import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GetInQueue.css';
import { getCsrfToken } from '../../../Utils/GetToken';

const GetInQueue = ({ isbn }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);
  const successRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const token = await getCsrfToken();
        const authResponse = await axios.get('http://localhost:8003/users/check-auth/', {
          headers: {
            'X-CSRFToken': token
          },
          withCredentials: true
        });

        setIsLoggedIn(authResponse.data.isAuthenticated);
      } catch (error) {
        console.error("Authentication check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleReserveClick = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const token = await getCsrfToken();
      const accessToken = localStorage.getItem('access_token');

      const userResponse = await axios.get('http://localhost:8003/users/get_profile/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-CSRFToken': token,
        },
        withCredentials: true
      });

      if (!userResponse.data?.id) {
        throw new Error('Could not retrieve user ID from profile');
      }

      const reservationResponse = await axios.post(
        'http://localhost:8002/reservations/create/',
        {
          user: userResponse.data.id,
          book: isbn
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-CSRFToken': token,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      if (reservationResponse.status === 201) {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Reservation Error:", error);
      if (error.response?.data) {
        if (error.response.data.user) {
          setError(`User error: ${error.response.data.user.join(' ')}`);
        } else if (error.response.data.book) {
          setError(`Book error: ${error.response.data.book.join(' ')}`);
        } else {
          setError(error.response.data.detail || 'Invalid reservation request');
        }
      } else {
        setError(error.message || 'Failed to make reservation');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      window.location.reload();
    }, 500); // Match this with fadeOut animation duration
  };
  // Auto-close after 5 seconds and reload
  useEffect(() => {
    let timer;
    if (success || error) {
      timer = setTimeout(() => {
        if (success) setSuccess(false);
        if (error) setError(null);
        handlePopupClose();
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [success, error]);

  // Close when clicking outside and reload
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (successRef.current && !successRef.current.contains(event.target)) {
        setSuccess(false);
        handlePopupClose();
      }
      if (errorRef.current && !errorRef.current.contains(event.target)) {
        setError(null);
        handlePopupClose();
      }
    };

    if (success || error) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [success, error]);

  return (
    <div className="reservation-container">
      {/* Success Modal */}
      {success && (
      <div className={`reservation-success ${isClosing ? 'fade-out' : ''}`}>
        <div className="success-message" ref={successRef}>
          <p className='Bookreserved-success'>You got in the queue!</p>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
        </div>
      </div>
    )}

    {error && (
      <div className={`reservation-error ${isClosing ? 'fade-out' : ''}`}>
        <div className="error-message" ref={errorRef}>
          <p className='Bookreserved-error'>{error}</p>
          <button 
            className="close-error" 
            onClick={() => {
              setIsClosing(true);
              setTimeout(() => {
                setError(null);
                window.location.reload();
              }, 500);
            }}
            aria-label="Close error message"
          >
            ×
          </button>
        </div>
      </div>
    )}

      {/* Reserve Button */}
      <button 
        className={`button-reserve ${!isLoggedIn ? 'disabled' : ''}`}
        onClick={handleReserveClick}
        disabled={loading || success}
      >
        {loading ? 'Processing...' : isLoggedIn ? 'Get in queue' : 'Login to get in queue'}
      </button>
    </div>
  );
};

export default GetInQueue;