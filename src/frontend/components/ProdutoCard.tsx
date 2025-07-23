import Link from 'next/link';
import { Produto } from '@/types';

type Props = {
  produto: Produto;
};
import { useCarrinho } from '@/context/CarrinhoContext';

export default function ProdutoCard({ produto }: Props) {
  const { carrinho, adicionarProduto, removerProduto, limparCarrinho } = useCarrinho();
  return (
    <div className="border rounded-xl shadow-sm hover:shadow-md transition bg-white overflow-hidden">
      <Link href={`/produto/${produto.id}`} className="block">
        <img
          src={'/cafe1.jpg'}
          alt={produto.nome}
          className="w-full h-56 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-yellow-800">{produto.nome}</h3>
          <p className="text-sm text-gray-600 mt-1">{produto.descricao}</p>
          <div className="mt-3 font-bold text-yellow-700">R$ {produto.preco.toFixed(2)}</div>
          <button className="mt-4 w-full bg-yellow-800 text-white py-2 rounded hover:bg-yellow-900 transition">
            Comprar
          </button>
        </div>
      </Link>
    </div>
  );
}
