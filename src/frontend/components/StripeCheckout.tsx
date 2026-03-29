import React, { useState, useEffect } from 'react';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Lock, User, Mail, MapPin, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import stripePromise from '../lib/stripe';
import { useAuth } from '../context/AuthContext';
import * as pagamentosService from '../lib/services/pagamentosService';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#ffffff',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      backgroundColor: '#333333',
      '::placeholder': { color: '#999999' },
    },
    invalid: { color: '#ef4444', iconColor: '#ef4444' },
    complete: { color: '#4caf50', iconColor: '#4caf50' },
  },
  hidePostalCode: true,
};

interface CheckoutFormProps {
  total: number;
  itens: { id: number; nome: string; quantidade: number; preco: number }[];
  onSuccess: () => void;
}

function CheckoutForm({ total, itens, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { usuario } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [pedidoId, setPedidoId] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);

  const [dadosCliente, setDadosCliente] = useState({
    nome: usuario?.nome ?? '',
    email: usuario?.email ?? '',
    endereco: '',
  });

  useEffect(() => {
    if (!total || total <= 0) return;

    const metadata: Record<string, string> = {
      usuarioId: String(usuario?.id ?? 0),
      clienteNome: dadosCliente.nome,
      clienteEmail: dadosCliente.email,
      itens: JSON.stringify(itens.map(i => ({ id: i.id, nome: i.nome, quantidade: i.quantidade, preco: i.preco }))),
    };

    pagamentosService.criarPaymentIntent(Math.round(total * 100), metadata)
      .then(({ clientSecret }) => setClientSecret(clientSecret))
      .catch(() => setError('Erro ao preparar pagamento'));
  }, [total]);

  const salvarPedido = async (paymentIntentId: string) => {
    const pedido = await pagamentosService.criarPedido({
      usuarioId: usuario?.id ?? 0,
      produtos: itens.map(i => ({
        produtoId: i.id,
        quantidade: i.quantidade,
        precoUnitario: i.preco,
      })),
      total: parseFloat(total.toFixed(2)),
      clienteNome: dadosCliente.nome,
      clienteEmail: dadosCliente.email,
      status: 'pago',
      stripePaymentIntentId: paymentIntentId,
    });
    setPedidoId(pedido.id);
    setSuccess(true);
    return pedido;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Erro ao processar cartão');
      setLoading(false);
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { name: dadosCliente.nome, email: dadosCliente.email },
      },
    });

    if (stripeError) {
      setError(stripeError.message || 'Erro no pagamento');
    } else if (paymentIntent?.status === 'succeeded') {
      try {
        await salvarPedido(paymentIntent.id);
        setTimeout(onSuccess, 3000);
      } catch (err: any) {
        // Pagamento aprovado mas erro ao salvar — webhook fará o backup
        setError(`Pagamento aprovado, mas erro ao salvar pedido. ID: ${paymentIntent.id}. Entre em contato conosco.`);
        setTimeout(onSuccess, 5000);
      }
    }

    setLoading(false);
  };

  const canProceed = dadosCliente.nome && dadosCliente.email && dadosCliente.endereco;

  if (success && pedidoId) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-[#4caf50] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Pagamento Aprovado!</h2>
        <p className="text-[#ccc] mb-6">Seu pedido foi processado com sucesso</p>
        <div className="bg-[#1b5e20] border border-[#2e7d32] rounded-lg p-6 mb-6">
          <h3 className="font-bold text-[#4caf50] mb-2">Detalhes do Pedido</h3>
          <p className="text-[#a5d6a7]"><strong>Pedido:</strong> #{pedidoId}</p>
          <p className="text-[#a5d6a7]"><strong>Valor:</strong> R$ {total.toFixed(2)}</p>
          <p className="text-[#a5d6a7]"><strong>Status:</strong> Pago</p>
        </div>
        <p className="text-sm text-[#999]">Redirecionando automaticamente...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Steps */}
      <div className="flex items-center space-x-4 mb-8">
        {[1, 2].map((step, i) => (
          <React.Fragment key={step}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${currentStep >= step ? 'bg-[#b71c1c] text-white' : 'bg-[#333] text-[#999]'}`}>
              {step}
            </div>
            {i === 0 && <div className={`flex-1 h-1 rounded ${currentStep >= 2 ? 'bg-[#b71c1c]' : 'bg-[#333]'}`} />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Etapa 1: Dados */}
        <div className={currentStep === 1 ? 'block' : 'hidden'}>
          <div className="flex items-center mb-6">
            <User className="h-6 w-6 text-[#b71c1c] mr-3" />
            <h2 className="text-xl font-bold text-white">Dados de Entrega</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-2">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-[#666]" />
                <input
                  className="w-full pl-10 pr-4 py-3 border border-[#444] bg-[#333] text-white rounded-lg focus:ring-2 focus:ring-[#b71c1c] focus:border-transparent placeholder:text-[#666]"
                  placeholder="Digite seu nome completo"
                  value={dadosCliente.nome}
                  onChange={e => setDadosCliente(d => ({ ...d, nome: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[#666]" />
                <input
                  className="w-full pl-10 pr-4 py-3 border border-[#444] bg-[#333] text-white rounded-lg focus:ring-2 focus:ring-[#b71c1c] focus:border-transparent placeholder:text-[#666]"
                  type="email"
                  placeholder="seu@email.com"
                  value={dadosCliente.email}
                  onChange={e => setDadosCliente(d => ({ ...d, email: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#ccc] mb-2">Endereço de Entrega</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-[#666]" />
                <textarea
                  className="w-full pl-10 pr-4 py-3 border border-[#444] bg-[#333] text-white rounded-lg focus:ring-2 focus:ring-[#b71c1c] focus:border-transparent resize-none placeholder:text-[#666]"
                  placeholder="Rua, número, complemento, bairro, cidade, CEP"
                  value={dadosCliente.endereco}
                  onChange={e => setDadosCliente(d => ({ ...d, endereco: e.target.value }))}
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => canProceed && setCurrentStep(2)}
            disabled={!canProceed}
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
            <label className="block text-sm font-medium text-[#ccc] mb-2">Dados do Cartão</label>
            <div className="border border-[#444] rounded-lg p-4 bg-[#333] focus-within:ring-2 focus-within:ring-[#b71c1c] transition-all">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            <p className="text-xs text-[#999] mt-2 flex items-center">
              <Lock className="h-3 w-3 mr-1" />
              Seus dados são protegidos com criptografia SSL de 256 bits
            </p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 mb-6 text-sm text-[#ccc]">
            <strong className="text-white">Para testar:</strong> 4242 4242 4242 4242 · 12/34 · 123
          </div>

          {error && (
            <div className="mb-4 p-4 bg-[#3d1a1a] border border-[#b71c1c] rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-[#ef4444] mr-3 shrink-0 mt-0.5" />
              <p className="text-sm text-[#ffcdd2]">{error}</p>
            </div>
          )}

          <div className="flex space-x-4">
            <button type="button" onClick={() => setCurrentStep(1)} className="flex-1 bg-[#333] text-[#ccc] py-3 rounded-lg font-semibold hover:bg-[#444] transition-all">
              Voltar
            </button>
            <button
              type="submit"
              disabled={!stripe || loading}
              className="flex-1 bg-gradient-to-r from-[#4caf50] to-[#2e7d32] text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {loading ? (
                <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Processando...</>
              ) : (
                <><Lock className="h-5 w-5 mr-2" /> Finalizar R$ {total.toFixed(2)}</>
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
  itens: { id: number; nome: string; quantidade: number; preco: number }[];
  onSuccess: () => void;
}

export default function StripeCheckout({ total, itens, onSuccess }: StripeCheckoutProps) {
  if (!stripePromise) {
    return (
      <div className="text-center py-8 bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-bold mb-2">Erro de Configuração</h3>
        <p className="text-red-700">Stripe não configurado. Verifique as variáveis de ambiente.</p>
      </div>
    );
  }
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm total={total} itens={itens} onSuccess={onSuccess} />
    </Elements>
  );
}
