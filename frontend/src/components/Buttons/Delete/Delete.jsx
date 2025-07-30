import React, { useState } from 'react';
import DeletePopup from '../../../Utils/Popup/DeletePopup'; // Import your popup component
import './Delete.css';

const DeleteButton = ({ onDelete }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleConfirmDelete = () => {
    onDelete(); // Execute the deletion function passed from parent
    setShowPopup(false); // Close the popup
  };

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
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default DeleteButton;