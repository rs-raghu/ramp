

const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const initModels = require('../models/init-models');
const models = initModels(sequelize);
const Goal = models.goals;
const auth = require('../middleware/authMiddleware');

// --- GET /api/goals/ ---
// @desc    Get all goals for the hardcoded user
// @access  Public (for now)
router.get('/', auth, async (req, res) => {
  try {
    const userGoals = await Goal.findAll({
      where: {
        user_id: req.user.id // Using hardcoded user
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
// @desc    Create a new goal (NOW WITH CONDITIONAL VALIDATION)
// @access  Public (for now)
router.post('/', auth, async (req, res) => {
  const { goal_type, target_value, start_date, target_date, notes } = req.body;

  // --- NEW VALIDATION LOGIC ---
  // 1. Base validation
  if (!goal_type || !start_date) {
    return res.status(400).json({ msg: 'Please provide a goal type and a start date' });
  }

  // 2. Conditional validation for target_value
  if ((goal_type === 'Weight Loss' || goal_type === 'Gain Muscle') && !target_value) {
    return res.status(400).json({ msg: 'Target Weight is required for this goal type.' });
  }

  try {
    // 3. Check if an active goal already exists
    const existingActiveGoal = await Goal.findOne({
      where: {
        user_id: req.user.id,
        status: 'In Progress'
      }
    });

    if (existingActiveGoal) {
      return res.status(400).json({ msg: 'You already have an active goal. Please complete it before starting a new one.' });
    }
    
    // 4. Create the new goal
    const newGoal = await Goal.create({
      user_id: req.user.id,
      goal_type: goal_type,
      // This will save null if target_value is ""
      target_value: target_value || null, 
      current_value: 0,
      start_date: start_date,
      target_date: target_date,
      status: 'In Progress',
      notes: notes
    });

    res.status(201).json(newGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// --- PUT /api/goals/:id ---
// @desc    Update a specific goal
// @access  Public (for now)
router.put('/:id', auth, async (req, res) => {
  const { goal_type, target_value, current_value, status, notes } = req.body;
  const goalId = req.params.id;

  try {
    // Find the goal by its ID (and check that it belongs to our user)
    const goal = await Goal.findOne({
      where: {
        goal_id: goalId,
        user_id: req.user.id
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
        user_id: req.user.id
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