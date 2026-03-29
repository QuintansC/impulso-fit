import api from '@/lib/api';
import type { Pedido } from '@/types';

export async function getMeusPedidos(): Promise<Pedido[]> {
  const { data } = await api.get<Pedido[]>('/pedidos');
  return data;
}

export async function getMeuPedido(id: number): Promise<Pedido> {
  const { data } = await api.get<Pedido>(`/pedidos/${id}`);
  return data;
}
