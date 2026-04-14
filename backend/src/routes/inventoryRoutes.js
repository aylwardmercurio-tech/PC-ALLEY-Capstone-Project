const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, updateStock, getInventory } = require('../controllers/inventoryController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/products', authenticateToken, getAllProducts);
router.post('/products', authenticateToken, authorizeRoles('super_admin', 'branch_admin'), createProduct);
router.get('/', authenticateToken, authorizeRoles('super_admin', 'branch_admin'), getInventory);
router.patch('/stock', authenticateToken, authorizeRoles('super_admin', 'branch_admin'), updateStock);

module.exports = router;
