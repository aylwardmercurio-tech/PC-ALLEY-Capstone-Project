const { Branch, Inventory, Product, Category } = require('../models');

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
    let { branch_id } = req.query;
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

module.exports = { getAllProducts, createProduct, updateStock, getInventory };
