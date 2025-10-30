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

module.exports = router;