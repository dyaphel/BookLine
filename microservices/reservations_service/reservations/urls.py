from django.urls import path
from . import views

urlpatterns = [
    path('', views.all_reservations, name='all_reservations'),
    path('book/<str:isbn>/', views.reservations_by_book, name='reservations_by_book'),
    path('user/<int:user_id>/', views.reservations_by_user, name='reservations_by_user'),
    path('book/<str:isbn>/availability/', views.book_availability, name='book_availability'),
    path('create/', views.create_reservation, name='create_reservation'),
    path('return/<int:reservation_id>/', views.return_book, name='return_book'),
    path('cancel/<int:reservation_id>/', views.cancel_reservation, name='cancel_reservation'),
    path('whoami/', views.whoami, name='whoami'),
]