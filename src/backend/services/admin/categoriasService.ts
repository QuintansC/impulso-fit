import prisma from '../../lib/prisma';
import { AppError } from '../../errors/AppError';

export async function listar() {
  return prisma.categoria.findMany({
    include: { subcategorias: true, produtos: true },
    orderBy: { id: 'asc' },
  });
}

export async function criar(nome: string) {
  return prisma.categoria.create({ data: { nome } });
}

export async function atualizar(id: number, nome: string) {
  const existente = await prisma.categoria.findUnique({ where: { id } });
  if (!existente) throw new AppError('Categoria não encontrada', 404);

  return prisma.categoria.update({ where: { id }, data: { nome } });
}
