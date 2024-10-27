import { base64encode, generateRandomString, sha256 } from "./lib/oauth-crypt"
import { useEffect } from "react";


const redirectUri = 'http://localhost:3000';
const clientId = process.env.REACT_APP_CLIENT_ID

const scope = 'user-read-private user-read-email';
const authUrl = new URL("https://accounts.spotify.com/authorize")

// generated in the previous step
const requestAuth = async () => {
    const codeVerifier  = generateRandomString(64);
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed);
    window.localStorage.setItem('code_verifier', codeVerifier);

    const params =  {
      response_type: 'code',
      client_id: clientId,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    }

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}


async function getApiToken(accessToken, refreshToken, expiresIn) {
    const url = "http://localhost:8000/api/authenticate"

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
          'access_token': accessToken,
          'refresh_token': refreshToken,
          'expires_in': expiresIn
      }),
    }

    const body = await fetch(url, payload);
    if (!body.ok) {
        console.error("Unable to authenticate user");
        return Promise.reject()
    }

    const response = await body.json();
    const token = response.auth_token;

    console.log("Token acquired: " + token)
    localStorage.setItem("token", token);
}

const getToken = async (code) => {
    const url = "https://accounts.spotify.com/api/token";
    // stored in the previous step
    let codeVerifier = localStorage.getItem('code_verifier');

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    }

    const body = await fetch(url, payload);

    if (!body.ok) {
        console.error("Unable to fetch token from Spotify API");
        return Promise.reject();
    }

    const response = await body.json();

    const accessToken = response.access_token;
    const refreshToken = response.refresh_token;
    const expiresIn = response.expires_in;
    
    getApiToken(accessToken, refreshToken, expiresIn);
}

function SpotifyButton() {
  console.log("hello world")
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      let code = urlParams.get('code');
      if (code) {
          getToken(code);
      }
    }, []);
    return (
        <button onClick = { requestAuth }>Log in with Spotify</button>
    )
}

export default SpotifyButton;