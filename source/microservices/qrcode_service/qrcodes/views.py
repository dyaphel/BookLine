from django.shortcuts import render
import qrcode
from io import BytesIO
from django.http import HttpResponse
from rest_framework.decorators import api_view, authentication_classes


@api_view(['GET'])
@authentication_classes([])
def generate_qr(request):
    """
    Example: /qrcodes/generate/?data=RESERVATION:123
    """
    data = request.GET.get("data", "empty")
    
    # If data contains "RESERVATION:" then make reservation URL
    if data.startswith('RESERVATION:'):
        reservation_id = data.split(':')[1]
        redirect_url = f"http://localhost:5173/reservations/{reservation_id}"
        qr = qrcode.make(redirect_url)
    else:
        qr = qrcode.make(data)

    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    buffer.seek(0)

    return HttpResponse(buffer, content_type="image/png")