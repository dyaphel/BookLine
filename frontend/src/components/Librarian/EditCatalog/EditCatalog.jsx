import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './EditCatalog.css';
import { normalizeCoverUrl } from "../../../Utils/urlCoverNormalizer";
import NavBar from "../../Navbar/Navbar";

const EditCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const navigate = useNavigate();

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

  const handleEdit = (book) => {
    setEditingBook(book.isbn);
    setEditFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      abstract: book.abstract,
      genre: book.genre,
      language: book.language,
      available_copies: book.available_copies
    });
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async (isbn) => {
    setLoading(true);
    try {
      await axios.patch(
        `http://localhost:8001/books/edit/${isbn}/`,
        editFormData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      fetchBooks();
      setEditingBook(null);
    } catch (error) {
      console.error("Error updating book:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

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
          fetchBooks();
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
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="catalog-books-grid">
          {books.map((book) => (
            <div key={book.isbn} className="catalog-book-card">

                
                <div className="catalog-book-content">
                  {/* Title and Author */}
                  {editingBook === book.isbn ? (
                    <div className="title-author-row">
                      <div className="edit-field">
                        <label className="edit-label">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={editFormData.title || ''}
                          onChange={handleEditChange}
                          className="edit-input"
                        />
                      </div>
                      <div className="edit-field">
                        <label className="edit-label">Author</label>
                        <input
                          type="text"
                          name="author"
                          value={editFormData.author || ''}
                          onChange={handleEditChange}
                          className="edit-input"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="title-author-center">
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">{book.author}</p>
                    </div>
                  )}
                <div className="catalog-book-header">
                  <div className="catalog-book-cover">
                    <img src={`http://localhost:8001${normalizeCoverUrl(book.cover)}`} alt={`${book.title} cover`} />
                </div>
                  
                  {/* Description and Abstract */}
                  <div className="description-abstract-row">
                    {editingBook === book.isbn ? (
                      <>
                        <div className="edit-field">
                          <label className="edit-label">Description</label>
                          <textarea
                            name="description"
                            value={editFormData.description || ''}
                            onChange={handleEditChange}
                            className="edit-textarea"
                          />
                        </div>
                        <div className="edit-field">
                          <label className="edit-label">Abstract</label>
                          <textarea
                            name="abstract"
                            value={editFormData.abstract || ''}
                            onChange={handleEditChange}
                            className="edit-textarea"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {book.description && (
                          <div className="view-field">
                            <h4 className="view-label">Description</h4>
                            <p>{book.description}</p>
                          </div>
                        )}
                        {book.abstract && (
                          <div className="view-field">
                            <h4 className="view-label">Abstract</h4>
                            <p>{book.abstract}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Book Details */}
              <div className="book-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Genre:</span>
                  {editingBook === book.isbn ? (
                    <input
                      type="text"
                      name="genre"
                      value={editFormData.genre || ''}
                      onChange={handleEditChange}
                      className="edit-input detail-input"
                    />
                  ) : (
                    <span className="detail-value">{book.genre}</span>
                  )}
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Available:</span>
                  {editingBook === book.isbn ? (
                    <input
                      type="number"
                      name="available_copies"
                      value={editFormData.available_copies || ''}
                      onChange={handleEditChange}
                      className="edit-input detail-input"
                      min="0"
                    />
                  ) : (
                    <span className="detail-value">{book.available_copies}</span>
                  )}
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">ISBN:</span>
                  <span className="detail-value">{book.isbn}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Language:</span>
                  {editingBook === book.isbn ? (
                    <input
                      type="text"
                      name="language"
                      value={editFormData.language || ''}
                      onChange={handleEditChange}
                      className="edit-input detail-input"
                    />
                  ) : (
                    <span className="detail-value">{book.language}</span>
                  )}
                </div>
              </div>
              
              <div className="catalog-book-actions">
                {editingBook === book.isbn ? (
                  <>
                    <button className="catalog-save-btn" onClick={() => handleSaveEdit(book.isbn)}>
                      Save
                    </button>
                    <button className="catalog-cancel-btn" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="catalog-edit-btn" onClick={() => handleEdit(book)}>
                      Edit
                    </button>
                    <button className="catalog-image-btn" onClick={() => handleChangeImage(book.isbn)}>
                      Change Image
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditCatalog;