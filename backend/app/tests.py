from rest_framework import status
from .models import CustomUser, Team, Message
from django.test import TestCase
from .utils import authenticate
from rest_framework.authtoken.models import Token

class YourAppAPITestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.username = 'testuser'
        self.password = 'testpassword'
        self.email = 'testuser@example.com'
        self.user = CustomUser.objects.create(username=self.username, password=self.password, email=self.email, is_admin=True)
        self.url = 'http://localhost:8000/'        

    def test_login(self):
        response = self.client.post(self.url + 'login/', {'username': self.username, 'password': self.password})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
    
    def test_create_user(self):
        response = self.client.post(self.url + 'login/', {'username': self.username, 'password': self.password})

        token = response.data['token']
        user_details = {
            'username': 'testuser2',
            'password': 'test',
            'email': 'test@gmail.com'
        }
        response = self.client.post(self.url + 'signup/', user_details, HTTP_AUTHORIZATION=f'Token {token}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')

    def test_delete_user(self):
        response = self.client.post(self.url + 'login/', {'username': self.username, 'password': self.password})
        token = response.data['token']
        user_details = {
            'username': 'testuser2',
            'password': 'test',
            'email': 'test@gmail.com'
        }
        self.client.post(self.url + 'signup/', user_details, HTTP_AUTHORIZATION=f'Token {token}')
        response = self.client.delete(self.url + f'delete-user/testuser2/', HTTP_AUTHORIZATION=f'Token {token}')
        print(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'].lower(), 'success')
        