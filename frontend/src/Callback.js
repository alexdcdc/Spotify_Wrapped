import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { post, get, postUrlEncoded } from './lib/requests'

const redirectUri = process.env.REACT_APP_REDIRECT_URI
const clientId = process.env.REACT_APP_CLIENT_ID

async function setAuthToken (accessToken, refreshToken, expiresIn) {
  const url = 'http://localhost:8000/api/authenticate'
  const requestBody = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn
  }

  const response = await post(url, requestBody)

  if (!response.ok) {
    return Promise.reject(new Error('Unable to authenticate user'))
  }

  const body = await response.json()
  const token = body.auth_token

  console.log('Token acquired: ' + token)
  sessionStorage.setItem('token', token)
}

const authenticate = async (code) => {
  const url = 'https://accounts.spotify.com/api/token'
  // stored in the previous step
  const codeVerifier = sessionStorage.getItem('code_verifier')
  const requestBody = {
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier
  }

  const body = await postUrlEncoded(url, requestBody)

  if (!body.ok) {
    return Promise.reject(new Error('Unable to fetch token from Spotify API'))
  }

  const response = await body.json()

  const accessToken = response.access_token
  const refreshToken = response.refresh_token
  const expiresIn = response.expires_in

  await setAuthToken(accessToken, refreshToken, expiresIn)
}

const getRegisteredStatus = async () => {
  const url = 'http://localhost:8000/api/user'
  const response = await get(url, {}, true)

  if (!response.ok) {
    return Promise.reject(new Error('Unable to fetch user data'))
  }

  const user = await response.json()

  return user.is_registered
}

function Callback () {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Please wait...')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (code) {
      authenticate(code).then(
        async () => {
          const isRegistered = await getRegisteredStatus()
          sessionStorage.setItem('isRegistered', isRegistered)
          navigate(isRegistered ? '/dashboard' : '/register')
        },
        () => {
          setStatus('An error occurred while trying to log in.')
        })
    }
  }, [])

  return (
    <div>{status}</div>
  )
}

export default Callback
