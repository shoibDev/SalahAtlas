import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const apiClient = axios.create({
  baseURL: 'http://192.168.0.35:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to inject access token from SecureStore
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
