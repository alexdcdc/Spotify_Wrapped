import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {generateUrl, post} from './lib/requests'

function Register () {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const postUserInfo = async (e) => {
    e.preventDefault()
    const url = generateUrl('api/user')
    const requestBody = {
      first_name: firstName,
      last_name: lastName,
      username
    }

    const response = await post(url, requestBody, true)

    if (response.ok) {
      sessionStorage.setItem('isRegistered', true)
      navigate('/dashboard')
    } else {
      return Promise.reject(new Error('An error occurred while trying to submit user information'))
    }
  }

  if (!sessionStorage.getItem('token')) {
    return (<Navigate to='/' />)
  }

  if (sessionStorage.getItem('isRegistered') === 'true') {
    return (<Navigate to='/dashboard' />)
  }

    return (
    <form onSubmit={postUserInfo} className="form-container">
      <h2 className="form-title">User Information</h2>

      <label htmlFor="first_name" className="form-label">First Name:</label>
      <input
        onChange={e => setFirstName(e.target.value)}
        type="text"
        id="fname"
        name="fname"
        required
        className="form-input"
      />

      <label htmlFor="last_name" className="form-label">Last Name:</label>
      <input
        onChange={e => setLastName(e.target.value)}
        type="text"
        id="lname"
        name="lname"
        required
        className="form-input"
      />

      <label htmlFor="username" className="form-label">Username:</label>
      <input
        onChange={e => setUsername(e.target.value)}
        type="text"
        id="username"
        name="username"
        required
        className="form-input"
      />

      <button type="submit" className="form-button">Submit</button>
    </form>
  )
}

export default Register
