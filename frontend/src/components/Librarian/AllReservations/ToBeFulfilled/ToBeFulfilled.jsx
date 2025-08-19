import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { normalizeCoverUrl } from "../../../../Utils/urlCoverNormalizer";
import './ToBeFulfilled.css';
import { getCsrfToken } from '../../../../Utils/GetToken';

const ToBeFulfilled = () => {
  const [reservations, setReservations] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');


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


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const reservationsRes = await axios.get(
          'http://localhost:8002/reservations/all',
          { withCredentials: true }
        );
        const readyReservations = (reservationsRes.data ?? []).filter(
          reservation => reservation.ready_for_pickup && !reservation.fulfilled
        );

        
        const bookIds = [...new Set(readyReservations.map(res => res.book))];
        const userIds = [...new Set(readyReservations.map(res => res.user))];
        
        const [booksResponse, usersResponse] = await Promise.all([
          Promise.all(
            bookIds.map(id => 
              axios.get(`http://localhost:8001/books/${id}/`, {
                 withCredentials: true
              })
                .then(res => res.data)
                .catch(() => null)
            )
          ),
          Promise.all(
            userIds.map(id => 
              axios.get(`http://localhost:8003/users/get_by/${id}`, { 
                withCredentials: true 
              })
                .then(res => res.data)
                .catch(() => null)
            )
          )
        ]);

        const booksById = {};
        booksResponse.forEach(book => {
          if (book && book.isbn) {
            booksById[book.isbn] = book;
          }
        });
        
        const usersById = {};
        usersResponse.forEach(user => {
          if (user && user.id) {
            usersById[user.id] = user;
          }
        });

        setBooks(booksById);
        setUsers(usersById);
        setReservations(readyReservations);
        
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFulfill = async (reservationId) => {
    try {
     await axios.patch(
  `http://localhost:8002/reservations/fulfill/${reservationId}/`,
  {}, // empty body
  {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    withCredentials: true,
  }
);

      setReservations(prev => prev.filter(res => res.id !== reservationId));
    } catch (err) {
      setError(err.response?.data?.detail || 'Fulfillment failed');
    }
  };

  const handleCancel = async (reservationId) => {
    try {
      await axios.delete(
        `http://localhost:8002/reservations/cancel/${reservationId}/`,
        { withCredentials: true }
      );
      setReservations(prev => prev.filter(res => res.id !== reservationId));
    } catch (err) {
      setError(err.response?.data?.detail || 'Deletion failed');
    }
  };

  if (loading) return <div className="loading">Loading reservations...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    
    <div className="fulfill-page-container">
      {reservations.length === 0 ? ( 
        <div className="fulfill-no-reservations">No books ready for pickup</div>
      ) : (
        <div className="fulfill-cards-container">
          {reservations.map((reservation) => {
            const book = books[reservation.book] || {
              title: "Unknown Book",
              id: "N/A",
              cover: null,
            };
            
            const user = users[reservation.user] || {
              first_name: "Unknown",
              surname: "User",
            };

            return (
              <div key={reservation.id} className="fulfill-card">
                <div className="fulfill-cover-container">
                  {book.cover ? (
                    <img
                      src={`http://localhost:8001${normalizeCoverUrl(book.cover)}`}
                      alt={`Cover of ${book.title}`}
                      className="fulfill-cover-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x200?text=No+Cover';
                      }}
                    />
                  ) : (
                    <div className="fulfill-no-cover">No cover available</div>
                  )}
                </div>

                <div className="fulfill-card-content">
                  <h3 className="fulfill-book-title">{book.title}</h3>

                   <div className="fulfill-info">
                    <span className="fulfill-label">isbn:</span>{book.isbn}
                  </div>
                  <div className="fulfill-info">
                    <span className="fulfill-label">Patron:</span> {user.first_name} {user.last_name}
                  </div>

                  <div className="fulfill-info">
                    <span className="fulfill-label">Reservation:</span> {reservation.id}
                  </div>

                  <div className="fulfill-buttons">
                    <button
                      onClick={() => handleFulfill(reservation.id)}
                      className="btn fulfill"
                    >
                      Fulfill
                    </button>
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="btn cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ToBeFulfilled;
