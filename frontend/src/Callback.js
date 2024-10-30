import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const clientId = process.env.REACT_APP_CLIENT_ID;

async function setAuthToken(accessToken, refreshToken, expiresIn) {
    console.log(accessToken);
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

    console.log(response)
    console.log("Token acquired: " + token)
    localStorage.setItem("token", token);

}

const authenticate = async (code) => {
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

    await setAuthToken(accessToken, refreshToken, expiresIn);
}

const getRegisteredStatus = async () => {
    const payload = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Token ' + localStorage.getItem('token'),
        },
    };
    const response = await fetch("http://localhost:8000/api/user", payload);
    if (!response.ok) {
        return Promise.reject("Unable to fetch user data");
    }

    const user = await response.json();

    return user.is_registered;
}

function Callback() {
    const navigate = useNavigate();
    const [status, setStatus] = useState("Please wait...")

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get('code');
        if (code) {
            authenticate(code).then(
                async () => {
                    const isRegistered = await getRegisteredStatus();
                    navigate(isRegistered ? "/dashboard" : "/register");
                },
                () => {
                    setStatus("An error occurred while trying to log in.")
                });
        }
    }, []);

    return (
        <div>{status}</div>
    );
}

export default Callback;