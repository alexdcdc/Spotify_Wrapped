from django.contrib import admin
from wrapped.models import CustomUser, SpotifyAuthData, SpotifyProfile


# Register your models here.
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    pass


@admin.register(SpotifyAuthData)
class CustomAuthDataAdmin(admin.ModelAdmin):
    pass


@admin.register(SpotifyProfile)
class CustomUserProfileAdmin(admin.ModelAdmin):
    pass
