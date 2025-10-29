const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_profile', {
    profile_id: {
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
      unique: "user_profile_user_id_key"
    },
    height: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    current_weight: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    activity_level: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    dietary_preference: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    health_conditions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fitness_experience: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user_profile',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "user_profile_pkey",
        unique: true,
        fields: [
          { name: "profile_id" },
        ]
      },
      {
        name: "user_profile_user_id_key",
        unique: true,
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
