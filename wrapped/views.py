from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.conf import settings

from urllib.parse import urlencode

import requests
import secrets



#----FUNCTIONS---------
def generate_crsf_state():
    return secrets.token_urlsafe(16)

#----VIEWS-------
def test(request):
    return HttpResponse("hello world!")
def login_spotify(request):
    client_id = settings.SPOTIFY_CLIENT_ID
    state = generate_crsf_state()
    scope = 'user-read-email user-top-read user-read-private'
    redirect_uri = request.build_absolute_uri(reverse('wrapped:login_callback'))

    params = {
        'client_id': client_id,
        'response_type': 'code',
        'scope': scope,
        'redirect_uri': redirect_uri,
        'state': state,
    }

    url = "https://accounts.spotify.com/authorize?" + urlencode(params)

    return redirect(url)

def login_spotify_callback(request):
    return HttpResponse("OAuth callback successful.")
