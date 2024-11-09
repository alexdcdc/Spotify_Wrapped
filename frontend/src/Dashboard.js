import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { get } from './lib/requests'

function Dashboard() {
    const [firstName, setFirstName] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

  const getUserData = async () => {
    const url = 'http://localhost:8000/api/user'

    const response = await get(url, {}, true)

    if (!response.ok) {
      return Promise.reject(new Error('Unable to get user data'))
    }

    const user = await response.json()
    setFirstName(user.first_name)
  }

    useEffect(() => {
        getUserData();
    }, [])

    const handleNavigateToSpotifyOverview = () => {
        navigate('/dashboard/overview'); // Navigate to the Spotify Overview page
    };

    return (
        <div>
            <p>Welcome to the dashboard, {firstName}.</p>
            <button onClick={handleNavigateToSpotifyOverview}>
                Go to Spotify Overview
            </button>
        </div>
    );
}

export default Dashboard
