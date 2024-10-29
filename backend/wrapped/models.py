from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from wrapped.managers import CustomUserManager

class SpotifyAuthData(models.Model):
    access_token = models.TextField()
    refresh_token = models.TextField()
    expires_in = models.IntegerField()

class SpotifyProfile(models.Model):
    spotify_id = models.TextField()

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    auth_data = models.OneToOneField(SpotifyAuthData, on_delete=models.CASCADE, null=True, related_name="user")
    spotify_profile = models.OneToOneField(SpotifyProfile, on_delete=models.CASCADE, null=True, related_name="user")
    is_name_set = models.BooleanField(default=True)

    objects = CustomUserManager()
    def __str__(self):
        return self.email



# Create your models here.
