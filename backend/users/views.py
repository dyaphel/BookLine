
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import logout
from django.contrib.auth import login as auth_login  # Renamed import
from django.contrib.auth.hashers import check_password
from .models import CustomUser
from .serializers import RegisterSerializer, UserProfileSerializer
from .models import CustomUser
from django.middleware.csrf import get_token
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
import logging
logger = logging.getLogger(__name__)



@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    token = get_token(request)
    return Response({'csrfToken': token})



@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    if not request.data.get('username', '').strip():
        return Response(
            {'username': 'This field is required and cannot be empty.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Assicurati che lo username sia tutto in minuscolo prima di passarlo al serializer
    username = request.data.get('username').strip().lower()
    request.data['username'] = username  # Modifica il dato per includere lo username in minuscolo

    if 'profile_image' in request.data and request.data['profile_image']:
        # The file will be automatically handled by MultiPartParser
       pass
    
    serializer = RegisterSerializer(data=request.data)

    # Ora passa i dati modificati al serializer
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    else:
        # Log o stampa degli errori per il debug
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# @api_view(['POST'])
@require_POST
@ensure_csrf_cookie
def login_view(request):
    try:
        data = json.loads(request.body)
        username_or_email = data.get('username', '').strip().lower() # Strip spaces
        password = data.get('password')

        if not username_or_email or not password:
            return JsonResponse({
                'success': False,
                'message': 'Both username/email and password are required'
            }, status=400)

        # Step 1: Try to find user by username
        user = None
        try:
            user = CustomUser.objects.get(username=username_or_email)
        except CustomUser.DoesNotExist:
            pass  # Ignore if no user is found by username

        # Step 2: If no user found by username, try to find user by email
        if user is None and '@' in username_or_email:
            try:
                user = CustomUser.objects.get(email=username_or_email)
            except CustomUser.DoesNotExist:
                pass  # Ignore if no user is found by email

        # Step 3: If user is found, check the password
        if user is not None and check_password(password, user.password):
            # Password matches, log the user in
            auth_login(request, user)
            serializer = UserProfileSerializer(user)  # Serialize user data
            return JsonResponse({
                'success': True,
                'message': 'Login successful',
                'user': serializer.data,
                })
        else:
            return JsonResponse({
                'success': False,
                'message': 'Invalid credentials'
            }, status=401)
        

    except Exception as e:
        print("Errore durante il login:", str(e))  # Log per il debug
        return JsonResponse({
            'success': False,
            'message': 'An error occurred during login'
        }, status=500)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@ensure_csrf_cookie
def get_user_profile(request):
    user = request.user
    serializer = UserProfileSerializer(user)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request):
    print(f"Incoming method: {request.method}")
    if request.method!='DELETE':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    if request.user.is_authenticated:
        user = request.user
        user.delete()
        return JsonResponse({'message': 'User deleted successfully'}, status=204)
    else:
        return JsonResponse({'error': 'User not authenticated'}, status=401)



@api_view(['GET'])
@ensure_csrf_cookie
def check_auth(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return JsonResponse({
                'isAuthenticated': True,
                'username': request.user.username
            })
        return JsonResponse({'isAuthenticated': False})
    return JsonResponse({'error': 'Invalid method'}, status=405)


@api_view(['POST'])
@ensure_csrf_cookie
def user_logout(request):
    if request.user.is_authenticated:
        logout(request)
        # Return a new CSRF token for subsequent requests
        return Response({
            'success': True,
            'message': 'Logged out successfully',
            'csrfToken': get_token(request)  # Return new token
        })
    return Response({
        'success': False,
        'message': 'User not authenticated'
    }, status=status.HTTP_401_UNAUTHORIZED)