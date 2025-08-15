// Script de teste para validar o fluxo de salvamento de pedidos
import axios from 'axios';

const API_URL = 'http://localhost:3333';

// Dados de teste do pedido
const dadosTestePedido = {
  usuarioId: 1,
  produtos: [
    {
      produtoId: 1,
      quantidade: 2,
      precoUnitario: 15.90,
      nome: 'Café Premium'
    },
    {
      produtoId: 2,
      quantidade: 1,
      precoUnitario: 8.50,
      nome: 'Café Expresso'
    }
  ],
  total: 40.30,
  stripePaymentIntentId: 'pi_teste_' + Date.now(),
  enderecoEntrega: 'Rua Teste, 123, Bairro Centro, Cidade - SP, 12345-678',
  stripePagamento: 'card',
  clienteNome: 'Cliente Teste',
  clienteEmail: 'teste@exemplo.com',
  status: 'pago'
};

async function testarFluxoPedido() {
  try {
    console.log('🧪 Iniciando teste do fluxo de pedidos...');
    console.log('📊 Dados do teste:', JSON.stringify(dadosTestePedido, null, 2));
    
    // 1. Testar criação de payment intent
    console.log('\n1️⃣ Testando criação de payment intent...');
    const paymentIntentResponse = await axios.post(
      `${API_URL}/pagamentos/create-payment-intent`,
      {
        amount: Math.round(dadosTestePedido.total * 100), // Stripe trabalha com centavos
        metadata: {
          itens: JSON.stringify(dadosTestePedido.produtos)
        }
      }
    );
    
    console.log('✅ Payment intent criado:', paymentIntentResponse.data.clientSecret ? 'Sucesso' : 'Falhou');
    
    // 2. Testar criação de pedido
    console.log('\n2️⃣ Testando criação de pedido...');
    const pedidoResponse = await axios.post(
      `${API_URL}/pagamentos/create-order`,
      dadosTestePedido
    );
    
    console.log('✅ Pedido criado com sucesso!');
    console.log('📦 ID do pedido:', pedidoResponse.data.id);
    console.log('💰 Total:', pedidoResponse.data.total);
    console.log('📧 Email enviado:', pedidoResponse.data.emailEnviado);
    console.log('📋 Status:', pedidoResponse.data.status);
    
    return {
      sucesso: true,
      pedidoId: pedidoResponse.data.id,
      dados: pedidoResponse.data
    };
    
  } catch (error: any) {
    console.error('❌ Erro no teste:', error.message);
    console.error('📋 Detalhes:', error.response?.data);
    
    return {
      sucesso: false,
      erro: error.message,
      detalhes: error.response?.data
    };
  }
}

// Função para validar dados do carrinho
function validarDadosCarrinho(carrinho: any[]) {
  console.log('\n🔍 Validando dados do carrinho...');
  
  if (!carrinho || carrinho.length === 0) {
    console.log('❌ Carrinho vazio');
    return false;
  }
  
  for (const item of carrinho) {
    if (!item.id) {
      console.log('❌ Item sem ID:', item);
      return false;
    }
    
    if (!item.nome) {
      console.log('❌ Item sem nome:', item);
      return false;
    }
    
    if (!item.preco || item.preco <= 0) {
      console.log('❌ Item sem preço válido:', item);
      return false;
    }
    
    if (!item.quantidade || item.quantidade <= 0) {
      console.log('❌ Item sem quantidade válida:', item);
      return false;
    }
  }
  
  console.log('✅ Dados do carrinho válidos');
  return true;
}

// Executar se chamado diretamente
if (require.main === module) {
  testarFluxoPedido().then(resultado => {
    console.log('\n🏁 Resultado final:', resultado);
    process.exit(resultado.sucesso ? 0 : 1);
  });
}

export { testarFluxoPedido, validarDadosCarrinho, dadosTestePedido };
