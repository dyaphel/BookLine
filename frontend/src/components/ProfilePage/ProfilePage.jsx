import React, { useState, useEffect, useRef } from 'react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    username: '',
    profile_image: null
  });
  const [previewImage, setPreviewImage] = useState('');
  const fileInputRef = useRef(null);

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
    if (!csrfToken) return;

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8003/users/get_profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true
        });
        setUserData(response.data);
        setEditedData({
          username: response.data.username,
          profile_image: null
        });
        setPreviewImage(`http://localhost:8003${response.data.profile_image}`); // da controllare il percorso dell'immagine
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [csrfToken]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData({
      username: userData.username,
      profile_image: null
    });
    setPreviewImage(`http://localhost:8003/${userData.profile_image}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedData(prev => ({
        ...prev,
        profile_image: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('username', editedData.username);
      if (editedData.profile_image) {
        formData.append('profile_image', editedData.profile_image);
      }

      const response = await axios.put(
        'http://localhost:8003/users/update_profile/',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true
        }
      );

      // Update user data with the response
    setUserData(prev => ({
      ...prev,
      username: response.data.data.username,
      profile_image: response.data.data.profile_image
    }));

      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!userData) return <div className="error">No profile data available</div>;

  return (
    <div className="profile-container">
      <NavBar />

      <div className="profile-content-wrapper">
        {/* Profile Image on the left */}
        <div className="profile-image-section">
          {isEditing ? (
            <>
              <div className="profile-image-edit-container">
                <img
                  src={previewImage}
                  className="profile-avatar"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/jpeg, image/png, image/jpg"
                  style={{ display: 'none' }}
                />
                <button
                  className="change-image-btn"
                  onClick={() => fileInputRef.current.click()}
                >
                  Change Image
                </button>
              </div>
              <input
                type="text"
                name="username"
                value={editedData.username}
                onChange={handleInputChange}
                className="profile-username-input"
              />
            </>
          ) : (
            <>
              <img
                src={`http://localhost:8003/${userData.profile_image}`}
                className="profile-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                }}
              />
              <h2 className="profile-username">{userData.username}</h2>
            </>
          )}
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
        
        {isEditing ? (
          <div className="profile-savechange-container">
          <>
            <button 
              className="save-btn"
              onClick={handleSaveChanges}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              className="cancel-btn"
              onClick={handleCancelEdit}
              disabled={isLoading}
            >
              Cancel
            </button>
         
          </>
         </div>
        ) : (
          <>
            <EditButton onClick={handleEditClick} />
            <ResetButton />
            <DeleteButton />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;