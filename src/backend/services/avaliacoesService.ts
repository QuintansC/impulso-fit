import prisma from '../lib/prisma';
import { AppError } from '../errors/AppError';

export async function listarPorProduto(produtoId: number) {
  return prisma.avaliacao.findMany({
    where: { produtoId },
    include: { usuario: { select: { id: true, nome: true } } },
    orderBy: { criadoEm: 'desc' },
  });
}

export async function criarOuAtualizar(
  usuarioId: number,
  produtoId: number,
  nota: number,
  comentario: string,
) {
  const produto = await prisma.produto.findUnique({ where: { id: produtoId } });
  if (!produto) throw new AppError('Produto não encontrado', 404);

  return prisma.avaliacao.upsert({
    where: { usuarioId_produtoId: { usuarioId, produtoId } },
    create: { usuarioId, produtoId, nota, comentario },
    update: { nota, comentario },
    include: { usuario: { select: { id: true, nome: true } } },
  });
}
