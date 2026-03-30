const prisma = require('../configs/db');
const { sendEmail } = require('../services/emailService');

const notificationController = {
  // Get notifications for the logged-in user
  getMyNotifications: async (req, res) => {
    try {
      const notifications = await prisma.notification.findMany({
        where: { recipientId: req.user.id },
        orderBy: { createdAt: 'desc' },
        take: 20
      });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mark a notification as read
  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.notification.update({
        where: { id, recipientId: req.user.id },
        data: { isRead: true }
      });
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mark all as read
  markAllAsRead: async (req, res) => {
    try {
      await prisma.notification.updateMany({
        where: { recipientId: req.user.id, isRead: false },
        data: { isRead: true }
      });
      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Broadcast Notification (Admin Only)
  broadcast: async (req, res) => {
    try {
      const { title, message, role, sendEmail: shouldSendEmail } = req.body;
      
      const filter = role ? { role } : {};
      const users = await prisma.user.findMany({
        where: filter,
        select: { id: true, email: true, name: true }
      });

      // Create in-app notifications
      const notificationData = users.map(user => ({
        recipientId: user.id,
        title,
        message,
        type: 'IN_APP'
      }));

      await prisma.notification.createMany({
        data: notificationData
      });

      // Optional: Send Emails
      if (shouldSendEmail) {
        users.forEach(user => {
            sendEmail({
                to: user.email,
                subject: title,
                title: title,
                htmlContent: `<p>Hello ${user.name || 'there'},</p><p>${message}</p>`,
                buttonText: "Go to Dashboard",
                buttonUrl: `${process.env.CLIENT_URL}/`
            }).catch(err => console.error(`Failed to send broadcast email to ${user.email}:`, err));
        });
      }

      res.json({ message: `Broadcast sent to ${users.length} users` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get Recent System Activities (Admin/Planner context)
  getRecentActivities: async (req, res) => {
    try {
      // Fetch latest bookings
      const bookings = await prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          attendee: { select: { name: true, email: true } },
          event: { select: { title: true } }
        }
      });

      // Fetch latest events
      const events = await prisma.event.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: { select: { name: true } }
        }
      });

      // Combine and format
      const activities = [
        ...bookings.map(b => ({
          id: b.id,
          type: 'booking',
          title: 'New Booking',
          description: `${b.attendee.name || b.attendee.email} secured a ticket for ${b.event.title}`,
          time: b.createdAt,
          amount: b.amount,
          status: b.status
        })),
        ...events.map(e => ({
          id: e.id,
          type: 'event',
          title: 'New Event Created',
          description: `${e.creator.name} published "${e.title}"`,
          time: e.createdAt,
          status: e.status
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time));

      res.json(activities.slice(0, 10));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = notificationController;
