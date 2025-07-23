import { createContext, useContext, useEffect, useState } from 'react';

type CarrinhoItem = {
  id: string;
  quantidade: number;
};

type CarrinhoContextType = {
  carrinho: CarrinhoItem[];
  adicionarProduto: (id: string) => void;
  removerProduto: (id: string) => void;
  limparCarrinho: () => void;
  adicionarProdutoQuantidade: (id: string, quantidade: number) => void;
};

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const CarrinhoProvider = ({ children }: { children: React.ReactNode }) => {
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);

  useEffect(() => {
    const armazenado = localStorage.getItem('carrinho');
    if (armazenado) {
      setCarrinho(JSON.parse(armazenado));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  const adicionarProduto = (id: string) => {
    setCarrinho(prev => {
      const existente = prev.find(p => p.id === id);
      if (existente) {
        return prev.map(p =>
          p.id === id ? { ...p, quantidade: p.quantidade + 1 } : p
        );
      }
      return [...prev, { id, quantidade: 1 }];
    });
  };

  const adicionarProdutoQuantidade = (id: string, quantidade: number) => {
    setCarrinho((carrinhoAtual) => {
      const existente = carrinhoAtual.find(item => item.id === id);
      if (existente) {
        // Atualiza a quantidade do produto já existente
        return carrinhoAtual.map(item =>
          item.id === id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      } else {
        // Adiciona novo produto ao carrinho
        return [...carrinhoAtual, { id, quantidade }];
      }
    });
  };

  const removerProduto = (id: string) => {
    setCarrinho(prev => prev.filter(p => p.id !== id));
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  return (
    <CarrinhoContext.Provider
      value={{ carrinho, adicionarProduto, removerProduto, limparCarrinho, adicionarProdutoQuantidade }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
  return context;
};
