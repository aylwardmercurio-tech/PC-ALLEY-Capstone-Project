const sequelize = require('../db');
const { Order, OrderItem, Product, Inventory, Category, StockMovement } = require('../models');

const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { customer_name, items, payment_method } = req.body;
    const branch_id = req.user.branch_id; // Taken from JWT
    const user_id = req.user.id;

    let total_amount = 0;

    // Handle proof of payment upload
    let proof_of_payment_url = null;
    if (req.file) {
      proof_of_payment_url = `/uploads/${req.file.filename}`;
    }

    // Create the Order first
    const order = await Order.create({
      branch_id,
      user_id,
      customer_name,
      total_amount: 0, // Update after calculating items
      payment_method,
      status: 'completed',
      proof_of_payment_url
    }, { transaction });

    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) throw new Error(`Product ${item.product_id} not found`);

      // Check Inventory
      const inventory = await Inventory.findOne({ 
        where: { product_id: product.id, branch_id } 
      });
      if (!inventory || inventory.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      // Record Order Item with historical price
      await OrderItem.create({
        order_id: order.id,
        product_id: product.id,
        quantity: item.quantity,
        price_at_sale: product.price // HISTORICAL PRICE PRESERVATION
      }, { transaction });

      // Update Inventory
      const previous_stock = inventory.quantity;
      inventory.quantity -= item.quantity;
      await inventory.save({ transaction });

      // Log StockMovement
      await StockMovement.create({
        product_id: product.id,
        type: 'SALE',
        quantity: -item.quantity,
        previous_stock,
        new_stock: inventory.quantity,
        user_id,
        note: `Sale processed: Order checkout`
      }, { transaction });

      total_amount += product.price * item.quantity;
    }

    order.total_amount = total_amount;
    await order.save({ transaction });

    await transaction.commit();
    res.status(201).json(order);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

const getSalesHistory = async (req, res) => {
  try {
    const { branch_id, days } = req.user.role === 'super_admin' ? req.query : { branch_id: req.user.branch_id, days: req.query.days };
    const whereClause = branch_id ? { branch_id } : {};
    
    if (days) {
      const { Op } = require('sequelize');
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - parseInt(days));
      whereClause.createdAt = { [Op.gte]: dateLimit };
    }
    
    const orders = await Order.findAll({
      where: whereClause,
      include: [{ 
        model: OrderItem, 
        include: [{
          model: Product,
          include: [Category]
        }] 
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getComparativeSales = async (req, res) => {
  try {
    const userRole = (req.user?.role || '').toLowerCase();
    if (userRole !== 'super_admin') {
      console.warn(`[AUTH] Comparative Matrix Access Rejected: User '${req.user?.username}' with role '${userRole}' is not a Super Admin.`);
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { Branch, Inventory } = require('../models');
    const branches = await Branch.findAll();
    const results = [];

    for (const branch of branches) {
      const orders = await Order.findAll({ where: { branch_id: branch.id } });
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
      const orderCount = orders.length;

      const inventory = await Inventory.findAll({ where: { branch_id: branch.id } });
      const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);

      // Get top product for this branch
      const topProduct = await OrderItem.findOne({
        attributes: [
          'product_id',
          [sequelize.fn('SUM', sequelize.col('OrderItem.quantity')), 'total_sold']
        ],
        include: [
          {
            model: Product,
            attributes: ['name']
          },
          {
            model: Order,
            attributes: [],
            where: { branch_id: branch.id }
          }
        ],
        group: ['product_id', 'Product.id'],
        order: [[sequelize.literal('total_sold'), 'DESC']],
      });

      results.push({
        branch_name: branch.name,
        branch_id: branch.id,
        total_revenue: totalRevenue,
        order_count: orderCount,
        total_stock: totalStock,
        top_product: topProduct ? topProduct.Product.name : 'N/A'
      });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalesTrends = async (req, res) => {
  try {
    const { branch_id, days } = req.user.role === 'super_admin' ? req.query : { branch_id: req.user.branch_id, days: req.query.days };
    const where = branch_id ? { branch_id } : {};
    
    if (days) {
      const { Op } = require('sequelize');
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - parseInt(days));
      where.createdAt = { [Op.gte]: dateLimit };
    }
    
    // Aggregate sales by day for the last 30 days
    const stats = await Order.findAll({
      where,
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
      limit: 30
    });
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductPerformance = async (req, res) => {
  try {
    const { branch_id, days } = req.user.role === 'super_admin' ? req.query : { branch_id: req.user.branch_id, days: req.query.days };
    const orderWhere = branch_id ? { branch_id } : {};

    if (days) {
      const { Op } = require('sequelize');
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - parseInt(days));
      orderWhere.createdAt = { [Op.gte]: dateLimit };
    }

    const stats = await OrderItem.findAll({
      attributes: [
        'product_id',
        [sequelize.fn('SUM', sequelize.col('OrderItem.quantity')), 'total_sold'],
        [sequelize.literal('SUM(OrderItem.quantity * price_at_sale)'), 'total_revenue']
      ],
      include: [
        {
          model: Product,
          attributes: ['name', 'sku']
        },
        {
          model: Order,
          attributes: [],
          where: orderWhere
        }
      ],
      group: ['product_id', 'Product.id'],
      order: [[sequelize.literal('total_sold'), 'DESC']],
      limit: 10
    });
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createOrder, getSalesHistory, getComparativeSales, getSalesTrends, getProductPerformance };
