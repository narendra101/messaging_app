from django.contrib import admin
from app.models import CustomUser, Message, Team


admin.site.register(CustomUser)
admin.site.register(Message)
admin.site.register(Team)