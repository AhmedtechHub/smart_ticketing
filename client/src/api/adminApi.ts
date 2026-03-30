import { api } from "./apiConfig";

export interface AdminAnalytics {
  totalUsers: number;
  activePlanners: number;
  totalEvents: number;
  pendingEvents: number;
  successfulBookings: number;
  totalTickets: number;
  totalRevenue: number;
}

export const adminApi = {
  // ── Analytics ───────────────────────────────────────────────────
  getAnalytics: async () => {
    const response = await api.get<AdminAnalytics>('/api/admin/analytics');
    return response.data;
  },

  // ── User Management ──────────────────────────────────────────────
  getUsers: async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },

  createUser: async (userData: any) => {
    const response = await api.post('/api/admin/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: any) => {
    const response = await api.put(`/api/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
  },

  // ── Event Management ─────────────────────────────────────────────
  getEvents: async () => {
    const response = await api.get('/api/admin/events');
    return response.data;
  },

  createEvent: async (eventData: any) => {
    const response = await api.post('/api/admin/events', eventData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  updateEventStatus: async (id: string, status: 'APPROVED' | 'ARCHIVED' | 'PENDING') => {
    const response = await api.put(`/api/admin/events/${id}/status`, { status });
    return response.data;
  },

  rescheduleEvent: async (id: string, date: string) => {
    const response = await api.put(`/api/admin/events/${id}/reschedule`, { date });
    return response.data;
  },

  deleteEvent: async (id: string) => {
    const response = await api.delete(`/api/admin/events/${id}`);
    return response.data;
  },

  // ── Payments & Finance ──────────────────────────────────────────
  getPayments: async () => {
    const response = await api.get('/api/admin/payments');
    return response.data;
  },

  getAllTickets: async () => {
    const response = await api.get('/api/admin/tickets');
    return response.data;
  },

  createTicket: async (ticketData: { type: string, price: number, quantity: number, eventId: string }) => {
    const response = await api.post('/api/admin/tickets', ticketData);
    return response.data;
  },

  // ── Communications ──────────────────────────────────────────────
  broadcastEmail: async (data: { subject: string, message: string, recipientRole?: string }) => {
    const response = await api.post('/api/admin/broadcast', data);
    return response.data;
  }
};
