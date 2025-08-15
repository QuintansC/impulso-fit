// Função de debug para verificar o estado do sistema de pedidos
import { useCarrinho } from '../context/CarrinhoContext';

export function DebugPedidos() {
  const { carrinho } = useCarrinho();
  
  const debugInfo = {
    carrinho: {
      existe: !!carrinho,
      quantidade: carrinho?.length || 0,
      itens: carrinho?.map(item => ({
        id: item.id,
        nome: item.nome,
        preco: item.preco,
        quantidade: item.quantidade,
        temNome: !!item.nome,
        temPreco: !!item.preco && item.preco > 0,
        temQuantidade: !!item.quantidade && item.quantidade > 0,
        temId: !!item.id
      })) || []
    },
    ambiente: {
      apiUrl: process.env.NEXT_PUBLIC_URL_BACKEND || 'http://localhost:3333',
      stripeKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    },
    validacao: {
      carrinhoValido: carrinho && carrinho.length > 0 && carrinho.every(item => 
        item.id && item.nome && item.preco > 0 && item.quantidade > 0
      ),
      dadosCompletos: carrinho?.every(item => 
        item.id && item.nome && item.preco && item.quantidade && item.imagemUrl && item.descricao
      )
    }
  };
  
  return debugInfo;
}

// Hook para usar debug
export function useDebugPedidos() {
  return DebugPedidos();
}

// Função para validar carrinho antes do checkout
export function validarCarrinhoCheckout(carrinho: any[]) {
  const erros: string[] = [];
  
  if (!carrinho || carrinho.length === 0) {
    erros.push('Carrinho está vazio');
    return { valido: false, erros };
  }
  
  carrinho.forEach((item, index) => {
    if (!item.id) erros.push(`Item ${index + 1}: ID ausente`);
    if (!item.nome) erros.push(`Item ${index + 1}: Nome ausente`);
    if (!item.preco || item.preco <= 0) erros.push(`Item ${index + 1}: Preço inválido`);
    if (!item.quantidade || item.quantidade <= 0) erros.push(`Item ${index + 1}: Quantidade inválida`);
  });
  
  return {
    valido: erros.length === 0,
    erros
  };
}

// Função para formatar dados do carrinho para o backend
export function formatarDadosPedido(carrinho: any[], dadosCliente: any, paymentIntentId: string) {
  return {
    usuarioId: 1, // Por enquanto fixo
    produtos: carrinho.map(item => ({
      produtoId: parseInt(item.id),
      quantidade: item.quantidade,
      precoUnitario: parseFloat(item.preco),
      nome: item.nome
    })),
    total: carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0),
    stripePaymentIntentId: paymentIntentId,
    enderecoEntrega: dadosCliente.endereco,
    stripePagamento: 'card',
    clienteNome: dadosCliente.nome,
    clienteEmail: dadosCliente.email,
    status: 'pago'
  };
}
