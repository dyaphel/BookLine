from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Reservation
from .serializers import ReservationSerializer
from bookline.models import Book
from django.shortcuts import get_object_or_404
from django.db.models import Q


@api_view(['GET'])
def all_reservations(request):
    reservations = Reservation.objects.all()
    serializer = ReservationSerializer(reservations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def reservations_by_book(request, isbn):
    reservations = Reservation.objects.filter(book__isbn=isbn)
    serializer = ReservationSerializer(reservations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def reservations_by_user(request, user_id):
    reservations = Reservation.objects.filter(user__id=user_id)
    serializer = ReservationSerializer(reservations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def book_availability(request, isbn):
    book = get_object_or_404(Book, isbn=isbn)
    active_reservations = Reservation.objects.filter(book=book, fulfilled=True, returned=False).count()
    available = book.available_copies - active_reservations
    return Response({'isbn': isbn, 'available_copies': max(0, available)})


@api_view(['POST'])
def create_reservation(request):
    user = request.data.get('user')
    isbn = request.data.get('book')
    book = get_object_or_404(Book, isbn=isbn)

    active_count = Reservation.objects.filter(book=book, fulfilled=True, returned=False).count()
    total = book.available_copies

    # If a copy is available
    if active_count < total:
        reservation = Reservation.objects.create(
            user_id=user,
            book=book,
            fulfilled=True,
            ready_for_pickup=True,
            position=None
        )
    else:
        position = Reservation.objects.filter(book=book, returned=False).count() + 1
        reservation = Reservation.objects.create(
            user_id=user,
            book=book,
            fulfilled=False,
            position=position
        )

    serializer = ReservationSerializer(reservation)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def return_book(request, reservation_id):
    reservation = get_object_or_404(Reservation, id=reservation_id)

    if not reservation.fulfilled or reservation.returned:
        return Response({'error': 'Invalid reservation return attempt.'}, status=status.HTTP_400_BAD_REQUEST)

    reservation.returned = True
    reservation.fulfilled = False
    reservation.save()

    # Promote next reservation in line
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

        # Update queue positions
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