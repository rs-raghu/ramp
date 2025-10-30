// in: frontend/src/pages/Login.js

import React, { useState } from 'react';
import { login } from '../services/authService'; // Import our login function

const Login = () => {
  // State for the form data
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });

  // State for messages
  const [message, setMessage] = useState('');

  const { login: loginField, password } = formData; // Renamed 'login' to 'loginField' to avoid conflict

  // Update state on form input change
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('Logging in...');

    try {
      // Call the login function from our service
      const data = await login({ login: loginField, password });
      
      console.log(data); // This will log the { token: "..." } object
      setMessage('Login successful! You have a token.');
      
      // We'll handle redirecting the user later.

    } catch (err) {
      console.error(err);
      setMessage(err.msg || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username or Email"
            name="login" // This 'name' must match the key in state
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
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;