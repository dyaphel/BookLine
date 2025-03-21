// BookCard.js
import React from 'react';
import './BookCard.css'; // Import the CSS file for styling

const BookCard = ({ cover, title, author, onClick }) => {
  console.log("Cover URL:", cover); // Log the cover URL
  return (
    <div className="book-card" onClick={onClick}>
      <div className="book-cover-container">
      <img src={`http://localhost:8000${cover}`} alt={title} className="book-cover" />
      </div>
      <div className="book-details">
        <h3 className="book-title">{title}</h3>
        <p className="book-author">{author}</p>
      </div>
    </div>
  );
};

export default BookCard;