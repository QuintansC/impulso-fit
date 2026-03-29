import axios from 'axios';
import { TOKEN_KEY, AUTH_UNAUTHORIZED_EVENT } from '@/lib/constants';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_BACKEND || 'http://localhost:3333/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  },
);

export default api;
