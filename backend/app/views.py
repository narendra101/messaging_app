from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from .models import *
from .serializers import *
from .utils import authenticate, auth


class PingAPIView(APIView):
    def get(self, request, *args, **kwargs):
        # success
        return Response({'status': 'success'}, status=status.HTTP_200_OK)

class AuthPingAPIView(APIView):
    @auth
    def get(self, request, *args, **kwargs):
        print(request.headers)
        # success
        return Response({'status': 'success'}, status=status.HTTP_200_OK)

class SignUpView(APIView):

    @auth
    def post(self, request, *args, **kwargs):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        auth, user = authenticate(request.data)
        if auth:
            return Response({'status': 'success', 'token': auth, 'user': user.username }, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    @auth
    def get(self, request, *args, **kwargs):
        request.authtoken.delete()
        request.authtoken = None
        return Response({'status': 'success'}, status=status.HTTP_200_OK)

class CreateGroup(APIView):

    @auth
    def post(self, request, *args, **kwargs):
        group_name = request.data['name']
        creator = request.usr
        if Team.objects.filter(name=group_name).exists():
            return Response({'detail': 'Group already exists'}, status=status.HTTP_400_BAD_REQUEST)
        users = request.data['users']
        team = Team.objects.create(name=group_name, creator=creator)
        team.save()
        # print(users, '-------------------')
        for user in users:
            team_member = CustomUser.objects.filter(username=user).first()
            if not team_member:
                continue
            print(team_member, '--------')            
            print(users, '--------')    
            team.members.add(team_member)
            team.save()            
        request.usr.teams.add(team)
        request.usr.save()
        team.members.add(request.usr)
        team.save()
        for user in users:
            team_member = CustomUser.objects.filter(username=user).first()
            team_member.teams.add(team)
            team_member.save()            
        current_user = request.usr        
        groups_for_current_user = current_user.teams.all()

        complete_data = []
        for group in groups_for_current_user:
            messages = []
            for msg in group.messages.all():
                messages.append({
                    'text': msg.text,
                    'user': msg.user.username,
                    'liked_by': [user.username for user in msg.liked_by.all()],
                    'like_count': msg.like_count
                })
            complete_data.append({
                'name': group.name,
                'messages': messages,
                'group_members': [user.username for user in group.members.all()]
            })
        return Response({'status': 'success', 'groups': complete_data}, status=status.HTTP_200_OK)

class GetData(APIView):
    @auth
    def get(self, request, *args, **kwargs):
        groups = request.usr.teams.all()
        complete_data = []
        for group in groups:
            messages = []
            for msg in group.messages.all():
                messages.append({
                    'id': msg.id,
                    'text': msg.text,
                    'user': msg.user.username,
                    'liked_by': [user.username for user in msg.liked_by.all()],
                    'like_count': msg.like_count
                })
            members = group.members.all()
            complete_data.append({
                'name': group.name, 
                'messages': messages,
                'creator': group.creator.username,
                'group_members': [user.username for user in members]
            })
        users = [ user.username for user in CustomUser.objects.all()]
        return Response({'status': 'success', 'groups': complete_data, 'users': users, 'is_admin': request.usr.is_admin, 'username': request.usr.username}, status=status.HTTP_200_OK)

class MessageView(APIView):
    @auth
    def post(self, request, *args, **kwargs):
        try:
            message = request.data['message']
            group = request.data['group']
            user = request.usr
            team = user.teams.filter(name=group).first()
            team.messages.create(text=message, user=user)
            return Response({'status': 'Success'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error': 'Internal Server Error'}, status=status.HTTP_400_BAD_REQUEST)


class LikeView(APIView):
    @auth
    def post(self, request, *args, **kwargs):
        try:
            print(request.data)
            message_id = request.data['msgId']
            user = request.usr
            message = Message.objects.get(id=message_id)
            if not user.username in [user.username for user in message.liked_by.all()]:
                message.liked_by.add(user)
                message.save()
            message.like_count = message.liked_by.count()
            message.save()
            return Response({'status': 'Success'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error': 'Internal Server Error'}, status=status.HTTP_400_BAD_REQUEST)
    

class DeleteUser(APIView):
    @auth
    def delete(self, request, *args, **kwargs):
        try:
            username = kwargs.get('uname')
            print(username)
            if username:
                CustomUser.objects.filter(username=username).first().delete()
            return Response({'status': 'Success'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error': 'Internal Server Error'}, status=status.HTTP_400_BAD_REQUEST)
    
class DeleteGroup(APIView):
    @auth
    def delete(self, request, *args, **kwargs):
        try:
            group = kwargs.get('group')
            if group:
                Team.objects.filter(name=group).first().delete()
            return Response({'status': 'Success'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'error': 'Internal Server Error'}, status=status.HTTP_400_BAD_REQUEST)