from rest_framework import serializers

from wrapped.models import CustomUser, Panel, SpotifyProfile, Wrapped


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpotifyProfile
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "email",
            "username",
            "first_name",
            "last_name",
            "spotify_profile",
            "is_registered",
        ]
        depth = 2


class PanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Panel
        fields = ["id", "type", "order", "data"]


class WrappedSerializer(serializers.ModelSerializer):
    panels = PanelSerializer(many=True, read_only=True)

    class Meta:
        model = Wrapped
        fields = ["id", "name", "date_created", "panels"]


from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'message', 'submitted_at']
