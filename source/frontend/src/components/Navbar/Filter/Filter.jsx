import React, { useState } from 'react';
import './Filter.css';

const Filter = ({ onFilterApply }) => {
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');

  const handleApply = () => {
    onFilterApply({ author, year, genre });
  };

  return (
    <div className="filter-modal">
      <h3>Filter Books</h3>
      <div className="filter-option">
        <label>Author:</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <div className="filter-option">
        <label>Year:</label>
        <input
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      <div className="filter-option">
        <label>Genre:</label>
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
      </div>
      <button onClick={handleApply} className="apply-button">
        Apply Filters
      </button>
    </div>
  );
};

export default Filter;