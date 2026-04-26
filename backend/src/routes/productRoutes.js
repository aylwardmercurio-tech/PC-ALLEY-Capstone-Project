const express = require('express');
const router = express.Router();
const { getProducts, createBundle, updateProduct } = require('../controllers/productController');
const { deleteProduct } = require('../controllers/inventoryController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getProducts);
router.post('/bundles', authenticateToken, createBundle);
router.patch('/:id', authenticateToken, authorizeRoles('super_admin'), updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('super_admin'), deleteProduct);

module.exports = router;
