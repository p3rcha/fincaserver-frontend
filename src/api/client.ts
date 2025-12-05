import axios from 'axios';

/**
 * API Client
 * 
 * Cliente axios centralizado para todas las llamadas al backend.
 * Maneja automáticamente los headers, errores, y logging.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging (development only)
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      // Network error
      if (!error.response) {
        console.error('[API] Network error - server may be offline');
        return Promise.reject(new Error('Error de conexión. Verifica que el servidor esté activo.'));
      }

      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.error || error.message;

      switch (status) {
        case 400:
          console.error('[API] Bad request:', message);
          break;
        case 401:
          console.error('[API] Unauthorized');
          break;
        case 403:
          console.error('[API] Forbidden');
          break;
        case 404:
          console.error('[API] Not found:', error.config?.url);
          break;
        case 500:
          console.error('[API] Server error:', message);
          break;
        default:
          console.error(`[API] Error ${status}:`, message);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
