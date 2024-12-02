import React, { useEffect, useState } from 'react';
import { get } from '../lib/requests';
import './panels/IntroPanel.css';

function TopTracksPlayer({ topTracks }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [token, setToken] = useState('');
  const [player, setPlayer] = useState(undefined);
  const [playerId, setPlayerId] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const getAccessToken = async () => {
    const url = 'http://localhost:8000/api/token';
    const response = await get(url, {}, true);
    const data = await response.json();
    setToken(data.token);
    createPlayer(data.token);
  };

  const createPlayer = (token) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Spotify Wrapped Player',
        getOAuthToken: (cb) => cb(token),
        volume: 0.5,
      });

      setPlayer(spotifyPlayer);

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Player Ready with Device ID:', device_id);
        setPlayerId(device_id);
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline:', device_id);
      });

      spotifyPlayer.connect();
    };
  };

  const startPlayback = async () => {
    if (!playerId || topTracks.length === 0) return;

    const url = `https://api.spotify.com/v1/me/player/play?device_id=${playerId}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const uris = topTracks.map((track) => track.uri); // Extract track URIs

    const data = {
      uris,
      offset: { position: currentTrackIndex },
      position_ms: 0,
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log('Playback started');
      setIsPlaying(true);
    } else {
      console.error('Error starting playback:', response);
    }
  };

  const switchTrack = async (index) => {
    setCurrentTrackIndex(index);

    if (playerId && topTracks.length > 0) {
      const url = `https://api.spotify.com/v1/me/player/play?device_id=${playerId}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      const uris = topTracks.map((track) => track.uri);

      const data = {
        uris,
        offset: { position: index },
        position_ms: 0,
      };

      await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
    }
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTrackIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % topTracks.length;
        switchTrack(nextIndex);
        return nextIndex;
      });
    }, 20000);

    return () => clearInterval(interval);
  }, [playerId, topTracks]);

  useEffect(() => {
    getAccessToken();
  }, []);

  if (!topTracks || topTracks.length === 0) {
    return <div>No tracks available to play.</div>;
  }

  return (
    <div className="intro-panel">
      <h1 className="intro-title">Welcome to Your Spotify Wrapped</h1>
      <p className="intro-description">
        Discover your top tracks, genres, and artists of the year in an immersive, personalized experience.
      </p>
      <button className="start-button" onClick={startPlayback}>
        Let's Start
      </button>
    </div>
  );
}

export default TopTracksPlayer;
