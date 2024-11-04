import { useState, useEffect } from 'react';

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
            console.log("Fetched Spotify Wrapped data:", data); // Log the data to inspect its structure
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
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Your Spotify Wrapped</h1>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : spotifyData ? (
                <div>
                    <h2>Top Tracks:</h2>
                    {spotifyData.items && spotifyData.items.length > 0 ? (
                        <ul>
                            {spotifyData.items.map((track, index) => {
                                // Extracting only the necessary information
                                const trackName = track.name;
                                const albumName = track.album.name;
                                const trackUrl = track.external_urls.spotify; // Spotify link for the track
                                const artistNames = track.artists.map(artist => (
                                    <a key={artist.id} href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                        {artist.name}
                                    </a>
                                ));

                                return (
                                    <li key={index}>
                                        <a href={trackUrl} target="_blank" rel="noopener noreferrer">
                                            <strong>{trackName}</strong>
                                        </a> from the album <em>{albumName}</em> by {artistNames.reduce((prev, curr) => [prev, ', ', curr])}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>No top tracks available.</p>
                    )}
                </div>
            ) : (
                <p>Loading your Spotify Wrapped data...</p>
            )}
        </div>
    );
}

export default SpotifyWrapped;

