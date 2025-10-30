// in: backend/routes/meals.js

const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const initModels = require('../models/init-models');
const models = initModels(sequelize);
const MealLog = models.meal_log;

// --- !! TEMPORARY DEV NOTE !! ---
// All routes are hardcoded to user_id: 1 for testing
const TEMP_USER_ID = 1;

// --- GET /api/meals/ ---
// @desc    Get all of the user's meal logs
// @access  Public (for now)
router.get('/', async (req, res) => {
  try {
    const logs = await MealLog.findAll({
      where: {
        user_id: TEMP_USER_ID
      },
      order: [['meal_date', 'DESC']]
    });
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- POST /api/meals/ ---
// @desc    Log a new meal
// @access  Public (for now)
router.post('/', async (req, res) => {
  const {
    food_id, // From the global pool
    custom_food_id, // From the user's custom list
    meal_date,
    meal_type, // e.g., 'Breakfast', 'Lunch'
    quantity,
    total_calories,
    total_protein,
    total_carbs,
    total_fats,
    notes
  } = req.body;

  // Validation
  if (!meal_date || (!food_id && !custom_food_id)) {
    return res.status(400).json({ msg: 'Please provide a meal_date and a food_id or custom_food_id' });
  }

  try {
    const newLog = await MealLog.create({
      user_id: TEMP_USER_ID,
      food_id: food_id,
      custom_food_id: custom_food_id,
      meal_date: meal_date,
      meal_type: meal_type,
      quantity: quantity,
      total_calories: total_calories,
      total_protein: total_protein,
      total_carbs: total_carbs,
      total_fats: total_fats,
      notes: notes
      // 'logged_at' will be set by default
    });

    res.status(201).json(newLog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- PUT /api/meals/:id ---
// @desc    Update a specific meal log
// @access  Public (for now)
router.put('/:id', async (req, res) => {
  const logId = req.params.id;

  try {
    // Find the log by its ID (and check that it belongs to our user)
    const log = await MealLog.findOne({
      where: {
        meal_log_id: logId,
        user_id: TEMP_USER_ID
      }
    });

    if (!log) {
      return res.status(404).json({ msg: 'Meal log not found' });
    }

    // Update the log with any new data from req.body
    await log.update(req.body);

    res.json(log); // Send back the updated log
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- DELETE /api/meals/:id ---
// @desc    Delete a specific meal log
// @access  Public (for now)
router.delete('/:id', async (req, res) => {
  const logId = req.params.id;

  try {
    const log = await MealLog.findOne({
      where: {
        meal_log_id: logId,
        user_id: TEMP_USER_ID
      }
    });

    if (!log) {
      return res.status(404).json({ msg: 'Meal log not found' });
    }

    // Delete the log
    await log.destroy();

    res.json({ msg: 'Meal log removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;