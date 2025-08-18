from django.shortcuts import render
from django.http import HttpResponse
from django.db import connection
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Book
from .serializers import BookSerializer
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny

def docker_health_check(request):
    # Controllo del database (opzionale ma utile)
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM books_book")
    except Exception:
        return HttpResponse("DB ERROR", status=500)
    
    return HttpResponse("OK", status=200)

@api_view(['GET'])
@authentication_classes([]) # NECESSARIO PER LA CHIMATA
@permission_classes([AllowAny])
def book_list(request):
    query = request.GET.get('q', '')  # General search query
    title = request.GET.get('title', None)
    author = request.GET.get('author', None)
    published = request.GET.get('published', None)  # Expected format: 'YYYY-MM-DD'
    genre = request.GET.get('genre', None)

    # Start building the filter condition
    filters = Q()
    # General search filter
    if query:
        filters |= Q(isbn__icontains=query) | Q(title__icontains=query) | Q(author__icontains=query)

    # Specific search filters
    if author:
        filters &= Q(author__icontains=author)
    if title:
        filters &= Q(title__icontains=title)
    if published:
        try:
            if len(published) == 4:  # Entered a year (not full date)
                year = int(published)
                filters &= Q(published__year=year)
            else:  # Full date (YYYY-MM-DD)
                filters &= Q(published=published)
        except ValueError:
            pass
    if genre:
        filters &= Q(genre__icontains=genre)

    # Fetch filtered & sorted books
    books = Book.objects.filter(filters).order_by('-published')
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([]) # NECESSARIO PER LA CHIMATA
@permission_classes([AllowAny])
def book_detail(request, isbn):
    """Return details of a book given its ISBN."""
    try:
        book = Book.objects.get(isbn=isbn)
        serializer = BookSerializer(book)
        return Response(serializer.data)
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=404)
