from rest_framework import serializers
from wrapped.models import CustomUser


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'auth_data', 'spotify_profile']