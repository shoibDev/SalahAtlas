import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.0.35:8080/api', // Replace with your backend
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ3MzU4NDcwLCJleHAiOjE3NDc0NDQ4NzB9.mxldJfq09Ku9kcyfk8Bwzvf8gOJwu6fvPAAiYIqfZF0', // <-- Replace with your actual token
  },
});

export default apiClient;
