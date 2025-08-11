from .models import Reservation
import jwt
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed

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

def get_token_from_request(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    return auth_header.split(' ')[1]

def decode_token(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Token has expired.")
    except jwt.InvalidTokenError:
        raise AuthenticationFailed("Invalid token.")

def get_user_id_from_token(request):
    token = get_token_from_request(request)
    if not token:
        return None
    payload = decode_token(token)
    return payload.get("user_id")

def get_user_role_from_token(request):
    token = get_token_from_request(request)
    if not token:
        return None
    payload = decode_token(token)
    return payload.get("role")
