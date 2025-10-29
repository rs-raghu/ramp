const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('food_pool', {
    food_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
    }
  }, {
    sequelize,
    tableName: 'food_pool',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "food_pool_pkey",
        unique: true,
        fields: [
          { name: "food_id" },
        ]
      },
    ]
  });
};
