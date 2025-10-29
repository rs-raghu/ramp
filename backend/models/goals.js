const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('goals', {
    goal_id: {
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
    goal_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    target_value: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    current_value: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    target_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "In Progress"
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'goals',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "goals_pkey",
        unique: true,
        fields: [
          { name: "goal_id" },
        ]
      },
    ]
  });
};
