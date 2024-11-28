import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
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
    account_created = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[models.Field] = []

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
    color = models.CharField(max_length=6)

    def __str__(self):
        return self.name


class PanelType(models.TextChoices):
    INTRO = "IN"
    TOP_TRACKS = "TT"
    PRE_LLM = "PL"
    LLM = "LM"
    TOP_GENRES = "TG"
    PRE_GAME = "PG"
    GAME = "GM"
    DANCE = "DC"


class Panel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wrapped = models.ForeignKey(
        Wrapped, on_delete=models.CASCADE, related_name="panels"
    )
    order = models.PositiveSmallIntegerField()
    type = models.CharField(
        max_length=2, choices=PanelType.choices, default=PanelType.TOP_TRACKS
    )
    data = models.JSONField(default=dict)

    class Meta:
        unique_together = (("wrapped", "order"),)
        ordering = ("order",)


class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ContactMessage from {self.name} ({self.email})"


"""
class Artist(models.Model):
    spotify_id = models.TextField(primary_key=True)
    albums = models.ManyToManyField("Album")
    name = models.TextField()
    songs = models.ManyToManyField("Track")


class Album(models.Model):
    spotify_id = models.TextField(primary_key=True)
    name = models.TextField()
    artists = models.ManyToManyField("Artist")


class Track(models.Model):
    spotify_id = models.TextField(primary_key=True)
    title = models.TextField()
    artists = models.ManyToManyField("Artist")
    album = models.ForeignKey(
        "Album", on_delete=models.CASCADE
    )  # Specify on_delete behavior

class PanelArtistOrdering(models.Model):
    panel = models.ForeignKey(AbstractPanel, on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    order = models.PositiveSmallIntegerField()

class PanelTrackOrdering(models.Model):
    panel = models.ForeignKey(AbstractPanel, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    order = models.PositiveSmallIntegerField()

class TopTracksPanel(AbstractPanel):
    tracks = models.ManyToManyField(Track, through=PanelTrackOrdering);

"""


# Create your models here.
