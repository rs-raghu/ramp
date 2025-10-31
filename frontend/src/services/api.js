// in: frontend/src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

/* --- THIS IS THE NEW PART ---
  This is an "interceptor". It's a piece of code that runs
  BEFORE every single request is sent.
*/
api.interceptors.request.use(
  (config) => {
    // 1. Get the token from local storage
    const token = localStorage.getItem('token');

    // 2. If the token exists, add it to the request headers
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;