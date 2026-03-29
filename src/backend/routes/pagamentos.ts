// src/backend/routes/pagamentos.ts

import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';

const router = express.Router();

// POST /api/pagamentos/create-payment-intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ erro: 'Valor inválido' });
    }

    // Por enquanto, retornamos um clientSecret simulado
    // Em produção, integrar com o Stripe aqui
    const clientSecret = `pi_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({ clientSecret, amount });
  } catch (error: any) {
    console.error('Erro ao criar payment intent:', error);
    res.status(500).json({ erro: 'Erro ao criar payment intent' });
  }
});

// POST /api/pagamentos/create-order
router.post('/create-order', async (req, res) => {
  try {
    const {
      usuarioId,
      produtos,
      total,
      clienteNome,
      clienteEmail,
      status
    } = req.body;

    if (!usuarioId || !produtos || !Array.isArray(produtos) || produtos.length === 0) {
      return res.status(400).json({ erro: 'Dados do pedido inválidos' });
    }

    // Verificar se o usuário existe; se não, criar um temporário
    let usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });

    if (!usuario) {
      const emailBase = clienteEmail || `cliente${usuarioId}@exemplo.com`;
      let emailFinal = emailBase;
      let tentativas = 0;

      while (await prisma.usuario.findUnique({ where: { email: emailFinal } })) {
        tentativas++;
        emailFinal = `${emailBase.split('@')[0]}+${tentativas}@${emailBase.split('@')[1]}`;
      }

      const senhaTemp = await bcrypt.hash(`temp_${Date.now()}`, 10);

      usuario = await prisma.usuario.create({
        data: {
          nome: clienteNome || 'Cliente',
          email: emailFinal,
          senha: senhaTemp,
        },
      });
    }

    // Agregar quantidades para evitar duplicatas na chave composta PedidoProduto
    const produtosAgregados = new Map<number, { quantidade: number; precoUnitario: number }>();
    for (const prod of produtos) {
      const id = parseInt(prod.produtoId);
      const qtd = parseInt(prod.quantidade) || 1;
      const preco = parseFloat(prod.precoUnitario) || 0;
      if (produtosAgregados.has(id)) {
        produtosAgregados.get(id)!.quantidade += qtd;
      } else {
        produtosAgregados.set(id, { quantidade: qtd, precoUnitario: preco });
      }
    }

    const pedido = await prisma.pedido.create({
      data: {
        usuarioId: usuario.id,
        total: parseFloat(total),
        status: status || 'pago',
        produtos: {
          create: Array.from(produtosAgregados.entries()).map(([produtoId, dados]) => ({
            produtoId,
            quantidade: dados.quantidade,
            precoUnitario: dados.precoUnitario,
          })),
        },
      },
      include: {
        produtos: { include: { produto: true } },
      },
    });

    res.json({
      id: pedido.id,
      total: pedido.total,
      status: pedido.status,
      emailEnviado: false,
      criadoEm: pedido.criadoEm,
    });
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ erro: 'Erro ao criar pedido', detalhes: error.message });
  }
});

export default router;
