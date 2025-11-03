import axios from 'axios';
import { getSubdomain } from '../utils/subdomain';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add subdomain header and auth token
api.interceptors.request.use(
  (config) => {
    // Add subdomain header to all requests
    const subdomain = getSubdomain();
    config.headers['X-Subdomain'] = subdomain;

    // Add auth token if available
    // Check for both user and host tokens
    const userToken = localStorage.getItem('userToken');
    const hostToken = localStorage.getItem('hostToken');

    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    } else if (hostToken) {
      config.headers.Authorization = `Bearer ${hostToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors ONLY if we're NOT on a login/auth page
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' ||
                        currentPath === '/signup' ||
                        currentPath === '/verify-email' ||
                        currentPath.startsWith('/host/login');

      // Only auto-redirect if NOT on an auth page (user session expired)
      if (!isAuthPage) {
        // Clear tokens and redirect to login
        localStorage.removeItem('userToken');
        localStorage.removeItem('hostToken');

        // Determine if this is a host route
        if (currentPath.startsWith('/host')) {
          window.location.href = '/login'; // Redirect to login page
        } else {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;