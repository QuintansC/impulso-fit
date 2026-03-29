import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import Spinner from '@/components/admin/Spinner';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Shield, User } from 'lucide-react';
import { UsuarioAdmin } from '@/types';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState<number | null>(null);
  const { usuario: eu } = useAuth();

  useEffect(() => {
    api.get('/admin/usuarios').then(res => setUsuarios(res.data)).finally(() => setLoading(false));
  }, []);

  const handleToggleRole = async (id: number, roleAtual: string) => {
    if (id === eu?.id) return; // não pode alterar a própria role
    const novaRole = roleAtual === 'admin' ? 'cliente' : 'admin';
    if (!confirm(`Alterar "${roleAtual}" → "${novaRole}" para este usuário?`)) return;
    setAtualizando(id);
    try {
      await api.put(`/admin/usuarios/${id}/role`, { role: novaRole });
      setUsuarios(prev => prev.map(u => u.id === id ? { ...u, role: novaRole } : u));
    } catch {
      alert('Erro ao atualizar role.');
    } finally {
      setAtualizando(null);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout title="Usuários">
        <div className="space-y-4">
          <div className="bg-dark-card border border-white/5 rounded-xl overflow-hidden">
            {loading ? (
              <Spinner />
            ) : usuarios.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-12">Nenhum usuário encontrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 text-xs uppercase">
                      <th className="text-left px-4 py-3">Usuário</th>
                      <th className="text-left px-4 py-3 hidden md:table-cell">Pedidos</th>
                      <th className="text-left px-4 py-3 hidden lg:table-cell">Cadastro</th>
                      <th className="text-left px-4 py-3">Role</th>
                      <th className="text-right px-4 py-3">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(u => (
                      <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                              {u.nome[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-medium flex items-center gap-1.5">
                                {u.nome}
                                {u.id === eu?.id && <span className="text-xs text-gray-500">(você)</span>}
                              </p>
                              <p className="text-gray-500 text-xs">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                          {u._count.pedidos}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                          {new Date(u.criadoEm).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                            u.role === 'admin'
                              ? 'bg-primary/20 text-primary border-primary/30'
                              : 'bg-white/5 text-gray-400 border-white/10'
                          }`}>
                            {u.role === 'admin' ? <Shield size={11} /> : <User size={11} />}
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {u.id !== eu?.id && (
                            <button
                              onClick={() => handleToggleRole(u.id, u.role)}
                              disabled={atualizando === u.id}
                              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                                u.role === 'admin'
                                  ? 'bg-white/5 text-gray-400 border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
                                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-primary/10 hover:text-primary hover:border-primary/20'
                              }`}
                            >
                              {atualizando === u.id ? '...' : u.role === 'admin' ? 'Remover admin' : 'Tornar admin'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <p className="text-gray-600 text-xs">{usuarios.length} usuário(s) cadastrado(s)</p>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
