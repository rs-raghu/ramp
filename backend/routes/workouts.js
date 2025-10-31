// in: backend/routes/workouts.js

const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const initModels = require('../models/init-models');
const models = initModels(sequelize);
const WorkoutLog = models.workout_log;
const auth = require('../middleware/authMiddleware');

// --- GET /api/workouts/ ---
// @desc    Get all of the user's workout logs
// @access  Public (for now)
router.get('/', auth, async (req, res) => {
  try {
    const logs = await WorkoutLog.findAll({
      where: {
        user_id: req.user.id
      },
      order: [['workout_date', 'DESC']]
    });
    res.json(logs);
  } catch (err)
 {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- POST /api/workouts/ ---
// @desc    Log a new completed workout
// @access  Public (for now)
router.post('/', auth, async (req, res) => {
  const {
    exercise_id, // From the global pool
    custom_exercise_id, // From the user's custom list
    workout_date,
    sets_completed,
    reps_completed,
    duration_minutes,
    calories_burned,
    notes
  } = req.body;

  // Validation
  if (!workout_date || (!exercise_id && !custom_exercise_id)) {
    return res.status(400).json({ msg: 'Please provide a workout_date and an exercise_id or custom_exercise_id' });
  }

  try {
    const newLog = await WorkoutLog.create({
      user_id: req.user.id,
      exercise_id: exercise_id,
      custom_exercise_id: custom_exercise_id,
      workout_date: workout_date,
      sets_completed: sets_completed,
      reps_completed: reps_completed,
      duration_minutes: duration_minutes,
      calories_burned: calories_burned,
      notes: notes
      // 'logged_at' will be set by default in the database
    });

    res.status(201).json(newLog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// --- PUT /api/workouts/:id ---
// @desc    Update a specific workout log
// @access  Public (for now)
router.put('/:id', auth, async (req, res) => {
  const logId = req.params.id;

  try {
    // Find the log by its ID (and check that it belongs to our user)
    const log = await WorkoutLog.findOne({
      where: {
        log_id: logId,
        user_id: req.user.id
      }
    });

    if (!log) {
      return res.status(404).json({ msg: 'Workout log not found' });
    }

    // Update the log with any new data from req.body
    // This will only update fields that are provided in the request
    await log.update(req.body);

    res.json(log); // Send back the updated log
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- DELETE /api/workouts/:id ---
// @desc    Delete a specific workout log
// @access  Public (for now)
router.delete('/:id', auth, async (req, res) => {
  const logId = req.params.id;

  try {
    const log = await WorkoutLog.findOne({
      where: {
        log_id: logId,
        user_id: req.user.id
      }
    });

    if (!log) {
      return res.status(404).json({ msg: 'Workout log not found' });
    }

    // Delete the log
    await log.destroy();

    res.json({ msg: 'Workout log removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



module.exports = router;