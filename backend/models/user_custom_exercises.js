const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_custom_exercises', {
    custom_exercise_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    exercise_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true
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
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'user_custom_exercises',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "idx_user_custom_exercises_public",
        fields: [
          { name: "is_public" },
        ]
      },
      {
        name: "idx_user_custom_exercises_user",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "user_custom_exercises_pkey",
        unique: true,
        fields: [
          { name: "custom_exercise_id" },
        ]
      },
    ]
  });
};
