import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './panelTwo.css';
import SlideIndicator from './SlideIndicator'; // Import SlideIndicator

const PanelTwo = () => {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  // Fixed currentSlide and totalSlides for static example

  useEffect(() => {
    const fetchTopGenres = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/spotify_top_genres', {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
          }
        });
        setGenres(response.data.top_genres);
      } catch (err) {
        setError('Failed to load top genres');
        console.error(err);
      }
    };

    fetchTopGenres();
  }, []);

  // Sort genres by the number of occurrences in descending order and limit to top 5
  const sortedGenres = genres
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className='panel-two'>
      <h2>Top Genres</h2>
      {error
        ? (
          <p>{error}</p>
        )
        : (
          <>
            <ul>
              {sortedGenres.map((genre, index) => (
                <li key={index}>
                  {genre[0]} ({genre[1]})
                </li>
              ))}
            </ul>
            {/* Static SlideIndicator */}
            <SlideIndicator currentSlide={1} totalSlides={2} />
          </>
        )}
    </div>
  );
};

export default PanelTwo;
