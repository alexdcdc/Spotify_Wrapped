import uuid

from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.db.models import PositiveIntegerField, PositiveSmallIntegerField
from wrapped.managers import CustomUserManager


class SpotifyAuthData(models.Model):
    access_token = models.TextField()
    refresh_token = models.TextField()
    expires_in = models.IntegerField()


class SpotifyProfile(models.Model):
    spotify_id = models.TextField(primary_key=True)


class CustomUser(AbstractUser):
    username = models.TextField(default="")
    email = models.EmailField(unique=True, primary_key=True)
    first_name = models.TextField(default="")
    last_name = models.TextField(default="")

    is_registered = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    auth_data = models.OneToOneField(
        SpotifyAuthData, on_delete=models.CASCADE, null=True, related_name="user"
    )
    spotify_profile = models.OneToOneField(
        SpotifyProfile, on_delete=models.CASCADE, null=True, related_name="user"
    )

    objects = CustomUserManager()

    def __str__(self):
        return self.email


class Wrapped(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now_add=True)


class AbstractPanel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wrapped = models.ForeignKey(Wrapped, on_delete=models.CASCADE)
    order = models.PositiveSmallIntegerField()

    class Meta:
        abstract = True


class Artist(models.Model):
    spotify_id = models.TextField(primary_key=True)
    albums = models.ManyToManyField("Album")
    name = models.TextField()
    songs = models.ManyToManyField("Song")


class Album(models.Model):
    spotify_id = models.TextField(primary_key=True)
    name = models.TextField()
    artists = models.ManyToManyField("Artist")


class Song(models.Model):
    spotify_id = models.TextField(primary_key=True)
    title = models.TextField()
    artists = models.ManyToManyField("Artist")
    album = models.ForeignKey(
        "Album", on_delete=models.CASCADE
    )  # Specify on_delete behavior


"""
To be completed after wrapped user story
class PanelOne(AbstractPanel):

class PanelTwo(AbstractPanel):

class PanelThree(AbstractPanel):

class PanelFour(AbstractPanel):

class PanelFive(AbstractPanel):

class PanelSix(AbstractPanel):

class PanelSeven(AbstractPanel):

class PanelEight(AbstractPanel):
"""


# Create your models here.
