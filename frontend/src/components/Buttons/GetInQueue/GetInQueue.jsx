
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GetInQueue.css'; // Import the CSS file for styling
import { getCsrfToken } from '../../../Utils/GetToken';

const GetInQueue = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        // Get CSRF token
        const token = await getCsrfToken();

        // Check authentication status
        const authResponse = await axios.get('http://localhost:8000/users/check-auth/', {
          headers: {
            'X-CSRFToken': token
          },
          withCredentials: true
        });

        if (authResponse.data.isAuthenticated) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Authentication check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleReserveClick = () => {
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      navigate('/login');
    } else {
      // Handle reservation logic here
      console.log('Book reserved!');
      // You would typically make an API call to create the reservation
    }
  };

  return (
    <div className="reservation-container">
      <button 
        className={`button-reserve ${!isLoggedIn ? 'disabled' : ''}`}
        onClick={handleReserveClick}
        disabled={loading}
      >
        {loading ? 'Loading...' : isLoggedIn ? 'Get in Queue' : 'Login to queue'}
      </button>
    </div>
  );
};

export default GetInQueue;
