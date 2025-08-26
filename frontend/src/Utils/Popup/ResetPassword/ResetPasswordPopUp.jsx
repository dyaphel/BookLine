import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResetPasswordPopup.css';
import { getCsrfToken } from '../../GetToken';

const PasswordResetPopup = ({ onClose }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const token = await getCsrfToken();
        setCsrfToken(token);
      } catch (err) {
        console.error('Error fetching CSRF token:', err);
        setError('Connection Error: Unable to fetch CSRF token');
      }
    };
    fetchCsrf();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validatePassword = () => {
    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (passwords.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (passwords.oldPassword === passwords.newPassword) {
      setError('New password must be different from the old password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:8003/users/change_password/', 
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword
        },
        {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        setSuccess('Password changed successfully'); 
      } else {
        setError(response.data.message || 'Errore changing password');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error || 
                      'Error on server connection';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="popup-overlay-password" onClick={onClose}>
      <div className="popup-box-password" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h3 className="popup-title-password">Password Change</h3>

          {error && (
            <div className="error-message">
              <i className="icon-warning"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              <i className="icon-check"></i>
              {success}
            </div>
          )}

          <div className="popup-actions-password">
            <div className="input-group">
              <label htmlFor="oldPassword" className="popup-text-password">
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                placeholder="Insert  current password"
                value={passwords.oldPassword}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="newPassword" className="popup-text-password">
                New password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="Insert the new password (min. 8 characters)"
                value={passwords.newPassword}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword" className="popup-text-password">
                Confirm new password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Conferma la nuova password"
                value={passwords.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="popup-buttons-password">
            <button 
              type="button"
              className="popup-btn-password cancel" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="popup-btn-password confirm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Resetting...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetPopup;