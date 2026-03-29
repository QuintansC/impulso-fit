import api from '@/lib/api';
import { Categoria } from '@/types';

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get('/admin/categorias');
  return data;
}

export async function criarCategoria(nome: string): Promise<Categoria> {
  const { data } = await api.post('/admin/categorias', { nome });
  return data;
}

export async function atualizarCategoria(id: number, nome: string): Promise<Categoria> {
  const { data } = await api.put(`/admin/categorias/${id}`, { nome });
  return data;
}
