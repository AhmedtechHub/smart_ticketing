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

  issueTicket: async (req, res) => {
    try {
      const { eventId, ticketId, attendeeName, attendeeEmail, image } = req.body;
      
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

      if (!event || !ticket) return res.status(404).json({ error: "Record not found" });
      if (ticket.quantity <= ticket.sold) {
        return res.status(400).json({ error: "Ticket category is out of stock" });
      }

      // Check user, or create unverified attendee
      let user = await prisma.user.findUnique({ where: { email: attendeeEmail } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: attendeeEmail,
            name: attendeeName,
            role: 'ATTENDEE'
          }
        });
      }

      // Process image (base64)
      const fs = require('fs');
      const path = require('path');
      const base64Data = image.replace(/^data:image\/png;base64,/, "");
      const fileName = `ticket-${Date.now()}-${ticketId}.png`;
      // Ensure 'uploads' directory is correct 
      // The server is normally at server/ and uploads is likely at server/public/uploads
      const uploadsDir = path.join(__dirname, '../../public/uploads');
      if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, fileName);
      
      fs.writeFileSync(filePath, base64Data, 'base64');
      const qrCodeUrl = `/uploads/${fileName}`;

      // Update catalog and create booking transaction
      const booking = await prisma.$transaction(async (tx) => {
        // deduct inventory (we increase sold, quantity represents total)
        await tx.ticket.update({
          where: { id: ticketId },
          data: {
            sold: { increment: 1 }
          }
        });

        const reference = `SYS-GEN-${Date.now()}`;
        return await tx.booking.create({
          data: {
            reference,
            amount: ticket.price,
            quantity: 1,
            status: 'SUCCESSFUL',
            gateway: 'OFFLINE_GENERATION',
            qrCode: qrCodeUrl,
            attendeeId: user.id,
            eventId,
            ticketId
          }
        });
      });

      // Send email (Graceful failure)
      try {
        await sendEmail({
          to: attendeeEmail,
          subject: `Digital Ticket: ${event.title}`,
          title: "Your Ticket is Ready!",
          htmlContent: `
            <div style="font-family: sans-serif; padding: 10px; color: #333;">
              <p>Hello <strong>${attendeeName}</strong>,</p>
              <p>Your digital pass for <strong>${event.title}</strong> has been successfully generated and issued by the administration.</p>
              <p>Please find your official ticket attached to this email. You can present this at the venue for scanning.</p>
              <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6d28d9;">
                <p style="margin: 0; font-size: 14px;"><strong>Event:</strong> ${event.title}</p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Location:</strong> ${event.location}</p>
                <p style="margin: 0; font-size: 14px;"><strong>Tier:</strong> ${ticket.type}</p>
              </div>
              <p>We look forward to seeing you there!</p>
            </div>`,
          attachments: [
            {
              filename: `Ticket_${event.title.replace(/\s+/g, '_')}.png`,
              path: filePath
            }
          ]
        });
      } catch (mailErr) {
        console.error("Delayed Email Dispatch Error:", mailErr.message);
      }

      res.status(200).json({ message: "Ticket issued successfully", booking });
    } catch (error) {
       console.error(error);
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
          title: "Official Announcement",
          htmlContent: `<div style="font-family: sans-serif; padding: 10px; color: #333;">
                  <p>${message}</p>
                </div>`
        }).catch(err => console.error(`Broadcast failed for ${user.email}:`, err.message))
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
