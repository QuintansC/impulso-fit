import { Produto } from '@/types';

type Props = {
  produto: Produto;
  quantidade: number;
  onRemove: () => void;
};

export default function CartItem({ produto, quantidade, onRemove }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-primary/10 py-4">
      <div className="flex items-center gap-4">
        <img
          src={produto.imagemUrl?.startsWith('http') ? produto.imagemUrl : `${process.env.NEXT_PUBLIC_URL_FRONTEND || ''}/${produto.imagemUrl}`}
          alt={produto.nome}
          className="w-16 h-16 object-cover rounded-lg border border-primary/20"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop';
          }}
        />
        <div>
          <h3 className="text-lg font-display font-medium text-white">{produto.nome}</h3>
          <p className="text-sm text-gray-500">{quantidade}x - R$ {produto.preco.toFixed(2)} cada</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-display font-semibold text-primary text-lg">
          R$ {(produto.preco * quantidade).toFixed(2)}
        </p>
        <button
          onClick={onRemove}
          className="text-secondary text-sm hover:text-primary hover:underline transition"
        >
          Remover
        </button>
      </div>
    </div>
  );
}
