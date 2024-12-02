import SpotifyButton from "./SpotifyButton"
import "./Login.css"
import "./Profile.css"
import React from "react";

function Login() {
  return (
    <div className="profile-wrapper">
      <div className="login-container">
        <h1> Vibe Dive </h1>
        <p> The premier app for analyzing your music tastes. </p>
        <SpotifyButton/>
      </div>
    </div>
  );
}

export default Login
