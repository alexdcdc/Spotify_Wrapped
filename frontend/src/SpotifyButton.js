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


const getToken = async (code) => {
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
    console.log("hihi");
    const body = await fetch("https://accounts.spotify.com/api/token", payload);
    const response = await body.json();

    console.log(response);
    localStorage.setItem('access_token', response.access_token);
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