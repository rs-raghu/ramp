// in: backend/routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const sequelize = require('../config/db'); // Import the main sequelize instance
const initModels = require('../models/init-models'); // Import the init function
const jwt = require('jsonwebtoken');

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
        [Op.or]: [
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
    const password_hash = await bcrypt.hash(password, salt); // <--- FIX #1

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


// --- POST /api/auth/login ---
router.post('/login', async (req, res) => {
  const { login, password } = req.body; 

  if (!login || !password) {
    return res.status(400).json({ msg: 'Please provide a username/email and password' });
  }

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: login },
          { email: login }
        ]
      }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials (user not found)' });
    }
    
    if (!user.password_hash) {
      console.error(`User ${user.username} has no password_hash in the database.`);
      return res.status(500).json({ msg: 'Server configuration error' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials (password mismatch)' });
    }

    const payload = {
      user: {
        id: user.user_id,
        username: user.username
      }
    };

    // --- THIS IS THE FIX ---
    // The function is just jwt.sign(), not jwt.signSync()
    const token = jwt.sign(
      payload,
      'your_jwt_secret',
      { expiresIn: '5h' }
    );
    
    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;