import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Produto } from '@/types';
import { getProduto } from '@/lib/services/produtosService';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useState } from 'react';
import { useCarrinho } from '@/context/CarrinhoContext';

type props = {
  produto: Produto | null;
};

export default function ProdutoDetalhePage({ produto }: props) {
  const [quantidade, setQuantidade] = useState(1);
  const { adicionarProdutoCompleto } = useCarrinho();
  if (!produto) {
    return (
      <>
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-10 min-h-screen">
          <h1 className="text-2xl font-bold text-[#b71c1c]">Produto não encontrado</h1>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`${produto.nome} | Impulso Fit`}</title>
      </Head>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10 bg-[#111111] min-h-screen">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Imagem do produto */}
          <div className="flex flex-col items-center">
            <img
              src={produto.imagemUrl?.startsWith('http') ? produto.imagemUrl : `${process.env.NEXT_PUBLIC_URL_FRONTEND || ''}/${produto.imagemUrl}`}
              alt={produto.nome}
              className="w-full max-w-xs h-auto rounded-xl shadow mb-4 border border-primary/20"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop';
              }}
            />
            <span className="text-xs text-gray-400">Imagem meramente ilustrativa.</span>
          </div>

          {/* Informações principais */}
          <div>
            <h1 className="text-3xl font-display font-bold text-gradient mb-2">{produto.nome}</h1>
            <p className="text-gray-400 mb-4">{produto.descricao}</p>
            <div className="text-2xl font-display font-bold text-primary mb-6">
              R$ {produto.preco.toFixed(2)}
            </div>

            {/* Quantidade */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-white">Quantidade:</span>
              <button
                className="px-3 py-1 bg-dark-light border border-primary/30 text-white rounded-l hover:bg-primary/20 transition"
                onClick={() => setQuantidade(q => Math.max(1, q - 1))}
              >-</button>
              <input
                placeholder='1'
                type="number"
                min={1}
                value={quantidade}
                onChange={e => setQuantidade(Math.max(1, Number(e.target.value)))}
                className="w-12 text-center border border-primary/30 rounded bg-dark-light text-white"
              />
              <button
                className="px-3 py-1 bg-dark-light border border-primary/30 text-white rounded-r hover:bg-primary/20 transition"
                onClick={() => setQuantidade(q => q + 1)}
              >+</button>
            </div>

            {/* Botão de compra */}
            <button 
              onClick={() => { adicionarProdutoCompleto(produto, quantidade) }} 
              className="btn-primary text-white px-6 py-3 rounded-lg w-full font-semibold mb-4"
            >
              Adicionar ao Carrinho
            </button>

            {/* Entrega e benefícios */}
            <div className="card-fitness rounded-lg p-4 mb-4 text-sm">
              <div className="mb-2 text-gray-400"><strong className="text-white">Entrega:</strong> Consulte o prazo e valor no carrinho.</div>
              <div className="mb-2 text-gray-400"><strong className="text-primary">Frete grátis</strong> <span className="text-white">para todo Brasil acima de R$ 250,00.</span></div>
              <div className="text-gray-400"><strong className="text-secondary">Parcele</strong> <span className="text-white">em até 5x sem juros.</span></div>
            </div>

            {/* Informações adicionais */}
            <div className="mt-6">
              <h2 className="text-lg font-display font-bold text-gradient mb-2">Informações do produto</h2>
              <ul className="list-disc pl-5 text-gray-400 space-y-1">
                <li>Peso: {`${produto.peso || 200}g`}</li>
                <li>Categoria: {produto.categoriaId || 'Suplemento'}</li>
                <li>Marca: Impulso Fit</li>
                {/* Adicione mais informações conforme necessário */}
              </ul>
            </div>
          </div>
        </div>

        {/* Área de perguntas */}
        <section className="mt-10">
          <h2 className="text-lg font-display font-bold text-gradient mb-4">Pergunte sobre o produto</h2>
          <form className="flex flex-col gap-3 max-w-md">
            <textarea
              className="border border-primary/30 rounded-lg p-2 bg-dark-light text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={3}
              placeholder="Digite sua dúvida sobre este produto..."
            />
            <button
              type="submit"
              className="btn-primary text-white px-4 py-2 rounded-lg transition self-end"
            >
              Enviar pergunta
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.slug as string;
  const produto = await getProduto(id);
  return {
    props: {
      produto
    },
  };
};
