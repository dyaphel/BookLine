from django.urls import path
from .views import login_view, register, get_csrf_token,check_auth , user_logout

urlpatterns = [
    path('login/', login_view, name='login'),
    path('register/', register, name='register'),
    path('csrf/', get_csrf_token, name='get_csrf_token'),
    path('check-auth/', check_auth, name='check-auth'),
    path('logout/', user_logout, name='user-logout'),
]
