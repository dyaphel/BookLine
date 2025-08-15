import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './BookInformation.css';
import NavBar from "../Navbar/Navbar";
import Reservation from "../Buttons/reservation/reservation";
import GetInQueue from "../Buttons/GetInQueue/GetInQueue";
import { getCsrfToken } from '../../Utils/GetToken';
import { normalizeCoverUrl } from "../../Utils/urlCoverNormalizer";

const BookInformation = () => {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [reservations, setReservations] = useState({ available_copies: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userReservation, setUserReservation] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await getCsrfToken();
        
        // Check auth status
        const authResponse = await axios.get('http://localhost:8003/users/check-auth/', {
          headers: { 'X-CSRFToken': token },
          withCredentials: true
        });
        setIsLoggedIn(authResponse.data.isAuthenticated);

        // Fetch book data and availability in parallel
        const [bookResponse, availabilityResponse] = await Promise.all([
          axios.get(`http://localhost:8001/books/${isbn}`),
          axios.get(`http://localhost:8002/reservations/book/${isbn}/availability/`)
        ]);
        
        setBook(bookResponse.data);
        console.log({bookResponse})
        setReservations(availabilityResponse.data);

        // If logged in, check user's reservations
        if (authResponse.data.isAuthenticated) {
          try {
            const accessToken = localStorage.getItem('access_token');
            const userProfile = await axios.get('http://localhost:8003/users/get_profile/', {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-CSRFToken': token,
              },
              withCredentials: true
            });
            const userReservations = await axios.get(
              `http://localhost:8002/reservations/user/${userProfile.data.id}`,
              {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'X-CSRFToken': token,
                },
                withCredentials: true
              }
            );
            
            // Find if user has reservation for this book
            const reservationForThisBook = userReservations.data.find(
              reservation => reservation.book === isbn && !reservation.cancelled
            );
            
            if (reservationForThisBook) {
              setUserReservation(reservationForThisBook);
            }
          } catch (err) {
            console.error("Error checking user reservations:", err);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load book information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isbn]);

  const getCoverUrl = () => {
    if (!book?.cover) return '/default-cover.jpg';
    const normalizedPath = normalizeCoverUrl(book.cover);
    return `http://localhost:8001${normalizedPath}`; //check if the cover URL is valid the port number
  };

  const renderButtonOrStatus = () => {
  if (!isLoggedIn) {
    return reservations.available_copies > 0 ? (
      <Reservation isbn={isbn} />
    ) : (
      <GetInQueue isbn={isbn} />
    );
  }

  if (userReservation) {
    let statusMessage = '';
    let statusClass = 'reservation-status';
    if (userReservation.ready_for_pickup) {
      statusMessage = 'Your reservation is ready for pickup!';
      statusClass += ' status-ready';
    } else if  (userReservation.fulfilled && !userReservation.returned) {
      statusMessage = 'You have reserved this book';
      statusClass += ' status-reserved';
    } else if (userReservation.position) {
      statusMessage = `You're in queue (position ${userReservation.position - book.available_copies})`;
      statusClass += ' status-queue';
    } else {
      statusMessage = 'You have a reservation for this book';
      statusClass += ' status-pending';
    }

    return (
      <div className={statusClass}>
        <div className="status-icon"></div>
        <p>{statusMessage}</p>
      </div>
    );
  }

  return reservations.available_copies > 0 ? (
    <Reservation isbn={isbn} />
  ) : (
    <GetInQueue isbn={isbn} />
  );
};

  if (loading) return <div className="loading">Loading book details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div className="not-found">Book not found</div>;

  const coverUrl = getCoverUrl();

  return (
    <>
      <NavBar/>
      
      <div className="book-details-container">
        {/* Book Cover Card (Left) */}
        <div className="book-cover-container-details">
          <img 
            src={coverUrl}
            alt={`Cover of ${book.title}`} 
            className="book-cover-details"
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
      
      <div className="status-button-row">
        <div className="book-status-container">
          <h3 className="bookstatus">Status:</h3>
          <p className="bookstatusresponse">
            {reservations.available_copies > 0 ? 'Available' : 'Not Available'}
          </p>
        </div>
        
        <div className="book-copies-container">
          <h3 className="bookscopies">Number of copies:</h3>
          <p className="bookscopieresponse">{reservations.available_copies}</p>
        </div>

        <div className="bookbutton">
          {renderButtonOrStatus()}
        </div>
      </div>
    </>
  );
};

export default BookInformation;