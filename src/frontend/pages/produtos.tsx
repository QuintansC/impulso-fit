import { useEffect, useState } from 'react';
import { Produto } from '@/types';
import { getProdutos } from '@/lib/api';
import ProdutoCard from '@/components/ProdutoCard';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    getProdutos().then(setProdutos);
  }, []);

  return (
    <>
      <Head>
        <title>Produtos | Café América</title>
      </Head>
      <Header />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-yellow-800 mb-6">Nossos Produtos</h1>

        {produtos.length === 0 ? (
          <p className="text-gray-500">Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {produtos.map(prod => (
              <ProdutoCard key={prod.id} produto={prod} />
            ))}
          </div>
        )}
      </section>
      <Footer/>
    </>
  );
}
