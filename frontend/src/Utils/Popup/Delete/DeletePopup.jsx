import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DeletePopup.css';
import { getCsrfToken } from '../../GetToken';

const DeletePopup = ({ onClose }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const token = await getCsrfToken();
        setCsrfToken(token);
      } catch (err) {
        console.error('Error fetching CSRF token:', err);
      }
    };
    fetchCsrf();
  }, []);

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError('');

    try {
      await axios.delete('http://localhost:8000/users/delete_user/', {
        headers: {
          'X-CSRFToken': csrfToken,
          'Authorization': `Bearer ${localStorage.getItem('token')}`  // Add JWT token
        },
        withCredentials: true  // Important for session authentication
      });
      
      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 
              err.response?.data?.detail || 
              'Deletion failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="popup-title">Confirm Deletion</h3>
        <p className="popup-text">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>

        {error && <p className="error-message">{error}</p>}

        <div className="popup-actions">
          <button 
            className="popup-btn cancel" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="popup-btn delete"
            onClick={handleDeleteAccount}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;