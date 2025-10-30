

const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const initModels = require('../models/init-models');
const models = initModels(sequelize);
const Goal = models.goals;

// --- !! TEMPORARY DEV NOTE !! ---
// All routes are hardcoded to user_id: 1 for testing
// We will add authentication later
const TEMP_USER_ID = 1; 

// --- GET /api/goals/ ---
// @desc    Get all goals for the hardcoded user
// @access  Public (for now)
router.get('/', async (req, res) => {
  try {
    const userGoals = await Goal.findAll({
      where: {
        user_id: TEMP_USER_ID // Using hardcoded user
      },
      order: [['target_date', 'ASC']]
    });

    res.json(userGoals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- POST /api/goals/ ---
// @desc    Create a new goal for the hardcoded user
// @access  Public (for now)
router.post('/', async (req, res) => {
  // Get goal data from the request body
  const { goal_type, target_value, start_date, target_date, notes } = req.body;

  // Basic validation
  if (!goal_type || !target_value || !start_date) {
    return res.status(400).json({ msg: 'Please provide goal_type, target_value, and start_date' });
  }

  try {
    const newGoal = await Goal.create({
      user_id: TEMP_USER_ID, // Using hardcoded user
      goal_type: goal_type,
      target_value: target_value,
      current_value: 0, // Default current value
      start_date: start_date,
      target_date: target_date,
      status: 'In Progress',
      notes: notes
    });

    res.status(201).json(newGoal); // Send the newly created goal back
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// --- PUT /api/goals/:id ---
// @desc    Update a specific goal
// @access  Public (for now)
router.put('/:id', async (req, res) => {
  const { goal_type, target_value, current_value, status, notes } = req.body;
  const goalId = req.params.id;

  try {
    // Find the goal by its ID (and check that it belongs to our user)
    const goal = await Goal.findOne({
      where: {
        goal_id: goalId,
        user_id: TEMP_USER_ID
      }
    });

    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }

    // Update the goal's fields
    goal.goal_type = goal_type || goal.goal_type;
    goal.target_value = target_value || goal.target_value;
    goal.current_value = current_value || goal.current_value;
    goal.status = status || goal.status;
    goal.notes = notes || goal.notes;
    
    // Save the changes
    await goal.save();

    res.json(goal); // Send back the updated goal
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- DELETE /api/goals/:id ---
// @desc    Delete a specific goal
// @access  Public (for now)
router.delete('/:id', async (req, res) => {
  const goalId = req.params.id;

  try {
    const goal = await Goal.findOne({
      where: {
        goal_id: goalId,
        user_id: TEMP_USER_ID
      }
    });

    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }

    // Delete the goal
    await goal.destroy();

    res.json({ msg: 'Goal removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;