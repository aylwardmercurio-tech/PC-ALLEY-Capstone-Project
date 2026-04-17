const sequelize = require('../db');
const { Order, OrderItem, Product, Inventory, Category } = require('../models');

const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { customer_name, items, payment_method } = req.body;
    const branch_id = req.user.branch_id; // Taken from JWT
    const user_id = req.user.id;

    let total_amount = 0;

    // Create the Order first
    const order = await Order.create({
      branch_id,
      user_id,
      customer_name,
      total_amount: 0, // Update after calculating items
      payment_method,
      status: 'completed'
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
      inventory.quantity -= item.quantity;
      await inventory.save({ transaction });

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
    const { branch_id } = req.user.role === 'super_admin' ? req.query : { branch_id: req.user.branch_id };
    const whereClause = branch_id ? { branch_id } : {};
    
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

module.exports = { createOrder, getSalesHistory };
