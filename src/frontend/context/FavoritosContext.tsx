import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import * as favoritosService from '@/lib/services/favoritosService';
import type { Produto } from '@/types';

type FavoritosContextType = {
  ids: Set<number>;
  isFavorito: (id: number) => boolean;
  toggleFavorito: (produto: Produto) => Promise<void>;
  loading: boolean;
};

const FavoritosContext = createContext<FavoritosContextType | undefined>(undefined);

export const FavoritosProvider = ({ children }: { children: React.ReactNode }) => {
  const { usuario } = useAuth();
  const [ids, setIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!usuario) { setIds(new Set()); return; }
    setLoading(true);
    favoritosService.getFavoritos()
      .then((produtos) => setIds(new Set(produtos.map((p) => p.id))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [usuario]);

  const toggleFavorito = async (produto: Produto) => {
    if (!usuario) return;
    // Optimistic update
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(produto.id)) next.delete(produto.id);
      else next.add(produto.id);
      return next;
    });
    try {
      await favoritosService.toggleFavorito(produto.id);
    } catch {
      // Reverte em caso de erro
      setIds((prev) => {
        const next = new Set(prev);
        if (next.has(produto.id)) next.delete(produto.id);
        else next.add(produto.id);
        return next;
      });
    }
  };

  return (
    <FavoritosContext.Provider value={{ ids, isFavorito: (id) => ids.has(id), toggleFavorito, loading }}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error('useFavoritos deve ser usado dentro de FavoritosProvider');
  return ctx;
};
