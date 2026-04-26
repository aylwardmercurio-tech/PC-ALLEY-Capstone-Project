const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Notification = sequelize.define('Notification', {
  user_id: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: { model: 'Users', key: 'id' } 
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  message: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  type: { 
    type: DataTypes.STRING, 
    defaultValue: 'info' 
  },
  link: { 
    type: DataTypes.STRING 
  },
  is_read: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  }
});

module.exports = Notification;
