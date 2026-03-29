import axios from 'axios';
import { Produto, Categoria } from '@/types';
import { TOKEN_KEY, AUTH_UNAUTHORIZED_EVENT } from '@/lib/constants';

const API_URL = process.env.NEXT_PUBLIC_URL_BACKEND || 'http://localhost:3333/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
  }
);

export default api;

export async function getProdutos(): Promise<Produto[]> {
  const { data } = await api.get('/produtos');
  return data;
}

export async function getProduto(id: string): Promise<Produto> {
  const { data } = await api.get(`/produtos/${id}`);
  return data;
}

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get('/categorias');
  return data;
}
