import { useEffect, useState, useMemo } from 'react';
import { Produto } from '@/types';
import { getProdutos, getCategorias } from '@/lib/api';
import ProdutoCard from '@/components/ProdutoCard';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';

type Ordenacao = 'nome' | 'preco-asc' | 'preco-desc' | 'recente';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | null>(null);
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState<Ordenacao>('nome');
  const [precoMin, setPrecoMin] = useState<number>(0);
  const [precoMax, setPrecoMax] = useState<number>(5000);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  // Calcula preços min e max dos produtos
  const precos = useMemo(() => {
    if (produtos.length === 0) return { min: 0, max: 5000 };
    const valores = produtos.map(p => p.preco);
    return {
      min: Math.floor(Math.min(...valores)),
      max: Math.ceil(Math.max(...valores))
    };
  }, [produtos]);

  useEffect(() => {
    getProdutos().then(setProdutos);
    getCategorias().then(setCategorias);
  }, []);

  // Atualiza preço máximo quando produtos são carregados
  useEffect(() => {
    if (produtos.length > 0 && precos.max > 0) {
      setPrecoMax(precos.max);
    }
  }, [produtos.length, precos.max]);

  // Aplica os filtros e ordenação
  const produtosFiltrados = useMemo(() => {
    let filtrados = [...produtos];

    // Filtro de busca
    if (busca) {
      filtrados = filtrados.filter(p => 
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.descricao.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // Filtro de categoria
    if (categoriaFiltro) {
      filtrados = filtrados.filter(p => p.categoriaId === categoriaFiltro);
    }

    // Filtro de preço
    filtrados = filtrados.filter(p => p.preco >= precoMin && p.preco <= precoMax);

    // Ordenação
    switch (ordenacao) {
      case 'preco-asc':
        filtrados.sort((a, b) => a.preco - b.preco);
        break;
      case 'preco-desc':
        filtrados.sort((a, b) => b.preco - a.preco);
        break;
      case 'nome':
        filtrados.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'recente':
        filtrados.sort((a, b) => {
          const dataA = new Date((a as any).criadoEm || 0).getTime();
          const dataB = new Date((b as any).criadoEm || 0).getTime();
          return dataB - dataA;
        });
        break;
    }

    return filtrados;
  }, [produtos, busca, categoriaFiltro, precoMin, precoMax, ordenacao]);

  const limparFiltros = () => {
    setCategoriaFiltro(null);
    setBusca('');
    setPrecoMin(0);
    setPrecoMax(precos.max);
    setOrdenacao('nome');
  };

  const temFiltrosAtivos = categoriaFiltro !== null || busca || precoMin > 0 || precoMax < precos.max;

  return (
    <>
      <Head>
        <title>Produtos | Impulso Fit</title>
        <meta name="description" content="Explore nossa linha completa de produtos fitness" />
      </Head>
      <Header />

      <section className="max-w-7xl mx-auto px-4 py-6 md:py-8 min-h-screen">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Nossos <span className="text-gradient">Produtos</span>
          </h1>
          <p className="text-gray-500">
            {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        </div>

        {/* Busca e Filtros Mobile */}
        <div className="lg:hidden mb-6 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 border border-primary/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-dark-light text-white placeholder:text-gray-500"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <button
            onClick={() => setFiltrosAbertos(!filtrosAbertos)}
            className="w-full btn-secondary text-white py-2.5 rounded-lg flex items-center justify-center gap-2"
          >
            <SlidersHorizontal size={20} />
            Filtros
            {temFiltrosAtivos && (
              <span className="bg-white text-secondary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {[categoriaFiltro, busca, precoMin > 0 || precoMax < precos.max].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar de Filtros - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="card-fitness rounded-xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-lg text-white">Filtros</h2>
                {temFiltrosAtivos && (
                  <button
                    onClick={limparFiltros}
                    className="text-sm text-secondary hover:text-primary transition-colors"
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Busca Desktop */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Buscar</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nome ou descrição..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-primary/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-dark-light text-white placeholder:text-gray-500 text-sm"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Filtro de Categorias */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-3">Categorias</h3>
                <div className="space-y-2">
                  {categorias.map(cat => (
                    <label key={cat.id} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="categoria"
                        checked={categoriaFiltro === cat.id}
                        onChange={() => setCategoriaFiltro(categoriaFiltro === cat.id ? null : cat.id)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                        categoriaFiltro === cat.id
                          ? 'border-primary bg-primary'
                          : 'border-primary/30 group-hover:border-primary/60'
                      }`}>
                        {categoriaFiltro === cat.id && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${
                        categoriaFiltro === cat.id ? 'text-primary font-medium' : 'text-gray-400 group-hover:text-white'
                      }`}>
                        {cat.nome}
                      </span>
                      <span className="ml-auto text-xs text-gray-500">
                        ({cat.produtos?.length || 0})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtro de Preço */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-3">Faixa de Preço</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Mín"
                      value={precoMin || ''}
                      onChange={(e) => setPrecoMin(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-primary/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-dark-light text-white text-sm"
                      min={0}
                    />
                    <input
                      type="number"
                      placeholder="Máx"
                      value={precoMax || ''}
                      onChange={(e) => setPrecoMax(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-primary/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-dark-light text-white text-sm"
                      min={0}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    De R$ {precoMin.toFixed(2)} até R$ {precoMax.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Filtros Mobile - Drawer */}
          {filtrosAbertos && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setFiltrosAbertos(false)}></div>
              <div className="absolute right-0 top-0 h-full w-80 bg-dark-card border-l border-primary/10 overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-bold text-lg text-white">Filtros</h2>
                    <button
                      onClick={() => setFiltrosAbertos(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Categorias Mobile */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-white mb-3">Categorias</h3>
                    <div className="space-y-2">
                      {categorias.map(cat => (
                        <label key={cat.id} className="flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            name="categoria-mobile"
                            checked={categoriaFiltro === cat.id}
                            onChange={() => setCategoriaFiltro(categoriaFiltro === cat.id ? null : cat.id)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                            categoriaFiltro === cat.id
                              ? 'border-primary bg-primary'
                              : 'border-primary/30'
                          }`}>
                            {categoriaFiltro === cat.id && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className={`text-sm ${
                            categoriaFiltro === cat.id ? 'text-primary font-medium' : 'text-gray-400'
                          }`}>
                            {cat.nome}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Preço Mobile */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-white mb-3">Faixa de Preço</h3>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Mín"
                        value={precoMin || ''}
                        onChange={(e) => setPrecoMin(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-primary/15 rounded-lg bg-dark-light text-white text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Máx"
                        value={precoMax || ''}
                        onChange={(e) => setPrecoMax(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-primary/15 rounded-lg bg-dark-light text-white text-sm"
                      />
                    </div>
                  </div>

                  {temFiltrosAtivos && (
                    <button
                      onClick={limparFiltros}
                      className="w-full btn-secondary text-white py-2 rounded-lg"
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Área de Produtos */}
          <div className="flex-1">
            {/* Barra de Ordenação */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Ordenar por:</span>
              </div>
              <div className="relative">
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
                  className="appearance-none bg-dark-light border border-primary/15 rounded-lg px-4 py-2 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                >
                  <option value="nome">Nome A-Z</option>
                  <option value="preco-asc">Menor Preço</option>
                  <option value="preco-desc">Maior Preço</option>
                  <option value="recente">Mais Recente</option>
                </select>
                <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Grid de Produtos */}
            {produtosFiltrados.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg mb-2">Nenhum produto encontrado</p>
                <p className="text-gray-500 text-sm mb-6">Tente ajustar os filtros</p>
                {temFiltrosAtivos && (
                  <button
                    onClick={limparFiltros}
                    className="btn-primary text-white px-6 py-2 rounded-lg"
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {produtosFiltrados.map(prod => (
                  <ProdutoCard key={prod.id} produto={prod} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
}
