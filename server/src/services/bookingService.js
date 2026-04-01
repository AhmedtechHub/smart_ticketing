const prisma = require('../configs/db');
const { generateTicketPNG } = require('../utils/ticketGenerator');
const { sendEmail } = require('./emailService');
const path = require('path');

const bookingService = {
  createPendingBooking: async (data) => {
    return await prisma.booking.create({
      data: {
        ...data,
        status: 'PENDING',
      },
    });
  },

  finalizeBooking: async (reference) => {
    const booking = await prisma.booking.findUnique({
      where: { reference },
      include: {
        attendee: true,
        event: true,
        ticket: true,
      },
    });

    if (!booking || booking.status === 'SUCCESSFUL') return booking;

    // Generate Ticket PNG
    const ticketUrl = await generateTicketPNG({
      reference: booking.reference,
      eventTitle: booking.event.title,
      eventDate: booking.event.date,
      attendeeName: booking.attendee.name || booking.attendee.email,
      ticketType: booking.ticket.type,
      attendeeId: booking.attendeeId,
      eventId: booking.eventId
    });

    // Update Booking
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: 'SUCCESSFUL',
        qrCode: ticketUrl,
      },
    });

    // Update Ticket Availability
    await prisma.ticket.update({
      where: { id: booking.ticketId },
      data: { sold: { increment: booking.quantity } }
    });

    // Create In-App Notification
    await prisma.notification.create({
      data: {
        recipientId: booking.attendeeId,
        type: 'IN_APP',
        title: 'Ticket Purchase Confirmed',
        message: `Your ticket for ${booking.event.title} (${booking.ticket.type}) has been successfully issued.`
      }
    });

    // Send Confirmation Email with Ticket (Graceful failure)
    try {
      await sendEmail({
        to: booking.attendee.email,
        subject: `Your Ticket for ${booking.event.title}`,
        title: "Booking Confirmed!",
        htmlContent: `<p>Hello <b>${booking.attendee.name || 'there'}</b>,</p><p>Your booking for <b>${booking.event.title}</b> is confirmed. Download your ticket below.</p>`,
        buttonText: "View Event Details",
        buttonUrl: `${process.env.CLIENT_URL}/events/${booking.eventId}`,
        attachments: [
          {
            filename: `Ticket_${booking.reference}.png`,
            path: path.join(__dirname, '../../public', ticketUrl)
          }
        ]
      });
    } catch (mailErr) {
      console.error("Booking Confirmation Email Error:", mailErr.message);
    }

    return updatedBooking;
  }
};

module.exports = bookingService;
