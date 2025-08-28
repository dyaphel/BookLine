import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios for API calls
import NavBar from "../Navbar/Navbar";
import Filter from '../Navbar/Filter/Filter';
import BookCard from "./BookCards/BookCard";
import './Home.css'; // Import the CSS file for styling
import { normalizeCoverUrl } from "../../Utils/urlCoverNormalizer"; // Import the utility function
import Spinner from "../../components/Loading/Spinner";



const Home = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ author: '', year: '', genre: '' });
  const [books, setBooks] = useState([]); // State to store books fetched from the API
  const [loading, setLoading] = useState(false); // Loading state
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();

  // Function to fetch books from the API
  const fetchBooks = async (filters) => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get('http://localhost:8001/books/', {
        params: filters, // Pass filters as query parameters
      });
     
      setBooks(response.data); // Update the books state with the fetched data
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching books:", error);
      // Optionally, set an error state to display a message to the user
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };


  // Fetch books when the component mounts or filters change
  useEffect(() => {
    fetchBooks(filters);
  }, [filters]);

   
  // Handle search input changes
  const handleSearch = (query) => {
    setFilters((prevFilters) => ({ ...prevFilters, q: query }));
    debouncedFetchBooks({ ...filters, q: query });
  };

  // Handle filter button click
  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

  // Handle filter overlay click (close overlay when clicking outside)
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("filter-overlay")) {
      setShowFilter(false);
    }
  };

  // Handle filter apply
  const handleFilterApply = (newFilters) => {
    // Only apply filters that have values
    const appliedFilters = {};
    if (newFilters.author) appliedFilters.author = newFilters.author;
    if (newFilters.year) appliedFilters.year = newFilters.year;
    if (newFilters.genre) appliedFilters.genre = newFilters.genre;

    setFilters(appliedFilters); // Update the filters state
    setShowFilter(false); // Close the filter overlay
    console.log('Filters applied:', appliedFilters);
    fetchBooks(appliedFilters); // Fetch books with the new filters
  };

  return (
    <div>
      {/* Navbar */}
      <NavBar onFilterClick={handleFilterClick} onSearch={handleSearch}/>

      {/* Filter Modal */}
      {showFilter && (
        <div className="filter-overlay" onClick={handleOverlayClick}>
          <Filter onFilterApply={handleFilterApply} />
        </div>
      )}

      {/* Page Content */}
      <div className="page-content">
        <h1 className="BookCatalog-title">Book Catalog</h1>
        {loading || !dataLoaded ? (
          <Spinner />
        ) : books && books.length > 0 ? (
          <div className="book-list">
            {books.map((book, index) => {
              const normalizedCoverUrl = normalizeCoverUrl(book.cover);
              return (
                <BookCard
                  key={index}
                  cover={normalizedCoverUrl} // Fallback image if cover is invalid
                  title={book.title}
                  author={book.author}
                  onClick={() => navigate(`/books/${book.isbn}`)}
                />
              );
            })}
          </div>
        ) : (
          <div className="catalog-no-books">
            <p className="text-center">No books found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;