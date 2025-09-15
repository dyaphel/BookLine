import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { getCsrfToken } from "../Utils/GetToken";
import BookInformation from "../components/BookInformation/BookInformation";
import Login from '../components/Login/Login';
import Home from '../components/Home/Home';
import RegisterPage from "../components/Register/Register";
import ProfilePage from "../components/ProfilePage/ProfilePage";
import MyBooks from "../components/User-Books/MyBooks";
import EditCatalog from "../components/Librarian/EditCatalog/EditCatalog";
import AllReservations from "../components/Librarian/AllReservations/AllReservations";
import ReservationAnalytics from "../components/Librarian/Analytics/Analytics";
import ReservationsDetails from "../components/Librarian/AllReservations/ReservationsDetails/ReservationsDetails";
import Spinner from "../components/Loading/Spinner";

const AppRoutes = () => { 
    const [isLoggedIn, setIsLoggedIn] = useState(null); 
    const [userData, setUserData] = useState({ username: "", id: null, isStaff: false });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            try {
                setLoading(true);
                const token = await getCsrfToken();
                const authResponse = await axios.get('http://localhost:8003/users/check-auth/', {
                    headers: { 'X-CSRFToken': token },
                    withCredentials: true
                });
                if (authResponse.data.isAuthenticated) {
                    setIsLoggedIn(true);
                    setUserData({
                        username: authResponse.data.username,
                        id: authResponse.data.id,
                        isStaff: authResponse.data.is_staff
                    });
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Initialization error:", error);
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };
        initialize();
    }, []);

    // Wrapper for protected routes
    const ProtectedRoute = ({ children, staffOnly = false }) => {
        if (isLoggedIn === null) return <Spinner />; 
        if (!isLoggedIn) return <Login />;
        if (staffOnly && !userData.isStaff) return <Login />;
        return children;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to='/home'/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/books/:isbn" element={<BookInformation />} />

                {/* PROTECTED ROUTES */}

                <Route path="/users/:username" element={
                    <ProtectedRoute><ProfilePage /></ProtectedRoute>
                } />
                <Route path="/my-books" element={
                    <ProtectedRoute><MyBooks userId={userData.id} /></ProtectedRoute>
                } />
                <Route path="/all-reservations" element={
                    <ProtectedRoute staffOnly={true}><AllReservations/></ProtectedRoute>
                } />
                <Route path="/reservations/:reservationId" element={
                    <ProtectedRoute staffOnly={true}><ReservationsDetails/></ProtectedRoute>
                } />
                <Route path="/catalog" element={
                    <ProtectedRoute staffOnly={true}><EditCatalog/></ProtectedRoute>
                } />
                <Route path="/analytics" element={
                    <ProtectedRoute staffOnly={true}><ReservationAnalytics/></ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
};

export default AppRoutes;