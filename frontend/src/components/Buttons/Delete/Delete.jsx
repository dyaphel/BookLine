import React, { useState } from 'react';
import DeletePopup from '../../../Utils/Popup/Delete/DeletePopup'; // Import your popup component
import './Delete.css';

const DeleteButton = () => {
  const [showPopup, setShowPopup] = useState(false);
  
  return (
    <>
      <div className="delete-container">
        <button 
          className="button-delete" 
          onClick={() => setShowPopup(true)}
        >
          Delete Profile
        </button>
      </div>

      {/* Conditionally render the popup */}
      {showPopup && (
        <DeletePopup 
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
};

export default DeleteButton;