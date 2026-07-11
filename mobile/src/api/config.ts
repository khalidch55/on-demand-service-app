import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  if (host && host !== 'localhost') {
    return `http://${host}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getBaseUrl();
