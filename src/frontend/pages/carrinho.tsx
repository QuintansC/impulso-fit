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

  useEffect(() => {
    // console.log('Produtos carregados:', produtos);
    // console.log('Carrinho:', carrinho.length);
    // console.log(getProduto(1))
  }, [produtos, carrinho]); 

  const getProduto = (id: string) => {
    return produtos.find(p => p.id === id);
  }

  const total = carrinho.reduce((acc, item) => {
    console.log(`Esse é o id do item: ${acc}`);
    const produto = getProduto(item.id);
    return acc + (produto ? produto.preco * item.quantidade : 0);
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
                const produto = getProduto(item.id);
                if (!produto) return null;
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
