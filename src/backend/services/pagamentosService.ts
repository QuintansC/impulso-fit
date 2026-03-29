import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { AppError } from '../errors/AppError';

interface ItemPedido {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
}

export async function criarPaymentIntent(amount: number) {
  if (amount <= 0) throw new AppError('Valor inválido');
  // Placeholder — integrar Stripe aqui futuramente
  const clientSecret = `pi_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return { clientSecret, amount };
}

export async function criarPedido(params: {
  usuarioId: number;
  produtos: ItemPedido[];
  total: number;
  clienteNome?: string;
  clienteEmail?: string;
  status?: string;
}) {
  const { usuarioId, produtos, total, clienteNome, clienteEmail, status } = params;

  let usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });

  if (!usuario) {
    const emailBase = clienteEmail ?? `cliente${usuarioId}@exemplo.com`;
    let emailFinal = emailBase;
    let tentativas = 0;

    while (await prisma.usuario.findUnique({ where: { email: emailFinal } })) {
      tentativas++;
      const [local, dominio] = emailBase.split('@');
      emailFinal = `${local}+${tentativas}@${dominio}`;
    }

    const senhaTemp = await bcrypt.hash(`temp_${Date.now()}`, 10);
    usuario = await prisma.usuario.create({
      data: { nome: clienteNome ?? 'Cliente', email: emailFinal, senha: senhaTemp },
    });
  }

  const agregados = new Map<number, { quantidade: number; precoUnitario: number }>();
  for (const item of produtos) {
    const existente = agregados.get(item.produtoId);
    if (existente) {
      existente.quantidade += item.quantidade;
    } else {
      agregados.set(item.produtoId, {
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
      });
    }
  }

  const pedido = await prisma.pedido.create({
    data: {
      usuarioId: usuario.id,
      total,
      status: status ?? 'pago',
      produtos: {
        create: Array.from(agregados.entries()).map(([produtoId, dados]) => ({
          produtoId,
          quantidade: dados.quantidade,
          precoUnitario: dados.precoUnitario,
        })),
      },
    },
    include: { produtos: { include: { produto: true } } },
  });

  return {
    id: pedido.id,
    total: pedido.total,
    status: pedido.status,
    emailEnviado: false,
    criadoEm: pedido.criadoEm,
  };
}
