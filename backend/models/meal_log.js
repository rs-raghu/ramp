const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('meal_log', {
    meal_log_id: {
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
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'food_pool',
        key: 'food_id'
      }
    },
    custom_food_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user_custom_foods',
        key: 'custom_food_id'
      }
    },
    meal_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    meal_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    total_calories: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    total_protein: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    total_carbs: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    total_fats: {
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
    tableName: 'meal_log',
    schema: 'public',
    timestamps: true,
    createdAt: 'logged_at',
    updatedAt: false,
    freezeTableName: true,
    indexes: [
      {
        name: "idx_meal_log_user_date",
        fields: [
          { name: "user_id" },
          { name: "meal_date" },
        ]
      },
      {
        name: "meal_log_pkey",
        unique: true,
        fields: [
          { name: "meal_log_id" },
        ]
      },
    ]
  });
};
