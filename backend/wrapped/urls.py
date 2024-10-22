from django.urls import path, include
from .views import *

app_name = 'wrapped'
urlpatterns = [
    path('', test, name='test'),
    path('login-spotify', login_spotify, name='login_spotify'),
    path('login-callback', login_spotify_callback, name='login_callback'),
]