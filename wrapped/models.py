from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)

    access_token = models.TextField()
    refresh_token = models.TextField()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []



# Create your models here.
