from django.db import models
import uuid


class CustomUser(models.Model):
    username = models.CharField(max_length=100, unique=True, null=False)
    password = models.CharField(max_length=100, null=False)
    is_admin = models.BooleanField(default=False)
    teams = models.ManyToManyField("Team", related_name='team_members')
    email = models.EmailField(unique=True, null=False)

    def __str__(self):
        return self.username

class Message(models.Model):
    text = models.TextField()
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE)
    liked_by = models.ManyToManyField('CustomUser', related_name='liked_messages')
    like_count = models.IntegerField(default=0)


class Team(models.Model):
    creator = models.ForeignKey('CustomUser', on_delete=models.CASCADE)
    name = models.CharField(max_length=100, unique=True)
    members = models.ManyToManyField('CustomUser', related_name='user_teams')
    messages = models.ManyToManyField('Message', related_name='chat_messages')


class Token(models.Model):
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)