const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { createOrder, getSalesHistory, getComparativeSales, getSalesTrends, getProductPerformance } = require('../controllers/salesController');
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', [
  authenticateToken,
  upload.single('proof_of_payment'),
  body('customer_name').notEmpty().withMessage('Designate a target customer entity'),
  body('items').customSanitizer(value => {
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch(e) { return []; }
    }
    return value;
  }).isArray({ min: 1 }).withMessage('At least one matrix asset must be included in the manifest'),
  body('items.*.product_id').notEmpty().withMessage('Valid asset hash required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Volume must be at least 1 unit'),
  body('payment_method').isIn(['cash', 'card', 'transfer', 'gcash', 'bank_transfer']).withMessage('Invalid payment protocol selection'),
  validate,
  createOrder
]);

router.get('/history', authenticateToken, getSalesHistory);
router.get('/comparative', authenticateToken, getComparativeSales);
router.get('/trends', authenticateToken, getSalesTrends);
router.get('/performance', authenticateToken, getProductPerformance);

module.exports = router;
