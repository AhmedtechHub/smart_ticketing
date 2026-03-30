const prisma = require('../configs/db');
const { sendEmail } = require('../services/emailService');

const adminController = {
  // ── USER MANAGEMENT ───────────────────────────────────────────
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { bookings: true, events: true } } }
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createUser: async (req, res) => {
    try {
      const { email, name, role, status } = req.body;
      const user = await prisma.user.create({
        data: { email, name, role: role || 'ATTENDEE' }
      });
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'A user with this email already exists.' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const user = await prisma.user.update({
        where: { id },
        data
      });
      res.json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.user.delete({ where: { id } });
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ── EVENT MANAGEMENT ───────────────────────────────────────────
  getAllEvents: async (req, res) => {
    try {
      const events = await prisma.event.findMany({
        include: { 
          creator: { select: { name: true, email: true } },
          _count: { select: { bookings: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createEvent: async (req, res) => {
    try {
      const { title, description, date, location, creatorId } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      
      const event = await prisma.event.create({
        data: {
          title,
          description,
          date: new Date(date),
          location,
          image: imageUrl,
          status: 'APPROVED', // Admin created events are approved by default
          creatorId: creatorId || req.user.id // Default to the admin creating it
        }
      });
      res.status(201).json({ message: 'Event created successfully', event });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateEventStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const event = await prisma.event.update({
        where: { id },
        data: { status },
        include: { creator: true }
      });

      // Notify the creator
      await prisma.notification.create({
        data: {
          recipientId: event.creatorId,
          type: 'IN_APP',
          title: `Event ${status.toLowerCase()}`,
          message: `Your event "${event.title}" has been ${status.toLowerCase()} by the administration.`
        }
      });

      res.json({ message: 'Event status updated successfully', event });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  rescheduleEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const { date } = req.body;
      const event = await prisma.event.update({
        where: { id },
        data: { date: new Date(date) }
      });
      res.json({ message: 'Event rescheduled successfully', event });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.event.delete({ where: { id } });
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ── PAYMENTS & TICKETS ───────────────────────────────────────────
  getAllPayments: async (req, res) => {
    try {
      const payments = await prisma.booking.findMany({
        include: {
          attendee: { select: { name: true, email: true } },
          event: { select: { title: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllTickets: async (req, res) => {
    try {
      // Tickets are part of Bookings/Ticket models
      const tickets = await prisma.ticket.findMany({
        include: {
          event: { select: { title: true } }
        }
      });
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createTicket: async (req, res) => {
    try {
      const { type, price, quantity, eventId } = req.body;
      const ticket = await prisma.ticket.create({
        data: {
          type,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          eventId
        },
        include: { event: true }
      });
      res.status(201).json({ message: 'Ticket category created successfully', ticket });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAnalytics: async (req, res) => {
    try {
      const totalUsers = await prisma.user.count();
      const activePlanners = await prisma.user.count({ where: { role: 'PLANNER' } });
      const totalEvents = await prisma.event.count();
      const pendingEvents = await prisma.event.count({ where: { status: 'PENDING' } });
      const successfulBookings = await prisma.booking.count({ where: { status: 'SUCCESSFUL' } });
      
      const revenueData = await prisma.booking.aggregate({
        where: { status: 'SUCCESSFUL' },
        _sum: { amount: true }
      });

      const ticketStats = await prisma.ticket.aggregate({
        _sum: { sold: true }
      });

      res.json({
        totalUsers,
        activePlanners,
        totalEvents,
        pendingEvents,
        successfulBookings,
        totalTickets: ticketStats._sum.sold || 0,
        totalRevenue: revenueData._sum.amount || 0
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  broadcastEmail: async (req, res) => {
    try {
      const { subject, message, recipientRole } = req.body;
      const filter = recipientRole ? { role: recipientRole } : {};
      const users = await prisma.user.findMany({ 
        where: filter,
        select: { email: true } 
      });

      // In a real system, use a queue for broadcasting
      const sendPromises = users.map(user => 
        sendEmail({
          to: user.email,
          subject,
          text: message,
          html: `<div style="font-family: sans-serif; padding: 20px; color: #333;">
                  <h2 style="color: #6d28d9;">Internal Announcement</h2>
                  <p>${message}</p>
                </div>`
        })
      );

      await Promise.all(sendPromises);

      // Log notification in DB if necessary
      res.json({ message: `Broadcast sent to ${users.length} users` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = adminController;
