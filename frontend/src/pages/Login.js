// in: frontend/src/pages/Login.js

import React, { useState } from 'react';
import { login } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import './AuthForm.css'; // Import the new CSS

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate(); // Hook for redirecting

  const { login: loginField, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');
    setIsError(false);
    try {
      const data = await login({ login: loginField, password });
      console.log(data);
      setMessage('Login successful! Redirecting...');
      onLoginSuccess();
      // Redirect to the dashboard after a short delay
      setTimeout(() => navigate('/'), 1000); // Navigate to Home
      
    } catch (err) {
      console.error(err);
      setMessage(err.msg || 'Invalid credentials. Please try again.');
      setIsError(true);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        <form onSubmit={onSubmit}>
          <div>
            <input
              type="text"
              placeholder="Username or Email"
              name="login"
              value={loginField}
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
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {message && (
          <p className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
        <p>
          Don't have an account? <Link to="/register">Register Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;