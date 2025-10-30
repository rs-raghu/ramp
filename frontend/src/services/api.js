// in: frontend/src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // <-- PASTE THIS EXACT LINE
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;