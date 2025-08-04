import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Produto } from '@/types';
import { getProduto } from '@/lib/api';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useState } from 'react';
import { useCarrinho } from '@/context/CarrinhoContext';

type props = {
  produto: Produto | null;
};

export default function ProdutoDetalhePage({ produto }: props) {
  const [quantidade, setQuantidade] = useState(1);
  const { adicionarProdutoQuantidade } = useCarrinho();
  if (!produto) {
    return (
      <>
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-red-700">Produto não encontrado</h1>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`${produto.nome} | Café América`}</title>
      </Head>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Imagem do produto */}
          <div className="flex flex-col items-center">
            <img
              src={process.env.NEXT_PUBLIC_URL_FRONTEND +'/'+ produto.imagemUrl || '/cafe1.jpg'}
              alt={produto.nome}
              className="w-full max-w-xs h-auto rounded-xl shadow mb-4"
            />
            <span className="text-xs text-gray-400">Imagem meramente ilustrativa.</span>
          </div>

          {/* Informações principais */}
          <div>
            <h1 className="text-3xl font-bold text-yellow-800 mb-2">{produto.nome}</h1>
            <p className="text-gray-700 mb-4">{produto.descricao}</p>
            <div className="text-2xl font-bold text-yellow-700 mb-6">
              R$ {produto.preco.toFixed(2)}
            </div>

            {/* Quantidade */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-gray-700">Quantidade:</span>
              <button
                className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                onClick={() => setQuantidade(q => Math.max(1, q - 1))}
              >-</button>
              <input
                placeholder='1'
                type="number"
                min={1}
                value={quantidade}
                onChange={e => setQuantidade(Math.max(1, Number(e.target.value)))}
                className="w-12 text-center border border-gray-300 rounded"
              />
              <button
                className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                onClick={() => setQuantidade(q => q + 1)}
              >+</button>
            </div>

            {/* Botão de compra */}
            <button onClick={()=>{ adicionarProdutoQuantidade(produto.id, quantidade) }} className="bg-yellow-800 text-white px-6 py-3 rounded hover:bg-yellow-900 transition w-full font-semibold mb-4">
              Adicionar ao carrinho
            </button>

            {/* Entrega e benefícios */}
            <div className="bg-gray-50 rounded p-4 mb-4 text-sm text-gray-700">
              <div className="mb-2"><strong>Entrega:</strong> Consulte o prazo e valor no carrinho.</div>
              <div className="mb-2"><strong>Frete grátis</strong> para Sul e Sudeste acima de R$ 250,00.</div>
              <div><strong>Parcele</strong> em até 5x sem juros.</div>
            </div>

            {/* Informações adicionais */}
            <div className="mt-6">
              <h2 className="text-lg font-bold text-yellow-800 mb-2">Informações do produto</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Peso: {`${produto.peso}g` || '200g'}</li>
                <li>Categoria: {produto.categoriaId || 'Cappuccino'}</li>
                <li>Marca: Café América</li>
                {/* Adicione mais informações conforme necessário */}
              </ul>
            </div>
          </div>
        </div>

        {/* Área de perguntas */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-yellow-800 mb-4">Pergunte sobre o produto</h2>
          <form className="flex flex-col gap-3 max-w-md">
            <textarea
              className="border border-gray-300 rounded p-2"
              rows={3}
              placeholder="Digite sua dúvida sobre este produto..."
            />
            <button
              type="submit"
              className="bg-yellow-800 text-white px-4 py-2 rounded hover:bg-yellow-900 transition self-end"
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
