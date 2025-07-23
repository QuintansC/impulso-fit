import { Produto } from '@/types';

type Props = {
  produto: Produto;
  quantidade: number;
  onRemove: () => void;
};

export default function CartItem({ produto, quantidade, onRemove }: Props) {
  return (
    <div className="flex items-center justify-between border-b py-4">
      <div>
        <h3 className="text-lg font-medium">{produto.nome}</h3>
        <p className="text-sm text-gray-500">{quantidade}x</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-yellow-800">
          R$ {(produto.preco * quantidade).toFixed(2)}
        </p>
        <button
          onClick={onRemove}
          className="text-red-500 text-sm hover:underline"
        >
          Remover
        </button>
      </div>
    </div>
  );
}
