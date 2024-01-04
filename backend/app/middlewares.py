import json
from .utils import authenticate
from .models import Token

# Custom middle ware for authentication


class AuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        if request.headers.get('Authorization'):
            token = request.headers['Authorization'].split()[1]            
            token = Token.objects.filter(token=token).first() if token != 'null' else None
            if token:
                request.usr = token.user
                request.authtoken = token
            else:
                request.authtoken = None
        else:
            request.authtoken = None

        return self.get_response(request)