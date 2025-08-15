import React, { useState, useEffect } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import stripePromise from '../lib/stripe';
import axios from 'axios';
import { CreditCard, Lock, User, Mail, MapPin, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

// Configuração da API
const API_URL = process.env.NEXT_PUBLIC_URL_BACKEND || 'http://localhost:3333';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#ffffff',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      lineHeight: '24px',
      backgroundColor: '#333333',
      '::placeholder': {
        color: '#999999',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
    complete: {
      color: '#4caf50',
      iconColor: '#4caf50',
    },
  },
  hidePostalCode: true,
};

interface CheckoutFormProps {
  total: number;
  itens: any[];
  onSuccess: () => void;
}

function CheckoutForm({ total, itens, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [pedidoId, setPedidoId] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Dados do cliente
  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    email: '',
    endereco: ''
  });

  useEffect(() => {
    // Criar payment intent quando o componente carregar
    criarPaymentIntent();
  }, [total]);

  const criarPaymentIntent = async () => {
    try {
      // Validar se o total é maior que 0
      if (!total || total <= 0) {
        setError('Valor total inválido para pagamento');
        return;
      }

      console.log('Criando payment intent com total:', total);
      console.log('Itens:', itens);

      const response = await axios.post(
        `${API_URL}/pagamentos/create-payment-intent`,
        {
          amount: Math.round(total * 100), // Stripe trabalha com centavos
          metadata: {
            itens: JSON.stringify(itens.map(item => ({
              id: item.id,
              nome: item.nome,
              quantidade: item.quantidade,
              preco: item.preco
            })))
          }
        }
      );
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error('Erro ao criar payment intent:', error);
      setError('Erro ao preparar pagamento');
    }
  };

  const salvarPedido = async (paymentIntentId: string) => {
    try {
      console.log('Pagamento aprovado! Salvando pedido...');
      console.log('PaymentIntent ID:', paymentIntentId);
      console.log('Total pago:', total);
      console.log('Itens do pedido:', itens);
      
      const pedidoData = {
        usuarioId: 1, // Por enquanto fixo, depois pegar do context de usuário
        produtos: itens.map(item => ({ 
          produtoId: parseInt(item.id), // Garantir que seja número
          quantidade: item.quantidade,
          precoUnitario: parseFloat(item.preco),
          nome: item.nome
        })),
        total: parseFloat(total.toFixed(2)),
        stripePaymentIntentId: paymentIntentId,
        enderecoEntrega: dadosCliente.endereco,
        stripePagamento: 'card',
        clienteNome: dadosCliente.nome,
        clienteEmail: dadosCliente.email,
        status: 'pago'
      };

      console.log('Dados do pedido a serem enviados:', pedidoData);

      const response = await axios.post(
        `${API_URL}/pagamentos/create-order`,
        pedidoData
      );
      
      console.log('Pedido salvo com sucesso:', response.data);
      
      // Definir ID do pedido e marcar como sucesso
      setPedidoId(response.data.id || response.data.pedidoId);
      setSuccess(true);
      
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      console.error('Detalhes do erro:', error.response?.data);
      
      // Mesmo com erro ao salvar, o pagamento foi processado
      throw new Error(`Erro ao salvar pedido: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Erro ao processar cartão');
      setLoading(false);
      return;
    }

    // Confirmar pagamento
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: dadosCliente.nome,
            email: dadosCliente.email,
          },
        },
      }
    );

    if (stripeError) {
      setError(stripeError.message || 'Erro no pagamento');
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        // Salvar pedido no backend
        await salvarPedido(paymentIntent.id);
        
        // Aguardar 2 segundos para mostrar a mensagem de sucesso
        setTimeout(() => {
          onSuccess();
        }, 3000);
        
      } catch (error: any) {
        // Pagamento foi aprovado, mas erro ao salvar pedido
        setError(`Pagamento aprovado (R$ ${total.toFixed(2)}), mas houve erro ao salvar o pedido: ${error.message}. Entre em contato conosco com o ID: ${paymentIntent.id}`);
        
        // Ainda assim, redirecionar para sucesso após alguns segundos
        setTimeout(() => {
          onSuccess();
        }, 5000);
      }
    }

    setLoading(false);
  };

  const canProceedToPayment = dadosCliente.nome && dadosCliente.email && dadosCliente.endereco;

  // Tela de sucesso
  if (success && pedidoId) {
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-[#4caf50] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Pagamento Aprovado!</h2>
          <p className="text-[#ccc]">Seu pedido foi processado com sucesso</p>
        </div>
        
        <div className="bg-[#1b5e20] border border-[#2e7d32] rounded-lg p-6 mb-6">
          <h3 className="font-bold text-[#4caf50] mb-2">Detalhes do Pedido</h3>
          <p className="text-[#a5d6a7]"><strong>Pedido:</strong> #{pedidoId}</p>
          <p className="text-[#a5d6a7]"><strong>Valor:</strong> R$ {total.toFixed(2)}</p>
          <p className="text-[#a5d6a7]"><strong>Status:</strong> Pago</p>
          <p className="text-[#a5d6a7]"><strong>Itens:</strong> {itens.length} produto(s)</p>
        </div>
        
        <p className="text-sm text-[#999] mb-6">
          Um email de confirmação será enviado para {dadosCliente.email}
        </p>
        
        <div className="text-xs text-[#666]">
          Redirecionando automaticamente em alguns segundos...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center space-x-4 mb-8">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-[#b71c1c] text-white' : 'bg-[#333] text-[#999]'} font-bold text-sm`}>
          1
        </div>
        <div className={`flex-1 h-1 ${currentStep >= 2 ? 'bg-[#b71c1c]' : 'bg-[#333]'} rounded`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-[#b71c1c] text-white' : 'bg-[#333] text-[#999]'} font-bold text-sm`}>
          2
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Etapa 1: Dados Pessoais */}
        <div className={currentStep === 1 ? 'block' : 'hidden'}>
          <div className="flex items-center mb-6">
            <User className="h-6 w-6 text-[#b71c1c] mr-3" />
            <h2 className="text-xl font-bold text-white">Dados de Entrega</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-[#666]" />
                <input
                  className="w-full pl-10 pr-4 py-3 border border-[#444] bg-[#333] text-white rounded-lg focus:ring-2 focus:ring-[#b71c1c] focus:border-transparent transition-all placeholder:text-[#666]"
                  placeholder="Digite seu nome completo"
                  value={dadosCliente.nome}
                  onChange={(e) => setDadosCliente({ ...dadosCliente, nome: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[#666]" />
                <input
                  className="w-full pl-10 pr-4 py-3 border border-[#444] bg-[#333] text-white rounded-lg focus:ring-2 focus:ring-[#b71c1c] focus:border-transparent transition-all placeholder:text-[#666]"
                  type="email"
                  placeholder="seu@email.com"
                  value={dadosCliente.email}
                  onChange={(e) => setDadosCliente({ ...dadosCliente, email: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-2">
                Endereço de Entrega
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-[#666]" />
                <textarea
                  className="w-full pl-10 pr-4 py-3 border border-[#444] bg-[#333] text-white rounded-lg focus:ring-2 focus:ring-[#b71c1c] focus:border-transparent transition-all resize-none placeholder:text-[#666]"
                  placeholder="Rua, número, complemento, bairro, cidade, CEP"
                  value={dadosCliente.endereco}
                  onChange={(e) => setDadosCliente({ ...dadosCliente, endereco: e.target.value })}
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => canProceedToPayment && setCurrentStep(2)}
            disabled={!canProceedToPayment}
            className="w-full mt-6 bg-[#b71c1c] text-white py-3 rounded-lg font-semibold hover:bg-[#d32f2f] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Continuar para Pagamento
          </button>
        </div>

        {/* Etapa 2: Pagamento */}
        <div className={currentStep === 2 ? 'block' : 'hidden'}>
          <div className="flex items-center mb-6">
            <CreditCard className="h-6 w-6 text-[#b71c1c] mr-3" />
            <h2 className="text-xl font-bold text-white">Informações de Pagamento</h2>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#ccc] mb-2">
              Dados do Cartão
            </label>
            <div className="border border-[#444] rounded-lg p-4 bg-[#333] focus-within:ring-2 focus-within:ring-[#b71c1c] focus-within:border-transparent transition-all">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            <p className="text-xs text-[#999] mt-2 flex items-center">
              <Lock className="h-3 w-3 mr-1" />
              Seus dados são protegidos com criptografia SSL de 256 bits
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-[#3d1a1a] border border-[#b71c1c] rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-[#ef4444] mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-[#ef4444]">Erro no pagamento</h3>
                <p className="text-sm text-[#ffcdd2] mt-1">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 mb-6">
            <h3 className="font-medium text-white mb-2">Para testar, use:</h3>
            <p className="text-sm text-[#ccc]">
              <strong>Cartão:</strong> 4242 4242 4242 4242<br />
              <strong>Validade:</strong> 12/34 | <strong>CVC:</strong> 123
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="flex-1 bg-[#333] text-[#ccc] py-3 rounded-lg font-semibold hover:bg-[#444] transition-all"
            >
              Voltar
            </button>
            
            <button
              type="submit"
              disabled={!stripe || loading}
              className="flex-1 bg-gradient-to-r from-[#4caf50] to-[#2e7d32] text-white py-3 rounded-lg font-semibold hover:from-[#2e7d32] hover:to-[#1b5e20] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Finalizar Pagamento R$ {total.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

interface StripeCheckoutProps {
  total: number;
  itens: any[];
  onSuccess: () => void;
}

export default function StripeCheckout({ total, itens, onSuccess }: StripeCheckoutProps) {
  // Verificar se stripePromise foi carregado corretamente
  if (!stripePromise) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-bold mb-2">Erro de Configuração</h3>
          <p className="text-red-700">Stripe não foi configurado corretamente. Verifique as variáveis de ambiente.</p>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm total={total} itens={itens} onSuccess={onSuccess} />
    </Elements>
  );
}
