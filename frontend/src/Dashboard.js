import { useState, useEffect } from 'react'
function Dashboard () {
  const [firstName, setFirstName] = useState('')

  const getUserData = async () => {
    const url = 'http://localhost:8000/api/user'
    const payload = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Token ' + localStorage.getItem('token')
      }
    }
    const response = await fetch(url, payload)
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
