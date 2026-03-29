import api from '@/lib/api';

interface ItemPedido {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
}

export async function criarPaymentIntent(
  amount: number,
  metadata?: Record<string, string>,
): Promise<{ clientSecret: string; amount: number }> {
  const { data } = await api.post('/pagamentos/create-payment-intent', { amount, metadata });
  return data;
}

export async function criarPedido(params: {
  usuarioId: number;
  produtos: ItemPedido[];
  total: number;
  clienteNome?: string;
  clienteEmail?: string;
  status?: string;
  stripePaymentIntentId?: string;
}) {
  const { data } = await api.post('/pagamentos/create-order', params);
  return data;
}
