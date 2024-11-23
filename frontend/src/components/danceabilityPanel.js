import { useState, useEffect } from 'react'
import './danceabilityPanel.css'

function DanceabilityPanel () {
  const [danceabilityScore, setDanceabilityScore] = useState(null)
  const [error, setError] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 3 // Example: Adjust to the actual number of slides.
  const token = localStorage.getItem('token')

  useEffect(() => {
    // Add Google Font dynamically
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // Set body font family
    document.body.style.fontFamily = "'Montserrat', sans-serif"
  }, [])

  // Fetch danceability score from API
  const fetchDanceabilityScore = async () => {
    if (!token) {
      setError('User is not authenticated.')
      return
    }

    const url = 'http://localhost:8000/api/danceability' // Update with the correct endpoint.
    const payload = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token
      }
    }

    try {
      const response = await fetch(url, payload)
      if (!response.ok) {
        const errorMessage = `Error ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }
      const data = await response.json()
      setDanceabilityScore(data.average_danceability) // Assuming the API response includes { score: <value> }.
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    if (token) fetchDanceabilityScore()
  }, [token])

  if (!token) return <p>Please sign in to view your danceability score.</p>

  // Slide navigation handlers
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)

  return (
    <div className='danceability-wrapper'>
      <h1>Your Danceability Spectrum</h1>
      <div className='svg-container left-side'>

        <img src='../../public/dancingFigure.svg' alt='Dance Visual Left' />
      </div>
      {error ? (
        <p className='error'>{error}</p>
      ) : danceabilityScore !== null ? (
        <div className='score-container'>
          <div className='spectrum'>
            <div
              className='score-indicator'
              style={{
                left: `calc(${danceabilityScore}% - 10px)` // Adjust position
              }}
            />
          </div>
          <p>Your danceability score: {danceabilityScore}</p>
        </div>
      ) : (
        <p>Loading your danceability score...</p>
      )}
      <div className='svg-container right-side'>

        <img src='./musical_notes.svg' alt='Dance Visual Right' />
      </div>
      <div className='navigation-buttons'>
        <button onClick={prevSlide}>&lt; Prev</button>
        <button onClick={nextSlide}>Next &gt;</button>
      </div>
    </div>
  )
}

export default DanceabilityPanel
