from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Reservation
from .serializers import ReservationSerializer
from .external_models import Book
from users.models import CustomUser
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.db import transaction

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def whoami(request):
    return Response({
        'user_id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
        'role': request.user.role,
        'is_authenticated': request.user.is_authenticated,
    })

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
        return Response({'detail': 'Not authorized to view reservations of other users.'}, status=status.HTTP_403_FORBIDDEN)

    reservations = Reservation.objects.filter(user__id=user_id)
    serializer = ReservationSerializer(reservations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def book_availability(request, isbn):
    book = get_object_or_404(Book, isbn=isbn)
    active_reservations = Reservation.objects.filter(book=book, returned=False).count()
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
    if request.user.role == "User" and int(user_id) != request.user.id:
        return Response({'detail': 'Users can only create reservations for themselves.'},
                        status=status.HTTP_403_FORBIDDEN)

    book = get_object_or_404(Book, isbn=isbn)
    active_count = Reservation.objects.filter(book=book, fulfilled=True, returned=False).count()
    total = book.available_copies

    if active_count < total:
        reservation = Reservation.objects.create(
            user_id=user_id,
            book=book,
            fulfilled=False, #SHOULD BE FALSE SINCE I HAVE JUST ASKED FOR A RESERVATION BUT I STILL DO NOT HAVE THE BOOKS IN MY HAND THE LIBRARIAN SHOULD SAY IF FULFILLED OR NOT
            ready_for_pickup=True,
            position=None
        )
    else:
        position = Reservation.objects.filter(book=book, returned=False).count() + 1
        reservation = Reservation.objects.create(
            user_id=user_id,
            book=book,
            fulfilled=False,
            position=position,
            ready_for_pickup=False,
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
    reservation.fulfilled = True
    reservation.save()

    next_in_line = Reservation.objects.filter(
        book=reservation.book,
        fulfilled=False,
        ready_for_pickup=False,
        returned=False
    ).order_by('position').first()

    if next_in_line:
        next_in_line.ready_for_pickup = True
        next_in_line.fulfilled = False
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


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def fulfill_book(request, reservation_id):
    # Permission check
    if request.user.role not in [CustomUser.Roles.LIBRARIAN, CustomUser.Roles.ADMIN]:
        return Response({'detail': 'Only librarians or admins can mark a book as fulfilled.'},
                        status=status.HTTP_403_FORBIDDEN)

    reservation = get_object_or_404(Reservation, id=reservation_id)

# Check if the reservation CANNOT be marked as fulfilled
    if reservation.returned or reservation.fulfilled:
        return Response(
            {'error': 'Reservation cannot be fulfilled because it is either already fulfilled, returned'},
            status=status.HTTP_400_BAD_REQUEST
        )
    # Update the reservation status
    reservation.fulfilled = True
    reservation.ready_for_pickup = False
    reservation.save()

    return Response({'message': 'Reservation successfully marked as fulfilled.'},
                   status=status.HTTP_200_OK)



#TO CHECK THE CANCEL RESERVATIONS
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_reservation(request, reservation_id):
    reservation = get_object_or_404(Reservation, id=reservation_id)

    # Check permissions
    if (reservation.user != request.user and 
        request.user.role not in [CustomUser.Roles.LIBRARIAN, CustomUser.Roles.ADMIN]):
        return Response(
            {"detail": "Permission denied"},
            status=status.HTTP_403_FORBIDDEN
        )

    if reservation.cancelled:
        return Response(
            {"detail": "Already cancelled"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # CHECK THE FULFILLED STATUS IN CREATE RESERVATIONS
    
    # if reservation.fulfilled and not reservation.returned:
    #     return Response(
    #         {"detail": "Cannot cancel fulfilled reservation that hasn't been returned"},
    #         status=status.HTTP_400_BAD_REQUEST
    #     )

    with transaction.atomic():
        reservation.cancelled = True
        reservation.save()
        book = Book.objects.get(isbn=reservation.book.isbn)
        book.available_copies += 1
        book.save()
        # Update positions for remaining reservations if needed
        if reservation.position is not None:
            later_reservations = Reservation.objects.filter(
                book=reservation.book,
                cancelled=False,
                fulfilled=False,
                position__gt=reservation.position
            ).order_by('position')

            # Use bulk_update for better performance
            updates = []
            for r in later_reservations:
                r.position -= 1
                updates.append(r)
            
            if updates:
                Reservation.objects.bulk_update(updates, ['position'])

        # Promote next in line if this was the current reservation
        if reservation.ready_for_pickup:
            next_in_line = Reservation.objects.filter(
                book=reservation.book,
                cancelled=False,
                fulfilled=False,
                ready_for_pickup=False
            ).order_by('position').first()

            if next_in_line:
                next_in_line.ready_for_pickup = True
                next_in_line.save()

    return Response(
        {"detail": "Reservation cancelled successfully"},
        status=status.HTTP_200_OK
    )