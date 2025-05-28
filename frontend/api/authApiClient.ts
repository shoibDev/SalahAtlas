import axios from 'axios';
import { BASE_API_URL } from '@/constants/apiEndPoints';

/**
 * Axios instance for authentication API requests
 * This client doesn't include the auth token interceptor since auth endpoints
 * don't require authentication
 */
const authApiClient = axios.create({
  baseURL: `${BASE_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default authApiClient;