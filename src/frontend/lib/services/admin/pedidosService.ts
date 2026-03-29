import api from '@/lib/api';
import { Pedido } from '@/types';

export async function getPedidos(): Promise<Pedido[]> {
  const { data } = await api.get('/admin/pedidos');
  return data;
}

export async function atualizarStatus(id: number, status: string): Promise<Pedido> {
  const { data } = await api.put(`/admin/pedidos/${id}/status`, { status });
  return data;
}
