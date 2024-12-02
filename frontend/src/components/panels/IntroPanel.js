import React from 'react';
import './IntroPanel.css'; // Ensure this matches the name of your CSS file.

function IntroPanel() {
  return (
    <div className="intro-panel">
      <h1 className="intro-title">Welcome to Your Spotify Wrapped</h1>
      <p className="intro-description">
        Discover your top tracks, genres, and artists of the year in an immersive, personalized experience.
      </p>
    </div>
  );
}

export default IntroPanel;
