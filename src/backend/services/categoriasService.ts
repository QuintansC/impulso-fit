import prisma from '../lib/prisma';

export async function listar() {
  return prisma.categoria.findMany({ include: { produtos: true } });
}
