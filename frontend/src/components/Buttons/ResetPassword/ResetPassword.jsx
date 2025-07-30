import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResetPassword.css'; // Import the CSS file for styling
import { getCsrfToken } from '../../../Utils/GetToken';

const ResetButton = () => {
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
    <div className="reset-container">
      <button className= "button-reset">
       Reset Password
      </button>
    </div>
  );
};

export default ResetButton;
