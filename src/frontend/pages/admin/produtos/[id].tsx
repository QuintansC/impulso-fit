import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import ProdutoForm, { ProdutoFormData } from '@/components/admin/ProdutoForm';
import Spinner from '@/components/admin/Spinner';
import { ArrowLeft } from 'lucide-react';
import { Categoria } from '@/types';
import * as produtosService from '@/lib/services/admin/produtosService';
import * as categoriasService from '@/lib/services/admin/categoriasService';

const FORM_VAZIO: ProdutoFormData = { nome: '', descricao: '', preco: '', imagemUrl: '', categoriaId: '', peso: '', estoque: '0' };

export default function EditarProduto() {
  const router = useRouter();
  const { id } = router.query;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [form, setForm] = useState<ProdutoFormData>(FORM_VAZIO);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      produtosService.getProduto(id as string),
      categoriasService.getCategorias(),
    ]).then(([produto, cats]) => {
      setForm({
        nome: produto.nome,
        descricao: produto.descricao,
        preco: String(produto.preco),
        imagemUrl: produto.imagemUrl,
        categoriaId: String(produto.categoriaId),
        peso: produto.peso ? String(produto.peso) : '',
        estoque: String(produto.estoque ?? 0),
      });
      setCategorias(cats);
    }).catch(() => setErro('Produto não encontrado.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      await produtosService.atualizarProduto(id as string, form);
      router.push('/admin/produtos');
    } catch (err: any) {
      setErro(err.response?.data?.erro || 'Erro ao salvar produto.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout title="Editar Produto">
        <div className="max-w-2xl">
          <Link href="/admin/produtos" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Voltar para produtos
          </Link>
          {loading ? <Spinner /> : (
            <ProdutoForm
              form={form} categorias={categorias} erro={erro}
              loading={salvando} submitLabel="Salvar Alterações"
              onChange={handleChange} onSubmit={handleSubmit}
            />
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
