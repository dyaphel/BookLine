
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Delete.css'; // Import the CSS file for styling
import { getCsrfToken } from '../../../Utils/GetToken';

const DeleteButton = () => {
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
    <div className="delete-container">
      <button className= "button-delete">
       DELETE
      </button>
    </div>
  );
};

export default DeleteButton;
