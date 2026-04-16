const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { register, login, getUsers } = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', [
  authenticateToken, 
  authorizeRoles('super_admin', 'branch_admin'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username or internal ID is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['super_admin', 'branch_admin', 'employee']).withMessage('Invalid role designation'),
  validate,
  register
]); 

router.post('/login', [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username or internal ID is required'),
  body('password').notEmpty().withMessage('Access key is required'),
  validate,
  login
]);

router.get('/users', authenticateToken, authorizeRoles('super_admin', 'branch_admin'), getUsers);

module.exports = router;
