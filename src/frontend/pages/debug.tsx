import { useState } from 'react';
import Head from 'next/head';
import { useDebugPedidos } from '../lib/debug-pedidos';
import { useCarrinho } from '../context/CarrinhoContext';

export default function DebugPage() {
  const debugInfo = useDebugPedidos();
  const { carrinho, adicionarProdutoCompleto } = useCarrinho();
  const [testeResultado, setTesteResultado] = useState<any>(null);

  const adicionarProdutoTeste = () => {
    const produtoTeste = {
      id: '1',
      nome: 'Café Premium Teste',
      preco: 15.90,
      imagemUrl: '/cafe1.jpg',
      descricao: 'Café premium para teste'
    };
    
    adicionarProdutoCompleto(produtoTeste, 2);
  };

  const testarAPIBackend = async () => {
    try {
      const response = await fetch(`${debugInfo.ambiente.apiUrl}/api/produtos`);
      const data = await response.json();
      setTesteResultado({
        sucesso: true,
        status: response.status,
        produtos: data?.length || 0,
        dados: data
      });
    } catch (error: any) {
      setTesteResultado({
        sucesso: false,
        erro: error.message
      });
    }
  };

  return (
    <>
      <Head>
        <title>Debug - Sistema de Pedidos</title>
      </Head>

      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug - Sistema de Pedidos</h1>

          {/* Estado do Carrinho */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Estado do Carrinho</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Existe:</strong> {debugInfo.carrinho.existe ? '✅' : '❌'}</p>
                <p><strong>Quantidade de itens:</strong> {debugInfo.carrinho.quantidade}</p>
                <p><strong>Carrinho válido:</strong> {debugInfo.validacao.carrinhoValido ? '✅' : '❌'}</p>
                <p><strong>Dados completos:</strong> {debugInfo.validacao.dadosCompletos ? '✅' : '❌'}</p>
              </div>
              <div>
                <button
                  onClick={adicionarProdutoTeste}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Adicionar Produto de Teste
                </button>
              </div>
            </div>
            
            {/* Detalhes dos itens */}
            {debugInfo.carrinho.itens.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">Itens do Carrinho:</h3>
                <div className="space-y-2">
                  {debugInfo.carrinho.itens.map((item, index) => (
                    <div key={index} className="border rounded p-3 bg-gray-50">
                      <p><strong>ID:</strong> {item.id} {item.temId ? '✅' : '❌'}</p>
                      <p><strong>Nome:</strong> {item.nome} {item.temNome ? '✅' : '❌'}</p>
                      <p><strong>Preço:</strong> R$ {item.preco} {item.temPreco ? '✅' : '❌'}</p>
                      <p><strong>Quantidade:</strong> {item.quantidade} {item.temQuantidade ? '✅' : '❌'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Configuração do Ambiente */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Configuração do Ambiente</h2>
            <div className="space-y-2">
              <p><strong>API URL:</strong> {debugInfo.ambiente.apiUrl}</p>
              <p><strong>Stripe Key configurada:</strong> {debugInfo.ambiente.stripeKey ? '✅' : '❌'}</p>
            </div>
            
            <div className="mt-4">
              <button
                onClick={testarAPIBackend}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Testar Conexão com Backend
              </button>
              
              {testeResultado && (
                <div className={`mt-4 p-4 rounded ${testeResultado.sucesso ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {testeResultado.sucesso ? (
                    <>
                      <p>✅ Backend respondeu com status {testeResultado.status}</p>
                      <p>📦 {testeResultado.produtos} produtos encontrados</p>
                    </>
                  ) : (
                    <p>❌ Erro: {testeResultado.erro}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* JSON Debug */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Debug JSON</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}
