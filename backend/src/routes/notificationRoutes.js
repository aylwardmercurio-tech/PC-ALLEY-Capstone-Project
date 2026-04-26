const express = require('express');
const router = express.Router();
const { getNotifications, markRead, markAllRead, clearAll } = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', getNotifications);
router.patch('/:id/read', markRead);
router.patch('/read-all', markAllRead);
router.delete('/clear-all', clearAll);

module.exports = router;
