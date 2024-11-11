import { base64encode, generateRandomString, sha256 } from './lib/oauth-crypt'

const redirectUri = process.env.REACT_APP_REDIRECT_URI
const clientId = process.env.REACT_APP_CLIENT_ID

const scope = 'user-read-private user-read-email user-read-recently-played user-top-read'
const authUrl = new URL('https://accounts.spotify.com/authorize')

// generated in the previous step
const requestAuth = async () => {
  const codeVerifier = generateRandomString(64)
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed)
  sessionStorage.setItem('code_verifier', codeVerifier)

  const params = {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri
  }
  authUrl.search = new URLSearchParams(params).toString()
  window.location.href = authUrl.toString()
}

function SpotifyButton () {
  return (
    <button onClick={requestAuth}>Log in with Spotify</button>
  )
}

export default SpotifyButton
