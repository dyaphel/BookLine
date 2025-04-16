import React, { useState } from 'react';
import Alert from '../../Utils/Alert/Alert';
import './Register.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    confirm_password: '',
  });
  // State to hold alert message and type (error, success, etc.)
  const [alertData, setAlertData] = useState({ message: '', type: '' });
  
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Registering user:', formData);
    
    // Frontend validation: password length
    if (formData.password.length < 8) {
      setAlertData({ message: 'Password must be at least 8 characters.', type: 'error' });
      return;
    }
    // Check that passwords match
    if (formData.password !== formData.confirm_password) {
      setAlertData({ message: 'Passwords do not match.', type: 'error' });
      return;
    }
    
    // Remove confirm_password from data to be sent
    const { confirm_password, ...dataToSend } = formData;

    try {
      const response = await fetch('http://localhost:8000/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setAlertData({ message: 'Registration successful!', type: 'success' });
        // Optionally, delay a bit before redirecting so the user sees the alert
        
        window.location.href = '/login';
        
      } else {
        const errorMessage = data.error || JSON.stringify(data);
        setAlertData({ message: errorMessage, type: 'error' });
      }
    } catch (error) {
      setAlertData({ message: 'Error: ' + error.message, type: 'error' });
    }
  };

  const clearAlert = () => {
    setAlertData({ message: '', type: '' });
  };
    
  return (
    <div className="myregister-container">
      {/* Render Alert at the top */}
      <Alert message={alertData.message} type={alertData.type} onClose={clearAlert} />
      
      <h2 className="myregister-title">Create an Account</h2>
      <form className="myregister-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="myregister-input"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          className="myregister-input"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          className="myregister-input"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="myregister-input"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="myregister-input"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          className="myregister-input"
          value={formData.confirm_password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="myregister-button">Register</button>
      </form>
      <a href="/login" className="myregister-button-login">Back to Login</a>
      <a href="/home" className="myregister-button-home">Main Page</a>
    </div>
  );
};

export default RegisterPage;
