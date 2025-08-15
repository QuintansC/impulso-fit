// Utilitários para gerenciamento de pedidos
export interface PedidoCompleto {
  id: number;
  clienteNome: string;
  clienteEmail: string;
  produtos: Array<{
    produtoId: number;
    quantidade: number;
    precoUnitario: number;
    nome: string;
  }>;
  total: number;
  status: string;
  stripePaymentIntentId: string;
  enderecoEntrega: string;
  createdAt: string;
}

// Função para salvar dados do pedido no localStorage para backup
export const salvarPedidoLocal = (pedido: Partial<PedidoCompleto>) => {
  try {
    const pedidosLocais = JSON.parse(localStorage.getItem('pedidos_backup') || '[]');
    pedidosLocais.push({
      ...pedido,
      timestamp: new Date().toISOString(),
      localId: Date.now()
    });
    
    // Manter apenas os últimos 10 pedidos
    if (pedidosLocais.length > 10) {
      pedidosLocais.shift();
    }
    
    localStorage.setItem('pedidos_backup', JSON.stringify(pedidosLocais));
  } catch (error) {
    console.error('Erro ao salvar pedido local:', error);
  }
};

// Função para formatar dados do pedido para exibição
export const formatarResumo = (pedido: PedidoCompleto) => {
  return {
    numero: `#${pedido.id}`,
    cliente: pedido.clienteNome,
    email: pedido.clienteEmail,
    valor: `R$ ${pedido.total.toFixed(2)}`,
    status: pedido.status,
    itens: pedido.produtos.length,
    data: new Date(pedido.createdAt).toLocaleDateString('pt-BR')
  };
};

// Função para gerar número de pedido único baseado no timestamp
export const gerarNumeroPedido = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `PED${timestamp}${random}`.slice(-12);
};

// Validar se todos os dados obrigatórios estão presentes
export const validarDadosPedido = (dados: any): { valido: boolean; erro?: string } => {
  if (!dados.produtos || dados.produtos.length === 0) {
    return { valido: false, erro: 'Nenhum produto no pedido' };
  }
  
  if (!dados.total || dados.total <= 0) {
    return { valido: false, erro: 'Valor total inválido' };
  }
  
  if (!dados.clienteNome || dados.clienteNome.length < 2) {
    return { valido: false, erro: 'Nome do cliente inválido' };
  }
  
  if (!dados.clienteEmail || !dados.clienteEmail.includes('@')) {
    return { valido: false, erro: 'Email do cliente inválido' };
  }
  
  if (!dados.enderecoEntrega || dados.enderecoEntrega.length < 10) {
    return { valido: false, erro: 'Endereço de entrega inválido' };
  }
  
  return { valido: true };
};

// Status do pedido
export const STATUS_PEDIDO = {
  PENDENTE: 'pendente',
  PAGO: 'pago',
  PROCESSANDO: 'processando',
  ENVIADO: 'enviado',
  ENTREGUE: 'entregue',
  CANCELADO: 'cancelado'
} as const;

export const formatarStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    [STATUS_PEDIDO.PENDENTE]: 'Pendente',
    [STATUS_PEDIDO.PAGO]: 'Pago',
    [STATUS_PEDIDO.PROCESSANDO]: 'Processando',
    [STATUS_PEDIDO.ENVIADO]: 'Enviado',
    [STATUS_PEDIDO.ENTREGUE]: 'Entregue',
    [STATUS_PEDIDO.CANCELADO]: 'Cancelado'
  };
  
  return statusMap[status] || status;
};
