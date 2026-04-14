const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getProducts);

module.exports = router;
