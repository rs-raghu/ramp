const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_meal_plan', {
    meal_plan_id: {
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
    meal_type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    quantity: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    is_favorite: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    added_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'user_meal_plan',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "idx_user_meal_plan_user",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "user_meal_plan_pkey",
        unique: true,
        fields: [
          { name: "meal_plan_id" },
        ]
      },
    ]
  });
};
