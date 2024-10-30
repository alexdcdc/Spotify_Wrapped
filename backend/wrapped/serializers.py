from rest_framework import serializers
from wrapped.models import CustomUser, SpotifyProfile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpotifyProfile
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'first_name', 'last_name', 'spotify_profile', 'is_registered']
        depth = 2