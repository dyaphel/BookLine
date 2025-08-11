from .models import Reservation

def create_reservation(user, book):
    existing = Reservation.objects.filter(book=book, fulfilled=True).count()
    if existing < book.available_copies:
        # Immediate fulfillment
        reservation = Reservation.objects.create(user=user, book=book, fulfilled=True, position=None)
    else:
        # Queueing
        queue_position = Reservation.objects.filter(book=book).count() + 1
        reservation = Reservation.objects.create(user=user, book=book, fulfilled=False, position=queue_position)
    return reservation