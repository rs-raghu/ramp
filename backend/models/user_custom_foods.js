const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_custom_foods', {
    custom_food_id: {
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
    food_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    serving_size: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    calories: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    protein: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    carbs: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    fats: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    fiber: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'user_custom_foods',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "idx_user_custom_foods_public",
        fields: [
          { name: "is_public" },
        ]
      },
      {
        name: "idx_user_custom_foods_user",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "user_custom_foods_pkey",
        unique: true,
        fields: [
          { name: "custom_food_id" },
        ]
      },
    ]
  });
};
