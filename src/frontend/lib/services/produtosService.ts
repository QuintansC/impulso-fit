import api from '@/lib/api';
import { Produto } from '@/types';

export async function getProdutos(): Promise<Produto[]> {
  const { data } = await api.get('/produtos');
  return data;
}

export async function getProduto(id: number | string): Promise<Produto> {
  const { data } = await api.get(`/produtos/${id}`);
  return data;
}
