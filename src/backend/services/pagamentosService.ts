import Stripe from 'stripe';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { AppError } from '../errors/AppError';
import { enviarConfirmacaoPedido } from './emailService';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new AppError('Stripe não configurado', 500);
  return new Stripe(key);
}

interface ItemPedido {
  produtoId: number;
  quantidade: number;
  precoUnitario: number;
}

export async function criarPaymentIntent(
  amount: number,
  metadata: Record<string, string> = {},
) {
  if (amount <= 0) throw new AppError('Valor inválido');

  const stripe = getStripe();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount), // centavos — o controller já converte
    currency: 'brl',
    metadata,
  });

  return { clientSecret: paymentIntent.client_secret!, amount };
}

export async function processarWebhook(payload: Buffer, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) throw new AppError('Webhook secret não configurado', 500);

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    throw new AppError('Assinatura do webhook inválida', 400);
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent;
    await _criarPedidoSeNaoExiste(pi);
  }

  return { received: true };
}

async function _criarPedidoSeNaoExiste(pi: Stripe.PaymentIntent) {
  // Idempotência — ignorar se o pedido já foi criado (ex: via frontend)
  const existente = await prisma.pedido.findUnique({
    where: { stripePaymentIntentId: pi.id },
  });
  if (existente) return;

  const { usuarioId, clienteNome, clienteEmail, itens: itensJson } = pi.metadata ?? {};

  if (!itensJson) return; // metadata insuficiente para criar pedido

  let produtos: ItemPedido[];
  try {
    const raw = JSON.parse(itensJson) as Array<{
      id: number;
      quantidade: number;
      preco: number;
    }>;
    produtos = raw.map(i => ({
      produtoId: i.id,
      quantidade: i.quantidade,
      precoUnitario: i.preco,
    }));
  } catch {
    return;
  }

  const total = pi.amount / 100;
  await criarPedido({
    usuarioId: parseInt(usuarioId ?? '0'),
    produtos,
    total,
    clienteNome,
    clienteEmail,
    status: 'pago',
    stripePaymentIntentId: pi.id,
  });
}

export async function criarPedido(params: {
  usuarioId: number;
  produtos: ItemPedido[];
  total: number;
  clienteNome?: string;
  clienteEmail?: string;
  status?: string;
  stripePaymentIntentId?: string;
}) {
  const { usuarioId, produtos, total, clienteNome, clienteEmail, status, stripePaymentIntentId } = params;

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

  // Verifica estoque antes de criar o pedido
  for (const [produtoId, dados] of agregados) {
    const produto = await prisma.produto.findUnique({ where: { id: produtoId }, select: { estoque: true, nome: true } });
    if (!produto) throw new AppError(`Produto #${produtoId} não encontrado`, 404);
    if (produto.estoque < dados.quantidade) {
      throw new AppError(`Estoque insuficiente para "${produto.nome}" (disponível: ${produto.estoque})`, 400);
    }
  }

  const pedido = await prisma.$transaction(async (tx) => {
    const pedidoCriado = await tx.pedido.create({
      data: {
        usuarioId: usuario!.id,
        total,
        status: status ?? 'pago',
        stripePaymentIntentId: stripePaymentIntentId ?? null,
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

    for (const [produtoId, dados] of agregados) {
      await tx.produto.update({
        where: { id: produtoId },
        data: { estoque: { decrement: dados.quantidade } },
      });
    }

    return pedidoCriado;
  });

  let emailEnviado = false;
  try {
    await enviarConfirmacaoPedido(usuario.email, usuario.nome, {
      id: pedido.id,
      total: pedido.total,
      status: pedido.status,
      criadoEm: pedido.criadoEm,
      itens: pedido.produtos.map((pp) => ({
        nome: pp.produto.nome,
        quantidade: pp.quantidade,
        precoUnitario: pp.precoUnitario,
      })),
    });
    emailEnviado = true;
  } catch (err) {
    console.error('Erro ao enviar email de confirmação:', err);
  }

  return {
    id: pedido.id,
    total: pedido.total,
    status: pedido.status,
    emailEnviado,
    criadoEm: pedido.criadoEm,
  };
}
