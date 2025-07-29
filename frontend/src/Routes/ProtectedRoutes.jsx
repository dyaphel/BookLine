import ProfilePage from '../components/ProfilePage/ProfilePage';
import React from 'react';
import { BrowserRouter as Router,Routes, Route, Navigate } from 'react-router-dom';


const ProtectedRoutes = () => {
    return (
      <Router>
        <Routes>
          <Route 
                      path="/profile/:username" element={  <ProfilePage /> }
                    />
        </Routes>
      </Router>

    );
} 
export default ProtectedRoutes;