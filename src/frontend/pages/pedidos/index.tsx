import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getMeusPedidos } from '@/lib/services/pedidosService';
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

export default function MeusPedidos() {
  const { usuario, loading } = useAuth();
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (loading) return;
    if (!usuario) { router.replace('/login'); return; }

    getMeusPedidos()
      .then(setPedidos)
      .catch(() => setErro('Não foi possível carregar seus pedidos.'))
      .finally(() => setCarregando(false));
  }, [usuario, loading, router]);

  if (loading || carregando) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Carregando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Package size={28} className="text-primary" />
          <h1 className="text-2xl font-bold text-white">Meus Pedidos</h1>
        </div>

        {erro && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 mb-6">
            {erro}
          </div>
        )}

        {!erro && pedidos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag size={56} className="text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg mb-6">Você ainda não fez nenhum pedido.</p>
            <Link
              href="/produtos"
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Ver produtos
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {pedidos.map((pedido) => {
            const { label, color } = statusInfo(pedido.status);
            const data = new Date(pedido.criadoEm).toLocaleDateString('pt-BR', {
              day: '2-digit', month: '2-digit', year: 'numeric',
            });
            const totalItens = pedido.produtos?.reduce((acc, p) => acc + p.quantidade, 0) ?? 0;

            return (
              <Link
                key={pedido.id}
                href={`/pedidos/${pedido.id}`}
                className="block bg-dark-card border border-primary/10 rounded-xl p-5 hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-bold text-lg">Pedido #{pedido.id}</span>
                  <ChevronRight size={18} className="text-gray-500 group-hover:text-primary transition-colors" />
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-gray-400">{data}</span>
                  <span className="text-gray-400">{totalItens} {totalItens === 1 ? 'item' : 'itens'}</span>
                  <span className="text-white font-semibold">
                    R$ {pedido.total.toFixed(2).replace('.', ',')}
                  </span>
                  <span className={`px-2 py-0.5 rounded border text-xs font-semibold uppercase ${color}`}>
                    {label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
