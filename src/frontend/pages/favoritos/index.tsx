import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProdutoCard from '@/components/ProdutoCard';
import { useAuth } from '@/context/AuthContext';
import { useFavoritos } from '@/context/FavoritosContext';
import { getFavoritos } from '@/lib/services/favoritosService';
import type { Produto } from '@/types';

export default function FavoritosPage() {
  const { usuario, loading: authLoading } = useAuth();
  const { ids } = useFavoritos();
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!usuario) { router.replace('/login'); return; }
    getFavoritos()
      .then(setProdutos)
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, [usuario, authLoading, router]);

  // Sincroniza lista local quando ids mudam (toggle remove da lista)
  useEffect(() => {
    setProdutos((prev) => prev.filter((p) => ids.has(p.id)));
  }, [ids]);

  if (authLoading || carregando) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Carregando favoritos...</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-dark py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Heart size={28} className="text-secondary" />
            <h1 className="text-2xl font-bold text-white">Meus Favoritos</h1>
          </div>

          {produtos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ShoppingBag size={56} className="text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg mb-6">Você ainda não tem produtos favoritos.</p>
              <Link
                href="/produtos"
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Explorar produtos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {produtos.map((p) => (
                <ProdutoCard key={p.id} produto={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
