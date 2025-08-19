from django.urls import path
from .views import (
    docker_health_check,
    login_view, 
    register, 
    get_csrf_token,
    check_auth,
    user_logout,
    get_user_profile,
    get_user_by_id,
    delete_user,
    change_password,
    update_profile  # No trailing comma here
)

urlpatterns = [
    path('health/', docker_health_check, name='docker-health-check'),
    path('login/', login_view, name='login'),
    path('register/', register, name='register'),
    path('csrf/', get_csrf_token, name='get_csrf_token'),
    path('check-auth/', check_auth, name='check-auth'),
    path('logout/', user_logout, name='user-logout'),
    path('get_profile/', get_user_profile, name='get_user_profile'), #da cambiare in profile
    path('delete_user/',delete_user, name='delete_user'),# da cmbiare in delete
    path('change_password/', change_password, name='change_password'),
    path('update_profile/', update_profile, name='update_profile'), # da cambiare in edit
    path('get_by/<int:id>', get_user_by_id, name='get_user_by_id'),
    
]