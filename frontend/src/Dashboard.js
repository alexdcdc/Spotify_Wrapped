import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // Import useNavigate for navigation
import { get } from './lib/requests'
import './Dashboard.css'
import WrappedCard from './WrappedCard'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

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

    return (

        <div className="dashboard">
            <h1 className="title pb-3">{firstName}'s Dashboard</h1>
            <div className="grid-container">

                <button className="card create-new" onClick="location.href='create-new.html'">
                    <div className="plus-icon">+</div>
                    <p className="title">Create New</p>
                </button>


                <button className="card" onClick="location.href='my-fav-wrap.html'">
                    <div className="image-placeholder"></div>
                    <p>My Fav Wrap</p>
                </button>


                <button className="card" onClick="location.href='wrap-2.html'">
                    <div className="image-placeholder"></div>
                    <p>Wrap 2</p>
                </button>
            </div>
      </div>

    )
}

export default Dashboard
