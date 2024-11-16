/*
import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tag } from '@/components/ui/tag'

const SpotifyWrappedPersonality = () => {
  const [personalityDescription, setPersonalityDescription] = useState('')
  const [genresAndArtists, setGenresAndArtists] = useState({
    genres: [],
    artists: []
  })

  useEffect(() => {
    const fetchPersonalityData = async () => {
      try {
        const response = await axios.get('/api/llm_generate/')
        const trimmedDescription = response.data.personality_description.slice(0, 150) + '...'
        setPersonalityDescription(trimmedDescription)
        setGenresAndArtists({
          genres: response.data.based_on.genres,
          artists: response.data.based_on.artists
        })
      } catch (error) {
        console.error('Error fetching personality data:', error)
      }
    }

    fetchPersonalityData()
  }, [])

  return (
    <div className='flex justify-center items-center h-screen'>
      <Card className='w-full max-w-xl bg-gradient-to-b from-black to-purple-700 text-white'>
        <CardHeader>
          <CardTitle>Your Spotify Wrapped Personality</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{personalityDescription}</p>
          <h3 className='text-lg font-medium mb-2'>Based on:</h3>
          <div className='flex flex-wrap gap-2'>
            {genresAndArtists.genres.map((genre, index) => (
              <Tag key={index} className='bg-gray-200 text-gray-800'>
                {genre}
              </Tag>
            ))}
            {genresAndArtists.artists.map((artist, index) => (
              <Tag key={index} className='bg-gray-200 text-gray-800'>
                {artist}
              </Tag>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SpotifyWrappedPersonality
*/

function LLMPanel () {
  return <p>LLM Panel TBA</p>
}

export default LLMPanel
