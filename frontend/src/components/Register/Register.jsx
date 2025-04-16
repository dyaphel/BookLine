import React, { useState } from 'react';
import './Register.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registering user:', formData);
    // Aggiungi qui la tua logica per inviare i dati al backend
  };

  return (
    <div className="myregister-container">
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
          name="name"
          placeholder="First Name"
          className="myregister-input"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="myregister-input"
          value={formData.lastName}
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
          name="confirmPassword"
          placeholder="Confirm Password"
          className="myregister-input"
          value={formData.confirmPassword}
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
