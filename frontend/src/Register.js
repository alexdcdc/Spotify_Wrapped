import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {post} from "./lib/requests"

function Register () {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const postUserInfo = async (e) => {
    e.preventDefault()
    const url = 'http://localhost:8000/api/user'
    const requestBody = {
        first_name: firstName,
        last_name: lastName,
        username
      }

    const response = await post(url, requestBody, true)

    if (response.ok) {
      navigate('/dashboard')
    } else {
      return Promise.reject(new Error('An error occurred while trying to submit user information'))
    }
  }

  return (
    <form onSubmit={postUserInfo}>
      <label htmlFor='first_name'>First Name:</label>
      <input onChange={e => { setFirstName(e.target.value) }} type='text' id='fname' name='fname' required />
      <br /><br />

      <label htmlFor='last_name'>Last Name:</label>
      <input onChange={e => { setLastName(e.target.value) }} type='text' id='lname' name='lname' required />
      <br /><br />

      <label htmlFor='username'>Username:</label>
      <input onChange={e => { setUsername(e.target.value) }} type='text' id='username' name='username' required />
      <br /><br />

      <button type='submit'>Submit</button>
    </form>
  )
}

export default Register
