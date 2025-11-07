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
    console.log('API Request:', config.method?.toUpperCase(), config.url, 'X-Subdomain:', subdomain);

    // Add auth token based on the route being accessed
    // Host routes (/api/host/*) use hostToken, everything else uses userToken
    const isHostRoute = config.url?.includes('/api/host/');
    const token = isHostRoute
      ? localStorage.getItem('hostToken')
      : localStorage.getItem('userToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    // Handle 403 Forbidden errors on protected routes
    if (error.response?.status === 403) {
      const requestUrl = error.config?.url || '';

      // Check if this is a protected route (host or user routes)
      const isProtectedRoute = requestUrl.includes('/api/host/') ||
                              requestUrl.includes('/api/user/');

      // If we get 403 on a protected route, redirect to homepage
      // This handles both: wrong subdomain OR missing/invalid token
      if (isProtectedRoute) {

        // Clear all auth tokens
        localStorage.removeItem('hostToken');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userType');

        // Redirect to homepage
        window.location.href = '/';

        return Promise.reject(new Error('Access denied - redirected to home'));
      }
    }

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