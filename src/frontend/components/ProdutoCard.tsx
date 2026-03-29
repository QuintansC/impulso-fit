import Link from 'next/link';
import { Produto } from '@/types';

type Props = {
  produto: Produto;
};
import { useCarrinho } from '@/context/CarrinhoContext';

export default function ProdutoCard({ produto }: Props) {
  const { carrinho, adicionarProdutoCompleto, removerProduto, limparCarrinho } = useCarrinho();
  
  const esgotado = produto.estoque === 0;

  const adicionarAoCarrinho = () => {
    if (esgotado) return;
    adicionarProdutoCompleto(produto, 1);
  };

  return (
    <div className="card-fitness rounded-xl overflow-hidden max-w-xs w-full flex flex-col group" style={{ minHeight: 420 }}>
      <div className="relative w-full h-56 overflow-hidden bg-dark-lighter flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <img
          src={produto.imagemUrl?.startsWith('http') ? produto.imagemUrl : `${process.env.NEXT_PUBLIC_URL_FRONTEND || ''}/${produto.imagemUrl}`}
          alt={produto.nome}
          className={`w-full h-full object-cover object-center transition-transform duration-300 ${esgotado ? 'grayscale opacity-60' : 'group-hover:scale-110'}`}
          style={{ maxHeight: '224px', minHeight: '224px' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop';
          }}
        />
        {esgotado ? (
          <div className="absolute top-3 right-3">
            <div className="bg-gray-800/90 backdrop-blur-sm text-gray-300 text-xs font-bold px-2 py-1 rounded-full border border-gray-600">
              Esgotado
            </div>
          </div>
        ) : produto.estoque <= 5 ? (
          <div className="absolute top-3 right-3">
            <div className="bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
              Últimas unidades
            </div>
          </div>
        ) : (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-primary/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
              Novo
            </div>
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between bg-dark-card">
        <div>
          <Link href={`/produto/${produto.id}`} className="block">
            <h3 className="text-lg font-display font-bold text-white group-hover:text-gradient transition-all mb-2 line-clamp-2">
              {produto.nome}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{produto.descricao}</p>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2 mb-3">
            <span className={`font-display font-bold text-2xl ${esgotado ? 'text-gray-500' : 'text-primary'}`}>
              R$ {produto.preco.toFixed(2)}
            </span>
            {!esgotado && <span className="text-xs text-gray-500 line-through">R$ {(produto.preco * 1.2).toFixed(2)}</span>}
          </div>
          <button
            onClick={adicionarAoCarrinho}
            disabled={esgotado}
            className={`w-full py-3 rounded-lg font-semibold text-sm uppercase tracking-wide shadow-lg transition-colors ${
              esgotado
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'btn-primary text-white'
            }`}
          >
            {esgotado ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
          </button>
        </div>
      </div>
    </div>
  );
}
