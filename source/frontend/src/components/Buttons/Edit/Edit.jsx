import React from 'react';
import './Edit.css'; 

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
