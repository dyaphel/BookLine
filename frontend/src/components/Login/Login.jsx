import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,  Link } from 'react-router-dom';
import Alert from '../../Utils/Alert/Alert';
import "./Login.css";

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');
    const navigate = useNavigate();

    // Fetch CSRF token when component mounts
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8000/users/csrf/', 
                    { withCredentials: true }
                );
                setCsrfToken(response.data.csrfToken);
            } catch (err) {
                console.error('Error fetching CSRF token:', err);
            }
        };
        fetchCsrfToken();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        try {
            const token = localStorage.getItem('csrfToken');
            const response = await axios.post(
                'http://localhost:8000/users/login/',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    withCredentials: true
                }
            );
            
            if (response.data.success) {
                navigate('/home');
            } else {
                setAlert({
                    message: response.data.message || 'Login failed',
                    type: 'error'
                });
            }
        } catch (err) {
            setAlert({
                message: err.response?.data?.message || 
                       err.message || 
                       'An error occurred during login',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const closeAlert = () => {
        setAlert(null);
    };

    return (
        <div className="mylogin-page">
            <h1 className="mylogin-title">Login</h1>
            <div className="mylogin-container">
                {alert && (
                    <Alert 
                        message={alert.message}
                        type={alert.type}
                        onClose={closeAlert}
                    />
                )}
                <form className="mylogin-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="mylogin-input"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mylogin-input"
                        required
                    />
                    <button 
                        type="submit" 
                        className="mylogin-button" 
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>
                <Link to="/register" className="myregister-button-login">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Login;