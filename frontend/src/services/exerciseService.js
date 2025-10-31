// in: frontend/src/services/exerciseService.js

import api from './api';

// Get all exercises from the pool
export const getExercises = async () => {
  try {
    const res = await api.get('/exercises');
    return res.data; // Returns an array of exercise objects
  } catch (err) {
    const errorMsg = err.response && err.response.data ? err.response.data : { msg: 'Error fetching exercises' };
    console.error(errorMsg);
    throw errorMsg;
  }
};