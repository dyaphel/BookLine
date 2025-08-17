import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './EditCatalog.css';
import { normalizeCoverUrl } from "../../../Utils/urlCoverNormalizer";
import NavBar from "../../Navbar/Navbar";

const EditCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 // Move fetchBooks outside useEffect so it's accessible everywhere
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8001/books/');
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleEdit = (isbn) => {
    navigate(`/edit-book/${isbn}`);
  };


// PROBLEMA CON LE RESERVATIONS VISTO CHE "ON CASCADE NON FUNZIONA"ù

//   const handleDelete = async (isbn) => {
//     try {
//       await axios.delete(`http://localhost:8001/books/delete/${isbn}/`);
//       setBooks(books.filter(book => book.isbn !== isbn));
//     } catch (error) {
//       console.error("Error deleting book:", error);
//     }
//   };

  const handleChangeImage = async (isbn) => {
    setLoading(true);
    try {
      const formData = new FormData();
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      
      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
          setLoading(false);
          return;
        }
        
        formData.append('cover', file);
        
        try {
          const response = await axios.put(
            `http://localhost:8001/books/changeimage/${isbn}/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              }
            }
          );
          
          console.log('Image changed successfully:', response.data);
          fetchBooks(); // Now this will work
        } catch (error) {
          console.error("Error changing image:", error.response?.data || error.message);
        } finally {
          setLoading(false);
        }
      };
      
      fileInput.click();
    } catch (error) {
      console.error("Error in image change process:", error);
      setLoading(false);
    }
  };


return (
    <div className="catalog-container">
      <NavBar />
      <h1>Book Catalog</h1>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="catalog-books-grid">
          {books.map((book) => (
            <div key={book.isbn} className="catalog-book-card">
              <div className="catalog-book-header">
                <div className="catalog-book-cover">
                  <img src={`http://localhost:8001${normalizeCoverUrl(book.cover)}`} alt={`${book.title} cover`} />
                </div>
                <div className="catalog-book-title-section">
                  <h3>{book.title}</h3>
                  <p className="catalog-author">{book.author}</p>
                  <div className="catalog-text-content">
                    {book.description && (
                      <div className="catalog-description">
                        <h4>Description</h4>
                        <p>{book.description}</p>
                      </div>
                    )}
                    {book.abstract && (
                      <div className="catalog-abstract">
                        <h4>Abstract</h4>
                        <p>{book.abstract}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="catalog-book-details">
                <div className="catalog-detail-row">
                  <span className="catalog-detail-label">Genre:</span>
                  <span>{book.genre}</span>
                </div>
                <div className="catalog-detail-row">
                  <span className="catalog-detail-label">Available:</span>
                  <span>{book.available_copies}</span>
                </div>
                <div className="catalog-detail-row">
                  <span className="catalog-detail-label">ISBN:</span>
                  <span>{book.isbn}</span>
                </div>
                <div className="catalog-detail-row">
                  <span className="catalog-detail-label">Language:</span>
                  <span>{book.language}</span>
                </div>
              </div>
              
              <div className="catalog-book-actions">
                <button className="catalog-edit-btn" onClick={() => handleEdit(book.isbn)}>Edit</button>
                {/* <button className="catalog-delete-btn" onClick={() => handleDelete(book.isbn)}>Delete</button> */}
                <button className="catalog-image-btn" onClick={() => handleChangeImage(book.isbn)}>
                  Change Image
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditCatalog;