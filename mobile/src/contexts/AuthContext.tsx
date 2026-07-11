import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { User, AuthState } from '../types';
import { loginUser, registerUser, logoutUser } from '../services/authService';
import apiClient from '../api/client';

export const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const profile = await fetchUserProfile();
    setUser(profile);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          const userData = await fetchUserProfile();
          setUser(userData);
        }
      } catch {
        await AsyncStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await loginUser(email, password);
    await AsyncStorage.setItem('token', token);
    setUser(user);
    setToken(token);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string,
    role: 'customer' | 'provider' = 'customer',
  ) => {
    const { user, token } = await registerUser(name, email, password, phone, role);
    await AsyncStorage.setItem('token', token);
    setUser(user);
    setToken(token);
  };

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Still clear local session if the API call fails (e.g. expired token)
    } finally {
      await AsyncStorage.removeItem('token');
      setUser(null);
      setToken(null);
      queryClient.clear();
    }
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

const fetchUserProfile = async (): Promise<User> => {
  const { data } = await apiClient.get('/auth/me');
  return data.data;
};
