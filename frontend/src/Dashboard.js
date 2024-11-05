import { useState, useEffect } from 'react'
import {get} from './lib/requests'

function Dashboard () {
  const [firstName, setFirstName] = useState('')

  const getUserData = async () => {
    const url = 'http://localhost:8000/api/user'

    const response = await get(url, {}, true)

    if (!response.ok) {
      return Promise.reject(new Error('Unable to get user data'))
    }

    const user = await response.json()
    setFirstName(user.first_name)
  }

  useEffect(() => { getUserData() }, [])

  return (
    <div>
      <p>Welcome to the dashboard, {firstName}.</p>
    </div>
  )
}

export default Dashboard
