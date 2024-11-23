import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate for navigation
import { get } from './lib/requests'
import './Dashboard.css'
import WrappedCard from './WrappedCard'

function Dashboard () {
  const [firstName, setFirstName] = useState('')
  const [wrappedList, setWrappedList] = useState([])
  const navigate = useNavigate() // Initialize useNavigate

  const getUserData = async () => {
    const url = 'http://localhost:8000/api/user'

    const response = await get(url, {}, true)

    if (!response.ok) {
      return Promise.reject(new Error('Unable to get user data'))
    }

    const user = await response.json()
    setFirstName(user.first_name)
  }

  const getUserWrapped = async () => {
    const url = 'http://localhost:8000/api/wrapped'
    const response = await get(url, {}, true)

    if (!response.ok) {
      return Promise.reject(new Error('Unable to get user wrapped'))
    }

    const data = await response.json()
    setWrappedList(data.wrapped_list)
  }

  useEffect(() => {
    getUserData()
    getUserWrapped()
  }, [])

  const handleNavigateToPanelOne = () => {
    navigate('/dashboard/panel-one') // Navigate to the Spotify Overview page
  }

  return (
    <div>
      <p>Welcome to the dashboard, {firstName}.</p>
      <div className='wrapped-card-container'>
        {wrappedList.map(
          (wrappedData) => <WrappedCard name={wrappedData.name} dateCreated={new Date(wrappedData.date_created)} key={wrappedData.id} id={wrappedData.id} />
        )}
      </div>
      <button onClick={handleNavigateToPanelOne}>
        Go to Panel One
      </button>
    </div>
  )
}

export default Dashboard
