import { useState } from 'react'
import './PlaybackButton.css'

function PlaybackButton ({ url, start, duration, maxPlays }) {
  const [isTrackPlaying, setIsTrackPlaying] = useState(false)
  const [playsRemaining, setPlaysRemaining] = useState(maxPlays)
  const audio = new Audio(url)

  const stopPlayBack = async () => {
    await audio.pause()
    setPlaysRemaining(playsRemaining - 1)
    setIsTrackPlaying(false)
  }

  const startPlayback = async () => {
    if (!isTrackPlaying) {
      audio.currentTime = start
      await audio.play()
      setIsTrackPlaying(true)
      setTimeout(stopPlayBack, duration * 1000)
    }
  }

  if (playsRemaining > 0) {
    return (<button className='playback-button' onClick={startPlayback}>{isTrackPlaying ? 'Playing...' : 'Play'}</button>)
  }

  return (<p>No more plays remaining!</p>)
}

export default PlaybackButton
