import apiClient from '../api/client';

export const loginUser = async (email: string, password: string) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data.data; // { user, token }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  phone?: string,
  role?: 'customer' | 'provider',
) => {
  const { data } = await apiClient.post('/auth/register', { name, email, password, phone, role });
  return data.data;
};

export const logoutUser = async () => {
  const { data } = await apiClient.post('/auth/logout');
  return data.data;
};