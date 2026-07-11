import apiClient from '../api/client';
import { MockPaymentInput } from '../types';

export const createBooking = async (serviceId: number, dateTime: string, notes?: string) => {
  const { data } = await apiClient.post('/bookings', { serviceId, dateTime, notes });
  return data.data;
};

export const getMyBookings = async () => {
  const { data } = await apiClient.get('/bookings/my');
  return data.data;
};

export const getProviderBookings = async () => {
  const { data } = await apiClient.get('/bookings/provider');
  return data.data;
};

export const getPendingBookings = async () => {
  const { data } = await apiClient.get('/bookings/pending');
  return data.data;
};

export const updateBookingStatus = async (bookingId: number, status: string) => {
  const { data } = await apiClient.put(`/bookings/${bookingId}/status`, { status });
  return data.data;
};

export const rejectBooking = async (bookingId: number) => {
  const { data } = await apiClient.put(`/bookings/${bookingId}/reject`);
  return data.data;
};

export const completeService = async (bookingId: number) => {
  const { data } = await apiClient.put(`/bookings/${bookingId}/complete`);
  return data.data;
};

export const markWorkDone = completeService;

export const processMockPayment = async (bookingId: number, payment: MockPaymentInput) => {
  const { data } = await apiClient.post(`/bookings/${bookingId}/pay`, payment);
  return data.data;
};
