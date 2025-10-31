// in: frontend/src/services/workoutService.js

import api from './api'; // Import our base axios instance

// We're calling the unsecured routes for now

// Get all workout logs
export const getWorkouts = async () => {
  try {
    const res = await api.get('/workouts');
    return res.data; // Returns an array of workout logs
  } catch (err) {
    const errorMsg = err.response && err.response.data ? err.response.data : { msg: 'Error fetching workouts' };
    console.error(errorMsg);
    throw errorMsg;
  }
};

// Create a new workout log
export const createWorkout = async (workoutData) => {
  // workoutData = { exercise_id, workout_date, sets_completed, ... }
  try {
    const res = await api.post('/workouts', workoutData);
    return res.data; // Returns the new workout log object
  } catch (err) {
    const errorMsg = err.response && err.response.data ? err.response.data : { msg: 'Error creating workout log' };
    console.error(errorMsg);
    throw errorMsg;
  }
};

// Delete a workout log by its ID
export const deleteWorkout = async (logId) => {
  try {
    const res = await api.delete(`/workouts/${logId}`);
    return res.data; // Returns { msg: 'Workout log removed successfully' }
  } catch (err) {
    const errorMsg = err.response && err.response.data ? err.response.data : { msg: 'Error deleting workout log' };
    console.error(errorMsg);
    throw errorMsg;
  }
};