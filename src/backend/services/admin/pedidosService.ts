import prisma from '../../lib/prisma';
import { AppError } from '../../errors/AppError';

const STATUS_VALIDOS = ['pendente', 'pago', 'enviado', 'entregue', 'cancelado'] as const;
export type StatusPedido = (typeof STATUS_VALIDOS)[number];

export async function listar() {
  return prisma.pedido.findMany({
    include: {
      usuario: { select: { id: true, nome: true, email: true } },
      produtos: { include: { produto: true } },
    },
    orderBy: { criadoEm: 'desc' },
  });
}

export async function buscarPorId(id: number) {
  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: {
      usuario: { select: { id: true, nome: true, email: true } },
      produtos: { include: { produto: true } },
    },
  });
  if (!pedido) throw new AppError('Pedido não encontrado', 404);
  return pedido;
}

export async function atualizarStatus(id: number, status: string) {
  if (!STATUS_VALIDOS.includes(status as StatusPedido)) {
    throw new AppError(`Status inválido. Valores aceitos: ${STATUS_VALIDOS.join(', ')}`);
  }

  const pedido = await prisma.pedido.update({ where: { id }, data: { status } }).catch(() => null);
  if (!pedido) throw new AppError('Pedido não encontrado', 404);
  return pedido;
}
