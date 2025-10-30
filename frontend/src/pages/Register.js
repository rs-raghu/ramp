// in: frontend/src/pages/Register.js

import React, { useState } from 'react';
import { register } from '../services/authService'; // Import our function

const Register = () => {
  // State to hold the form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: ''
  });

  // A state for loading or error messages
  const [message, setMessage] = useState('');

  const { username, email, password, full_name } = formData;

  // This function updates the state when you type in the form
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // This function runs when you submit the form
  const onSubmit = async (e) => {
    e.preventDefault(); // Stop the form from refreshing the page
    setMessage('Registering...');

    try {
      // Call the register function from our authService
      const data = await register({ username, email, password, full_name });
      
      console.log(data); // Log the success message
      setMessage(data.msg); // Show "User registered successfully"
      
      // You could automatically log them in or redirect them here
      // For now, we'll just show the message.

    } catch (err) {
      console.error(err);
      setMessage(err.msg || 'An error occurred. Please try again.'); // Show the error from the backend
    }
  };

  return (
    <div>
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
            placeholder="Full Name"
            name="full_name"
            value={full_name}
            onChange={onChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;