const express = require('express');
const router = express.Router();
const { getProducts, createBundle } = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getProducts);
router.post('/bundles', authenticateToken, createBundle);

module.exports = router;
