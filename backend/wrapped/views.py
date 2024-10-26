from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import requests

from wrapped.models import CustomUser, SpotifyAuthData, SpotifyProfile

#takes in token
#validates token
#gets email to match user
#creates + populates new user if no matching user
#returns existing user if matching user
def spotify_authenticate(token, refresh_token, expires_in):
    request_url = "https://api.spotify.com/v1/me"
    headers = {"Authorization": "Bearer " + token}

    response = requests.get(request_url, headers=headers)

    if response.status_code == 200:
        user_email = response.json()["email"]
        user_id = response.json()["id"]
        user, created = CustomUser.objects.get_or_create(email=user_email)

        if not user.auth_data:
            user.auth_data = SpotifyAuthData()

        auth_data = user.auth_data
        auth_data.access_token = token
        auth_data.refresh_token = refresh_token
        auth_data.expires_in = expires_in
        auth_data.save()

        if not user.spotify_profile:
            user.spotify_profile = SpotifyProfile()

        spotify_profile = user.spotify_profile
        spotify_profile.spotify_id = user_id
        spotify_profile.save()

        user.save()
        return user

    return None


@api_view(['POST'])
@permission_classes([AllowAny])
def register_by_access_token(request):
    token = request.data.get('access_token')
    user = spotify_authenticate(token, "foobar", 3600)

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