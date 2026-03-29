import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import Spinner from '@/components/admin/Spinner';
import api from '@/lib/api';
import { PEDIDO_STATUS_COLORS } from '@/lib/constants';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';
import { Pedido } from '@/types';

type Stats = {
  totalPedidos: number;
  receita: number;
  totalProdutos: number;
  totalUsuarios: number;
  pedidosRecentes: Pedido[];
};


export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/pedidos'),
      api.get('/admin/produtos'),
      api.get('/admin/usuarios'),
    ]).then(([pedidosRes, produtosRes, usuariosRes]) => {
      const pedidos: Pedido[] = pedidosRes.data;
      setStats({
        totalPedidos: pedidos.length,
        receita: pedidos.reduce((sum, p) => sum + p.total, 0),
        totalProdutos: produtosRes.data.length,
        totalUsuarios: usuariosRes.data.length,
        pedidosRecentes: pedidos.slice(0, 5),
      });
    }).finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total de Pedidos', value: stats.totalPedidos, icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Receita Total', value: `R$ ${stats.receita.toFixed(2)}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Produtos Cadastrados', value: stats.totalProdutos, icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Usuários', value: stats.totalUsuarios, icon: Users, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  ] : [];

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout title="Dashboard">
        {loading ? (
          <Spinner className="h-64" />
        ) : stats ? (
          <div className="space-y-8">
            {/* Cards de stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {cards.map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className={`rounded-xl border p-5 flex items-center gap-4 ${bg}`}>
                  <div className={`p-3 rounded-lg bg-white/5`}>
                    <Icon size={22} className={color} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-medium">{label}</p>
                    <p className={`text-xl font-bold mt-0.5 ${color}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pedidos recentes */}
            <div>
              <h2 className="text-white font-semibold text-base mb-4">Pedidos Recentes</h2>
              <div className="bg-dark-card border border-white/5 rounded-xl overflow-hidden">
                {stats.pedidosRecentes.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">Nenhum pedido ainda.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5 text-gray-500 text-xs uppercase">
                        <th className="text-left px-4 py-3">ID</th>
                        <th className="text-left px-4 py-3">Cliente</th>
                        <th className="text-left px-4 py-3">Total</th>
                        <th className="text-left px-4 py-3">Status</th>
                        <th className="text-left px-4 py-3">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.pedidosRecentes.map((pedido) => (
                        <tr key={pedido.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                          <td className="px-4 py-3 text-gray-400">#{pedido.id}</td>
                          <td className="px-4 py-3 text-white">{pedido.usuario?.nome || '—'}</td>
                          <td className="px-4 py-3 text-primary font-medium">R$ {pedido.total.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full border ${PEDIDO_STATUS_COLORS[pedido.status] || 'bg-gray-500/20 text-gray-400'}`}>
                              {pedido.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">
                            {new Date(pedido.criadoEm).toLocaleDateString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </AdminLayout>
    </ProtectedRoute>
  );
}
