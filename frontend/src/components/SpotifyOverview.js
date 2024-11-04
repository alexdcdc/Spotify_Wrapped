import { useState, useEffect } from 'react';
import './SpotifyWrapped.css';

function SpotifyWrapped() {
    const [spotifyData, setSpotifyData] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    const getSpotifyData = async () => {
        if (!token) {
            setError("User is not authenticated.");
            return;
        }

        const url = "http://localhost:8000/api/top-tracks";
        const payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Token ' + token,
            }
        };

        try {
            const response = await fetch(url, payload);
            if (!response.ok) {
                const errorMessage = `Error ${response.status}: ${response.statusText}`;
                throw new Error(errorMessage);
            }
            const data = await response.json();
            console.log("Fetched Spotify Wrapped data:", data);
            setSpotifyData(data);
        } catch (error) {
            console.error("Failed to fetch Spotify Wrapped data:", error);
            setError(error.message);
        }
    };

    useEffect(() => {
        if (token) getSpotifyData();
    }, [token]);

    if (!token) return <p>Please sign in to view your Spotify Wrapped data.</p>;

    return (
        <div className="spotify-wrapper">
            <h1>Your Spotify Wrapped</h1>
            {error ? (
                <p className="error">{error}</p>
            ) : spotifyData ? (
                <div className="tracks-container">
                    <h2>Top Tracks:</h2>
                    <div className="tracks-columns">
                        <div className="track-column">
                            {spotifyData.items.slice(0, 5).map((track, index) => (
                                <TrackItem track={track} index={index} key={track.id} />
                            ))}
                        </div>
                        <div className="track-column">
                            {spotifyData.items.slice(5, 10).map((track, index) => (
                                <TrackItem track={track} index={index + 5} key={track.id} />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading your Spotify Wrapped data...</p>
            )}
        </div>
    );
}

function TrackItem({ track, index }) {
    const trackName = track.name;
    const albumName = track.album.name;
    const albumImage = track.album.images[0]?.url;
    const trackUrl = track.external_urls.spotify;
    const artistNames = track.artists.map(artist => (
        <a key={artist.id} href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="artist-link">
            {artist.name}
        </a>
    ));

    return (
        <div className="track-item">
            <a href={trackUrl} target="_blank" rel="noopener noreferrer" className="track-link">
                <div className="track-info">
                    <span className="track-number">{index + 1}</span>
                    <strong>{trackName}</strong>
                    <span className="track-album"> from <em>{albumName}</em></span>
                    <span className="track-artists"> by {artistNames.reduce((prev, curr) => [prev, ', ', curr])}</span>
                </div>
                {albumImage && (
                    <img src={albumImage} alt={`${albumName} cover`} className="album-cover" />
                )}
            </a>
        </div>
    );
}

export default SpotifyWrapped;



