import api from '@/lib/api';
import type { Produto } from '@/types';

export async function getFavoritos(): Promise<Produto[]> {
  const { data } = await api.get<Produto[]>('/favoritos');
  return data;
}

export async function toggleFavorito(produtoId: number): Promise<{ favoritado: boolean }> {
  const { data } = await api.post<{ favoritado: boolean }>('/favoritos/toggle', { produtoId });
  return data;
}
