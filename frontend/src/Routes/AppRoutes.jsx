import React from "react";
import { BrowserRouter as Router,Routes, Route, Navigate } from 'react-router-dom';

import BookInformation from "../components/BookInformation/BookInformation";
import Login from '../components/Login/Login';
import Home from '../components/Home/Home';
import RegisterPage from "../components/Register/Register";
import ProfilePage from "../components/ProfilePage/ProfilePage";
const AppRoutes = () => {   
    return (
        <Router>
             <Routes>
                <Route path="/" element = {<Navigate to ='/home'/>} />

                <Route path="/login" element = {<Login />} />
                
                <Route path="/register" element = {<RegisterPage />} />
                <Route path="/home" element = {<Home />} />

                {/*PROTECTED ROUTES*/}
                <Route path="/books/:isbn" element={<BookInformation/>}/>
                <Route path="/users/:username" element={<ProfilePage />} />
                
                {/* Fallback route */}
             </Routes>
        </Router>
    );
};
 export default AppRoutes;