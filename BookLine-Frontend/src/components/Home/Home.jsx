// Home.js
import React, { useState } from "react";
import NavBar from "../Navbar/Navbar";
import Filter from '../Navbar/Filter/Filter';
import './Home.css'; // Import the CSS file for styling

const Home = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ author: '', year: '', genre: '' });

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setShowFilter(false);
    // Here you can filter the books based on the newFilters
    console.log('Filters applied:', newFilters);
  };

  return (
    <div>
      {/* Navbar */}
      <NavBar onFilterClick={handleFilterClick} />

      {/* Filter Modal */}
      {showFilter && (
        <div className="filter-overlay">
          <Filter onFilterApply={handleFilterApply} />
        </div>
      )}

      {/* Page Content */}
      <div className="page-content">
        <h1>Welcome to the Home</h1>
        <p>This is your page content.</p>
      </div>
    </div>
  );
};

export default Home;