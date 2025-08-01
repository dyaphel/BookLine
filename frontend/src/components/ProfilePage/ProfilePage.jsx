import React, { useState, useEffect } from 'react';
import DeleteButton from '../Buttons/Delete/Delete';
import EditButton from '../Buttons/Edit/Edit';
import ResetButton from '../Buttons/ResetPassword/ResetPassword';
import axios from 'axios';
import NavBar from "../Navbar/Navbar";
import { getCsrfToken } from '../../Utils/GetToken';
import './ProfilePage.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');


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

 
  useEffect(() => {
    if (!csrfToken) return; // aspetta di avere il token

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users/get_profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true
        });
        console.log('Profile data fetched:', response.data);
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [csrfToken]);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!userData) return <div className="error">No profile data available</div>;

  return (
    <div className="profile-container">
      <NavBar />

      <div className="profile-content-wrapper">
        {/* Profile Image on the left */}
        <div className="profile-image-section">
          <img
            src={`http://localhost:8000${userData.profile_image}`}
            className="profile-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-profile.png';
            }}
          />
          <h2 className="profile-username">{userData.username}</h2>
        </div>

        {/* Profile Info Card on the right */}
        <div className="profile-info-card">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">First Name:</span>
              <span className="info-value">{userData.first_name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Name:</span>
              <span className="info-value">{userData.last_name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{userData.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value">{userData.role}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-actions-container">
        <EditButton />
        <ResetButton />
        <DeleteButton />
      </div>
    </div>
  );
};

export default ProfilePage;
