import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './panelTwo.css';
import SlideIndicator from './SlideIndicator';

const PanelTwo = () => {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopGenres = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/spotify_top_genres', {
          headers: {
            Authorization: `Token ${sessionStorage.getItem('token')}`,
          },
        });
        setGenres(response.data.top_genres);
      } catch (err) {
        setError('Failed to load top genres');
        console.error('Error fetching top genres:', err);
      }
    };

    fetchTopGenres();
  }, []);

  // Limit to the top 5 genres
  const topGenres = Array.isArray(genres) ? genres.slice(0, 5) : [];

  return (
    <div className="panel-two">
      <div className="box">
        <h2 className="panel-heading">My Top Genres</h2>
        {error ? (
          <p>{error}</p>
        ) : (
          <ul className="genre-list">
            {topGenres.map((genre, index) => (
              <li key={index} className="genre-item">
                {/* Bar with proportional width and color */}
                <div className={`genre-bar genre-${index + 1}`}></div>
                {/* Text block with rank and genre name */}
                <div className="genre-text">
                  <span className="genre-rank">#{index + 1}</span>
                  <span className="genre-name">{genre[0]}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <SlideIndicator currentSlide={1} totalSlides={2} />
      </div>
    </div>
  );
};

export default PanelTwo
