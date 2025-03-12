// Home.js
import React, { useState } from "react";
import NavBar from "../Navbar/Navbar";
import Filter from '../Navbar/Filter/Filter';
import BookCard  from "./BookCards/BookCard";
import './Home.css'; // Import the CSS file for styling

const Home = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ author: '', year: '', genre: '' });



  const books = [
    {
      cover: 'https://marketplace.canva.com/EAFPHUaBrFc/1/0/1003w/canva-black-and-white-modern-alone-story-book-cover-QHBKwQnsgzs.jpg',
      title: 'Book Title 1',
      author: 'Author Name 1',
    },
    {
      cover: 'https://marketplace.canva.com/EAFf0E5urqk/1/0/1003w/canva-blue-and-green-surreal-fiction-book-cover-53S3IzrNxvY.jpg', // Placeholder image URL
      title: 'Book Title 2',
      author: 'Author Name 2',
    },
    {
      cover: 'https://static01.nyt.com/images/2022/12/08/books/review/08NotableBookCovers-PROMO/08NotableBookCovers-PROMO-superJumbo.jpg', // Placeholder image URL
      title: 'Book Title 3',
      author: 'Author Name 3',
    },
    {
      cover: 'https://marketplace.canva.com/EAFPHUaBrFc/1/0/1003w/canva-black-and-white-modern-alone-story-book-cover-QHBKwQnsgzs.jpg',
      title: 'Book Title 1',
      author: 'Author Name 1',
    },
    {
      cover: 'https://marketplace.canva.com/EAFf0E5urqk/1/0/1003w/canva-blue-and-green-surreal-fiction-book-cover-53S3IzrNxvY.jpg', // Placeholder image URL
      title: 'Book Title 2',
      author: 'Author Name 2',
    },
    {
      cover: 'https://static01.nyt.com/images/2022/12/08/books/review/08NotableBookCovers-PROMO/08NotableBookCovers-PROMO-superJumbo.jpg', // Placeholder image URL
      title: 'Book Title 3',
      author: 'Author Name 3',
    },
    {
      cover: 'https://marketplace.canva.com/EAFPHUaBrFc/1/0/1003w/canva-black-and-white-modern-alone-story-book-cover-QHBKwQnsgzs.jpg',
      title: 'Book Title 1',
      author: 'Author Name 1',
    },
    {
      cover: 'https://marketplace.canva.com/EAFf0E5urqk/1/0/1003w/canva-blue-and-green-surreal-fiction-book-cover-53S3IzrNxvY.jpg', // Placeholder image URL
      title: 'Book Title 2',
      author: 'Author Name 2',
    },
    {
      cover: 'https://static01.nyt.com/images/2022/12/08/books/review/08NotableBookCovers-PROMO/08NotableBookCovers-PROMO-superJumbo.jpg', // Placeholder image URL
      title: 'Book Title 3',
      author: 'Author Name 3',
    },
  ];


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
      <h1>Book Catalog</h1>
      <div className="book-list">
        {books.map((book, index) => (
          <BookCard
            key={index}
            cover={book.cover}
            title={book.title}
            author={book.author}
          />
        ))}
      </div>
      </div>
    </div>
  );
};

export default Home;