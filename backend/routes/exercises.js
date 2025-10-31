// in: backend/routes/exercises.js

const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const initModels = require('../models/init-models');
const models = initModels(sequelize);
const Exercise = models.exercise_pool;

// --- GET /api/exercises/ ---
// @desc    Get all exercises from the pool
// @access  Public (for now)
router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.findAll({
      order: [['exercise_name', 'ASC']]
    });
    res.json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;