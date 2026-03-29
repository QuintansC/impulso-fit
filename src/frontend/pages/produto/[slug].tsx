import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { ShoppingCart, Package, Tag, Weight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProdutoCard from '@/components/ProdutoCard';
import { Produto } from '@/types';
import { getProduto, getProdutos } from '@/lib/services/produtosService';
import { useCarrinho } from '@/context/CarrinhoContext';

type Props = {
  produto: Produto;
  relacionados: Produto[];
};

export default function ProdutoDetalhePage({ produto, relacionados }: Props) {
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);
  const { adicionarProdutoCompleto } = useCarrinho();

  const handleAdicionarCarrinho = () => {
    adicionarProdutoCompleto(produto, quantidade);
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  };

  return (
    <>
      <Head>
        <title>{`${produto.nome} | Impulso Fit`}</title>
        <meta name="description" content={produto.descricao} />
      </Head>
      <Header />
      <main className="bg-[#111111] min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-10">

          {/* Produto principal */}
          <div className="grid md:grid-cols-2 gap-10 mb-16">
            {/* Imagem */}
            <div className="flex flex-col items-center">
              <div className="w-full aspect-square max-w-sm rounded-2xl overflow-hidden border border-white/10 bg-dark-lighter">
                <img
                  src={produto.imagemUrl}
                  alt={produto.nome}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop';
                  }}
                />
              </div>
              <span className="text-xs text-gray-600 mt-3">Imagem meramente ilustrativa.</span>
            </div>

            {/* Informações */}
            <div className="flex flex-col">
              {produto.categoria && (
                <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
                  {produto.categoria.nome}
                </span>
              )}
              <h1 className="text-3xl font-bold text-white mb-3">{produto.nome}</h1>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{produto.descricao}</p>

              <div className="text-3xl font-bold text-primary mb-8">
                R$ {produto.preco.toFixed(2)}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ou 5x de R$ {(produto.preco / 5).toFixed(2)} sem juros
                </span>
              </div>

              {/* Quantidade */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-gray-400 text-sm">Quantidade:</span>
                <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                  <button
                    className="px-4 py-2 text-white hover:bg-white/5 transition"
                    onClick={() => setQuantidade(q => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-white text-sm font-semibold w-12 text-center">
                    {quantidade}
                  </span>
                  <button
                    className="px-4 py-2 text-white hover:bg-white/5 transition"
                    onClick={() => setQuantidade(q => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botão */}
              <button
                onClick={handleAdicionarCarrinho}
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  adicionado
                    ? 'bg-green-600 text-white'
                    : 'bg-primary hover:bg-primary/90 text-white'
                }`}
              >
                <ShoppingCart size={18} />
                {adicionado ? 'Adicionado ao carrinho!' : 'Adicionar ao Carrinho'}
              </button>

              {/* Benefícios */}
              <div className="mt-6 space-y-2 text-sm text-gray-400 border-t border-white/5 pt-6">
                <p><span className="text-white font-medium">Frete grátis</span> para todo Brasil acima de R$ 250,00</p>
                <p><span className="text-white font-medium">Entrega:</span> consulte prazo no carrinho</p>
              </div>

              {/* Detalhes do produto */}
              <div className="mt-6 border-t border-white/5 pt-6 space-y-3">
                <h2 className="text-white font-semibold text-sm mb-3">Detalhes do produto</h2>
                {produto.categoria && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Tag size={14} className="text-primary shrink-0" />
                    <span>Categoria: <span className="text-white">{produto.categoria.nome}</span></span>
                  </div>
                )}
                {produto.peso && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Weight size={14} className="text-primary shrink-0" />
                    <span>Peso: <span className="text-white">{produto.peso}g</span></span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Package size={14} className="text-primary shrink-0" />
                  <span>Marca: <span className="text-white">Impulso Fit</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Produtos relacionados */}
          {relacionados.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-6">Você também pode gostar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relacionados.map(p => (
                  <ProdutoCard key={p.id} produto={p} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.slug as string;
  try {
    const [produto, todos] = await Promise.all([getProduto(id), getProdutos()]);
    const relacionados = todos
      .filter(p => p.categoriaId === produto.categoriaId && p.id !== produto.id)
      .slice(0, 4);
    return { props: { produto, relacionados } };
  } catch {
    return { notFound: true };
  }
};
