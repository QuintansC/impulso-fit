import Link from 'next/link';
import { Produto } from '@/types';

type Props = {
  produto: Produto;
};
import { useCarrinho } from '@/context/CarrinhoContext';

export default function ProdutoCard({ produto }: Props) {
  const { carrinho, adicionarProduto, removerProduto, limparCarrinho } = useCarrinho();
  return (
    <div className="border rounded-xl shadow-sm hover:shadow-md transition bg-white overflow-hidden max-w-xs w-full flex flex-col" style={{ minHeight: 420 }}>
      <div className="w-full h-56 overflow-hidden bg-gray-100 flex items-center justify-center">
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
            <h3 className="text-lg font-semibold text-yellow-800 hover:text-yellow-900 transition">{produto.nome}</h3>
          </Link>
          <p className="text-sm text-gray-600 mt-1">{produto.descricao}</p>
        </div>
        <div>
          <div className="mt-3 font-bold text-yellow-700">R$ {produto.preco.toFixed(2)}</div>
          <button className="mt-4 w-full bg-yellow-800 text-white py-2 rounded hover:bg-yellow-900 transition">
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
