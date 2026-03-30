const cron = require('node-cron');
const prisma = require('../configs/db');
const { sendEmail } = require('../services/emailService');

/**
 * Scheduled Reminder Job
 * Runs every day at 10:00 AM
 */
const startReminderJob = () => {
  cron.schedule('0 10 * * *', async () => {
    console.log('Running daily event reminders...');
    
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfter = new Date(tomorrow);
      dayAfter.setDate(dayAfter.getDate() + 1);

      // Find events happening tomorrow
      const upcomingEvents = await prisma.event.findMany({
        where: {
          date: {
            gte: tomorrow,
            lt: dayAfter
          },
          status: 'APPROVED'
        },
        include: {
          bookings: {
            where: { status: 'SUCCESSFUL' },
            include: { attendee: true }
          }
        }
      });

      for (const event of upcomingEvents) {
        for (const booking of event.bookings) {
          await sendEmail({
            to: booking.attendee.email,
            subject: `Reminder: ${event.title} is tomorrow!`,
            title: "Event Reminder",
            htmlContent: `<p>Hello <b>${booking.attendee.name || 'there'}</b>,</p><p>Get ready! The event <b>"${event.title}"</b> is happening tomorrow at <b>${event.location}</b>.</p>`,
            buttonText: "Event Location",
            buttonUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
          });
        }
      }
    } catch (error) {
      console.error('Reminder Job Error:', error);
    }
  });
};

module.exports = startReminderJob;
