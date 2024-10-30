import base64

from django.conf import settings
import os
import requests
from rest_framework import serializers
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from requests.exceptions import HTTPError
from django.http import JsonResponse

from social_django.utils import psa


class SocialSerializer(serializers.Serializer):
    """
    Serializer which accepts an OAuth2 access token.
    """
    access_token = serializers.CharField(
        allow_blank=False,
        trim_whitespace=True,
    )


@api_view(['POST'])
@permission_classes([AllowAny])
@psa()
def register_by_access_token(request, backend):
    token = request.data.get('access_token')
    user = request.backend.do_auth(token)
    print(request)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                'token': token.key
            },
            status=status.HTTP_200_OK,
            )
    else:
        return Response(
            {
                'errors': {
                    'token': 'Invalid token'
                    }
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(['GET', 'POST'])
def authentication_test(request):
    print(request.user)
    return Response(
        {
            'message': "User successfully authenticated"
        },
        status=status.HTTP_200_OK,
    )

@api_view(['GET'])
def health(request):
    return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
def spotify_top_artists(request):
    client_id = os.getenv('SPOTIFY_CLIENT_ID')
    client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')

    if not client_id or not client_secret:
        return Response(
            {'error': 'Spotify client ID and secret must be set in environment variables.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # Get access token
    auth_response = requests.post(
        'https://accounts.spotify.com/api/token',
        data={
            'grant_type': 'client_credentials'
        },
        headers={
            'Authorization': f'Basic {base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()}'
        }
    )

    if auth_response.status_code != 200:
        return Response({'error': 'Failed to authenticate with Spotify API.'}, status=status.HTTP_400_BAD_REQUEST)

    access_token = auth_response.json().get('access_token')

    # Get top artists
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    top_artists_response = requests.get(
        'https://api.spotify.com/v1/me/top/artists?limit=5',
        headers=headers
    )

    if top_artists_response.status_code != 200:
        return Response({'error': 'Failed to fetch top artists from Spotify API.'}, status=status.HTTP_400_BAD_REQUEST)

    top_artists = top_artists_response.json().get('items', [])
    artists = [{'name': artist['name'], 'popularity': artist['popularity']} for artist in top_artists]

    return Response(artists, status=status.HTTP_200_OK)


import requests
from django.http import JsonResponse


def spotify_stats(request):
    auth_token = "YOUR_ACCESS_TOKEN"  # Retrieve the actual user's access token here

    total_hours = total_hours_listened(auth_token)
    total_songs = total_songs_listened(auth_token)
    active_months = most_active_months(auth_token)
    top_genres = top_genres_data(auth_token)
    top_artists = top_artists_data(auth_token)

    stats = {
        "total_hours": total_hours,
        "total_songs": total_songs,
        "active_months": active_months,
        "top_genres": top_genres,
        "top_artists": top_artists
    }

    return JsonResponse(stats)


def total_hours_listened(auth_token):
    total_duration_ms = 0
    url = "https://api.spotify.com/v1/me/player/recently-played"
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }

    while url:
        response = requests.get(url, headers=headers, params={"limit": 50})
        data = response.json()

        for item in data.get("items", []):
            total_duration_ms += item["track"]["duration_ms"]

        url = data.get("next")

    total_hours = total_duration_ms / (1000 * 60 * 60)
    return total_hours


def total_songs_listened(auth_token):
    total_songs = 0
    url = "https://api.spotify.com/v1/me/player/recently-played"
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }

    while url:
        response = requests.get(url, headers=headers, params={"limit": 50})
        data = response.json()

        total_songs += len(data.get("items", []))

        url = data.get("next")

    return total_songs


def most_active_months(auth_token):
    active_months = {}
    url = "https://api.spotify.com/v1/me/player/recently-played"
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }

    while url:
        response = requests.get(url, headers=headers, params={"limit": 50})
        data = response.json()

        for item in data.get("items", []):
            played_at = item["played_at"]  # Get the played at timestamp
            month = played_at[:7]  # Extract the YYYY-MM part
            active_months[month] = active_months.get(month, 0) + 1

        url = data.get("next")

    # Sort the months by their activity counts
    sorted_months = sorted(active_months.items(), key=lambda x: x[1], reverse=True)
    return sorted_months


def top_genres_data(auth_token):
    top_genres = {}
    url = "https://api.spotify.com/v1/me/top/artists"
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }

    response = requests.get(url, headers=headers, params={"limit": 50})
    data = response.json()

    for item in data.get("items", []):
        genres = item.get("genres", [])
        for genre in genres:
            top_genres[genre] = top_genres.get(genre, 0) + 1

    # Sort genres by their count
    sorted_genres = sorted(top_genres.items(), key=lambda x: x[1], reverse=True)
    return [{"name": genre, "count": count} for genre, count in sorted_genres]


def top_artists_data(auth_token):
    top_artists = []
    url = "https://api.spotify.com/v1/me/top/artists"
    headers = {
        "Authorization": f"Bearer {auth_token}"
    }

    response = requests.get(url, headers=headers, params={"limit": 50})
    data = response.json()

    for item in data.get("items", []):
        artist_name = item["name"]
        artist_listen_count = item["popularity"]  # Popularity as a proxy for listen count
        top_artists.append({"name": artist_name, "listen_count": artist_listen_count})

    return top_artists


