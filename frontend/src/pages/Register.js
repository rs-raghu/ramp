// in: frontend/src/pages/Register.js

import React, { useState } from 'react';
import { register } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import './AuthForm.css'; // Import the new CSS

const Register = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', full_name: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate(); // Hook for redirecting

  const { username, email, password, full_name } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('Registering...');
    setIsError(false);
    try {
      const data = await register({ username, email, password, full_name });
      setMessage(data.msg + ' Redirecting to login...');
      
      // Redirect to the login page after a short delay
      setTimeout(() => navigate('/login'), 1500); 

    } catch (err) {
      console.error(err);
      setMessage(err.msg || 'An error occurred. Please try again.');
      setIsError(true);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Register</h2>
        <form onSubmit={onSubmit}>
          <div>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={onChange}
              minLength="6"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Full Name (Optional)"
              name="full_name"
              value={full_name}
              onChange={onChange}
            />
          </div>
          <button type="submit">Register</button>
        </form>
        {message && (
          <p className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
        <p>
          Already have an account? <Link to="/login">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;