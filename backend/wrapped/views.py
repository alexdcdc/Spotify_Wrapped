import requests
from collections import Counter
from random import choice, randint


from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from wrapped.models import *
from wrapped.serializers import (
    UserSerializer,
    WrappedSerializer,
)
from wrapped.utils import get_spotify_endpoint_data


# takes in token
# validates token
# gets email to match user
# creates + populates new user if no matching user
# returns existing user if matching user
def spotify_authenticate(token, refresh_token, expires_in):
    data = get_spotify_endpoint_data("me", token)
    user_email = data["email"]
    user_id = data["id"]
    user_display_name = data["display_name"]
    user, created = CustomUser.objects.get_or_create(email=user_email)

    if created:
        user.auth_data = SpotifyAuthData(
            access_token=token, refresh_token=refresh_token, expires_in=expires_in
        )
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



@api_view(["POST"])
@permission_classes([AllowAny])
def register_by_access_token(request):
    token = request.data.get("access_token")
    refresh_token = request.data.get("refresh_token")
    expires_in = request.data.get("expires_in")
    user = spotify_authenticate(token, refresh_token, expires_in)

    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "auth_token": token.key,
            },
            status=status.HTTP_200_OK,
        )
    else:
        return Response(
            {"errors": {"auth_token": "Invalid token"}},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    if request.method == "GET":
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == "POST":
        data = request.data
        user.username = data["username"]
        user.first_name = data["first_name"]
        user.last_name = data["last_name"]
        user.is_registered = True
        user.save()

        return Response(
            {
                "message": "User information successfully updated",
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            status=status.HTTP_200_OK,
        )

    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile_image(request):
    data = get_spotify_endpoint_data("me", request.user.auth_data.access_token)
    images = data["images"]
    found = len(images) != 0

    return Response({"found": found, "images": images}, status=status.HTTP_200_OK)



@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response(status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def wrapped(request):
    user = request.user
    data = request.data
    if request.method == "POST":
        if not ("name" in data and data["name"]):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        new_wrapped = generate_wrapped(user, data["name"])
        new_wrapped.save()
        serializer = WrappedSerializer(new_wrapped)
        return Response(
            {
                "message": "New wrapped successfully created",
                "wrapped": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    elif request.method == "GET":
        serializer = WrappedSerializer(Wrapped.objects.filter(user=user).order_by("-date_created"), many=True)
        return Response({"wrapped_list": serializer.data}, status=status.HTTP_200_OK)

    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

def get_random_color():
    return "".join([choice("0123456789ABCDEF") for _ in range(6)])

def generate_wrapped(user, name):
    PANEL_ORDER = [
        IntroPanel,
        TopTracksPanel,
        DancePanel,
        TopGenresPanel,
        PreLLMPanel,
        LLMPanel,
        PreGamePanel,
        GamePanel,
    ]
    new_wrapped = Wrapped()
    new_wrapped.user = user
    new_wrapped.name = name
    new_wrapped.color = get_random_color()
    new_wrapped.save()

    order = 1
    for Panel in PANEL_ORDER:
        generate_panel(user, new_wrapped, order, Panel)
        order += 1

    return new_wrapped


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_wrapped_with_id(request, wrapped_id):
    user = request.user
    try:
        serializer = WrappedSerializer(Wrapped.objects.get(id=wrapped_id, user=user))
        return Response({"wrapped": serializer.data}, status=status.HTTP_200_OK)
    except Wrapped.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


def generate_panel(user, parent_wrapped, order, Panel):
    panel = Panel()
    panel.wrapped = parent_wrapped
    panel.order = order
    panel.generate_data()
    panel.set_type()
    panel.save()
    return panel

@api_view(['GET'])
def is_authenticated(request):
    if request.user and request.user.is_authenticated:
        return Response({"logged_in": True}, status=status.HTTP_200_OK)
    return Response({"logged_in": False}, status=status.HTTP_200_OK)

def generate_data_danceability(user):
    '''
    params = {"limit": 10}
    data = get_spotify_endpoint_data("me/top/tracks", user.auth_data.access_token, params)

    tracks = data.get("items", [])
    track_ids = [track["id"] for track in tracks]

    params = {"ids": {','.join(track_ids)}}
    data = get_spotify_endpoint_data("audio-features", user.auth_data.access_token, params)

    audio_features = data.get("audio_features", [])

    total_danceability = sum(
        feature["danceability"] for feature in audio_features if feature
    )
    average_danceability = (
        total_danceability / len(audio_features) if audio_features else 0
    )
    '''

    return



@api_view(["POST"])
def send_email(request):
    data = request.data
    user_email_addr = data["email"]
    message = data["message"]
    user_name = data["name"]
    subject = f"Comment from {user_email_addr}"
    body = f"Name: {user_name}\nAddress: {user_email_addr}\n\n{message}"
    mail_status = send_mail(
        subject=subject,
        message=body,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[settings.EMAIL_HOST_USER],
    )
    if mail_status == 1:
        send_mail(
            subject="Spotify Wrapped comment confirmation",
            message="Your inquiry has been successfully sent! You will hear back from us in 1-2 business days.",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user_email_addr],
        )
        return Response(
            {"message": "Email successfully sent"}, status=status.HTTP_200_OK
        )
    else:
        return Response(
            {"message": "Could not send email"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_access_token(request):
    user = request.user
    return Response({"token": user.auth_data.access_token}, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_user(request):
    user = request.user
    user.delete()
    return Response({"message": "User successfully deleted"}, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_wrapped(request, wrapped_id):
    user = request.user
    try:
        target_wrapped = Wrapped.objects.get(id=wrapped_id, user=user)
        target_wrapped.delete()
        return Response({"message": "Wrapped successfully deleted"}, status=status.HTTP_200_OK)
    except Wrapped.DoesNotExist:
        return Response({"message": "Wrapped does not exist"}, status=status.HTTP_404_NOT_FOUND)