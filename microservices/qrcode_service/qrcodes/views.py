from django.shortcuts import render
import qrcode
from io import BytesIO
from django.http import HttpResponse
from rest_framework.decorators import api_view

@api_view(['GET'])
def generate_qr(request):
    """
    Example: /qrcodes/generate/?data=HelloWorld
    """
    data = request.GET.get("data", "empty")
    qr = qrcode.make(data)

    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    buffer.seek(0)

    return HttpResponse(buffer, content_type="image/png")