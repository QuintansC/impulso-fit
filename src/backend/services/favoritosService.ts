import prisma from '../lib/prisma';
import { AppError } from '../errors/AppError';

export async function listar(usuarioId: number) {
  const favoritos = await prisma.favorito.findMany({
    where: { usuarioId },
    include: { produto: { include: { categoria: true } } },
    orderBy: { criadoEm: 'desc' },
  });
  return favoritos.map((f) => f.produto);
}

export async function toggle(usuarioId: number, produtoId: number) {
  const produto = await prisma.produto.findUnique({ where: { id: produtoId } });
  if (!produto) throw new AppError('Produto não encontrado', 404);

  const existente = await prisma.favorito.findUnique({
    where: { usuarioId_produtoId: { usuarioId, produtoId } },
  });

  if (existente) {
    await prisma.favorito.delete({
      where: { usuarioId_produtoId: { usuarioId, produtoId } },
    });
    return { favoritado: false };
  }

  await prisma.favorito.create({ data: { usuarioId, produtoId } });
  return { favoritado: true };
}
