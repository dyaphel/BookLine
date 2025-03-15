// Home.js
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../Navbar/Navbar";
import Filter from '../Navbar/Filter/Filter';
import BookCard  from "./BookCards/BookCard";
import './Home.css'; // Import the CSS file for styling

const Home = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ author: '', year: '', genre: '' });
  const navigate = useNavigate();


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
      cover: 'https://marketplace.canva.com/EAFfSnGl7II/2/0/1003w/canva-elegant-dark-woods-fantasy-photo-book-cover-vAt8PH1CmqQ.jpg',
      title: 'Book Title 4',
      author: 'Author Name 4',
    },
    {
      cover: 'https://plus.unsplash.com/premium_photo-1682125773446-259ce64f9dd7?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Ym9vayUyMGNvdmVyfGVufDB8fDB8fHww',
      title: 'Book Title 5',
      author: 'Author Name 5',
    },
    {
      cover: 'https://i.pinimg.com/236x/0c/ee/7e/0cee7e54fda8ac99ec11459448e89c7d.jpg',
      title: 'Book Title 6',
      author: 'Author Name 6',
    },
    {
      cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF2RGkcidnu9RVMoFi3ZSf2B7TTxoMECEi96CHn6J_GFsm5IlzO0E8nx2SMIuOoQY01VE&usqp=CAU',
      title: 'Book Title 7',
      author: 'Author Name 7',
    },
    {
      cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcCXfBBNZRrKQJAVrHnQxdctxNEDu9RgscC35Z9l5sUItqJFpI274Esg7KBEM6J8s076w&usqp=CAU',
      title: 'Book Title 8',
      author: 'Author Name 8',
    },
    {
      cover: 'https://miblart.com/wp-content/uploads/2024/01/main-4.jpg',
      title: 'Book Title 9',
      author: 'Author Name 9',
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