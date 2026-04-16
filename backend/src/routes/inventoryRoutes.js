const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { getAllProducts, createProduct, updateStock, getInventory } = require('../controllers/inventoryController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/products', authenticateToken, getAllProducts);

router.post('/products', [
  authenticateToken, 
  authorizeRoles('super_admin', 'branch_admin'),
  body('name').notEmpty().withMessage('Product designation is required'),
  body('sku').notEmpty().withMessage('SKU code required for tracking'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive numerical value'),
  validate,
  createProduct
]);

router.get('/', authenticateToken, authorizeRoles('super_admin', 'branch_admin', 'employee'), getInventory);

router.patch('/stock', [
  authenticateToken, 
  authorizeRoles('super_admin', 'branch_admin'),
  body('product_id').notEmpty().withMessage('Product reference required'),
  body('branch_id').notEmpty().withMessage('Sector target required'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity cannot be negative'),
  body('low_stock_threshold').optional().isInt({ min: 0 }).withMessage('Threshold must be positive'),
  validate,
  updateStock
]);

module.exports = router;
