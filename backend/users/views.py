
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login  # Renamed import
from django.contrib.auth.hashers import check_password
from .models import CustomUser
from .serializers import RegisterSerializer
from .models import CustomUser
from django.middleware.csrf import get_token
from django.views.decorators.http import require_POST

import logging
logger = logging.getLogger(__name__)



@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    token = get_token(request)
    return Response({'csrfToken': token})

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    if not request.data.get('username', '').strip():
        return Response(
            {'username': 'This field is required and cannot be empty.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    else:
        # Log or print detailed errors to help troubleshoot
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@csrf_exempt
@require_POST
def login_view(request):
    try:
        data = json.loads(request.body)
        username_or_email = data.get('username', '').strip()  # Strip spaces
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
            return JsonResponse({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
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