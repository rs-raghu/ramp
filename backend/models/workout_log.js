const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('workout_log', {
    log_id: {
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
    exercise_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'exercise_pool',
        key: 'exercise_id'
      }
    },
    custom_exercise_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user_custom_exercises',
        key: 'custom_exercise_id'
      }
    },
    workout_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    sets_completed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reps_completed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    calories_burned: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logged_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'workout_log',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_workout_log_user_date",
        fields: [
          { name: "user_id" },
          { name: "workout_date" },
        ]
      },
      {
        name: "workout_log_pkey",
        unique: true,
        fields: [
          { name: "log_id" },
        ]
      },
    ]
  });
};
