import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Title from "../../Utils/Title/BookLinetitle";
import { normalizeCoverUrl } from "../../Utils/urlCoverNormalizer";
import './BookInformation.css';
import NavBar from "../Navbar/Navbar";
import Reservation from "../Buttons/reservation/reservation";

const BookInformation = () => {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookInformation = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/books/${isbn}`);
        setBook(response.data);
      } catch (err) {
        console.error("Error fetching book:", err);
        setError("Failed to load book information");
      } finally {
        setLoading(false);
      }
    };

    fetchBookInformation();
  }, [isbn]);

  if (loading) return <div className="loading">Loading book details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div className="not-found">Book not found</div>;

  // Calculate the normalized cover URL
  const getCoverUrl = () => {
    if (!book.cover) return '/default-cover.jpg';
    const normalizedPath = normalizeCoverUrl(book.cover);
    return `http://localhost:8000${normalizedPath}`;
  };

  const coverUrl = getCoverUrl();

  return (
    <>
      
        <NavBar/>
      
      
      <div className="book-details-container">
        {/* Book Cover Card (Left) */}
        <div className="book-cover-container">
          <img 
            src={coverUrl}
            alt={`Cover of ${book.title}`} 
            className="book-cover"
            onError={(e) => {
              e.target.src = '/default-cover.jpg';
            }}
          />
        </div>
       
   
        {/* Book Info Card (Right) */}
        <div className="book-info-card">
          <h1 className="book-title-info">{book.title}</h1>
          <h2 className="book-author-info">by {book.author}</h2>
          
          <div className="book-meta">
            <p><strong>Published:</strong> {new Date(book.published).toLocaleDateString()}</p>
            <p><strong>Genre:</strong> {book.genre || 'N/A'}</p>
            <p><strong>Language:</strong> {book.language || 'N/A'}</p>
            <p><strong>ISBN:</strong> {book.isbn}</p>
          </div>
          
          <div className="book-description">
            <h3>Description</h3>
            <p>{book.description || 'No description available.'}</p>
          </div>
          
          <div className="book-abstract">
            <h3>Abstract</h3>
            <p>{book.abstract || 'No abstract available.'}</p>
          </div>
        </div>
      </div>

      <div className="book-status-container">
        <h3 className="bookstatus">Status:</h3>
        <p className="bookstatusresponse">{book.status}</p>
      </div>

      <div className="bookbutton">
            <Reservation/>
        </div>
    </>
  );
}

export default BookInformation;