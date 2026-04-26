const Branch = require('./Branch');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Inventory = require('./Inventory');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Supplier = require('./Supplier');
const StockMovement = require('./StockMovement');
const ProductBundle = require('./ProductBundle');
const RestockRequest = require('./RestockRequest');
const Notification = require('./Notification');
const AuditLog = require('./AuditLog');

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

Supplier.hasMany(Product, { foreignKey: 'supplier_id' });
Product.belongsTo(Supplier, { foreignKey: 'supplier_id' });

Product.hasMany(StockMovement, { foreignKey: 'product_id' });
StockMovement.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(StockMovement, { foreignKey: 'user_id' });
StockMovement.belongsTo(User, { foreignKey: 'user_id' });

Supplier.hasMany(StockMovement, { foreignKey: 'supplier_id' });
StockMovement.belongsTo(Supplier, { foreignKey: 'supplier_id' });

// RestockRequest associations
RestockRequest.belongsTo(Product, { foreignKey: 'product_id' });
RestockRequest.belongsTo(Branch, { foreignKey: 'branch_id' });
RestockRequest.belongsTo(User, { as: 'Manager', foreignKey: 'manager_id' });
RestockRequest.belongsTo(User, { as: 'Admin', foreignKey: 'admin_id' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'user_id' });

// AuditLog associations
User.hasMany(AuditLog, { foreignKey: 'user_id' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });

// Product Bundle associations
Product.belongsToMany(Product, { as: 'BundleItems', through: ProductBundle, foreignKey: 'bundle_id', otherKey: 'product_id' });

module.exports = {
  Branch,
  User,
  Category,
  Product,
  ProductBundle,
  Inventory,
  Order,
  OrderItem,
  Supplier,
  StockMovement,
  RestockRequest,
  Notification,
  AuditLog
};
