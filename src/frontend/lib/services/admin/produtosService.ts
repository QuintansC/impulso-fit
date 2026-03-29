import api from '@/lib/api';
import { Produto } from '@/types';

export async function getProdutos(): Promise<Produto[]> {
  const { data } = await api.get('/admin/produtos');
  return data;
}

export async function getProduto(id: number | string): Promise<Produto> {
  const { data } = await api.get(`/admin/produtos/${id}`);
  return data;
}

export async function criarProduto(form: Record<string, unknown>): Promise<Produto> {
  const { data } = await api.post('/admin/produtos', form);
  return data;
}

export async function atualizarProduto(id: number | string, form: Record<string, unknown>): Promise<Produto> {
  const { data } = await api.put(`/admin/produtos/${id}`, form);
  return data;
}

export async function deletarProduto(id: number): Promise<void> {
  await api.delete(`/admin/produtos/${id}`);
}
