import { api } from './apiConfig';

export interface BookingResponse {
  booking: {
    id: string;
    reference: string;
    amount: string;
    status: string;
    gateway: string;
  };
  paymentData: any; // Contains Paystack URL or Mpesa response
}

export const bookingService = {
  initializeBooking: async (data: { 
    eventId: string; 
    ticketId: string; 
    gateway: 'Paystack' | 'Mpesa';
    phone?: string; // Required for Mpesa STK Push
  }) => {
    const response = await api.post<BookingResponse>('/api/attendee/bookings', data);
    return response.data;
  },

  // Helpers for checking status if needed
  getBookingStatus: async (reference: string) => {
    const response = await api.get(`/api/attendee/bookings/${reference}/status`);
    return response.data;
  }
};
