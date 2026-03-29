export const TOKEN_KEY = 'impulsofit_token';
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

export const PEDIDO_STATUS = ['pendente', 'pago', 'enviado', 'entregue', 'cancelado'] as const;
export type PedidoStatus = typeof PEDIDO_STATUS[number];

export const PEDIDO_STATUS_COLORS: Record<string, string> = {
  pendente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  pago:     'bg-blue-500/20 text-blue-400 border-blue-500/30',
  enviado:  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  entregue: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelado:'bg-red-500/20 text-red-400 border-red-500/30',
};

export const DEPARTMENTS = [
  'Suplementos',
  'Equipamentos',
  'Roupas Fitness',
  'Acessórios',
  'Presentes Fit',
] as const;
