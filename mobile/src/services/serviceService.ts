import apiClient from '../api/client';

export const getServices = async (activeOnly: boolean = true) => {
  const { data } = await apiClient.get('/services', { params: { activeOnly } });
  return data.data;   // matches sendSuccess format
};

export const getServiceById = async (id: number) => {
  const { data } = await apiClient.get(`/services/${id}`);
  return data.data;
};