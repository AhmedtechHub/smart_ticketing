import { api } from './apiConfig';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'IN_APP' | 'EMAIL';
  isRead: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'booking' | 'event';
  title: string;
  description: string;
  time: string;
  amount?: number;
  status: string;
}

export const notificationService = {
  getMyNotifications: async () => {
    const response = await api.get<Notification[]>('/api/notifications');
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.put(`/api/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/api/notifications/read-all');
    return response.data;
  },

  getRecentActivities: async () => {
    const response = await api.get<Activity[]>('/api/notifications/activities');
    return response.data;
  },

  broadcast: async (data: { title: string; message: string; role?: string; sendEmail?: boolean }) => {
    const response = await api.post('/api/notifications/broadcast', data);
    return response.data;
  }
};
