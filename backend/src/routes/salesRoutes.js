const express = require('express');
const router = express.Router();
const { createOrder, getSalesHistory } = require('../controllers/salesController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, createOrder);
router.get('/history', authenticateToken, getSalesHistory);

module.exports = router;
