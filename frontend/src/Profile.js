import './App.css';
import React from 'react';
import { isAuthenticated, logout, deleteAcct } from "./lib/auth"


function Profile() {

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <h1>Profile</h1>
                <div className="profile-row">
                    <div className="profile-image">alexdcdc</div>
                    <div className="profile-details">
                        <p><strong>Name:</strong> Alex Chen</p>
                        <p><strong>Email:</strong> alexdcdc@gmail.com</p>
                        <p><strong>Spotify ID:</strong> abcdefghijk</p>
                        <p><strong>Account created:</strong> 01/01/1970</p>
                    </div>
                </div>
                <button className="delete-button" onClick={ () => {deleteAcct()} }>Delete account</button>
            </div>
        </div>


    );
}

export default Profile;
