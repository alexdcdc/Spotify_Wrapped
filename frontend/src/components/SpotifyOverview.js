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
                    <h2>Top Song: {spotifyData.top_song || 'N/A'}</h2>
                    <h2>Top Artist: {spotifyData.top_artist || 'N/A'}</h2>
                    <p>Listening Hours: {spotifyData.listening_hours || 'N/A'}</p>

                    {/* Display top tracks if available */}
                    {spotifyData.top_tracks && spotifyData.top_tracks.length > 0 && (
                        <div>
                            <h3>Your Top Tracks:</h3>
                            <ul>
                                {spotifyData.top_tracks.map((track, index) => (
                                    <li key={index}>
                                        {track.name} by {track.artist} - {track.play_count} plays
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Display top artists if available */}
                    {spotifyData.top_artists && spotifyData.top_artists.length > 0 && (
                        <div>
                            <h3>Your Top Artists:</h3>
                            <ul>
                                {spotifyData.top_artists.map((artist, index) => (
                                    <li key={index}>{artist.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Full data for debugging */}
                    <pre style={{ marginTop: '20px', backgroundColor: '#f4f4f4', padding: '10px' }}>
                        {JSON.stringify(spotifyData, null, 2)}
                    </pre>
                </div>
            ) : (
                <p>Loading your Spotify Wrapped data...</p>
            )}
        </div>
    );
}

export default SpotifyWrapped;

