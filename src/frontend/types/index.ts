export type Produto = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string;
  categoriaId: number;
  peso?: number | null;
  estoque: number;
  categoria?: { id: number; nome: string };
};

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  role: string;
  criadoEm: string;
};

export type Pedido = {
  id: number;
  usuarioId: number;
  usuario?: Pick<Usuario, 'id' | 'nome' | 'email'>;
  total: number;
  status: string;
  criadoEm: string;
  produtos?: {
    produtoId: number;
    quantidade: number;
    precoUnitario: number;
    produto: Produto;
  }[];
};

export type Avaliacao = {
  id: number;
  usuarioId: number;
  produtoId: number;
  nota: number;
  comentario: string;
  criadoEm: string;
  usuario: { id: number; nome: string };
};

export type UsuarioAdmin = {
  id: number;
  nome: string;
  email: string;
  role: string;
  criadoEm: string;
  _count: { pedidos: number };
};

export type Categoria = {
  id: number;
  nome: string;
  produtos?: Produto[];
  subcategorias?: { id: number; nome: string }[];
};
