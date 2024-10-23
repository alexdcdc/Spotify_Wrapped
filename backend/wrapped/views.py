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


