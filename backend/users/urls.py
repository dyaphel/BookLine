from django.urls import path
from .views import login_view, register, get_csrf_token

urlpatterns = [
    path('login/', login_view, name='login'),
    path('register/', register, name='register'),
    path('csrf/', get_csrf_token, name='get_csrf_token'),
]
