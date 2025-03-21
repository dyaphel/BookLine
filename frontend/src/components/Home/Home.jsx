// Home.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // Import Axios for API calls
import NavBar from "../Navbar/Navbar";
import Filter from '../Navbar/Filter/Filter';
import BookCard  from "./BookCards/BookCard";
import './Home.css'; // Import the CSS file for styling

const Home = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ author: '', year: '', genre: '' });
  const [books, setBooks] = useState([]); // State to store books fetched from the API
  const navigate = useNavigate();


  // Function to fetch books from the API
  const fetchBooks = async (filters) => {
    try {
      const response = await axios.get('http://localhost:8000/books/', {      
        params: filters, // Pass filters as query parameters
      });
      console.log(response.data); // Log the response data to inspect it
      setBooks(response.data); // Update the books state with the fetched data
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Fetch books when the component mounts or filters change
  useEffect(() => {
    fetchBooks(filters);
  }, [filters]);




  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setShowFilter(false);
    // Here you can filter the books based on the newFilters
    console.log('Filters applied:', newFilters);
    fetchBooks(newFilters);
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
      <h1 className="BookCatalog-title">Book Catalog</h1>
      <div className="book-list" >
        {books.map((book, index) => (
          
          <BookCard
            key={index}
            cover={book.cover}
            title={book.title}
            author={book.author}
            onClick={() => navigate('/bookinformation')}
          />
          
        ))}
      </div>
      </div>
    </div>
  );
};

export default Home;