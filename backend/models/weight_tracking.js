const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('weight_tracking', {
    weight_id: {
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
      },
      unique: "weight_tracking_user_id_recorded_date_key"
    },
    weight: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    recorded_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: "weight_tracking_user_id_recorded_date_key"
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'weight_tracking',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "idx_weight_tracking_user",
        fields: [
          { name: "user_id" },
          { name: "recorded_date" },
        ]
      },
      {
        name: "weight_tracking_pkey",
        unique: true,
        fields: [
          { name: "weight_id" },
        ]
      },
      {
        name: "weight_tracking_user_id_recorded_date_key",
        unique: true,
        fields: [
          { name: "user_id" },
          { name: "recorded_date" },
        ]
      },
    ]
  });
};
