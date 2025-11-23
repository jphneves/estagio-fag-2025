const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  resource: {
    type: DataTypes.STRING,
    allowNull: false
  },
  action: {
    type: DataTypes.ENUM('CREATE', 'READ', 'UPDATE', 'DELETE'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'permissions',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['resource', 'action']
    }
  ]
});

module.exports = Permission;
