import React from "react";
import { BrowserRouter as Router,Routes, Route, Navigate } from 'react-router-dom';

import BookInformation from "../components/BookInformation/BookInformation";
import Login from '../components/Login/Login';
import Home from '../components/Home/Home';

const AppRoutes = () => {   
    return (
        <Router>
             <Routes>
                <Route path="/" element = {<Navigate to ='/home'/>} />

                <Route path="/login" element = {<Login />} />
                
                <Route path="/home" element = {<Home/>} />

                {/*PROTECTED ROUTES*/}
                <Route path="/bookinformation" element={<BookInformation/>}/>
             </Routes>
        </Router>
    );
};
 export default AppRoutes;