import { useEffect, useState } from 'react';
import { Produto } from '@/types';
import CartItem from '@/components/CartItem';
import { getProdutos } from '@/lib/api';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useCarrinho } from '@/context/CarrinhoContext';

export default function CarrinhoPage() {
  const { carrinho, removerProduto } = useCarrinho();
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    getProdutos().then(setProdutos);
  }, []); 

  const getProduto = (id: string) => {
    return produtos.find(p => p.id === id);
  }

  const total = carrinho.reduce((acc, item) => {
    // Agora o item já tem o preço, não precisa buscar
    return acc + (item.preco * item.quantidade);
  }, 0);

  return (
    <>
      <Header />
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Seu Carrinho</h1>
        {carrinho.length === 0 ? (
          <p className="text-gray-500">Seu carrinho está vazio.</p>
        ) : (
          <>
            <div className="space-y-4">
              {carrinho.map((item: any) => {
                // Agora podemos usar diretamente o item do carrinho
                const produto = {
                  id: item.id,
                  nome: item.nome,
                  preco: item.preco,
                  imagemUrl: item.imagemUrl,
                  descricao: item.descricao,
                  categoriaId: 1, // Valor padrão para compatibilidade
                  criadoEm: new Date().toISOString() // Valor padrão
                };
                
                return (
                  <CartItem
                    key={item.id}
                    produto={produto}
                    quantidade={item.quantidade}
                    onRemove={() => removerProduto(item.id)}
                  />
                );
              })}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <span className="font-semibold text-lg">
                Total: R$ {total.toFixed(2)}
              </span>
              <Link
                href="/checkout"
                className="bg-yellow-800 text-white px-6 py-2 rounded hover:bg-yellow-900"
              >
                Finalizar Compra
              </Link>
            </div>
          </>
        )}
      </section>
      <Footer />
    </>
  );
}
