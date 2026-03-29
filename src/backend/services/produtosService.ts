import prisma from '../lib/prisma';
import { AppError } from '../errors/AppError';

export async function listar() {
  return prisma.produto.findMany({ include: { categoria: true } });
}

export async function buscarPorId(id: number) {
  const produto = await prisma.produto.findUnique({
    where: { id },
    include: { categoria: true },
  });
  if (!produto) throw new AppError('Produto não encontrado', 404);
  return produto;
}
