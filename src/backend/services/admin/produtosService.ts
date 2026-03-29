import prisma from '../../lib/prisma';
import { AppError } from '../../errors/AppError';

interface DadosProduto {
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string;
  categoriaId: number;
  peso?: number | null;
}

export async function listar() {
  return prisma.produto.findMany({
    include: { categoria: true },
    orderBy: { criadoEm: 'desc' },
  });
}

export async function buscarPorId(id: number) {
  const produto = await prisma.produto.findUnique({
    where: { id },
    include: { categoria: true },
  });
  if (!produto) throw new AppError('Produto não encontrado', 404);
  return produto;
}

export async function criar(dados: DadosProduto) {
  return prisma.produto.create({
    data: dados,
    include: { categoria: true },
  });
}

export async function atualizar(id: number, dados: Partial<DadosProduto>) {
  const existente = await prisma.produto.findUnique({ where: { id } });
  if (!existente) throw new AppError('Produto não encontrado', 404);

  return prisma.produto.update({
    where: { id },
    data: dados,
    include: { categoria: true },
  });
}

export async function remover(id: number) {
  const existente = await prisma.produto.findUnique({ where: { id } });
  if (!existente) throw new AppError('Produto não encontrado', 404);

  await prisma.pedidoProduto.deleteMany({ where: { produtoId: id } });
  await prisma.produto.delete({ where: { id } });
}
