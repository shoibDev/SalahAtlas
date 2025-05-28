import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { BASE_API_URL } from '@/constants/apiEndPoints';

/**
 * Axios instance for API requests
 */
const apiClient = axios.create({
  baseURL: `${BASE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
    async (config) => {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

export default apiClient;
