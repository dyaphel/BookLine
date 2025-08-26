from rest_framework.permissions import BasePermission
from .utils import get_user_role_from_token

class IsAuthenticatedFromToken(BasePermission):
    def has_permission(self, request, view):
        return get_user_role_from_token(request) is not None
