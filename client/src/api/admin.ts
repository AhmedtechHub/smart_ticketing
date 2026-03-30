import { api } from './apiConfig';

export interface SystemAnalytics {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
}

export const adminService = {
  getAnalytics: async () => {
    const response = await api.get<SystemAnalytics>('/api/admin/analytics');
    return response.data;
  },

  broadcastEmail: async (data: { subject: string; message: string }) => {
    const response = await api.post('/api/admin/broadcast', data);
    return response.data;
  }
};
