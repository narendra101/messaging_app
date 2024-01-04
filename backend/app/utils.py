from .models import Token, CustomUser
from functools import wraps
from rest_framework import status
from rest_framework.response import Response

def authenticate(data):
    user = CustomUser.objects.filter(username=data['username'], password=data['password']).first()
    if user:
        if Token.objects.filter(user=user).exists():
            token = Token.objects.filter(user=user).first()
            return token.token, token.user
        token = Token(user=user)
        token.save()
        return token.token, token.user
    else:
        return None, None

def auth(func):
    @wraps(func)
    def wrapper(self, request, *args, **kwargs):        
        if request.authtoken:
            return func(self, request, *args, **kwargs)
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    return wrapper
            

    