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
from django.urls import path
from wrapped.views import (
    register_by_access_token,
    health,
    get_user,
    wrapped,
    get_wrapped_with_id,
    send_email,
    get_access_token,
)

urlpatterns = [
    path('api/authenticate', register_by_access_token),
    path('api/user', get_user),
    path('api/health', health),
    path('admin/', admin.site.urls),
    path('api/wrapped', wrapped),
    path('api/wrapped/<str:wrapped_id>', get_wrapped_with_id),
    path('api/email', send_email),
    path('api/token', get_access_token)

]