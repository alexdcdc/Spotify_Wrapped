from django.contrib import admin

from wrapped.models import CustomUser, Panel, SpotifyAuthData, SpotifyProfile, Wrapped


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

class PanelInline(admin.TabularInline):  # or use admin.StackedInline for a different layout
    model = Panel
    extra = 0  # No extra blank rows for new related objects

@admin.register(Wrapped)
class WrappedAdmin(admin.ModelAdmin):
    inlines = [PanelInline]


@admin.register(Panel)
class PanelAdmin(admin.ModelAdmin):
    pass
