import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import ProdutoForm, { ProdutoFormData } from '@/components/admin/ProdutoForm';
import api from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import { Categoria } from '@/types';

const FORM_VAZIO: ProdutoFormData = { nome: '', descricao: '', preco: '', imagemUrl: '', categoriaId: '', peso: '' };

export default function NovoProduto() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [form, setForm] = useState<ProdutoFormData>(FORM_VAZIO);

  useEffect(() => {
    api.get('/admin/categorias').then(res => setCategorias(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await api.post('/admin/produtos', form);
      router.push('/admin/produtos');
    } catch (err: any) {
      setErro(err.response?.data?.erro || 'Erro ao criar produto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminLayout title="Novo Produto">
        <div className="max-w-2xl">
          <Link href="/admin/produtos" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Voltar para produtos
          </Link>
          <ProdutoForm
            form={form} categorias={categorias} erro={erro}
            loading={loading} submitLabel="Criar Produto"
            onChange={handleChange} onSubmit={handleSubmit}
          />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
