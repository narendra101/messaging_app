from .views import PingAPIView, SignUpView, AuthPingAPIView, LoginView, LogoutView, CreateGroup, GetData, MessageView, LikeView, DeleteUser, DeleteGroup
from django.urls import path


urlpatterns = [
    path('ping/', PingAPIView.as_view()),
    path('auth-ping/', AuthPingAPIView.as_view()),
    path('signup/', SignUpView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('get-data/', GetData.as_view()),
    path('create-group/', CreateGroup.as_view()),    
    path('send-message/', MessageView.as_view()),
    path('set-like/', LikeView.as_view()),
    path('delete-user/<str:uname>/', DeleteUser.as_view()),
    path('delete-group/<str:group>/', DeleteGroup.as_view()),
]
