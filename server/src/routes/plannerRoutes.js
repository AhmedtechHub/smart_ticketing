const express = require('express');
const router = express.Router();
const plannerController = require('../controllers/plannerController');
const authenticate = require('../middlewares/auth');
const checkRole = require('../middlewares/role');
const upload = require('../middlewares/upload');

router.use(authenticate, checkRole(['PLANNER', 'ADMIN']));

router.post('/events', upload.single('image'), plannerController.createEvent);
router.get('/my-events', plannerController.getMyEvents);
router.get('/events/:eventId/attendees', plannerController.getEventAttendees);
router.put('/events/:id/status', plannerController.updateEventStatus);
router.delete('/events/:id', plannerController.deleteEvent);

// Ticket Management (Separate)
router.post('/tickets', plannerController.createTicket);

module.exports = router;
