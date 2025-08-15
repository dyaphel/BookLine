import React, { useState, useEffect } from 'react';
import BookCard from '../Home/BookCards/BookCard';
import './MyBooks.css';
import { getCsrfToken } from '../../Utils/GetToken';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import { normalizeCoverUrl } from '../../Utils/urlCoverNormalizer';
import { useNavigate } from "react-router-dom";

const MyBooks = ({ userId }) => {
  const [reservations, setReservations] = useState([]);
  const [booksData, setBooksData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        const token = await getCsrfToken();
        setCsrfToken(token);
      } catch (err) {
        console.error('Error fetching CSRF token:', err);
        setError('Connection Error: Unable to fetch CSRF token');
      }
    };
    fetchCsrf();
  }, []);

  // Fetch only active (non-cancelled) reservations
  useEffect(() => {
    if (!userId || !csrfToken) return;
    
    const fetchUserReservations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `http://localhost:8002/reservations/user/${userId}/`,
          {
            params: { cancelled: false }, // Only fetch non-cancelled reservations
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
            },
            withCredentials: true
          }
        );
        console.log({response})
        setReservations(response.data.filter(res=> !res.cancelled));
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError(err.response?.data?.message || 'Failed to load reservation data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserReservations();
  }, [userId, csrfToken]);

  // Fetch book details for reservations
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!reservations.length || !csrfToken) return;
      
      try {
        const bookPromises = reservations.map(reservation => 
          axios.get(`http://localhost:8001/books/${reservation.book}/`, {
            headers: { 'X-CSRFToken': csrfToken },
            withCredentials: true,
            validateStatus: status => status < 500
          })
          .then(response => ({
            success: response.status === 200,
            data: response.data,
            isbn: reservation.book,
            error: response.status !== 200 ? `Server responded with ${response.status}` : null
          }))
          .catch(error => ({
            success: false,
            isbn: reservation.book,
            error: error.message
          }))
        );

        const results = await Promise.all(bookPromises);
        const booksMap = {};
        const errors = [];

        results.forEach(result => {
          if (result.success) {
            booksMap[result.isbn] = result.data;
          } else {
            errors.push(`Book ${result.isbn}: ${result.error}`);
          }
        });

        setBooksData(booksMap);
        if (errors.length) {
          setError(`Couldn't load details for ${errors.length} books. Showing available data.`);
        }
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details');
      }
    };

    fetchBookDetails();
  }, [reservations, csrfToken]);

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8002/reservations/cancel/${reservationId}/`, // Changed endpoint
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.status !== 200 && response.status !== 204) {
        throw new Error('Failed to cancel reservation');
      }

      // Optimistic update - remove the cancelled reservation
      setReservations(prev => prev.filter(res => res.id !== reservationId));
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  const activeReservations = reservations.filter(res => !res.cancelled);

  const getStatusText = (reservation) => {
    if (reservation.ready_for_pickup) return 'Ready for pickup!';
    if (reservation.position) return `Position in queue: ${reservation.position}`;
    return 'Pending';
  };

  if (loading) return <div className="loading">Loading your books...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="my-books-page">
      <Navbar />
      <div className="my-books-container">
        <h1 className="my-books-page-title">Your Reserved Books</h1>

        { activeReservations.length === 0 ? ( 
          <div className="empty-state">
            <p>You haven't reserved any books yet</p>
          </div>
        ) : (
          <div className="books-grid">
            {activeReservations.map(reservation => {
              const book = booksData[reservation.book];
              if (!book) return null;

              return (
                <div key={reservation.id}>
                  <BookCard 
                    cover={normalizeCoverUrl(book.cover || '')} 
                    title={book.title}
                    author={book.author}
                    onClick={() => navigate(`/books/${book.isbn}`)}
                  />
                  <p
                    className="my-books-status-text"
                    data-status={
                      reservation.ready_for_pickup ? 'ready' :
                      reservation.position ? 'waiting' : 'pending'
                    }
                  >
                    {getStatusText(reservation)}
                  </p>
                  <div className="my-books-buttons">
                    <button
                      className="my-books-cancel-button"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooks;