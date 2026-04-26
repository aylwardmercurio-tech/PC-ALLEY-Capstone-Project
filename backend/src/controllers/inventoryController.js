const { Branch, Inventory, Product, Category, Supplier, StockMovement } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../db');

// Product Management
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, sku, description, category_id, price, image_url } = req.body;
    const product = await Product.create({ name, sku, description, category_id, price, image_url });
    
    // Automatically initialize inventory for all branches with 0 quantity
    const branches = await Branch.findAll();
    const inventoryData = branches.map(branch => ({
      product_id: product.id,
      branch_id: branch.id,
      quantity: 0
    }));
    await Inventory.bulkCreate(inventoryData);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const { product_id, branch_id, quantity, low_stock_threshold } = req.body;
    
    // Security Enforcement
    if (req.user.role === 'branch_admin' && parseInt(branch_id) !== req.user.branch_id) {
      return res.status(403).json({ message: 'Forbidden: You can only manage inventory for your assigned sector.' });
    }

    const inventory = await Inventory.findOne({ where: { product_id, branch_id } });
    if (!inventory) return res.status(404).json({ message: 'Inventory record not found for this sector.' });

    if (quantity !== undefined) inventory.quantity = quantity;
    if (low_stock_threshold !== undefined) inventory.low_stock_threshold = low_stock_threshold;
    
    await inventory.save();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getInventory = async (req, res) => {
  try {
    const { branch_id } = req.query;
    let where = {};
    // Logic: Branch managers and employees only see their assigned sector. Super Admins see everything unless filtered.
    if (req.user.role === 'branch_admin' || req.user.role === 'employee') {
      where.branch_id = req.user.branch_id;
    } else if (branch_id) {
      where.branch_id = branch_id;
    }

    const inventory = await Inventory.findAll({
      where,
      include: [
        { 
          model: Product,
          attributes: ['id', 'name', 'sku', 'price', 'last_purchase_price', 'description', 'category_id', 'supplier_id'],
          include: [{ model: Category }, { model: Supplier }]
        },
        { model: Branch }
      ]
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const restockInventory = async (req, res) => {
  try {
    const { product_id, branch_id, quantity, supplier_id, cost_price } = req.body;
    
    // Security Enforcement
    if (req.user.role === 'employee' || (req.user.role === 'branch_admin' && parseInt(branch_id) !== req.user.branch_id)) {
      return res.status(403).json({ message: 'Forbidden: You cannot perform procurement for this sector.' });
    }

    const inventory = await Inventory.findOne({ where: { product_id, branch_id } });
    if (!inventory) return res.status(404).json({ message: 'Inventory record not found.' });

    const previous_stock = inventory.quantity;
    const new_stock = previous_stock + parseInt(quantity);
    inventory.quantity = new_stock;
    await inventory.save();

    // Log the event
    await StockMovement.create({
      product_id,
      type: 'RESTOCK',
      quantity: parseInt(quantity),
      previous_stock,
      new_stock,
      user_id: req.user.id,
      supplier_id,
      note: 'Procurement processed'
    });

    // Update Product Cost/Supplier
    const product = await Product.findByPk(product_id);
    if (product) {
      if (supplier_id) product.supplier_id = supplier_id;
      if (cost_price) product.last_purchase_price = cost_price;
      await product.save();
    }

    res.json({ message: 'Restock processed successfully', new_stock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStockHistory = async (req, res) => {
  try {
    const { id } = req.params; // product_id
    const history = await StockMovement.findAll({
      where: { product_id: id },
      include: [
        { model: require('../models/User'), attributes: ['name', 'role'] },
        { model: Supplier, attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLowStock = async (req, res) => {
  try {
    const { branch_id } = req.query;
    let where = {};
    if (req.user.role === 'branch_admin' || req.user.role === 'employee') {
      where.branch_id = req.user.branch_id;
    } else if (branch_id) {
      where.branch_id = branch_id;
    }

    const inventory = await Inventory.findAll({
      where: {
        ...where,
        quantity: { [Op.lte]: sequelize.col('low_stock_threshold') }
      },
      include: [
        { 
          model: Product, 
          attributes: ['id', 'name', 'sku', 'price', 'last_purchase_price'],
          include: [{ model: Category }] 
        },
        { model: Branch }
      ]
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGlobalInventoryStatus = async (req, res) => {
  try {
    const isSuperAdmin = req.user.role === 'super_admin';
    const branches = await Branch.findAll(isSuperAdmin ? {} : { where: { id: req.user.branch_id } });
    const products = await Product.findAll({
      attributes: ['id', 'name', 'sku']
    });

    const status = [];
    for (const product of products) {
      const stockPerBranch = {};
      for (const branch of branches) {
        const inv = await Inventory.findOne({
          where: { product_id: product.id, branch_id: branch.id }
        });
        stockPerBranch[branch.name] = inv ? inv.quantity : 0;
      }
      status.push({
        id: product.id,
        name: product.name,
        sku: product.sku,
        stock: stockPerBranch
      });
    }

    res.json({
      branches: branches.map(b => b.name),
      data: status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductRestockAnalytics = async (req, res) => {
  try {
    const { product_id, branch_id } = req.query;
    const { Order, OrderItem } = require('../models');
    const { Op } = require('sequelize');

    // Get sales for the last 30 days
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 30);

    const sales = await OrderItem.findAll({
      where: { product_id },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('OrderItem.quantity')), 'total_sold']
      ],
      include: [{
        model: Order,
        attributes: [],
        where: {
          branch_id,
          createdAt: { [Op.gte]: dateLimit }
        }
      }],
      raw: true
    });

    const totalSold = parseInt(sales[0]?.total_sold || 0);
    const dailySales = parseFloat((totalSold / 30).toFixed(2));

    res.json({
      totalSold30Days: totalSold,
      dailySales,
      suggestedQuantity: Math.max(0, Math.ceil(dailySales * 14)) // 2 weeks of stock
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  getAllProducts, 
  createProduct, 
  updateStock, 
  getInventory, 
  getStockHistory, 
  getLowStock,
  getGlobalInventoryStatus,
  getProductRestockAnalytics
};
