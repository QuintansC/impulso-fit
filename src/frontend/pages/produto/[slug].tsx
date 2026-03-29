import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { ShoppingCart, Package, Tag, Weight, Star } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProdutoCard from '@/components/ProdutoCard';
import { Produto, Avaliacao } from '@/types';
import { getProduto, getProdutos } from '@/lib/services/produtosService';
import { getAvaliacoes, enviarAvaliacao } from '@/lib/services/avaliacoesService';
import { useCarrinho } from '@/context/CarrinhoContext';
import { useAuth } from '@/context/AuthContext';

type Props = {
  produto: Produto;
  relacionados: Produto[];
};

function Estrelas({ nota, onChange }: { nota: number; onChange?: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={onChange ? 24 : 16}
          className={`${(hover || nota) >= n ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} ${onChange ? 'cursor-pointer transition-colors' : ''}`}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange?.(n)}
        />
      ))}
    </div>
  );
}

export default function ProdutoDetalhePage({ produto, relacionados }: Props) {
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);
  const { adicionarProdutoCompleto } = useCarrinho();
  const { usuario } = useAuth();
  const esgotado = produto.estoque === 0;

  // Avaliações
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erroAvaliacao, setErroAvaliacao] = useState('');

  useEffect(() => {
    getAvaliacoes(produto.id).then(setAvaliacoes).catch(() => {});
  }, [produto.id]);

  const minhaAvaliacao = avaliacoes.find((a) => a.usuarioId === usuario?.id);

  useEffect(() => {
    if (minhaAvaliacao) {
      setNota(minhaAvaliacao.nota);
      setComentario(minhaAvaliacao.comentario);
    }
  }, [minhaAvaliacao]);

  const handleEnviarAvaliacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comentario.trim()) { setErroAvaliacao('Escreva um comentário.'); return; }
    setErroAvaliacao('');
    setEnviando(true);
    try {
      const nova = await enviarAvaliacao(produto.id, nota, comentario);
      setAvaliacoes((prev) => {
        const sem = prev.filter((a) => a.id !== nova.id);
        return [nova, ...sem];
      });
    } catch {
      setErroAvaliacao('Erro ao enviar avaliação. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const mediaNotas = avaliacoes.length
    ? avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length
    : 0;

  const handleAdicionarCarrinho = () => {
    if (esgotado) return;
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

              {/* Estoque */}
              {esgotado ? (
                <div className="mb-6 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium">
                  Produto esgotado — em breve disponível novamente
                </div>
              ) : produto.estoque <= 5 ? (
                <div className="mb-6 px-4 py-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm font-medium">
                  Atenção: apenas {produto.estoque} unidade{produto.estoque > 1 ? 's' : ''} em estoque
                </div>
              ) : null}

              {/* Quantidade */}
              {!esgotado && (
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
                      onClick={() => setQuantidade(q => Math.min(produto.estoque, q + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Botão */}
              <button
                onClick={handleAdicionarCarrinho}
                disabled={esgotado}
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  esgotado
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : adicionado
                    ? 'bg-green-600 text-white'
                    : 'bg-primary hover:bg-primary/90 text-white'
                }`}
              >
                <ShoppingCart size={18} />
                {esgotado ? 'Produto Esgotado' : adicionado ? 'Adicionado ao carrinho!' : 'Adicionar ao Carrinho'}
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
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Package size={14} className="text-primary shrink-0" />
                  <span>Disponibilidade: <span className={produto.estoque === 0 ? 'text-red-400' : 'text-green-400'}>
                    {produto.estoque === 0 ? 'Esgotado' : `${produto.estoque} em estoque`}
                  </span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Avaliações */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-white">Avaliações</h2>
              {avaliacoes.length > 0 && (
                <div className="flex items-center gap-2">
                  <Estrelas nota={Math.round(mediaNotas)} />
                  <span className="text-gray-400 text-sm">
                    {mediaNotas.toFixed(1)} ({avaliacoes.length} {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'})
                  </span>
                </div>
              )}
            </div>

            {/* Formulário */}
            {usuario ? (
              <form onSubmit={handleEnviarAvaliacao} className="bg-dark-card border border-primary/10 rounded-xl p-6 mb-8">
                <h3 className="text-white font-semibold mb-4">
                  {minhaAvaliacao ? 'Editar sua avaliação' : 'Deixe sua avaliação'}
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-gray-400 text-sm">Nota:</span>
                  <Estrelas nota={nota} onChange={setNota} />
                </div>
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={3}
                  placeholder="Conte sua experiência com o produto..."
                  className="w-full px-3 py-2.5 bg-dark-lighter border border-white/10 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-primary/50 placeholder:text-gray-600 mb-3"
                />
                {erroAvaliacao && (
                  <p className="text-red-400 text-sm mb-3">{erroAvaliacao}</p>
                )}
                <button
                  type="submit"
                  disabled={enviando}
                  className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {enviando ? 'Enviando...' : minhaAvaliacao ? 'Atualizar' : 'Publicar avaliação'}
                </button>
              </form>
            ) : (
              <div className="bg-dark-card border border-primary/10 rounded-xl p-5 mb-8 text-center">
                <p className="text-gray-400 text-sm">
                  <Link href="/login" className="text-primary hover:underline font-medium">Faça login</Link>
                  {' '}para deixar uma avaliação.
                </p>
              </div>
            )}

            {/* Lista */}
            {avaliacoes.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma avaliação ainda. Seja o primeiro!</p>
            ) : (
              <ul className="space-y-4">
                {avaliacoes.map((av) => (
                  <li key={av.id} className="bg-dark-card border border-primary/10 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          {av.usuario.nome[0].toUpperCase()}
                        </div>
                        <span className="text-white font-medium text-sm">{av.usuario.nome}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Estrelas nota={av.nota} />
                        <span className="text-gray-500 text-xs">
                          {new Date(av.criadoEm).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{av.comentario}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

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
