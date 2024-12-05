import uuid
from collections import Counter
from random import choice, randint

from django.contrib.auth.models import AbstractUser
from django.db import models
from wrapped.managers import CustomUserManager
from wrapped.utils import get_spotify_endpoint_data, get_llm_description


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
    data = models.JSONField(default=dict)
    type = models.CharField(max_length=2, choices=PanelType.choices)

    def generate_data(self):
        self.data = {}

    def set_type(self):
        self.type = PanelType.INTRO

    def get_parent_user(self):
        return self.wrapped.user

    class Meta:
        unique_together = (("wrapped", "order"),)
        ordering = ("order",)

class IntroPanel(Panel):
    def set_type(self):
        self.type = PanelType.INTRO
    class Meta:
        proxy = True

class TopTracksPanel(Panel):
    def set_type(self):
        self.type = PanelType.TOP_TRACKS
    def generate_data(self):
        user = self.get_parent_user()
        params = {"time_range": "short_term", "limit": 10}
        data = get_spotify_endpoint_data("me/top/tracks", user.auth_data.access_token, params)
        self.data = data
    class Meta:
        proxy = True

class PreLLMPanel(Panel):
    def set_type(self):
        self.type = PanelType.PRE_LLM
    class Meta:
        proxy = True

class LLMPanel(Panel):
    def set_type(self):
        self.type = PanelType.LLM
    def generate_data(self):
        user = self.get_parent_user()
        data = get_spotify_endpoint_data("me/top/artists", user.auth_data.access_token, {"limit": 5})
        genres = {genre for artist in data["items"] for genre in artist["genres"]}
        artist_names = [artist["name"] for artist in data["items"]]

        self.data = get_llm_description(genres, artist_names)
    class Meta:
        proxy = True

class TopGenresPanel(Panel):
    def set_type(self):
        self.type = PanelType.TOP_GENRES
    def generate_data(self):
        user = self.get_parent_user()
        params = {"time_range": "short_term", "limit": 20}
        data = get_spotify_endpoint_data("me/top/artists", user.auth_data.access_token, params)
        genres = []

        # Collect genres from each artist
        for artist in data.get("items", []):
            genres.extend(artist.get("genres", []))

        # Count and sort genres
        genre_counts = Counter(genres)
        top_genres = genre_counts.most_common(10)  # Adjust the number as needed

        self.data = {"top_genres": top_genres}
    class Meta:
        proxy = True

class PreGamePanel(Panel):
    def set_type(self):
        self.type = PanelType.PRE_GAME
    class Meta:
        proxy = True

class GamePanel(Panel):
    def set_type(self):
        self.type = PanelType.GAME
    def generate_data(self):
        user = self.get_parent_user()
        params = {"time_range": "long_term", "limit": 50}
        data = get_spotify_endpoint_data("me/top/tracks", user.auth_data.access_token, params)
        tracks = data["items"]
        random_track = choice(tracks)

        clip_start = randint(0, 27)
        clip_duration = 3

        self.data = {
            "choices": tracks,
            "correct": random_track,
            "clip_start": clip_start,
            "clip_duration": clip_duration,
        }
    class Meta:
        proxy = True

class DancePanel(Panel):
    def set_type(self):
        self.type = PanelType.DANCE
    def generate_data(self):
        self.data = {"average_danceability": 50}
    class Meta:
        proxy = True


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
