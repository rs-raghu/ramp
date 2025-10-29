// in: backend/routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db'); // Import the main sequelize instance
const initModels = require('../models/init-models'); // Import the init function

// Initialize models and get the 'users' model
const models = initModels(sequelize);
const User = models.users; // 'users' is the table name

const router = express.Router();

// --- POST /api/auth/register ---
// This is the route for creating a new user
router.post('/register', async (req, res) => {
  // Get user data from the request body
  const { username, email, password, full_name, date_of_birth, gender } = req.body;

  // --- Basic Validation ---
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter username, email, and password' });
  }

  try {
    // 1. Check if user already exists (by email or username)
    const userExists = await User.findOne({
      where: {
        [sequelize.Op.or]: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (userExists) {
      return res.status(400).json({ msg: 'User with this email or username already exists' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10); // Generate a 'salt'
    const password_hash = await bcrypt.hash(password, salt); // Create the hash

    // 3. Create the new user in the database
    const newUser = await User.create({
      username: username,
      email: email,
      password_hash: password_hash, // Store the hash, NOT the password
      full_name: full_name,
      date_of_birth: date_of_birth,
      gender: gender
    });

    // Send a success response (but don't send the password hash back!)
    res.status(201).json({
      msg: 'User registered successfully',
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        created_at: newUser.created_at
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;