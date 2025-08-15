import Link from 'next/link';
import { Produto } from '@/types';

type Props = {
  produto: Produto;
};
import { useCarrinho } from '@/context/CarrinhoContext';

export default function ProdutoCard({ produto }: Props) {
  const { carrinho, adicionarProdutoCompleto, removerProduto, limparCarrinho } = useCarrinho();
  
  const adicionarAoCarrinho = () => {
    adicionarProdutoCompleto(produto, 1);
  };
  return (
    <div className="border border-[#b71c1c] rounded-xl shadow-sm hover:shadow-md transition bg-[#111111] overflow-hidden max-w-xs w-full flex flex-col" style={{ minHeight: 420 }}>
      <div className="w-full h-56 overflow-hidden bg-[#222] flex items-center justify-center">
        <img
          src={`${process.env.NEXT_PUBLIC_URL_FRONTEND}/${produto.imagemUrl}`}
          alt={produto.nome}
          className="w-full h-full object-cover object-center"
          style={{ maxHeight: '224px', minHeight: '224px' }}
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/produto/${produto.id}`} className="block">
            <h3 className="text-lg font-semibold text-white hover:text-[#b71c1c] transition">{produto.nome}</h3>
          </Link>
          <p className="text-sm text-gray-300 mt-1">{produto.descricao}</p>
        </div>
        <div>
          <div className="mt-3 font-bold text-[#b71c1c] text-lg">R$ {produto.preco.toFixed(2)}</div>
          <button 
            onClick={adicionarAoCarrinho}
            className="mt-4 w-full bg-[#b71c1c] text-white py-2 rounded hover:bg-white hover:text-[#b71c1c] border border-[#b71c1c] transition font-bold"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
