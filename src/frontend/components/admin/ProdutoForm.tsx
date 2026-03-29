import { Save } from 'lucide-react';
import { Categoria } from '@/types';

export type ProdutoFormData = {
  nome: string;
  descricao: string;
  preco: string;
  imagemUrl: string;
  categoriaId: string;
  peso: string;
  estoque: string;
};

type Props = {
  form: ProdutoFormData;
  categorias: Categoria[];
  erro: string;
  loading: boolean;
  submitLabel: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const inputClass = 'w-full px-3 py-2.5 bg-dark-lighter border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 placeholder:text-gray-600';

export default function ProdutoForm({ form, categorias, erro, loading, submitLabel, onChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="bg-dark-card border border-white/5 rounded-xl p-6 space-y-5">
      {erro && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{erro}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Nome *</label>
          <input name="nome" value={form.nome} onChange={onChange} required placeholder="Nome do produto" className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Descrição *</label>
          <textarea name="descricao" value={form.descricao} onChange={onChange} required rows={3}
            placeholder="Descrição do produto" className={`${inputClass} resize-none`} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Preço (R$) *</label>
          <input name="preco" value={form.preco} onChange={onChange} required type="number" step="0.01" min="0" placeholder="0.00" className={inputClass} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Peso (g)</label>
          <input name="peso" value={form.peso} onChange={onChange} type="number" min="0" placeholder="Ex: 500" className={inputClass} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Estoque *</label>
          <input name="estoque" value={form.estoque} onChange={onChange} required type="number" min="0" placeholder="0" className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">URL da Imagem *</label>
          <input name="imagemUrl" value={form.imagemUrl} onChange={onChange} required placeholder="https://..." className={inputClass} />
          {form.imagemUrl && (
            <img src={form.imagemUrl} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg border border-white/10"
              onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Categoria *</label>
          <select name="categoriaId" value={form.categoriaId} onChange={onChange} required className={inputClass}>
            <option value="">Selecione uma categoria</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm">
          <Save size={16} />
          {loading ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
