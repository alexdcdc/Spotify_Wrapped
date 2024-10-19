import base64

from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.conf import settings

from urllib.parse import urlencode

import requests
import secrets

#----GLOBAL VARS----------
client_id = settings.SPOTIFY_CLIENT_ID
client_secret = settings.SPOTIFY_CLIENT_SECRET
redirect_uri = "http://localhost:8000/wrapped/login-callback"

#----FUNCTIONS---------
def generate_crsf_state():
    return secrets.token_urlsafe(16)


def get_access_token(code):
    url = 'https://accounts.spotify.com/api/token'
    auth_string = client_id + ':' + client_secret
    auth_string = auth_string.encode('ascii')
    base64string = base64.b64encode(auth_string)
    form = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,  # Must match the redirect URI set earlier
    }

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + base64string.decode('ascii'),
    }

    response = requests.post(url, data=form, headers=headers)
    return response.json()

#----VIEWS-------
def test(request):
    return HttpResponse("hello world!")
def login_spotify(request):
    state = generate_crsf_state()
    scope = 'user-read-email user-top-read user-read-private'
    params = {
        'client_id': client_id,
        'response_type': 'code',
        'scope': scope,
        'redirect_uri': redirect_uri,
        'state': state,
        'show_dialog': True
        # This last param can be removed to streamline OAuth process, included now for debugging
        # and ease of switching Spotify accounts when needed
    }

    url = "https://accounts.spotify.com/authorize?" + urlencode(params)

    return redirect(url)

def login_spotify_callback(request):
    code = request.GET.get('code', None)
    state = request.GET.get('state', None)
    if state is None:
        raise Exception("CRSF state mismatch")

    response = get_access_token(code)
    return JsonResponse(response)









