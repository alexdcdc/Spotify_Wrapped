// TopGenresPanel.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const TopGenresPanel = () => {
  const [genres, setGenres] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTopGenres = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/spotify_top_genres', {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
          }
        })
        setGenres(response.data.top_genres)
      } catch (err) {
        setError('Failed to load top genres')
        console.error(err)
      }
    }

    fetchTopGenres()
  }, [])

  return (
    <div className='panel-two'>
      <h2>Top Genres</h2>
      {error
        ? (
          <p>{error}</p>
          )
        : (
          <ul>
            {genres.map((genre, index) => (
              <li key={index}>
                {genre[0]} ({genre[1]})
              </li>
            ))}
          </ul>
          )}
    </div>
  )
}

export default TopGenresPanel
