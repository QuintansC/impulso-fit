import { createContext, useContext, useEffect, useState } from 'react';
import { Produto } from '@/types';

type CarrinhoItem = {
  id: number;
  quantidade: number;
  nome: string;
  preco: number;
  imagemUrl?: string;
  descricao?: string;
};

type CarrinhoContextType = {
  carrinho: CarrinhoItem[];
  removerProduto: (id: number) => void;
  limparCarrinho: () => void;
  adicionarProdutoCompleto: (produto: Produto, quantidade: number) => void;
};

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const CarrinhoProvider = ({ children }: { children: React.ReactNode }) => {
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);

  useEffect(() => {
    const armazenado = localStorage.getItem('carrinho');
    if (armazenado) {
      try {
        const salvo = JSON.parse(armazenado);
        if (Array.isArray(salvo) && salvo.length > 0 && salvo[0].nome !== undefined) {
          setCarrinho(salvo);
        } else {
          localStorage.removeItem('carrinho');
        }
      } catch {
        localStorage.removeItem('carrinho');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  const adicionarProdutoCompleto = (produto: Produto, quantidade: number) => {
    setCarrinho((atual) => {
      const existente = atual.find(item => item.id === produto.id);
      if (existente) {
        return atual.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item,
        );
      }
      return [...atual, {
        id: produto.id,
        quantidade,
        nome: produto.nome,
        preco: produto.preco,
        imagemUrl: produto.imagemUrl,
        descricao: produto.descricao,
      }];
    });
  };

  const removerProduto = (id: number) => {
    setCarrinho(prev => prev.filter(p => p.id !== id));
  };

  const limparCarrinho = () => setCarrinho([]);

  return (
    <CarrinhoContext.Provider value={{ carrinho, removerProduto, limparCarrinho, adicionarProdutoCompleto }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
  return context;
};
