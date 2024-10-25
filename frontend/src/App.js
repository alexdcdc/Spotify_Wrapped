import React from "react";
import './App.css';
import SpotifyButton from "./SpotifyButton";
import useDarkMode from "./UseDarkMode";

function App() {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <div>
      <button onClick={toggleDarkMode}>
        Switch to {darkMode ? "Light" : "Dark"} Mode
      </button>
      <SpotifyButton />
    </div>
  );
}

export default App;
