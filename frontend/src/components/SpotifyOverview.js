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
                const errorMessage = `Error ${response.status}: ${response.statusText}`; // Fixed syntax error
                throw new Error(errorMessage);
            }
            const data = await response.json();
            setSpotifyData(data);
        } catch (error) {
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
                    {spotifyData.items.slice(0, 5).map((_, index) => {
                        // Ensure there are two tracks to display per year
                        const track1 = spotifyData.items[index * 2];
                        const track2 = spotifyData.items[index * 2 + 1];
                        return (
                            <YearlyTrackItem
                                track1={track1}
                                track2={track2}
                                year={2015 + index}
                                key={track1?.id || track2?.id || index} // Ensure a unique key is present
                            />
                        );
                    })}
                </div>
            ) : (
                <p>Loading your Spotify Wrapped data...</p>
            )}
        </div>
    );
}

function YearlyTrackItem({ track1, track2, year }) {
    if (!track1 || !track2) return null; // Ensure both tracks are available

    const track1Name = track1.name;
    const artist1Name = track1.artists[0].name;
    const track1Url = track1.external_urls.spotify;
    const artist1Url = track1.artists[0].external_urls.spotify;
    const albumImage1 = track1.album.images[0]?.url;

    const track2Name = track2.name;
    const artist2Name = track2.artists[0].name;
    const track2Url = track2.external_urls.spotify;
    const artist2Url = track2.artists[0].external_urls.spotify;
    const albumImage2 = track2.album.images[0]?.url;

    return (
        <div className="yearly-track-item">
            <div className="album-cover-container">
                <img src={albumImage1} alt={`${track1Name} cover`} className="album-cover" />
                <img src={albumImage2} alt={`${track2Name} cover`} className="album-cover" />
            </div>
            <p className="year-label">{year}</p>
            <div className="track-details">
                <p className="track-label">Top Song</p>
                <a href={track1Url} target="_blank" rel="noopener noreferrer" className="track-name">
                    {track1Name}
                </a>
                <p className="track-label">Top Artist</p>
                <a href={artist1Url} target="_blank" rel="noopener noreferrer" className="artist-name">
                    {artist1Name}
                </a>
            </div>
            <div className="track-details">
                <p className="track-label">Second Song</p>
                <a href={track2Url} target="_blank" rel="noopener noreferrer" className="track-name">
                    {track2Name}
                </a>
                <p className="track-label">Second Artist</p>
                <a href={artist2Url} target="_blank" rel="noopener noreferrer" className="artist-name">
                    {artist2Name}
                </a>
            </div>
        </div>
    );
}

export default SpotifyWrapped;
