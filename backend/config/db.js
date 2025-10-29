// in: backend/config/db.js

const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('fitness_planner', 'postgres', 'rama_mani7581', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // Set to console.log to see the raw SQL queries

  // This 'define' block is important for connecting to an existing database
  define: {
    // This tells Sequelize to use the 'public' schema (default for Postgres)
    schema: 'public',
    
    // This tells Sequelize to use the exact table names you created
    // (e.g., 'users' instead of trying to pluralize it to 'userses')
    freezeTableName: true,

    // This stops Sequelize from automatically creating 'createdAt' and 'updatedAt' columns
    // You already have your own 'created_at' and 'updated_at' columns
    timestamps: false 
  }
});

module.exports = sequelize;