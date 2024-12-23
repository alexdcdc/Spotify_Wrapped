import { useState, useEffect } from 'react'
import './llmPanel.css'
import {generateUrl} from "../lib/requests";

function LLMPanel () {
  const [llmData, setLlmData] = useState(null)
  const [error, setError] = useState(null)
  const token = sessionStorage.getItem('token')

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    document.body.style.fontFamily = "'Montserrat', sans-serif"
  }, [])

  const fetchData = async () => {
    if (!token) {
      setError('User is not authenticated.')
      return
    }

    const url = generateUrl('api/wrapped-llm')
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
      setLlmData(data)
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    if (token) fetchData()
  }, [token])

  if (!token) return <p>Please sign in to view your personality insights.</p>

  return (
    <div className='llm-wrapper'>

      <h1>Your Personality Snapshot</h1>
      {error
        ? (
          <p className='error'>{error}</p>
          )
        : llmData
          ? (
            <div className='insight-content'>
              {llmData.personality_description && (
                <div className='insight-card'>
                  <h2>Personality & Thinking Style</h2>
                  <p>{llmData.personality_description}</p>
                </div>
              )}

              {llmData.fashion_choices && (
                <div className='insight-card'>
                  <h2>Fashion Choices</h2>
                  <p>{llmData.fashion_choices}</p>
                </div>
              )}

              {llmData.behavior_description && (
                <div className='insight-card'>
                  <h2>Behavior</h2>
                  <p>{llmData.behavior_description}</p>
                </div>
              )}
            </div>
            )
          : (
            <p>Loading your insights...</p>
            )}
    </div>
  )
}

export default LLMPanel
