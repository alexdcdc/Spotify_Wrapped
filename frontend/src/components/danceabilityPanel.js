// DanceabilityPanel.js
import React, { useEffect, useState } from 'react';
import './panelOne.css.css';

function DanceabilityPanel({ token }) {
  const [danceability, setDanceability] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDanceability = async () => {
      const url = 'http://localhost:8000/api/danceability';
      const payload = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Token ' + token
        }
      };

      try {
        const response = await fetch(url, payload);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setDanceability(data.average_danceability * 100); // Scale to 1-100
      } catch (error) {
        setError(error.message);
      }
    };

    if (token) {
      fetchDanceability();
    }
  }, [token]);

  return (
    <div className="danceability-panel">
      <h2>Danceability Score</h2>
      {error ? (
        <p className="error">{error}</p>
      ) : danceability !== null ? (
        <p className="danceability-score">{danceability.toFixed(2)} / 100</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default DanceabilityPanel;
