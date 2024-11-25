import { useState, useEffect } from 'react'
import './panelOne.css'

function PanelOne () {
  const [spotifyData, setSpotifyData] = useState(null)
  const [error, setError] = useState(null)
  const token = sessionStorage.getItem('token')

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    document.body.style.fontFamily = "'Montserrat', sans-serif"
  }, [])

  const getSpotifyData = async () => {
    if (!token) {
      setError('User is not authenticated.')
      return
    }

    const url = 'http://localhost:8000/api/top-tracks'
    const payload = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
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
      setSpotifyData(data)
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    if (token) getSpotifyData()
  }, [token])

  if (!token) return <p>Please sign in to view your Spotify Wrapped data.</p>

  return (
    <div className='spotify-wrapper'>
      <h1>The music that defined your month.</h1>
      {error
        ? (
          <p className='error'>{error}</p>
          )
        : spotifyData
          ? (
            <div className='yearly-tracks'>
              {spotifyData.items.length > 0
                ? (
                    spotifyData.items.slice(0, 5).map((_, index) => {
                      const track1 = spotifyData.items[index * 2]
                      const track2 = spotifyData.items[index * 2 + 1]
                      return (
                        <YearlyTrackItem
                          track1={track1}
                          track2={track2}
                          year={2015 + index}
                          startIndex={index * 2}
                          key={`${track1?.id || track2?.id || index}-${index}`}
                        />
                      )
                    })
                  )
                : (
                  <p>No tracks available.</p>
                  )}
            </div>
            )
          : null}
    </div>
  )
}

function YearlyTrackItem ({ track1, track2, startIndex }) {
  if (!track1 || !track2) return null

  const track1Name = track1.name
  const artist1Name = track1.artists[0].name
  const track1Url = track1.external_urls.spotify
  const artist1Url = track1.artists[0].external_urls.spotify
  const albumImage1 = track1.album.images[0]?.url

  const track2Name = track2.name
  const artist2Name = track2.artists[0].name
  const track2Url = track2.external_urls.spotify
  const artist2Url = track2.artists[0].external_urls.spotify
  const albumImage2 = track2.album.images[0]?.url

  return (
    <div className='yearly-track-item'>
      <div className='album-cover-container'>
        <img src={albumImage1} alt={`${track1Name} cover`} className='album-cover' />
        <img src={albumImage2} alt={`${track2Name} cover`} className='album-cover' />
      </div>
      <div className='track-details'>
        <p className='track-label'>{startIndex + 1}</p>
        <a href={track1Url} target='_blank' rel='noopener noreferrer' className='track-name'>
          {track1Name}
        </a>
        <a href={artist1Url} target='_blank' rel='noopener noreferrer' className='artist-name'>
          {artist1Name}
        </a>
      </div>
      <div className='track-details'>
        <p className='track-label'>{startIndex + 2}</p>
        <a href={track2Url} target='_blank' rel='noopener noreferrer' className='track-name'>
          {track2Name}
        </a>
        <a href={artist2Url} target='_blank' rel='noopener noreferrer' className='artist-name'>
          {artist2Name}
        </a>
      </div>
    </div>
  )
}

export default PanelOne
