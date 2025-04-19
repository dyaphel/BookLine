import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Title from '../../Utils/Title/BookLinetitle';
import './Navbar.css';
import { getCsrfToken } from '../../Utils/GetToken'; // Import your existing CSRF utility

const NavBar = ({ onFilterClick, onSearch }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        // Use your existing CSRF utility
        const token = await getCsrfToken();
        
        // Check auth status with the token
        const authResponse = await axios.get('http://localhost:8000/users/check-auth/', {
          headers: {
            'X-CSRFToken': token
          },
          withCredentials: true
        });
        
        if (authResponse.data.isAuthenticated) {
          setIsLoggedIn(true);
          setUsername(authResponse.data.username);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleLogout = async () => {
    try {
        setLoading(true);
        
        // Get fresh CSRF token using your utility
        const token = await getCsrfToken();
        
        // Make logout request
        const response = await axios.post(
            'http://localhost:8000/users/logout/',
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': token
                },
                withCredentials: true
            }
        );

        if (response.data.success) {
            setIsLoggedIn(false);
            setUsername("");
            navigate('/login');
        }
    } catch (error) {
        console.error("Detailed logout error:", {
            status: error.response?.status,
            data: error.response?.data,
            config: error.config,
            message: error.message
        });
    } finally {
        setLoading(false);
    }
};

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    value.trim() && onSearch(value);
  };

  if (loading) return <div className="my-navbar">Loading...</div>;

  return (
    <div className="my-navbar">
      <Title />
      
      <div className="my-nav-center">
        <div className="my-search-container">
          <input
            type="text"
            placeholder="Search..."
            className="my-search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button onClick={onFilterClick} className="my-filter">
            <img src="/Filter.png" alt="Filter" className="my-filter-image" />
          </button>
        </div>
      </div>

      <div className="my-nav-right">
        {isLoggedIn ? (
          <>
            <button onClick={() => navigate('/my-books')} className="my-nav-button">
              My Books
            </button>
            <button onClick={() => navigate(`/profile/${username}`)} className="my-nav-button">
              My Profile
            </button>
            <button onClick={handleLogout} className="my-nav-button" disabled={loading}>
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/register')} className="my-nav-button-register">
              Register
            </button>
            <button onClick={() => navigate('/login')} className="my-nav-button">
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;