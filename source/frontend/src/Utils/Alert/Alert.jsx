import React, { useEffect } from 'react';
import './Alert.css';

const Alert = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;
  
  return (
    <div className={`alert alert-${type}`} role="alert">
      <span>{message}</span>
      <button 
        className="alert-close" 
        onClick={onClose}
        aria-label="Close alert"
      >
        &times;
      </button>
    </div>
  );
};

export default Alert;