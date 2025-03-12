import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import "./Login.css";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    

    return (
    <div className="login-page">
        <h1 className="login-title">Login</h1>
        <div className="login-container">
            <form className="login-form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="login-input" />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input" />
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                </button>
            </form>
            <Link to="/register" className="register-button-login">
                Register
            </Link>
        </div>
    </div>
    );
};

export default Login;