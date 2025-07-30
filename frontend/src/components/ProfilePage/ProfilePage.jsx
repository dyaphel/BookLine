import React, { useState, useEffect } from 'react';
import DeleteButton from '../Buttons/Delete/Delete';
import EditButton from '../Buttons/Edit/Edit';
import ResetButton from '../Buttons/ResetPassword/ResetPassword';
import axios from 'axios';
import NavBar from "../Navbar/Navbar";
import Alert from '../../Utils/Alert/Alert';
import './ProfilePage.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users/get_profile', {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Profile data fetched:', response.data);
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!userData) {
    return <div className="error">Failed to load profile data</div>;
  }

  return (
    <div className="profile-container">
      <NavBar />
      
      <div className="profile-content-wrapper">
        {/* Profile Image on the left */}
        <div className="profile-image-section">
          <img 
            src={
              `http://localhost:8000${userData.profile_image}`
             }
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
          <DeleteButton/>
      </div>
    </div>
  );
};

export default ProfilePage;