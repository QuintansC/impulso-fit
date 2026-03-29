import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import Spinner from '@/components/admin/Spinner';
import api from '@/lib/api';
import { Plus, Pencil, Check, X } from 'lucide-react';

type Categoria = { id: number; nome: string; produtos: any[]; subcategorias: any[] };

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoNome, setNovoNome] = useState('');
  const [criando, setCriando] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoNome, setEditandoNome] = useState('');

  const carregar = () => {
    api.get('/admin/categorias').then(res => setCategorias(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  const handleCriar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) return;
    setCriando(true);
    try {
      await api.post('/admin/categorias', { nome: novoNome.trim() });
      setNovoNome('');
      carregar();
    } catch {
      alert('Erro ao criar categoria.');
    } finally {
      setCriando(false);
    }
  };

  const handleEditar = async (id: number) => {
    if (!editandoNome.trim()) return;
    try {
      await api.put(`/admin/categorias/${id}`, { nome: editandoNome.trim() });
      setCategorias(prev => prev.map(c => c.id === id ? { ...c, nome: editandoNome.trim() } : c));
      setEditandoId(null);
    } catch {
      alert('Erro ao editar categoria.');
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout title="Categorias">
        <div className="max-w-2xl space-y-6">
          {/* Criar nova */}
          <div className="bg-dark-card border border-white/5 rounded-xl p-5">
            <h2 className="text-white font-semibold text-sm mb-4">Nova Categoria</h2>
            <form onSubmit={handleCriar} className="flex gap-3">
              <input
                type="text"
                value={novoNome}
                onChange={e => setNovoNome(e.target.value)}
                placeholder="Nome da categoria"
                className="flex-1 px-3 py-2.5 bg-dark-lighter border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-gray-600"
              />
              <button
                type="submit"
                disabled={criando || !novoNome.trim()}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
              >
                <Plus size={15} />
                {criando ? 'Criando...' : 'Criar'}
              </button>
            </form>
          </div>

          {/* Lista */}
          <div className="bg-dark-card border border-white/5 rounded-xl overflow-hidden">
            {loading ? (
              <Spinner />
            ) : categorias.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-12">Nenhuma categoria cadastrada.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-gray-500 text-xs uppercase">
                    <th className="text-left px-4 py-3">Nome</th>
                    <th className="text-left px-4 py-3 hidden sm:table-cell">Produtos</th>
                    <th className="text-right px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map(cat => (
                    <tr key={cat.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        {editandoId === cat.id ? (
                          <input
                            value={editandoNome}
                            onChange={e => setEditandoNome(e.target.value)}
                            className="px-2 py-1 bg-dark-lighter border border-primary/50 rounded text-white text-sm focus:outline-none w-48"
                            autoFocus
                          />
                        ) : (
                          <span className="text-white font-medium">{cat.nome}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">
                        {cat.produtos?.length || 0} produto(s)
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          {editandoId === cat.id ? (
                            <>
                              <button onClick={() => handleEditar(cat.id)} className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">
                                <Check size={15} />
                              </button>
                              <button onClick={() => setEditandoId(null)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition-colors">
                                <X size={15} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => { setEditandoId(cat.id); setEditandoNome(cat.nome); }}
                              className="p-2 rounded-lg bg-white/5 hover:bg-primary/10 text-gray-400 hover:text-primary transition-colors"
                            >
                              <Pencil size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
