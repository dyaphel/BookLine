import React from 'react';
import './Edit.css'; // Import the CSS file for styling

const EditButton = ({onClick}) => {


  return (
    <div className="edit-container">
      <button className= "button-edit" onClick={onClick}>
       Edit Profile
      </button>
    </div>
  );
};

export default EditButton;
