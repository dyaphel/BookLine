import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResetPassword.css'; // Import the CSS file for styling
import { getCsrfToken } from '../../../Utils/GetToken';
import PasswordResetPopup from '../../../Utils/Popup/ResetPassword/ResetPasswordPopUp';
const ResetButton = () => {
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  

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
    <>
    <div className="reset-container">
      <button className= "button-reset"
      onClick={() => setShowPopup(true)}>
       Reset Password
      </button>
    </div>
          {/* Conditionally render the popup */}
      {showPopup && (
        <PasswordResetPopup 
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
};

export default ResetButton;
