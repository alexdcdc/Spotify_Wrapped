import './App.css';
import React from 'react';




function Contact() {

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <form className="contact-form" action="/submit" method="POST">
                    <h1>Contact Us</h1>
                    <p>Let us know your thoughts!</p>

                    <div className="form-row">
                        <div className="form-group">
                            <label form="first-name">First Name</label>
                            <input type="text" id="first-name" name="first_name" placeholder="Your first name"
                                   required></input>
                        </div>
                        <div className="form-group">
                            <label form="last-name">Last Name</label>
                            <input type="text" id="last-name" name="last_name" placeholder="Your last name"
                                   required></input>
                        </div>
                    </div>

                    <div className="form-group">
                        <label form="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Your email" required></input>
                    </div>

                    <div className="form-group">
                        <label form="comments">Comments</label>
                        <textarea id="comments" name="comments" placeholder="Your comments" rows="4"
                                  required></textarea>
                    </div>

                    <button type="submit" class="submit-button">Submit</button>
                </form>
            </div>
        </div>

            );
            }

            export default Contact;
