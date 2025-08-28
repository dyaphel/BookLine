from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.db import connection
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from django.db.models import Q
from django.shortcuts import get_object_or_404
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


@api_view(['PUT', 'PATCH'])
@authentication_classes([]) 
def edit_book(request, isbn):
    try:
        book = Book.objects.get(isbn=isbn)
        # Partial update - only modify provided fields
        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'message': 'Book updated successfully',
                    'data': serializer.data
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {'error': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    except ObjectDoesNotExist:
        return Response(
            {'error': 'Book not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@authentication_classes([]) 
def delete_book(request, isbn):
    book = get_object_or_404(Book, isbn=isbn)
    book.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.http import JsonResponse
from datetime import datetime
from .models import Book
from .serializers import BookSerializer

@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def create_book(request):
    try:
        # Recupera ISBN e controlla che esista
        isbn = request.data.get('isbn')
        if not isbn:
            return JsonResponse({'error': 'ISBN is required'}, status=400)
        
        # Validazione lunghezza ISBN
        if len(isbn) != 13:
            return JsonResponse({'error': 'ISBN must be 13 characters long'}, status=400)

        if Book.objects.filter(isbn=isbn).exists():
            return JsonResponse({'error': 'A book with this ISBN already exists'}, status=400)

        # Recupera published e converte in date
        published_str = request.data.get('published')
        if not published_str:
            return JsonResponse({'error': 'Published date is required'}, status=400)

        try:
            published_date = datetime.strptime(published_str, "%Y-%m-%d").date()
        except ValueError:
            return JsonResponse({'error': 'Invalid date format for published. Use YYYY-MM-DD'}, status=400)

        # Validazione campi obbligatori
        required_fields = ['title', 'author']
        for field in required_fields:
            if not request.data.get(field):
                return JsonResponse({'error': f'{field.capitalize()} is required'}, status=400)

        # Validazione available_copies
        available_copies = request.data.get('available_copies', 1)
        try:
            available_copies = int(available_copies)
            if available_copies < 0:
                return JsonResponse({'error': 'Available copies cannot be negative'}, status=400)
        except (ValueError, TypeError):
            return JsonResponse({'error': 'Available copies must be a valid number'}, status=400)

        # Prepara i dati per il serializer
        book_data = {
            'isbn': isbn,
            'title': request.data.get('title'),
            'author': request.data.get('author'),
            'description': request.data.get('description', ''),
            'abstract': request.data.get('abstract', ''),
            'published': published_date,
            'genre': request.data.get('genre', ''),
            'language': request.data.get('language', ''),
            'available_copies': available_copies
        }

        # Aggiungi cover se presente
        if 'cover' in request.FILES:
            # Validazione del file (opzionale)
            cover_file = request.FILES['cover']
            if cover_file.size > 5 * 1024 * 1024:  # 5MB limit
                return JsonResponse({'error': 'Cover image too large. Max size is 5MB'}, status=400)
            book_data['cover'] = cover_file

        # Serializza e salva
        serializer = BookSerializer(data=book_data)
        if serializer.is_valid():
            book = serializer.save()
            return JsonResponse({
                'message': 'Book created successfully', 
                'book': BookSerializer(book).data
            }, status=201)
        else:
            return JsonResponse({
                'error': 'Invalid data', 
                'details': serializer.errors
            }, status=400)

    except Exception as e:
        print(f"Error creating book: {e}")
        return JsonResponse({
            'error': 'Internal server error', 
            'details': str(e)
        }, status=500)