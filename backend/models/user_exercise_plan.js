const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_exercise_plan', {
    plan_id: {
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
    sets: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reps: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    frequency_per_week: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    added_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'user_exercise_plan',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_user_exercise_plan_user",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "user_exercise_plan_pkey",
        unique: true,
        fields: [
          { name: "plan_id" },
        ]
      },
    ]
  });
};
