const express = require('express');
const router = express.Router();
const attendeeController = require('../controllers/attendeeController');
const authenticate = require('../middlewares/auth');

// Public routes
router.get('/events', attendeeController.getPublicEvents);
router.get('/events/:id', attendeeController.getEventDetails);
router.post('/quotes', attendeeController.submitQuote);

// Protected routes
router.post('/bookings', authenticate, attendeeController.initializeBooking);
router.get('/bookings/:id', authenticate, attendeeController.getBookingDetails);
router.get('/bookings/reference/:reference', attendeeController.getBookingByReference);

module.exports = router;
