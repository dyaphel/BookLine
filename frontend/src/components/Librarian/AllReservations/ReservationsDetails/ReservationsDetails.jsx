import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { normalizeCoverUrl } from "../../../../Utils/urlCoverNormalizer";
import { getCsrfToken } from '../../../../Utils/GetToken';
import './ReservationsDetails.css';
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../Navbar/Navbar";

const ReservationsDetails = () => {
  const [reservation, setReservation] = useState(null);
  const [book, setBook] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const { reservationId } = useParams();
  const navigate = useNavigate();
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
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const reservationRes = await axios.get(
          `http://localhost:8002/reservations/${reservationId}/`,
          { withCredentials: true }
        );
        const resData = reservationRes.data;
        setReservation(resData);

        const bookRes = await axios.get(
          `http://localhost:8001/books/${resData.book}/`,
          { withCredentials: true }
        );
        setBook(bookRes.data);

        const userRes = await axios.get(
          `http://localhost:8003/users/get_by/${resData.user}`,
          { withCredentials: true }
        );
        setUser(userRes.data);

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load reservation details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [reservationId]);

  const handleFulfill = async () => {
    try {
      await axios.patch(
        `http://localhost:8002/reservations/fulfill/${reservationId}/`,
        {}, 
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        }
      );
      // Update local reservation state
      setReservation(prev => ({ ...prev, fulfilled: true }));
      setError(null);
      navigate('/all-reservations')
    } catch (err) {
      setError(err.response?.data?.detail || 'Fulfillment failed');
    }
  };

  const handleCancel = async () => {
    try {
      await axios.delete(
        `http://localhost:8002/reservations/cancel/${reservationId}/`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,
        }
      );
      // Update local reservation state
      setReservation(prev => ({ ...prev, cancelled: true }));
      setError(null);
      navigate('/all-reservations')
    } catch (err) {
      setError(err.response?.data?.detail || 'Cancellation failed');
      setSuccessMessage('');
    }
  };

  if (loading) return <div className="loading">Loading reservation details...</div>;
  if (error && !reservation) return <div className="error">Error: {error}</div>;
  if (!reservation || !book || !user) return null;

  return (
   <div className="reservation-details-container">
  <Navbar />
  <h2 className="Reservation-title"> Reservation number:{reservation.id}</h2>

  {/* Top row: Book + User */}
  <div className="top-row">
    <div className="details-section book-section">
      <h3>Book Information</h3>
      <div className="book-details">
        {book.cover ? (
          <img
            src={`http://localhost:8001${normalizeCoverUrl(book.cover)}`}
            alt={book.title}
            className="book-cover"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/150x200?text=No+Cover'; }}
          />
        ) : (
          <div className="no-cover">No Cover Available</div>
        )}
        <div className="book-info">
          <p><strong>Title:</strong> {book.title}</p>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>ISBN:</strong> {book.isbn}</p>
          <p><strong>Genre:</strong> {book.genre}</p>
          <p><strong>Language:</strong> {book.language}</p>
          <p><strong>Available Copies:</strong> {book.available_copies}</p>
        </div>
      </div>
    </div>

    <div className="details-section user-section">
      <h3>Patron Information</h3>
      <div className="user-details">
        {user.profile_image && (
          <img
            src={`http://localhost:8003${user.profile_image}`}
            alt={`${user.first_name} ${user.last_name}`}
            className="user-image"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/150x150?text=No+Image'; }}
          />
        )}
        <div className="user-info">
          <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
    </div>
  </div>

  {/* Reservation card centered */}
  <div className="details-section reservation-section">
    <h3>Reservation Status</h3>
    <p><strong>Ready for Pickup:</strong> {reservation.ready_for_pickup ? 'Yes' : 'No'}</p>
    <p><strong>Fulfilled:</strong> {reservation.fulfilled ? 'Yes' : 'No'}</p>
    <p><strong>Returned:</strong> {reservation.returned ? 'Yes' : 'No'}</p>
    <p><strong>Cancelled:</strong> {reservation.cancelled ? 'Yes' : 'No'}</p>
    <p><strong>Timestamp:</strong> {new Date(reservation.timestamp).toLocaleString()}</p>

    {!reservation.fulfilled && !reservation.cancelled && (
      <div className="fulfill-buttons">
        <button onClick={handleFulfill} className="btn fulfill">Fulfill</button>
        <button onClick={handleCancel} className="btn cancel">Cancel</button>
      </div>
    )}
  </div>
</div>
  );
};

export default ReservationsDetails;