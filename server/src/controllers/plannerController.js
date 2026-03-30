const prisma = require('../configs/db');

const plannerController = {
  createEvent: async (req, res) => {
    try {
      const { title, description, date, location } = req.body;
      const creatorId = req.user.id;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      const event = await prisma.event.create({
        data: {
          title,
          description,
          date: new Date(date),
          location,
          creatorId,
          image,
          status: 'PENDING'
        }
      });

      res.status(201).json({ message: 'Event created and pending approval', event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  createTicket: async (req, res) => {
    try {
      const { eventId, type, price, quantity } = req.body;
      const userId = req.user.id;

      // Ensure the planner owns the event
      const event = await prisma.event.findFirst({
        where: { id: eventId, creatorId: userId }
      });

      if (!event) {
        return res.status(403).json({ message: 'Unauthorized to add tickets for this event' });
      }

      const ticket = await prisma.ticket.create({
        data: {
          eventId,
          type,
          price: parseFloat(price),
          quantity: parseInt(quantity, 10),
          sold: 0
        }
      });

      res.status(201).json({ message: 'Ticket category added successfully', ticket });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  getMyEvents: async (req, res) => {
    try {
      const events = await prisma.event.findMany({
        where: { creatorId: req.user.id },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { bookings: true } },
          tickets: true
        }
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getEventAttendees: async (req, res) => {
    try {
      const { eventId } = req.params;
      const attendees = await prisma.booking.findMany({
        where: { eventId, status: 'SUCCESSFUL' },
        include: {
          attendee: { select: { id: true, name: true, email: true } },
          ticket: { select: { type: true } }
        }
      });
      res.json(attendees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateEventStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.id;

      const event = await prisma.event.findFirst({
        where: { id, creatorId: userId }
      });

      if (!event) {
        return res.status(403).json({ message: 'Unauthorized to update this event' });
      }

      const updated = await prisma.event.update({
        where: { id },
        data: { status }
      });

      res.json(updated);
    } catch (error) {
       res.status(500).json({ error: error.message });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const event = await prisma.event.findFirst({
        where: { id, creatorId: userId }
      });

      if (!event) {
        return res.status(403).json({ message: 'Unauthorized to delete this event' });
      }

      await prisma.event.delete({ where: { id } });
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = plannerController;
