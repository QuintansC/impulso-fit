import { useEffect, useMemo, useState } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import Spinner from '@/components/admin/Spinner';
import api from '@/lib/api';
import { PEDIDO_STATUS, PEDIDO_STATUS_COLORS } from '@/lib/constants';
import { Pedido } from '@/types';

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState<number | null>(null);
  const [filtroStatus, setFiltroStatus] = useState('');

  useEffect(() => {
    api.get('/admin/pedidos').then(res => setPedidos(res.data)).finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id: number, status: string) => {
    setAtualizando(id);
    try {
      await api.put(`/admin/pedidos/${id}/status`, { status });
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    } catch {
      alert('Erro ao atualizar status.');
    } finally {
      setAtualizando(null);
    }
  };

  const pedidosFiltrados = useMemo(
    () => filtroStatus ? pedidos.filter(p => p.status === filtroStatus) : pedidos,
    [pedidos, filtroStatus]
  );

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout title="Pedidos">
        <div className="space-y-6">
          {/* Filtro */}
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">Filtrar por status:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFiltroStatus('')}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${!filtroStatus ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'}`}
              >
                Todos
              </button>
              {PEDIDO_STATUS.map(s => (
                <button
                  key={s}
                  onClick={() => setFiltroStatus(s === filtroStatus ? '' : s)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${filtroStatus === s ? PEDIDO_STATUS_COLORS[s] : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-dark-card border border-white/5 rounded-xl overflow-hidden">
            {loading ? (
              <Spinner />
            ) : pedidosFiltrados.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-12">Nenhum pedido encontrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 text-xs uppercase">
                      <th className="text-left px-4 py-3">ID</th>
                      <th className="text-left px-4 py-3">Cliente</th>
                      <th className="text-left px-4 py-3 hidden md:table-cell">Itens</th>
                      <th className="text-left px-4 py-3">Total</th>
                      <th className="text-left px-4 py-3">Status</th>
                      <th className="text-left px-4 py-3 hidden lg:table-cell">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosFiltrados.map(pedido => (
                      <tr key={pedido.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3 text-gray-400 font-mono">#{pedido.id}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-white font-medium">{pedido.usuario?.nome || '—'}</p>
                            <p className="text-gray-500 text-xs">{pedido.usuario?.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                          {pedido.produtos?.length || 0} item(s)
                        </td>
                        <td className="px-4 py-3 text-primary font-semibold">
                          R$ {pedido.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={pedido.status}
                            onChange={e => handleStatus(pedido.id, e.target.value)}
                            disabled={atualizando === pedido.id}
                            className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none transition-colors disabled:opacity-50 ${PEDIDO_STATUS_COLORS[pedido.status] || 'bg-white/5 text-gray-400 border-white/10'}`}
                            style={{ background: 'transparent' }}
                          >
                            {PEDIDO_STATUS.map(s => (
                              <option key={s} value={s} className="bg-[#1a1a1a] text-white">{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                          {new Date(pedido.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <p className="text-gray-600 text-xs">{pedidosFiltrados.length} pedido(s)</p>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
