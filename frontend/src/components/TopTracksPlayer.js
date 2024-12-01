import React, {useEffect, useState} from 'react';
import {get} from '../lib/requests'

function TopTracksPlayer({topTracks}) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [token, setToken] = useState("")
  const [player, setPlayer] = useState(undefined)
  const [playerId, setPlayerId] = useState("")

  const getAccessToken = async () => {
    const url = "http://localhost:8000/api/token"
    const response = await get(url, {}, true)
    const data = await response.json()
    setToken(data.token)
    await createPlayer(data.token)
  }

  const createPlayer = (token) => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => {
          cb(token);
        },
        volume: 0.5
      });

      setPlayer(player);

      player.addListener('ready', ({device_id}) => {
        console.log('Ready with Device ID', device_id);
        setPlayerId(device_id)
      });

      player.addListener('not_ready', ({device_id}) => {
        console.log('Device ID has gone offline', device_id);
      });


      player.connect();
    }
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

  const startPlayback = async () => {
    const url = "https://api.spotify.com/v1/me/player/play?device_id=" + playerId
    const headers = {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json",
    }
    const data = {
      "context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr",
      "offset": {
        "position": 5
      },
      "position_ms": 0
    }

    const payload = {
      method: "PUT",
      headers,
      body: JSON.stringify(data)
    }

    const response = await fetch(url, payload)
    console.log(response)
  }


  useEffect(() => {
    getAccessToken()
  }, [])

  if (!topTracks || topTracks.length === 0) {
    return <div>No tracks available to play.</div>;
  }

  return (
    <div className="top-tracks-player">
      <h3>Now Playing:</h3>
      <p>{topTracks[currentTrackIndex].title} by {topTracks[currentTrackIndex].artist}</p>
      <div className="controls">
        <button onClick={startPlayback}>Start</button>
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

export default TopTracksPlayer