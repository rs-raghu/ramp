// in: frontend/src/services/goalService.js

import api from './api'; // Import our base axios instance

// We're calling the unsecured routes for now
// They are hardcoded to user_id: 1 on the backend

// Get all goals
export const getGoals = async () => {
  try {
    const res = await api.get('/goals');
    return res.data; // Returns an array of goals
  } catch (err) {
    const errorMsg = err.response && err.response.data ? err.response.data : { msg: 'Error fetching goals' };
    console.error(errorMsg);
    throw errorMsg;
  }
};

// Create a new goal
export const createGoal = async (goalData) => {
  // goalData = { goal_type, target_value, start_date, ... }
  try {
    const res = await api.post('/goals', goalData);
    return res.data; // Returns the new goal object
  } catch (err) {
    const errorMsg = err.response && err.response.data ? err.response.data : { msg: 'Error creating goal' };
    console.error(errorMsg);
    throw errorMsg;
  }
};

export const deleteGoal = async (goalId) => {
  try {
    // We're using the unsecured route for now
    const res = await api.delete(`/goals/${goalId}`);
    return res.data; // Returns { msg: 'Goal removed successfully' }
  } catch (err) {
    const errorMsg = err.response && err.response.data ? err.response.data : { msg: 'Error deleting goal' };
    console.error(errorMsg);
    throw errorMsg;
  }
};

export const updateGoal = async (goalId, updateData) => {
  // updateData will be { status: 'Completed' }
  try {
    const res = await api.put(`/goals/${goalId}`, updateData);
    return res.data; // Returns the updated goal object
  } catch (err) {
    const errorMsg = err.response && err.response.data ? err.response.data : { msg: 'Error updating goal' };
    console.error(errorMsg);
    throw errorMsg;
  }
};