from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
import requests

from wrapped.models import CustomUser, SpotifyAuthData, SpotifyProfile
from wrapped.serializers import UserSerializer
import os
import base64



# takes in token
# validates token
# gets email to match user
# creates + populates new user if no matching user
# returns existing user if matching user
def spotify_authenticate(token, refresh_token, expires_in):
    request_url = "https://api.spotify.com/v1/me"
    headers = {"Authorization": "Bearer " + token}

    response = requests.get(request_url, headers=headers)
    print(response)
    if response.status_code == 200:
        data = response.json()
        user_email = data["email"]
        user_id = data["id"]
        user_display_name = data["display_name"]
        user, created = CustomUser.objects.get_or_create(email=user_email)

        if created:
            user.auth_data = SpotifyAuthData(access_token=token,
                                             refresh_token=refresh_token,
                                             expires_in=expires_in)
            user.spotify_profile = SpotifyProfile(spotify_id=user_id)

        else:
            user.auth_data.access_token = token
            user.auth_data.refresh_token = refresh_token
            user.auth_data.expires_in = expires_in

            user.spotify_profile.spotify_id = user_id
            user.spotify_profile.display_name = user_display_name

        user.auth_data.save()
        user.spotify_profile.save()

        user.save()
        return user

    return None


@api_view(['POST'])
@permission_classes([AllowAny])
def register_by_access_token(request):
    token = request.data.get('access_token')
    refresh_token = request.data.get('refresh_token')
    expires_in = request.data.get('expires_in')
    user = spotify_authenticate(token, refresh_token, expires_in)

    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                'auth_token': token.key,
            },
            status=status.HTTP_200_OK,
        )
    else:
        return Response(
            {
                'errors': {
                    'auth_token': 'Invalid token'
                }
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        data = request.data
        user.username = data['username']
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        user.is_registered = True
        user.save()

        return Response({
            'message': "User information successfully updated",
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
        },
            status=status.HTTP_200_OK
        )

    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def authentication_test(request):
    print(request.user)
    return Response(
        {
            'message': "User successfully authenticated"
        },
        status=status.HTTP_200_OK,
    )


@api_view(['GET'])
@permission_classes([AllowAny])
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

@api_view(['GET'])
def is_authenticated(request):
    if request.user and request.user.is_authenticated:
        return Response({"logged_in": True}, status=status.HTTP_200_OK)
    return Response({"logged_in": False}, status=status.HTTP_200_OK)


