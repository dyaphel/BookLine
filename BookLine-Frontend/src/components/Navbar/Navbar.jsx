// NavBar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css'; // Import the CSS file for styling

const NavBar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="navbar">
      <h3 className="nav-title">BOOKLINE</h3>
      {/* Home Button (Top Left) */}
      <div className="nav-left">
      
      </div>

      <div className="nav-center">
        <input
          type="text"
          placeholder="Search..."
          className="search-bar"
        />
      </div>

      {/* Calendar, To-Do, and Logout Buttons (Top Right) */}
      <div className="nav-right">
      <button onClick={() => navigate('/register')} className="nav-button-register">
          Register
        </button>

        <button onClick={() => navigate('/login')} className="nav-button">
          Login
        </button>
      </div>
    </div>
  );
};

export default NavBar;