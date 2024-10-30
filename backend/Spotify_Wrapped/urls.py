"""
URL configuration for Spotify_Wrapped project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
#hello world!
from django.contrib import admin
from django.urls import path, include, re_path
from wrapped.views import register_by_access_token, authentication_test, health, get_user
from rest_framework import routers, serializers, viewsets


urlpatterns = [
    path('api/authenticate', register_by_access_token),
    path('api/user', get_user),
    path('api/authentication-test/', authentication_test),
    path('api/health', health),
    path('admin', admin.site.urls),
]