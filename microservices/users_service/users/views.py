from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection

def docker_health_check(request):
    # Controllo del database (opzionale ma utile)
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except Exception:
        return HttpResponse("DB ERROR", status=500)
    
    return HttpResponse("OK", status=200)