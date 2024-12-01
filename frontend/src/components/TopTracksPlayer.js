import React, { useState } from 'react';

function TopTracksPlayer({ topTracks }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!topTracks || topTracks.length === 0) {
    return <div>No tracks available to play.</div>;
  }

  const playTrack = (trackUrl) => {
    const audio = new Audio(trackUrl);
    audio.play();
    setIsPlaying(true);
    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % topTracks.length);
  };

  const handlePreviousTrack = () => {
    setCurrentTrackIndex(
      (prevIndex) => (prevIndex - 1 + topTracks.length) % topTracks.length
    );
  };

  return (
    <div className="top-tracks-player">
      <h3>Now Playing:</h3>
      <p>{topTracks[currentTrackIndex].title} by {topTracks[currentTrackIndex].artist}</p>
      <div className="controls">
        <button onClick={handlePreviousTrack}>&lt; Previous</button>
        <button
          onClick={() =>
            playTrack(topTracks[currentTrackIndex].preview_url)
          }
          disabled={isPlaying}
        >
          {isPlaying ? 'Playing...' : 'Play'}
        </button>
        <button onClick={handleNextTrack}>Next &gt;</button>
      </div>
    </div>
  );
}

export default TopTracksPlayer;
