import api from '@/lib/api';
import { Categoria } from '@/types';

export async function getCategorias(): Promise<Categoria[]> {
  const { data } = await api.get('/categorias');
  return data;
}
