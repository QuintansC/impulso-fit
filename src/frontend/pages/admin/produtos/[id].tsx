import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import ProdutoForm, { ProdutoFormData } from '@/components/admin/ProdutoForm';
import Spinner from '@/components/admin/Spinner';
import api from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import { Categoria } from '@/types';

const FORM_VAZIO: ProdutoFormData = { nome: '', descricao: '', preco: '', imagemUrl: '', categoriaId: '', peso: '' };

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
      api.get(`/admin/produtos/${id}`),
      api.get('/admin/categorias'),
    ]).then(([prodRes, catRes]) => {
      const p = prodRes.data;
      setForm({
        nome: p.nome,
        descricao: p.descricao,
        preco: String(p.preco),
        imagemUrl: p.imagemUrl,
        categoriaId: String(p.categoriaId),
        peso: p.peso ? String(p.peso) : '',
      });
      setCategorias(catRes.data);
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
      await api.put(`/admin/produtos/${id}`, form);
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
