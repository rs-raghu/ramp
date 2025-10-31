// in: frontend/src/services/mealService.js

import api from './api'; // Import our base axios instance

// We're calling the unsecured routes for now

// Get all meal logs
export const getMeals = async () => {
  try {
    const res = await api.get('/meals');
    return res.data; // Returns an array of meal logs
  } catch (err) {
    const errorMsg = err.response && err.response.data ? err.response.data : { msg: 'Error fetching meals' };
    console.error(errorMsg);
    throw errorMsg;
  }
};

// Create a new meal log
export const createMeal = async (mealData) => {
  // mealData = { food_id, meal_date, meal_type, ... }
  try {
    const res = await api.post('/meals', mealData);
    return res.data; // Returns the new meal log object
  } catch (err) {
    const errorMsg = err.response && err.response.data ? err.response.data : { msg: 'Error creating meal log' };
    console.error(errorMsg);
    throw errorMsg;
  }
};

// Delete a meal log by its ID
export const deleteMeal = async (logId) => {
  try {
    const res = await api.delete(`/meals/${logId}`);
    return res.data; // Returns { msg: 'Meal log removed successfully' }
  } catch (err) {
    const errorMsg = err.response && err.response.data ? err.response.data : { msg: 'Error deleting meal log' };
    console.error(errorMsg);
    throw errorMsg;
  }
};