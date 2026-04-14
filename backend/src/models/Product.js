const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  sku: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  category_id: { type: DataTypes.INTEGER, references: { model: 'Categories', key: 'id' } },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  image_url: { type: DataTypes.STRING }
});

module.exports = Product;
