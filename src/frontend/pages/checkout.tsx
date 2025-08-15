import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import StripeCheckout from '../components/StripeCheckout';
import TestStripeCheckout from '../components/TestStripeCheckout';
import { useCarrinho } from '../context/CarrinhoContext';
import { ShoppingBag, ArrowLeft, CheckCircle, Shield, Truck } from 'lucide-react';
import { formatPrice, formatCurrency, calculateCartTotal } from '../lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const { carrinho, limparCarrinho } = useCarrinho();
  const [total, setTotal] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const [useTestMode, setUseTestMode] = useState(false); // Para alternar entre componentes

  useEffect(() => {
    // Calcular total do carrinho usando o contexto
    if (carrinho && carrinho.length > 0) {
      const totalCalculado = calculateCartTotal(carrinho);
      setTotal(totalCalculado);
    }
  }, [carrinho]);

  const handleSuccess = () => {
    setFinalizado(true);
    
    // Limpar carrinho usando o contexto
    limparCarrinho();
    
    // Redirecionar após 3 segundos
    setTimeout(() => {
      router.push('/');
    }, 3000);
  };

  if (carrinho.length === 0 && !finalizado) {
    return (
      <>
        <Head>
          <title>Checkout | Impulso Fit</title>
        </Head>
        <Header />
        <div className="min-h-screen bg-[#111111]">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto text-center">
              <div className="bg-[#222] border border-[#333] rounded-2xl shadow-xl p-8">
                <ShoppingBag className="mx-auto h-16 w-16 text-[#666] mb-4" />
                <h1 className="text-2xl font-bold text-white mb-4">Carrinho Vazio</h1>
                <p className="text-[#ccc] mb-6">
                  Adicione alguns produtos incríveis ao seu carrinho primeiro.
                </p>
                <button 
                  onClick={() => router.push('/produtos')}
                  className="w-full bg-gradient-to-r from-[#b71c1c] to-[#d32f2f] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#d32f2f] hover:to-[#f44336] transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <ArrowLeft className="inline h-5 w-5 mr-2" />
                  Ver Produtos
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout | Impulso Fit</title>
        <meta name="description" content="Finalize sua compra na Impulso Fit - Pagamento seguro e entrega rápida" />
      </Head>
      <Header />

      <div className="min-h-screen bg-[#111111]">
        <div className="container mx-auto px-4 py-8">
          {finalizado ? (
            <div className="max-w-lg mx-auto">
              <div className="bg-[#222] border border-[#333] rounded-2xl shadow-xl p-8 text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-[#4caf50] mb-4" />
                <h1 className="text-3xl font-bold text-white mb-4">
                  Pedido Confirmado!
                </h1>
                <div className="bg-[#1b5e20] border border-[#2e7d32] rounded-lg p-4 mb-6">
                  <p className="text-[#4caf50] font-medium">
                    ✅ Pagamento processado com sucesso!
                  </p>
                </div>
                <p className="text-[#ccc] mb-4">
                  Obrigado pela sua compra! Você receberá um email com os detalhes do pedido e informações de entrega.
                </p>
                <div className="bg-[#333] border border-[#444] rounded-lg p-4 mb-6">
                  <p className="text-[#fff] text-sm flex items-center justify-center">
                    <Truck className="h-4 w-4 mr-2" />
                    📦 Seu pedido será preparado e enviado em breve.
                  </p>
                </div>
                <div className="flex items-center justify-center text-sm text-[#999]">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#b71c1c] mr-2"></div>
                  Redirecionando para a página inicial...
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <button 
                  onClick={() => router.push('/carrinho')}
                  className="inline-flex items-center text-[#b71c1c] hover:text-[#d32f2f] mb-4 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Voltar ao Carrinho
                </button>
                <h1 className="text-3xl font-bold text-white">Finalizar Compra</h1>
                <p className="text-[#ccc] mt-2">Complete seu pedido de forma segura</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Resumo do Pedido */}
                <div className="order-2 lg:order-1">
                  <div className="bg-[#222] border border-[#333] rounded-2xl shadow-lg p-6 sticky top-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                      <ShoppingBag className="h-6 w-6 mr-2 text-[#b71c1c]" />
                      Resumo do Pedido
                    </h2>
                    
                    <div className="space-y-4 mb-6">
                      {carrinho.map((item, index) => {
                        const preco = formatPrice(item.preco);
                        const quantidade = item.quantidade || 1;
                        const total = preco * quantidade;
                        
                        return (
                          <div key={index} className="flex items-center justify-between py-3 border-b border-[#333] last:border-b-0">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 w-12 h-12 bg-[#333] border border-[#444] rounded-lg flex items-center justify-center">
                                <span className="text-[#b71c1c] font-bold text-sm">
                                  {quantidade}x
                                </span>
                              </div>
                              <div>
                                <h3 className="font-medium text-white">{item.nome || 'Produto'}</h3>
                                <p className="text-sm text-[#999]">R$ {formatCurrency(preco)} cada</p>
                              </div>
                            </div>
                            <span className="font-bold text-white">
                              R$ {formatCurrency(total)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-[#333] pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#ccc]">Subtotal:</span>
                        <span className="font-medium text-white">R$ {formatCurrency(total)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#ccc]">Frete:</span>
                        <span className="font-medium text-[#4caf50]">Grátis</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold text-white pt-2 border-t border-[#333]">
                        <span>Total:</span>
                        <span className="text-[#b71c1c]">R$ {formatCurrency(total)}</span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-[#1a1a1a] border border-[#333] rounded-lg">
                      <p className="text-sm text-[#ccc] flex items-center">
                        <Shield className="h-4 w-4 mr-2 flex-shrink-0 text-[#4caf50]" />
                        Pagamento 100% seguro com criptografia SSL
                      </p>
                    </div>
                  </div>
                </div>

                {/* Formulário de Checkout */}
                <div className="order-1 lg:order-2">
                  <div className="bg-[#222] border border-[#333] rounded-2xl shadow-lg p-6">
                    {/* Botão para alternar modo de teste */}
                    <div className="mb-4 flex justify-end">
                      <button
                        onClick={() => setUseTestMode(!useTestMode)}
                        className="text-sm text-[#999] hover:text-[#b71c1c] underline transition-colors"
                      >
                        {useTestMode ? 'Usar Stripe Real' : 'Usar Modo Teste'}
                      </button>
                    </div>
                    
                    {useTestMode ? (
                      <TestStripeCheckout 
                        total={total}
                        itens={carrinho}
                        onSuccess={handleSuccess}
                      />
                    ) : (
                      <StripeCheckout 
                        total={total}
                        itens={carrinho}
                        onSuccess={handleSuccess}
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
