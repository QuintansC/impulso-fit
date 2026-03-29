import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getMeuPedido } from '@/lib/services/pedidosService';
import type { Pedido } from '@/types';

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pago: { label: 'Pago', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  pendente: { label: 'Pendente', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  enviado: { label: 'Enviado', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  entregue: { label: 'Entregue', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  cancelado: { label: 'Cancelado', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

function statusInfo(status: string) {
  return STATUS_LABEL[status] ?? { label: status, color: 'text-gray-400 bg-gray-400/10 border-gray-400/20' };
}

export default function DetalhePedido() {
  const { usuario, loading } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (loading) return;
    if (!usuario) { router.replace('/login'); return; }
    if (!id) return;

    getMeuPedido(Number(id))
      .then(setPedido)
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 404) setErro('Pedido não encontrado.');
        else if (status === 403) setErro('Você não tem acesso a este pedido.');
        else setErro('Não foi possível carregar o pedido.');
      })
      .finally(() => setCarregando(false));
  }, [usuario, loading, id, router]);

  if (loading || carregando) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Carregando pedido...</div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-dark py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/pedidos" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={18} /> Meus Pedidos
          </Link>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-red-400 text-center">
            {erro}
          </div>
        </div>
      </div>
    );
  }

  if (!pedido) return null;

  const { label, color } = statusInfo(pedido.status);
  const dataFormatada = new Date(pedido.criadoEm).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-dark py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/pedidos" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} /> Meus Pedidos
        </Link>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-6">
          <Package size={26} className="text-primary" />
          <h1 className="text-2xl font-bold text-white">Pedido #{pedido.id}</h1>
          <span className={`ml-2 px-3 py-1 rounded border text-xs font-semibold uppercase ${color}`}>
            {label}
          </span>
        </div>

        {/* Resumo */}
        <div className="bg-dark-card border border-primary/10 rounded-xl p-5 mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 block mb-1">Data</span>
            <span className="text-white">{dataFormatada}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1">Total</span>
            <span className="text-white font-bold text-lg">
              R$ {pedido.total.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        {/* Itens */}
        <div className="bg-dark-card border border-primary/10 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-primary/10">
            <h2 className="text-white font-semibold">Itens do pedido</h2>
          </div>

          {pedido.produtos && pedido.produtos.length > 0 ? (
            <>
              <ul className="divide-y divide-primary/5">
                {pedido.produtos.map((pp) => (
                  <li key={pp.produtoId} className="flex items-center gap-4 px-5 py-4">
                    {pp.produto.imagemUrl && (
                      <img
                        src={pp.produto.imagemUrl}
                        alt={pp.produto.nome}
                        className="w-16 h-16 object-cover rounded-lg bg-dark-light flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{pp.produto.nome}</p>
                      <p className="text-gray-400 text-sm mt-0.5">
                        {pp.quantidade}x — R$ {pp.precoUnitario.toFixed(2).replace('.', ',')} cada
                      </p>
                    </div>
                    <span className="text-white font-semibold flex-shrink-0">
                      R$ {(pp.quantidade * pp.precoUnitario).toFixed(2).replace('.', ',')}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="px-5 py-4 border-t border-primary/10 flex justify-end">
                <span className="text-gray-400 text-sm mr-3">Total</span>
                <span className="text-white font-bold text-lg">
                  R$ {pedido.total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </>
          ) : (
            <p className="px-5 py-6 text-gray-500 text-center">Nenhum item encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
