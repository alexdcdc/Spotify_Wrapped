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
            <h1>The music that defined your decade.</h1>
            {error ? (
                <p className="error">{error}</p>
            ) : spotifyData ? (
                <div className="yearly-tracks">
                    {spotifyData.items.slice(0, 5).map((track, index) => (
                        <YearlyTrackItem track={track} year={2015 + index} key={track.id} />
                    ))}
                </div>
            ) : (
                <p>Loading your Spotify Wrapped data...</p>
            )}
        </div>
    );
}

function YearlyTrackItem({ track, year }) {
    const trackName = track.name;
    const artistName = track.artists[0].name;
    const trackUrl = track.external_urls.spotify; // Spotify link for the track
    const artistUrl = track.artists[0].external_urls.spotify; // Spotify link for the artist
    const albumImage = track.album.images[0]?.url;

    return (
        <div className="yearly-track-item">
            <img src={albumImage} alt={`${trackName} cover`} className="album-cover" />
            <p className="year-label">{year}</p>
            <p className="track-label">Top Song</p>
            <a href={trackUrl} target="_blank" rel="noopener noreferrer" className="track-name">
                {trackName}
            </a>
            <p className="track-label">Top Artist</p>
            <a href={artistUrl} target="_blank" rel="noopener noreferrer" className="artist-name">
                {artistName}
            </a>
        </div>
    );
}

export default SpotifyWrapped;



