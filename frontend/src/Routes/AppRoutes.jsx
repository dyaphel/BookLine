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
import Analytics from "../components/Librarian/Analytics/Analytics";

const AppRoutes = () => { 
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({ username: "", id: null, isStaff:false });
    const [Loading, setLoading] = useState(false);
    useEffect(() => {
        const initialize = async () => {
            try {
                setLoading(true);
                const token = await getCsrfToken();
                const authResponse = await axios.get('http://localhost:8003/users/check-auth/', {
                    headers: {
                        'X-CSRFToken': token
                    },
                    withCredentials: true
                });
                if (authResponse.data.isAuthenticated) {
                    setIsLoggedIn(true);
                    setUserData({
                        username: authResponse.data.username,
                        id: authResponse.data.id,
                        isStaff: authResponse.data.is_staff
                    });
                }
            } catch (error) {
                console.error("Initialization error:", error);
            } finally {
                setLoading(false);
            }
        };
        initialize();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to='/home'/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<Home />} />

                {/* PROTECTED ROUTES */}
                <Route path="/books/:isbn" element={<BookInformation/>}/>
               <Route 
                    path="/users/:username" 
                    element={isLoggedIn ? <ProfilePage /> : <Login /> }  />
                    
                <Route 
                    path="/my-books" 
                    element={isLoggedIn ? <MyBooks userId={userData.id} /> : <Login /> }  />
                
                <Route 
                path="/all-reservations" 
                element={ userData.isStaff ?<AllReservations/>:<Login />  } />
                
                <Route 
                path="/catalog" 
                element={ userData.isStaff ?<EditCatalog/>:<Login />  } />

                <Route 
                path="/analytics" 
                element={ userData.isStaff ?<Analytics/>:<Login />  } />
            </Routes>
        </Router>
    );
};

export default AppRoutes;