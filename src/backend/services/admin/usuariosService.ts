import prisma from '../../lib/prisma';
import { AppError } from '../../errors/AppError';

const ROLES_VALIDOS = ['cliente', 'admin'] as const;

export async function listar() {
  return prisma.usuario.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      criadoEm: true,
      _count: { select: { pedidos: true } },
    },
    orderBy: { criadoEm: 'desc' },
  });
}

export async function atualizarRole(id: number, role: string) {
  if (!ROLES_VALIDOS.includes(role as (typeof ROLES_VALIDOS)[number])) {
    throw new AppError('Role inválido. Valores aceitos: cliente, admin');
  }

  const usuario = await prisma.usuario
    .update({
      where: { id },
      data: { role },
      select: { id: true, nome: true, email: true, role: true },
    })
    .catch(() => null);

  if (!usuario) throw new AppError('Usuário não encontrado', 404);
  return usuario;
}
