import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import Spinner from '@/components/admin/Spinner';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Produto } from '@/types';
import * as produtosService from '@/lib/services/admin/produtosService';

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [deletando, setDeletando] = useState<number | null>(null);

  const carregar = () => {
    setLoading(true);
    produtosService.getProdutos()
      .then(setProdutos)
      .finally(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  const handleDeletar = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${nome}"?`)) return;
    setDeletando(id);
    try {
      await produtosService.deletarProduto(id);
      setProdutos(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Erro ao excluir produto.');
    } finally {
      setDeletando(null);
    }
  };

  const produtosFiltrados = useMemo(
    () => produtos.filter(p =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.categoria?.nome.toLowerCase().includes(busca.toLowerCase())
    ),
    [produtos, busca],
  );

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout title="Produtos">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por nome ou categoria..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-dark-card border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50"
              />
            </div>
            <Link
              href="/admin/produtos/novo"
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus size={16} />
              Novo Produto
            </Link>
          </div>

          <div className="bg-dark-card border border-white/5 rounded-xl overflow-hidden">
            {loading ? (
              <Spinner />
            ) : produtosFiltrados.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-12">
                {busca ? 'Nenhum produto encontrado.' : 'Nenhum produto cadastrado.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 text-xs uppercase">
                      <th className="text-left px-4 py-3">Produto</th>
                      <th className="text-left px-4 py-3 hidden md:table-cell">Categoria</th>
                      <th className="text-left px-4 py-3">Preço</th>
                      <th className="text-right px-4 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtosFiltrados.map((produto) => (
                      <tr key={produto.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={produto.imagemUrl}
                              alt={produto.nome}
                              className="w-10 h-10 rounded-lg object-cover bg-dark-lighter border border-white/10"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop';
                              }}
                            />
                            <span className="text-white font-medium line-clamp-1">{produto.nome}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                          {produto.categoria?.nome || '—'}
                        </td>
                        <td className="px-4 py-3 text-primary font-semibold">
                          R$ {produto.preco.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <Link
                              href={`/admin/produtos/${produto.id}`}
                              className="p-2 rounded-lg bg-white/5 hover:bg-primary/10 text-gray-400 hover:text-primary transition-colors"
                              title="Editar"
                            >
                              <Pencil size={15} />
                            </Link>
                            <button
                              onClick={() => handleDeletar(produto.id, produto.nome)}
                              disabled={deletando === produto.id}
                              className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                              title="Excluir"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <p className="text-gray-600 text-xs">{produtosFiltrados.length} produto(s) encontrado(s)</p>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
