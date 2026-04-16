const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { createOrder, getSalesHistory } = require('../controllers/salesController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', [
  authenticateToken,
  body('customer_name').notEmpty().withMessage('Designate a target customer entity'),
  body('items').isArray({ min: 1 }).withMessage('At least one matrix asset must be included in the manifest'),
  body('items.*.product_id').notEmpty().withMessage('Valid asset hash required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Volume must be at least 1 unit'),
  body('payment_method').isIn(['cash', 'card', 'transfer']).withMessage('Invalid payment protocol selection'),
  validate,
  createOrder
]);

router.get('/history', authenticateToken, getSalesHistory);

module.exports = router;
