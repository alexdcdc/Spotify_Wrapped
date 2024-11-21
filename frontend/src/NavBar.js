import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { isAuthenticated, logout } from "./lib/auth"
import SpotifyButton from "./SpotifyButton";


function NavBar() {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    const handleNavigation = (path) => {
        navigate(path);
    };

    if (isAuthenticated()) {

        return (
            <nav className={`navbar navbar-expand-lg ${isDark ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
                <a className="navbar-brand ps-3 custom-font" href="/dashboard"
                   onClick={() => handleNavigation('/dashboard')}>Vibe Dive</a>
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle pe-3"
                            href="#"
                            id="navbarDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            More
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li>
                                <a
                                    className="dropdown-item"
                                    onClick={() => toggleTheme(!isDark)}
                                >
                                    Toggle Dark Mode
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/profile"
                                   onClick={() => handleNavigation('/profile')}>
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/contact"
                                   onClick={() => handleNavigation('/contact')}>
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item"
                                   onClick={ () => {logout()} }>
                                    Log Out
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        );
    }
    else {
        return (
            <nav className={`navbar navbar-expand-lg ${isDark ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}>
                <a className="navbar-brand ps-3 custom-font" href="/dashboard"
                   onClick={() => handleNavigation('/dashboard')}>Vibe Dive</a>

                <ul className="navbar-nav ms-auto pe-3">
                    <SpotifyButton/>
                </ul>
            </nav>
    );
    }
    }

    export default NavBar;
