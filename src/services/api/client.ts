import axios from 'axios';

/**
 * Feature flag to switch between mock data and real API.
 * Set to `true` when the .NET backend is ready.
 */
export const USE_API = false;

/**
 * Axios instance pre-configured for the .NET backend.
 * Base URL can be overridden via EXPO_PUBLIC_API_URL environment variable.
 */
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth interceptor — uncomment when authentication is implemented
// apiClient.interceptors.request.use(async (config) => {
//   const token = await SecureStore.getItemAsync('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// Response interceptor for common error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized — redirect to login
//     }
//     return Promise.reject(error);
//   }
// );
