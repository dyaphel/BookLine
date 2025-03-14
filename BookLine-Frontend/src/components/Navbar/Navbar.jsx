// NavBar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../../Utils/Title/BookLinetitle';
import './Navbar.css'; // Import the CSS file for styling

const NavBar = ({ onFilterClick }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="my-navbar">

     <Title/>
      {/* Home Button (Top Left) */}

      <div className="my-nav-center">
        <div className="my-search-container">
          {/* Filter Icon */}
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search..."
            className="my-search"
          />
          <button onClick={onFilterClick} className="my-filter">
            <img src="./Filter.png" alt="Filter" className="my-filter-image" />
          </button>
        </div>
      </div>

      {/* Calendar, To-Do, and Logout Buttons (Top Right) */}
      <div className="my-nav-right">
        <button onClick={() => navigate('/register')} className="my-nav-button-register">
          Register
        </button>

        <button onClick={() => navigate('/login')} className="my-nav-button">
          Login
        </button>
      </div>
    </div>
  );
};

export default NavBar;