import apiClient from '../api/client';

export interface AvailabilitySlot {
  id: number;
  providerId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export const getMyAvailability = async (): Promise<AvailabilitySlot[]> => {
  const { data } = await apiClient.get('/availability/my');
  return data.data;
};

export const addAvailability = async (dayOfWeek: number, startTime: string, endTime: string) => {
  const { data } = await apiClient.post('/availability', { dayOfWeek, startTime, endTime });
  return data.data;
};

export const deleteAvailability = async (id: number) => {
  const { data } = await apiClient.delete(`/availability/${id}`);
  return data.data;
};
