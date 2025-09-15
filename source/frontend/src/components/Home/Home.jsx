import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import NavBar from "../Navbar/Navbar";
import Filter from '../Navbar/Filter/Filter';
import BookCard from "./BookCards/BookCard";
import './Home.css'; 
import { normalizeCoverUrl } from "../../Utils/urlCoverNormalizer"; 
import Spinner from "../../components/Loading/Spinner";



const Home = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ author: '', year: '', genre: '' });
  const [books, setBooks] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();

  // Function to fetch books from the API
  const fetchBooks = async (filters) => {
    setLoading(true); 
    try {
      const response = await axios.get('http://localhost:8001/books/', {
        params: filters, // Pass filters as query parameters
      });
     
      setBooks(response.data); 
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching books:", error);
      
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchBooks(filters);
  }, [filters]);

   

  const handleSearch = (query) => {
    setFilters((prevFilters) => ({ ...prevFilters, q: query }));
    debouncedFetchBooks({ ...filters, q: query });
  };


  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

 
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("filter-overlay")) {
      setShowFilter(false);
    }
  };


  const handleFilterApply = (newFilters) => {
  
    const appliedFilters = {};
    if (newFilters.author) appliedFilters.author = newFilters.author;
    if (newFilters.year) appliedFilters.year = newFilters.year;
    if (newFilters.genre) appliedFilters.genre = newFilters.genre;

    setFilters(appliedFilters); 
    setShowFilter(false); 
    console.log('Filters applied:', appliedFilters);
    fetchBooks(appliedFilters); 
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
                  cover={normalizedCoverUrl} 
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