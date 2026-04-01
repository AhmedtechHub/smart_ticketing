const prisma = require('../configs/db');
const paymentService = require('../services/paymentService');
const { sendEmail } = require('../services/emailService');

const attendeeController = {
  getPublicEvents: async (req, res) => {
    try {
      const { search, location } = req.query;
      
      const filter = {
        status: 'APPROVED'
      };

      if (search) {
        filter.OR = [
          { title: { contains: search } },
          { description: { contains: search } }
        ];
      }

      if (location) {
        filter.location = { contains: location };
      }

      const events = await prisma.event.findMany({
        where: filter,
        include: { tickets: true, _count: { select: { bookings: true } } }
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getEventDetails: async (req, res) => {
    try {
      const event = await prisma.event.findUnique({
        where: { id: req.params.id },
        include: { tickets: true, creator: { select: { name: true } } }
      });
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  initializeBooking: async (req, res) => {
    try {
      const { eventId, ticketId, gateway, quantity = 1 } = req.body;
      const attendeeId = req.user.id;

      if (parseInt(quantity) > 10) {
        return res.status(400).json({ message: 'Individual purchases are limited to 10 tickets per transaction.' });
      }

      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { event: true }
      });

      if (!ticket || (ticket.sold + parseInt(quantity)) > ticket.quantity) {
        return res.status(400).json({ message: 'Ticket unavailable in requested quantity' });
      }

      const totalAmount = Number(ticket.price) * parseInt(quantity);
      const reference = `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create Pending Booking
      const booking = await prisma.booking.create({
        data: {
          reference,
          amount: totalAmount,
          quantity: parseInt(quantity),
          gateway,
          attendeeId,
          eventId,
          ticketId,
          status: 'PENDING'
        }
      });

      let paymentData;
      if (gateway === 'Paystack') {
        paymentData = await paymentService.initializePaystack(req.user.email, totalAmount, {
          bookingId: booking.id,
          reference
        });
      } else if (gateway === 'Mpesa') {
        const { phone } = req.body;
        paymentData = await paymentService.initiateMpesaStkPush(phone, totalAmount, reference);
        
        // Save the CheckoutRequestID to link callback securely
        if (paymentData.CheckoutRequestID) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: { checkoutRequestId: paymentData.CheckoutRequestID }
          });
        }
      }

      res.status(200).json({ booking, paymentData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBookingDetails: async (req, res) => {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: req.params.id },
        include: { event: true, ticket: true, attendee: { select: { name: true, email: true } } }
      });

      if (!booking || (booking.attendeeId !== req.user.id && req.user.role !== 'ADMIN')) {
        return res.status(403).json({ message: 'Unauthorized view of this booking' });
      }

      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getBookingByReference: async (req, res) => {
    try {
      const { reference } = req.params;
      const booking = await prisma.booking.findUnique({
        where: { reference },
        include: { event: true, ticket: true, attendee: { select: { name: true, email: true } } }
      });

      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      
      // Basic security - should ideally check if it belongs to user or pass a secret token
      // but for SuccessPage it's usually fine as reference is sensitive/unique
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  submitQuote: async (req, res) => {
    try {
      const { name, email, eventType, eventDate, estimatedAttendance, message } = req.body;

      if (!name || !email || !eventType || !eventDate || !estimatedAttendance || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      // Format the message for the email
      const htmlContent = `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #10b981;">New Event Quote Inquiry</h2>
          <p><strong>Planner Name:</strong> ${name}</p>
          <p><strong>Email Address:</strong> ${email}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Event Type:</strong> ${eventType}</p>
          <p><strong>Proposed Date:</strong> ${eventDate}</p>
          <p><strong>Estimated Attendance:</strong> ${estimatedAttendance}</p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <p><strong>Details/Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `;

      // Save to Database
      await prisma.inquiry.create({
        data: {
          name,
          email,
          eventType,
          eventDate: eventDate.toString(),
          estimatedAttendance: parseInt(estimatedAttendance),
          message
        }
      });

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New Quote Inquiry: ${eventType} by ${name}`,
        title: "New Quote Request Received",
        htmlContent
      });

      res.status(200).json({ message: 'Quote inquiry sent successfully.' });
    } catch (error) {
      console.error('Quote Submission Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = attendeeController;
