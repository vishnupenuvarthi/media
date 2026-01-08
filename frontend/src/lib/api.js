import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

const shouldAttachAuth = (url = '') => !url.includes('/auth/login') && !url.includes('/auth/register');

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && shouldAttachAuth(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config, message } = error;
    const status = response?.status;

    // Log all errors for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: config?.url,
        method: config?.method,
        status: status,
        statusText: response?.statusText,
        data: response?.data,
        message: message,
        error: error
      });
    }

    // For non-401 errors or auth endpoints, reject immediately with proper error
    if (status !== 401 || config?._retry || config?.url?.includes('/auth/refresh') || config?.url?.includes('/auth/register') || config?.url?.includes('/auth/login')) {
      // Return error in a format the frontend can handle
      const errorData = response?.data || { message: message || 'Network error occurred' };
      return Promise.reject(errorData);
    }

    config._retry = true;

    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) {
      useAuthStore.getState().logout();
      return Promise.reject(response?.data ?? error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          config.headers.Authorization = `Bearer ${token}`;
          return api(config);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const { data } = await api.post('/auth/refresh', { refreshToken });
      useAuthStore.getState().setAuth(data);
      processQueue(null, data.accessToken);
      config.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(config);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      return Promise.reject(refreshError.response?.data ?? refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

