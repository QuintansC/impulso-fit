export type Produto = {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    imagemUrl: string;
    categoriaId: number;
    peso?: number;
};
export type Categoria = {
    id: number;
    nome: string;
};