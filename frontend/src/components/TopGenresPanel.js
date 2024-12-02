import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './panelTwo.css'
import {generateUrl, get} from "../lib/requests";

const PanelTwo = () => {
  const [genres, setGenres] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTopGenres = async () => {
      try {
        const response = await get(generateUrl('api/spotify_top_genres'), {}, true)
        const data = await response.json()
        setGenres(data.top_genres)
      } catch (err) {
        setError('Failed to load top genres')
        console.error('Error fetching top genres:', err)
      }
    }

    fetchTopGenres()
  }, [])

  // Limit to the top 5 genres
  const topGenres = Array.isArray(genres) ? genres.slice(0, 5) : []

  return (
    <div className='panel-two'>
      <div className='box'>
        <h2 className='panel-heading'>My Top Genres</h2>
        {error
          ? (
            <p>{error}</p>
            )
          : (
            <ul className='genre-list'>
              {topGenres.map((genre, index) => (
                <li key={index} className='genre-item'>
                  {/* Bar with proportional width and color */}
                  <div className={`genre-bar genre-${index + 1}`} />
                  {/* Text block with rank and genre name */}
                  <div className='genre-text'>
                    <span className='genre-rank'>#{index + 1}</span>
                    <span className='genre-name'>{genre[0]}</span>
                  </div>
                </li>
              ))}
            </ul>
            )}
      </div>
    </div>
  )
}

export default PanelTwo
