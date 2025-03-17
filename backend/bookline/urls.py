from django.urls import path
from .views import book_list, book_detail

urlpatterns = [
    path('books/', book_list, name='book-list'),  # Returns all books
    path('books/<str:isbn>/', book_detail, name='book-detail'),  # Returns a book by ISBN
]