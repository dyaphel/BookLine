import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const {username} = useParams();
  const [userData, setUserData] = useState({
    email: '',
    username: '',
    profile_image: '',
    first_name: '',
    last_name: '',
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/users/get_profile`, {
        withCredentials: true,  // Correct property name (camelCase)
        headers: {
             'Content-Type': 'application/json',
        }
      });
      setUserData(response.data);
      setEditData({
        username: response.data.username,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email
      });
      setPreviewImage(response.data.profile_image);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch user profile');
      setIsLoading(false);
    }
  };
  fetchUserProfile();
    }, [username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('username', editData.username);
      formData.append('first_name', editData.first_name);
      formData.append('last_name', editData.last_name);
      formData.append('email', editData.email);
      if (profileImage) {
        formData.append('profile_image', profileImage);
      }

      const response = await axios.patch(
        'http://localhost:8000/users/get_profile/',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setUserData(response.data);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/users/change_password/',
        {
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );

      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setSuccessMessage('Password changed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await axios.delete('http://localhost:8000/users/delete_account/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        // Redirect to login or home page after deletion
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete account');
      }
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      
      {error && <div className="alert error">{error}</div>}
      {successMessage && <div className="alert success">{successMessage}</div>}

      <div className="profile-section">
        <div className="profile-image-container">
          <img 
            src={previewImage || '/default-profile.png'} 
            alt="Profile" 
            className="profile-image"
          />
          {isEditing && (
            <div className="image-upload">
              <label htmlFor="profile-image-upload" className="upload-btn">
                Change Photo
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="profile-info">
            <div className="info-item">
              <span className="label">Username:</span>
              <span className="value">{userData.username}</span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{userData.email}</span>
            </div>
            <div className="info-item">
              <span className="label">First Name:</span>
              <span className="value">{userData.first_name}</span>
            </div>
            <div className="info-item">
              <span className="label">Last Name:</span>
              <span className="value">{userData.last_name}</span>
            </div>
            <div className="info-item">
              <span className="label">Role:</span>
              <span className="value">{userData.role}</span>
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              className="edit-btn"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={editData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                required
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={editData.first_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={editData.last_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="password-section">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="password-form">
          <div className="form-group">
            <label htmlFor="current_password">Current Password</label>
            <input
              type="password"
              id="current_password"
              name="current_password"
              value={passwordData.current_password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new_password">New Password</label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              value={passwordData.new_password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm_password">Confirm New Password</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={passwordData.confirm_password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit" className="change-password-btn">
            Change Password
          </button>
        </form>
      </div>

      <div className="danger-zone">
        <h2>Danger Zone</h2>
        <p>Be careful with these actions as they cannot be undone.</p>
        <button 
          onClick={handleDeleteAccount}
          className="delete-account-btn"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;