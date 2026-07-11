import apiClient from '../api/client';

export const updateProfile = async (userData: { name?: string; phone?: string }) => {
  const { data } = await apiClient.put('/auth/me', userData);
  return data.data;
};