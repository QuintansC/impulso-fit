import { createContext, useContext, useEffect, useState } from 'react';

type CarrinhoItem = {
  id: string;
  quantidade: number;
  nome: string;
  preco: number;
  imagemUrl?: string;
  descricao?: string;
};

type CarrinhoContextType = {
  carrinho: CarrinhoItem[];
  adicionarProduto: (id: string) => void;
  removerProduto: (id: string) => void;
  limparCarrinho: () => void;
  adicionarProdutoQuantidade: (id: string, quantidade: number) => void;
  adicionarProdutoCompleto: (produto: any, quantidade: number) => void;
};

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const CarrinhoProvider = ({ children }: { children: React.ReactNode }) => {
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);

  useEffect(() => {
    const armazenado = localStorage.getItem('carrinho');
    if (armazenado) {
      try {
        const carrinhoSalvo = JSON.parse(armazenado);
        // Verificar se o carrinho tem a estrutura nova (com nome e preco)
        if (carrinhoSalvo.length > 0 && carrinhoSalvo[0].nome !== undefined) {
          setCarrinho(carrinhoSalvo);
        } else {
          // Carrinho com estrutura antiga - limpar
          console.log('Carrinho com estrutura antiga detectado. Limpando...');
          localStorage.removeItem('carrinho');
          setCarrinho([]);
        }
      } catch {
        // Se houver erro ao fazer parse, limpar o localStorage
        localStorage.removeItem('carrinho');
        setCarrinho([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  const adicionarProduto = (id: string) => {
    // Esta função agora deve ser evitada - use adicionarProdutoCompleto
    console.warn('adicionarProduto está depreciado. Use adicionarProdutoCompleto.');
  };

  const adicionarProdutoQuantidade = (id: string, quantidade: number) => {
    // Esta função agora deve ser evitada - use adicionarProdutoCompleto
    console.warn('adicionarProdutoQuantidade está depreciado. Use adicionarProdutoCompleto.');
  };

  const removerProduto = (id: string) => {
    setCarrinho(prev => prev.filter(p => p.id !== id));
  };

  const adicionarProdutoCompleto = (produto: any, quantidade: number) => {
    setCarrinho((carrinhoAtual) => {
      const existente = carrinhoAtual.find(item => item.id === produto.id);
      if (existente) {
        // Atualiza a quantidade do produto já existente
        return carrinhoAtual.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      } else {
        // Adiciona novo produto ao carrinho com informações completas
        return [...carrinhoAtual, { 
          id: produto.id,
          quantidade,
          nome: produto.nome,
          preco: produto.preco,
          imagemUrl: produto.imagemUrl,
          descricao: produto.descricao
        }];
      }
    });
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  return (
    <CarrinhoContext.Provider
      value={{ 
        carrinho, 
        adicionarProduto, 
        removerProduto, 
        limparCarrinho, 
        adicionarProdutoQuantidade,
        adicionarProdutoCompleto 
      }}
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
