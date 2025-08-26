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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBookData, setNewBookData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    abstract: '',
    published: '',
    genre: '',
    language: '',
    available_copies: 1,
    cover: null,
    coverPreview: null
  });
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
      published: book.published,
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

  const handleDeleteBook = async (isbn) => {
    
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8001/books/delete/${isbn}/`);
      setBooks(prevBooks => prevBooks.filter(book => book.isbn !== isbn));
    } catch (error) {
      console.error("Error deleting book:", error.response?.data || error.message);
      alert(`Error deleting book: ${error.response?.data?.error || error.message}`);
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

  const handleCreateNewBook = () => {
    setShowCreateForm(true);
  };

  const handleNewBookChange = (e) => {
    const { name, value } = e.target;
    setNewBookData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewBookData(prev => ({
          ...prev,
          cover: file,
          coverPreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Aggiungi tutti i campi al formData
      Object.keys(newBookData).forEach(key => {
        if (key !== 'coverPreview' && newBookData[key] !== null) {
          formData.append(key, newBookData[key]);
        }
      });

      await axios.post(
        'http://localhost:8001/books/create/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      setShowCreateForm(false);
      setNewBookData({
        title: '',
        author: '',
        isbn: '',
        description: '',
        abstract: '',
        genre: '',
        language: '',
        published: '',
        available_copies: 1,
        cover: null,
        coverPreview: null
      });
      fetchBooks();
    } catch (error) {
      console.error("Error creating book:", error.response?.data || error.message);
      alert(`Error creating book: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setNewBookData({
      title: '',
      author: '',
      isbn: '',
      description: '',
      abstract: '',
      genre: '',
      language: '',
      published: '',
      available_copies: 1,
      cover: null,
      coverPreview: null
    });
  };

  return (
    <div className="catalog-container">
      <NavBar />
     
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="edit-catalog-header">
            <h1 className="EditCatalog-title">Edit Books</h1>
            <button 
              className="create-book-btn"
              onClick={handleCreateNewBook}
              title="Create new book"
            >
              Add new Book
            </button>
          </div>

         {showCreateForm && (
  <div className="create-book-overlay">
    <div className="create-book-popup">
      <div className="popup-header">
        <h3>Create new book</h3>
        <button className="close-popup" onClick={handleCancelCreate}>
          <span className="close-popupX">×</span>
        </button>
      </div>
      
      <form onSubmit={handleCreateSubmit} className="popup-form">
        <div className="popup-content-grid">
          {/* Colonna sinistra - Immagine e campi principali */}
          <div className="left-column">
            <div className="image-upload-container">
              <div className="image-preview-box">
                <img 
                  src={newBookData.coverPreview || "/placeholder-cover.jpg"} 
                  alt="Book cover preview" 
                  className="cover-preview"
                />
              </div>
              <input
                type="file"
                id="cover-upload"
                accept="image/*"
                onChange={handleCoverUpload}
                className="file-input-hidden"
              />
              <label htmlFor="cover-upload" className="upload-button">
                Upload Cover
              </label>
            </div>

            <div className="main-fields-grid">
              <div className="form-group">
                <label>TITLE</label>
                <input
                  type="text"
                  name="title"
                  value={newBookData.title}
                  onChange={handleNewBookChange}
                  required
                  className="popup-input"
                />
              </div>

              <div className="form-group">
                <label>AUTHOR</label>
                <input
                  type="text"
                  name="author"
                  value={newBookData.author}
                  onChange={handleNewBookChange}
                  required
                  className="popup-input"
                />
              </div>

              <div className="form-group">
                <label>ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  value={newBookData.isbn}
                  onChange={handleNewBookChange}
                  required
                  className="popup-input"
                />
              </div>
            </div>
          </div>

          {/* Colonna destra - Campi aggiuntivi */}
          <div className="right-column">
            <div className="details-grid">
              <div className="form-group">
                <label>GENRE</label>
                <input
                  type="text"
                  name="genre"
                  value={newBookData.genre}
                  onChange={handleNewBookChange}
                  className="popup-input"
                />
              </div>

              <div className="form-group">
                <label>LANGUAGE</label>
                <input
                  type="text"
                  name="language"
                  value={newBookData.language}
                  onChange={handleNewBookChange}
                  className="popup-input"
                />
              </div>

              <div className="form-group">
                <label>COPIES</label>
                <input
                  type="number"
                  name="available_copies"
                  value={newBookData.available_copies}
                  onChange={handleNewBookChange}
                  min="1"
                  className="popup-input"
                />
              </div>
            </div>

            <div className="form-group">
                <label>Published</label>
                <input
                  type="text"
                  name="published"
                  value={newBookData.published}
                  onChange={handleNewBookChange}
                  required
                  className="popup-input"
                />
              </div>

            <div className="form-group">
              <label>DESCRIPTION</label>
              <textarea
                name="description"
                value={newBookData.description}
                onChange={handleNewBookChange}
                rows="5"
                className="popup-textarea"
                placeholder="Enter book description..."
              />
            </div>

            <div className="form-group">
              <label>ABSTRACT</label>
              <textarea
                name="abstract"
                value={newBookData.abstract}
                onChange={handleNewBookChange}
                rows="3"
                className="popup-textarea"
                placeholder="Enter book abstract..."
              />
            </div>
          </div>
        </div>

        <div className="popup-actions">
          <button type="submit" className="popup-submit-btn">
            Create
          </button>
          <button type="button" className="popup-cancel-btn" onClick={handleCancelCreate}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

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
                      <button className="catalog-cancel-btn" onClick={() => handleDeleteBook(book.isbn)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EditCatalog;