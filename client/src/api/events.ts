import { api } from './apiConfig';

export interface TicketType {
  id?: string;
  type: string;
  price: number;
  quantity: number;
  sold?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  status: 'PENDING' | 'APPROVED' | 'ARCHIVED';
  creatorId: string;
  creator?: {
    name: string;
    email: string;
  };
  tickets?: TicketType[];
  bookings?: any[];
  _count?: {
    bookings: number;
  };
}

export const eventService = {
  // Public / Attendee
  getPublicEvents: async (params?: any) => {
    const response = await api.get<Event[]>('/api/attendee/events', { params });
    return response.data;
  },

  getEventDetails: async (id: string) => {
    const response = await api.get<Event>(`/api/attendee/events/${id}`);
    return response.data;
  },

  initializeBooking: async (bookingData: { eventId: string, ticketId: string, gateway: string, phone?: string, quantity: number }) => {
    const response = await api.post('/api/attendee/bookings', bookingData);
    return response.data;
  },

  getBookingDetails: async (id: string) => {
    const response = await api.get(`/api/attendee/bookings/${id}`);
    return response.data;
  },

  getBookingByReference: async (reference: string) => {
    const response = await api.get(`/api/attendee/bookings/reference/${reference}`);
    return response.data;
  },

  // Planner
  createEvent: async (formData: FormData) => {
    const response = await api.post('/api/planner/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  createTicket: async (ticketData: { eventId: string, type: string, price: number, quantity: number }) => {
    const response = await api.post('/api/planner/tickets', ticketData);
    return response.data;
  },

  getMyEvents: async () => {
    const response = await api.get<Event[]>('/api/planner/my-events');
    return response.data;
  },

  getEventAttendees: async (eventId: string) => {
    const response = await api.get(`/api/planner/events/${eventId}/attendees`);
    return response.data;
  },

  updateMyEventStatus: async (id: string, status: string) => {
    const response = await api.put(`/api/planner/events/${id}/status`, { status });
    return response.data;
  },

  deleteMyEvent: async (id: string) => {
    const response = await api.delete(`/api/planner/events/${id}`);
    return response.data;
  },

  // Admin
  updateEventStatus: async (id: string, status: 'APPROVED' | 'ARCHIVED') => {
    const response = await api.put(`/api/admin/events/${id}/status`, { status });
    return response.data;
  },
};
