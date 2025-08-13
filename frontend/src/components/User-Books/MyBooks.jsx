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



// Separate function to fetch reservations
useEffect(() => {
  if (!userId || !csrfToken) return; // Check for both required values
  
  const fetchUserReservations = async () => {
    setLoading(true);
    setError(null); // Reset error state
    
    try {
      const response = await axios.get(
        `http://localhost:8002/reservations/user/${userId}/`, // Fixed endpoint URL
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, // Use the state variable
          },
          withCredentials: true
        }
      );
      console.log({response});
      setReservations(response.data);
    } catch (err) {
      console.error('Error fetching reservations:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      setError(err.response?.data?.message || 'Failed to load reservation data');
    } finally {
      setLoading(false);
    }
  };

  fetchUserReservations();
}, [userId, csrfToken]); // Add dependencies to avoid stale closures

useEffect(() => {
  const fetchBookDetails = async () => {
    if (!reservations.length || !csrfToken) return;
    try {
      // Create array of book fetch promises with improved error handling
      const bookPromises = reservations.map(reservation => 
        axios.get(`http://localhost:8001/books/${reservation.book}/`, {
          headers: {
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
          validateStatus: function (status) {
            return status < 500; // Don't throw for server errors
          }
        })
        .then(response => {
          if (response.status === 200) {
            return {
              success: true,
              data: response.data,
              isbn: reservation.book
            };
          }
          return {
            success: false,
            isbn: reservation.book,
            error: `Server responded with ${response.status}`,
            status: response.status
          };
        })
        .catch(error => ({
          success: false,
          isbn: reservation.book,
          error: error.message,
          status: error.response?.status
        }))
      );

      const bookResults = await Promise.all(bookPromises);
      const booksMap = {};
      const failedFetches = [];
      
      bookResults.forEach(result => {
        if (result.success) {
          booksMap[result.isbn] = result.data;
        } else {
          failedFetches.push({
            isbn: result.isbn,
            status: result.status,
            error: result.error
          });
          console.error(`Failed to fetch book ${result.isbn}:`, result.error);
        }
      });

      setBooksData(booksMap);
      
      if (failedFetches.length > 0) {
        setError(`Couldn't load details for ${failedFetches.length} books. Showing available data.`);
        console.table(failedFetches); // Better error visualization
      }

    } catch (err) {
      console.error('Unexpected error in book fetching:', err);
      setError('Failed to load book details');
    } finally {

    }
  };

  fetchBookDetails();
}, [reservations, csrfToken]);

  // const handlePickupConfirmation = async (reservationId) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8002/reservations/${reservationId}/confirm-pickup/`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'X-CSRFToken': csrfToken,
  //         },
  //         credentials: 'include',
  //         body: JSON.stringify({ confirmed: true })
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error('Failed to confirm pickup');
  //     }

  //     // Refresh reservations after successful confirmation
  //     const updatedReservations = reservations.map(res => 
  //       res.id === reservationId ? { ...res, fulfilled: true } : res
  //     );
  //     setReservations(updatedReservations);
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

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

      {reservations.length === 0 ? (
        <div className="empty-state">
          <p>You haven't reserved any books yet</p>
        </div>
      ) : (
        <div className="books-grid">
          {reservations.map(reservation => {
            const book = booksData[reservation.book];
            const normalizedCoverUrl = book?.cover
              ? normalizeCoverUrl(book.cover)
              : '';

            if (!book) return null;

            return (
              <div key={reservation.id} >
                <BookCard 
                  cover={normalizedCoverUrl} 
                  title={book.title}
                  author={book.author}
                  onClick={() => navigate(`/books/${book.isbn}`)}/>
                <p
                  className="my-books-status-text"
                  data-status={
                    reservation.ready_for_pickup
                      ? 'ready'
                      : reservation.position
                      ? 'waiting'
                      : 'pending'
                  }
                >
                  {getStatusText(reservation)}
                </p>

                {/* Buttons cancel */}
                <div className="my-books-buttons">
                    <button
                      className="my-books-cancel-button"
                      onClick={() =>
                        handleCancelReservation(reservation.id)
                      }
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