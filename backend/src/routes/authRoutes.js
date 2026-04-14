const express = require('express');
const router = express.Router();
const { register, login, getUsers } = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', authenticateToken, authorizeRoles('super_admin', 'branch_admin'), register); 
router.post('/login', login);
router.get('/users', authenticateToken, authorizeRoles('super_admin', 'branch_admin'), getUsers);

module.exports = router;
