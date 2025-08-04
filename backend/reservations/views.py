from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Reservation
from .serializers import ReservationSerializer
from users.models import CustomUser
from bookline.models import Book
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.db import transaction


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_reservations(request):
    if request.user.role not in [CustomUser.Roles.LIBRARIAN, CustomUser.Roles.ADMIN]:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)

    reservations = Reservation.objects.all()
    serializer = ReservationSerializer(reservations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reservations_by_book(request, isbn):
    if request.user.role not in [CustomUser.Roles.LIBRARIAN, CustomUser.Roles.ADMIN]:
        return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)

    reservations = Reservation.objects.filter(book__isbn=isbn)
    serializer = ReservationSerializer(reservations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reservations_by_user(request, user_id):
    if request.user.id != user_id and request.user.role not in [CustomUser.Roles.LIBRARIAN, CustomUser.Roles.ADMIN]:
        return Response({'detail': 'Not authorized to view reservations of other users.'},
                        status=status.HTTP_403_FORBIDDEN)

    reservations = Reservation.objects.filter(user__id=user_id)
    serializer = ReservationSerializer(reservations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def book_availability(request, isbn):
    book = get_object_or_404(Book, isbn=isbn)
    active_reservations = Reservation.objects.filter(book=book, fulfilled=True, returned=False).count()
    available = book.available_copies - active_reservations
    return Response({'isbn': isbn, 'available_copies': available})


# Per creare la reservation, the user must be authenticated and have the appropriate permissions. If the user is a regular user, they can only create reservations for themselves. The system checks if there are available copies of the book and creates a reservation accordingly. If all copies are reserved, the user is added to the queue.
# Insert in the body the "user" and "book" fields, where "user" is the ID of the user making the reservation and "book" is the ISBN of the book being reserved.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_reservation(request):
    user_id = request.data.get('user')
    isbn = request.data.get('book')

    if not user_id or not isbn:
        return Response({'detail': 'Missing user or book information.'}, status=status.HTTP_400_BAD_REQUEST)

    # If user is not admin or librarian, enforce self-reservation
    if request.user.role == CustomUser.Roles.USER and int(user_id) != request.user.id:
        return Response({'detail': 'Users can only create reservations for themselves.'},
                        status=status.HTTP_403_FORBIDDEN)

    book = get_object_or_404(Book, isbn=isbn)
    active_count = Reservation.objects.filter(book=book, fulfilled=True, returned=False).count()
    total = book.available_copies

    if active_count < total:
        reservation = Reservation.objects.create(
            user_id=user_id,
            book=book,
            fulfilled=True,
            ready_for_pickup=True,
            position=None
        )
    else:
        position = Reservation.objects.filter(book=book, returned=False).count() + 1
        reservation = Reservation.objects.create(
            user_id=user_id,
            book=book,
            fulfilled=False,
            position=position
        )

    serializer = ReservationSerializer(reservation)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def return_book(request, reservation_id):
    if request.user.role not in [CustomUser.Roles.LIBRARIAN, CustomUser.Roles.ADMIN]:
        return Response({'detail': 'Only librarians or admins can mark a book as returned.'},
                        status=status.HTTP_403_FORBIDDEN)

    reservation = get_object_or_404(Reservation, id=reservation_id)

    if not reservation.fulfilled or reservation.returned:
        return Response({'error': 'Invalid reservation return attempt.'}, status=status.HTTP_400_BAD_REQUEST)

    reservation.returned = True
    reservation.fulfilled = False
    reservation.save()

    next_in_line = Reservation.objects.filter(
        book=reservation.book,
        fulfilled=False,
        ready_for_pickup=False,
        returned=False
    ).order_by('position').first()

    if next_in_line:
        next_in_line.ready_for_pickup = True
        next_in_line.fulfilled = True
        next_in_line.position = None
        next_in_line.save()

        others = Reservation.objects.filter(
            book=reservation.book,
            fulfilled=False,
            ready_for_pickup=False,
            returned=False
        ).exclude(id=next_in_line.id).order_by('position')

        for i, res in enumerate(others, start=1):
            res.position = i + 1
            res.save()

    return Response({'message': 'Book returned and queue updated.'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_reservation(request, reservation_id):
    reservation = get_object_or_404(Reservation, id=reservation_id)

    # Check permissions: allow if the user is the owner OR a librarian OR the admin
    if (reservation.user != request.user and request.user.role not in [CustomUser.Roles.LIBRARIAN, CustomUser.Roles.ADMIN]):
        return Response({"detail": "You do not have permission to cancel this reservation."},
                        status=status.HTTP_403_FORBIDDEN)

    if reservation.cancelled:
        return Response({"detail": "Reservation already cancelled."}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        reservation.cancelled = True
        was_fulfilled = reservation.fulfilled
        reservation.fulfilled = False
        reservation.save()

        # Shift remaining reservations up in the queue
        later_reservations = Reservation.objects.filter(
            book=reservation.book,
            cancelled=False,
            fulfilled=False,
            position_in_queue__gt=reservation.position_in_queue
        ).order_by('position_in_queue')

        for r in later_reservations:
            r.position_in_queue -= 1
            r.save()

        # Promote next in line if necessary
        if was_fulfilled and later_reservations.exists():
            next_in_line = later_reservations.first()
            next_in_line.fulfilled = True
            next_in_line.save()

    return Response({"detail": "Reservation cancelled."}, status=status.HTTP_200_OK)