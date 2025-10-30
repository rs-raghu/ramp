// in: backend/server.js

const express = require('express');
const { Op } = require('sequelize');
const sequelize = require('./config/db'); // Your database connection

// Import your models. This function will attach them to the 'sequelize' object.
const initModels = require('./models/init-models');
const models = initModels(sequelize);

// --- Import Routes (We will create these next) ---
const authRoutes = require('./routes/auth');
// const workoutRoutes = require('./routes/workouts');
// const mealRoutes = require('./routes/meals');
// const goalRoutes = require('./routes/goals');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json()); // Allows your server to accept JSON data in request bodies

// --- Simple Test Route ---
app.get('/', (req, res) => {
  res.send('Fitness Planner API is running!');
});

// --- Use Routes (Uncomment these later) ---
app.use('/api/auth', authRoutes);
// app.use('/api/workouts', workoutRoutes);
// app.use('/api/meals', mealRoutes);
// app.use('/api/goals', goalRoutes);


// --- Start Server & Connect to DB ---
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});