import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Title from '../../Utils/Title/BookLinetitle';
import './Navbar.css';
import { getCsrfToken } from '../../Utils/GetToken';

const NavBar = ({ onFilterClick, onSearch }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ 
    username: "", 
    id: null,
    isStaff: false  // Changed to match backend response
  });
  const [loading, setLoading] = useState(false);

  const hideOnPaths = ['/users/', '/all-reservations', '/books', '/my-books'];
  const shouldHide = hideOnPaths.some(path => location.pathname.startsWith(path));

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const token = await getCsrfToken();
        
        const authResponse = await axios.get('http://localhost:8003/users/check-auth/', {
          headers: {
            'X-CSRFToken': token
          },
          withCredentials: true
        });
        
        if (authResponse.data.isAuthenticated) {
          setIsLoggedIn(true);
          setUserData({
            username: authResponse.data.username,
            id: authResponse.data.id,
            isStaff: authResponse.data.is_staff || false  // Using is_staff from backend
          });
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
        const token = await getCsrfToken();
        const response = await axios.post(
            'http://localhost:8003/users/logout/',
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
            setUserData({ username: "", id: null, isStaff: false });
            navigate('/home');
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
    onSearch(value.trim());
  };

  return (
    <div className="my-navbar">
      <Title />
      
      {!shouldHide &&  (
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
      )}

<div className="my-nav-right">
  {isLoggedIn ? (
    <>
      <button onClick={() => navigate('/my-books')} className="my-nav-button">
        My Books
      </button>
      
      <button onClick={() => navigate(`/users/${userData.username}`)} className="my-nav-button">
        Profile
      </button>
        {/* <span className="divider">|</span> */}
      
      {/* Solo staff */}
      {userData.isStaff && (
        <>
          <button onClick={() => navigate('/catalog')} className="my-nav-button">
            Catalog
          </button>
          <button onClick={() => navigate('/all-reservations')} className="my-nav-button">
            Dashboard
          </button>
          <button onClick={() => navigate('/analytics')} className="my-nav-button">
            Analytics
          </button>
        </>
      )}

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