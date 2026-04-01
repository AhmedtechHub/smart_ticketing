const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middlewares/auth');
const checkRole = require('../middlewares/role');
const upload = require('../middlewares/upload');

router.use(authenticate, checkRole(['ADMIN']));

// Analytics
router.get('/analytics', adminController.getAnalytics);

// User Management
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Event Management
router.get('/events', adminController.getAllEvents);
router.post('/events', upload.single('image'), adminController.createEvent);
router.put('/events/:id/status', adminController.updateEventStatus);
router.put('/events/:id/reschedule', adminController.rescheduleEvent);
router.delete('/events/:id', adminController.deleteEvent);

// Payments & Tickets
router.get('/payments', adminController.getAllPayments);
router.get('/tickets', adminController.getAllTickets);
router.post('/tickets', adminController.createTicket);
router.post('/tickets/issue', adminController.issueTicket);

// Communications
router.post('/broadcast', adminController.broadcastEmail);

module.exports = router;
