// in: frontend/src/services/authService.js

import api from './api'; // Import our base axios instance

// Function to register a new user
export const register = async (userData) => {
  try {
    // userData will be an object like:
    // { username, email, password, full_name }
    const res = await api.post('/auth/register', userData);
    return res.data; // Returns the { msg, user } object
  } catch (err) {
    console.error(err.response.data);
    throw err.response.data; // Throw the error to be caught by the component
  }
};

// Function to log in a user
export const login = async (credentials) => {
  try {
    // credentials will be an object like:
    // { login, password }
    const res = await api.post('/auth/login', credentials);
    
    // The response will be { token: "..." }
    if (res.data.token) {
      // We can save the token to localStorage for later
      localStorage.setItem('token', res.data.token);
    }
    return res.data;
  } catch (err) {
    console.error(err.response.data);
    throw err.response.data;
  }
};

// Function to log out a user (simple version)
export const logout = () => {
  localStorage.removeItem('token');
};