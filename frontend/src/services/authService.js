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
    const errorMsg = err.response && err.response.data ? err.response.data : { msg: 'Network Error or CORS failure' };
    console.error(errorMsg);
    throw errorMsg;
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
    const errorMsg = err.response && err.response.data ? err.response.data : { msg: 'Invalid credentials or Network Error' };
    console.error(errorMsg);
    throw errorMsg;
  }
};

// Function to log out a user (simple version)
export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  // In a real app, you'd decode the token to get user info.
  // For now, just knowing the token exists is enough.
  return { token: token }; 
};