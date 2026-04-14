const Branch = require('./Branch');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Inventory = require('./Inventory');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Associations
Branch.hasMany(User, { foreignKey: 'branch_id' });
User.belongsTo(Branch, { foreignKey: 'branch_id' });

Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

Product.hasMany(Inventory, { foreignKey: 'product_id' });
Inventory.belongsTo(Product, { foreignKey: 'product_id' });

Branch.hasMany(Inventory, { foreignKey: 'branch_id' });
Inventory.belongsTo(Branch, { foreignKey: 'branch_id' });

Branch.hasMany(Order, { foreignKey: 'branch_id' });
Order.belongsTo(Branch, { foreignKey: 'branch_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
  Branch,
  User,
  Category,
  Product,
  Inventory,
  Order,
  OrderItem
};
