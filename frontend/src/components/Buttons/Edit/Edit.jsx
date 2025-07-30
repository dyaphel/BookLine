import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Edit.css'; // Import the CSS file for styling
import { getCsrfToken } from '../../../Utils/GetToken';

const EditButton = () => {
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const token = await getCsrfToken();

      } catch (error) {
        console.error("Authentication check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);


  return (
    <div className="edit-container">
      <button className= "button-edit">
       Edit Profile
      </button>
    </div>
  );
};

export default EditButton;
