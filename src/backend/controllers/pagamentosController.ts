import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as pagamentosService from '../services/pagamentosService';

const paymentIntentSchema = z.object({
  amount: z.number().positive('Valor deve ser positivo'),
  metadata: z.record(z.string(), z.string()).optional(),
});

const itemPedidoSchema = z.object({
  produtoId: z.coerce.number().int().positive(),
  quantidade: z.coerce.number().int().positive(),
  precoUnitario: z.coerce.number().nonnegative(),
});

const criarPedidoSchema = z.object({
  usuarioId: z.coerce.number().int().nonnegative(),
  produtos: z.array(itemPedidoSchema).min(1, 'Pedido deve ter ao menos um produto'),
  total: z.coerce.number().nonnegative(),
  clienteNome: z.string().optional(),
  clienteEmail: z.string().email().optional(),
  status: z.string().optional(),
  stripePaymentIntentId: z.string().optional(),
});

export async function criarPaymentIntent(req: Request, res: Response, next: NextFunction) {
  try {
    const { amount, metadata } = paymentIntentSchema.parse(req.body);
    const resultado = await pagamentosService.criarPaymentIntent(amount, metadata);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
}

export async function criarPedido(req: Request, res: Response, next: NextFunction) {
  try {
    const dados = criarPedidoSchema.parse(req.body);
    const pedido = await pagamentosService.criarPedido(dados);
    res.json(pedido);
  } catch (err) {
    next(err);
  }
}

export async function webhook(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers['stripe-signature'] as string;
    if (!signature) {
      res.status(400).json({ erro: 'Assinatura ausente' });
      return;
    }
    const resultado = await pagamentosService.processarWebhook(req.body as Buffer, signature);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
}
