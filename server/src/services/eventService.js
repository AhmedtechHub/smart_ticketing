const prisma = require('../configs/db');

const eventService = {
  createEvent: async (userId, data) => {
    return await prisma.event.create({
      data: {
        ...data,
        creatorId: userId,
        status: 'PENDING', // Default to pending as per requirement
      },
    });
  },

  getAllEvents: async (filters = {}) => {
    return await prisma.event.findMany({
      where: {
        status: 'APPROVED',
        ...filters,
      },
      include: {
        creator: {
          select: { name: true, email: true },
        },
        tickets: true,
      },
    });
  },

  getEventById: async (id) => {
    return await prisma.event.findUnique({
      where: { id },
      include: {
        creator: { select: { name: true, email: true } },
        tickets: true,
      },
    });
  },

  updateEventStatus: async (id, status) => {
    return await prisma.event.update({
      where: { id },
      data: { status },
    });
  },

  getPlannerEvents: async (plannerId) => {
    return await prisma.event.findMany({
      where: { creatorId: plannerId },
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    });
  },

  getEventAttendees: async (eventId) => {
    return await prisma.booking.findMany({
      where: { eventId, status: 'SUCCESSFUL' },
      include: {
        attendee: {
          select: { name: true, email: true }
        }
      }
    });
  }
};

module.exports = eventService;
