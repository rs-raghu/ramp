const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exercise_pool', {
    exercise_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    exercise_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    difficulty_level: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    calories_per_minute: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    target_muscles: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    equipment_needed: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'exercise_pool',
    schema: 'public',
    createdAt: 'created_at', // Map createdAt to your 'created_at' column
    updatedAt: false,     // Tell Sequelize there is NO updatedAt column
    freezeTableName: true,
    indexes: [
      {
        name: "exercise_pool_pkey",
        unique: true,
        fields: [
          { name: "exercise_id" },
        ]
      },
    ]
  });
};
