const { RestockRequest, Product, Inventory, User, Branch, Notification, StockMovement } = require('../models');

const createRequest = async (req, res) => {
  try {
    const { product_id, quantity, notes, cost_price, supplier_id, branch_id: body_branch_id } = req.body;
    const branch_id = body_branch_id || req.user.branch_id;

    if (!branch_id) {
      return res.status(400).json({ message: 'User must be assigned to a branch to make restock requests.' });
    }

    const request = await RestockRequest.create({
      product_id,
      branch_id,
      manager_id: req.user.id,
      quantity,
      cost_price,
      supplier_id,
      notes,
      status: 'Pending'
    });

    // Notify all Super Admins
    const admins = await User.findAll({ where: { role: 'super_admin' } });
    const product = await Product.findByPk(product_id);
    const branch = await Branch.findByPk(branch_id);

    const notifications = admins.map(admin => ({
      user_id: admin.id,
      title: 'New Restock Request',
      message: `${req.user.username} (Manager) has requested ${quantity} units of ${product.name} for ${branch.name}.`,
      type: 'restock_request',
      link: `/admin?tab=restock&id=${request.id}`
    }));

    await Notification.bulkCreate(notifications);

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listRequests = async (req, res) => {
  try {
    let where = {};
    if (req.user.role === 'branch_admin' || req.user.role === 'employee') {
      where.branch_id = req.user.branch_id;
    }

    const requests = await RestockRequest.findAll({
      where,
      include: [
        { model: Product, attributes: ['name', 'sku'] },
        { model: Branch, attributes: ['name'] },
        { model: User, as: 'Manager', attributes: ['username'] },
        { model: User, as: 'Admin', attributes: ['username'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await RestockRequest.findByPk(id, {
      include: [Product, Branch]
    });

    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.status !== 'Pending') return res.status(400).json({ message: 'Request already processed.' });

    // Update inventory
    const inventory = await Inventory.findOne({ 
      where: { product_id: request.product_id, branch_id: request.branch_id } 
    });

    if (!inventory) return res.status(404).json({ message: 'Inventory record not found.' });

    const previous_stock = inventory.quantity;
    const new_stock = previous_stock + parseInt(request.quantity);
    inventory.quantity = new_stock;
    await inventory.save();

    // Log movement
    await StockMovement.create({
      product_id: request.product_id,
      type: 'RESTOCK',
      quantity: parseInt(request.quantity),
      previous_stock,
      new_stock,
      user_id: req.user.id,
      note: `Approved restock request #${request.id}`
    });

    // Update request
    request.status = 'Approved';
    request.admin_id = req.user.id;
    await request.save();

    // Notify Manager
    await Notification.create({
      user_id: request.manager_id,
      title: 'Restock Request Approved',
      message: `Your request for ${request.quantity} units of ${request.Product.name} has been approved.`,
      type: 'success',
      link: '/inventory'
    });

    res.json({ message: 'Request approved and inventory updated.', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const request = await RestockRequest.findByPk(id, {
      include: [Product]
    });

    if (!request) return res.status(404).json({ message: 'Request not found.' });
    if (request.status !== 'Pending') return res.status(400).json({ message: 'Request already processed.' });

    request.status = 'Rejected';
    request.admin_id = req.user.id;
    request.rejection_reason = reason;
    await request.save();

    // Notify Manager
    await Notification.create({
      user_id: request.manager_id,
      title: 'Restock Request Rejected',
      message: `Your request for ${request.Product.name} was rejected. Reason: ${reason || 'No reason provided.'}`,
      type: 'error',
      link: '/inventory'
    });

    res.json({ message: 'Request rejected.', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRequest,
  listRequests,
  approveRequest,
  rejectRequest
};
