import prisma from '../lib/prisma';
import { AppError } from '../errors/AppError';

export async function listarPedidosUsuario(usuarioId: number) {
  return prisma.pedido.findMany({
    where: { usuarioId },
    orderBy: { criadoEm: 'desc' },
    include: {
      produtos: {
        include: { produto: true },
      },
    },
  });
}

export async function buscarPedidoUsuario(pedidoId: number, usuarioId: number) {
  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: {
      produtos: {
        include: { produto: true },
      },
    },
  });

  if (!pedido) throw new AppError('Pedido não encontrado', 404);
  if (pedido.usuarioId !== usuarioId) throw new AppError('Acesso negado', 403);

  return pedido;
}
