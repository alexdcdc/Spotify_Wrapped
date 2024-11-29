import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react'

const TopTracksPlayer = ({ topTracks }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [isPlaying, currentTrackIndex])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    setCurrentTrackIndex((prev) =>
      (prev + 1) % topTracks.length
    )
  }

  const prevTrack = () => {
    setCurrentTrackIndex((prev) =>
      (prev - 1 + topTracks.length) % topTracks.length
    )
  }

  const currentTrack = topTracks[currentTrackIndex]

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-black text-white p-4 flex items-center'>
      <div className='flex-1'>
        <p>{currentTrack.name}</p>
        <p className='text-sm text-gray-400'>{currentTrack.artists[0].name}</p>
      </div>
      <div className='flex space-x-4 items-center'>
        <button onClick={prevTrack} className='hover:bg-gray-800 p-2 rounded'>
          <SkipBack size={24} />
        </button>
        <button onClick={togglePlay} className='hover:bg-gray-800 p-2 rounded'>
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={nextTrack} className='hover:bg-gray-800 p-2 rounded'>
          <SkipForward size={24} />
        </button>
      </div>
      <audio
        ref={audioRef}
        src={currentTrack.preview_url}
        onEnded={nextTrack}
      />
    </div>
  )
}

export default TopTracksPlayer
