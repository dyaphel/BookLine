from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.db import connection
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny  
from django.core.exceptions import ObjectDoesNotExist
import os

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


# @api_view(['DELETE'])
# @authentication_classes([]) # NECESSARIO PER LA CHIMATA
# def delete_book(request, isbn):
#     try:
#         book = Book.objects.get(isbn=isbn)
#         book.delete()
#         return JsonResponse({'message': 'Book deleted successfully'}, status=204)
#     except Book.DoesNotExist:
#         return JsonResponse({'error': 'Book not found'}, status=404)
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)


@api_view(['PUT', 'PATCH'])
@authentication_classes([]) 
def change_book_image(request, isbn):
    try:
        book = Book.objects.get(isbn=isbn)
        # Verifica se è stata inviata una nuova immagine
        if 'cover' not in request.FILES:
            return Response(
                {'error': 'Nessuna immagine fornita'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        new_image = request.FILES['cover']
        
        # Elimina la vecchia immagine se esiste
        if book.cover:
            if os.path.isfile(book.cover.path):
                os.remove(book.cover.path)
        
        # Aggiorna con la nuova immagine
        book.cover = new_image
        book.save()
        
        return Response(
            {
                'message': 'Immagine aggiornata con successo',
                'new_image_url': book.cover.url
            },
            status=status.HTTP_200_OK
        )
    
    except ObjectDoesNotExist:
        return Response(
            {'error': 'Libro non trovato'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )