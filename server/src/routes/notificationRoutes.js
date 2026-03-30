const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticate = require('../middlewares/auth');
const checkRole = require('../middlewares/role');

router.use(authenticate);

// User specific notifications
router.get('/', notificationController.getMyNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', notificationController.markAllAsRead);

// System Activities (Admin/Planner)
router.get('/activities', checkRole(['ADMIN', 'PLANNER']), notificationController.getRecentActivities);

// Broadcast (Admin Only)
router.post('/broadcast', checkRole(['ADMIN']), notificationController.broadcast);

module.exports = router;
