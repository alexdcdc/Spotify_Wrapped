import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SpotifyOverview() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get('/api/spotify-stats/')
            .then(response => setStats(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    if (!stats) return <p>Loading...</p>;

    return (
        <div>
            <h2>Spotify Wrapped Overview</h2>
            <p>Total Hours Listened: {stats.total_hours}</p>
            <p>Total Songs Played: {stats.total_songs}</p>
            <p>Most Active Months: {stats.active_months}</p>

            <h3>Top Genres</h3>
            <ul>
                {stats.top_genres.map((genre, index) => (
                    <li key={index}>{genre.name}: {genre.count}</li>
                ))}
            </ul>

            <h3>Top Artists</h3>
            <ul>
                {stats.top_artists.map((artist, index) => (
                    <li key={index}>{artist.name}: {artist.listen_count}</li>
                ))}
            </ul>
        </div>
    );
}

export default SpotifyOverview;
