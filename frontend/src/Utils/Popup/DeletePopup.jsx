import React from 'react';
import './DeletePopup.css'; // Import the separate CSS file

const DeletePopup = ({ onClose, onConfirm }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="popup-title">Confirm Deletion</h3>
        <p className="popup-text">
          Are you sure you want to delete your account? This action cannot be undone.
        </p>

        <div className="popup-actions">
          <button className="popup-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="popup-btn delete"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
