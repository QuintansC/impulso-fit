// src/backend/routes/pagamentos.ts

import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/pagamentos/create-payment-intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, metadata } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ erro: 'Valor inválido' });
    }

    // Por enquanto, retornamos um clientSecret simulado
    // Em produção, você integraria com o Stripe aqui
    const clientSecret = `pi_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      clientSecret,
      amount
    });
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
      stripePaymentIntentId,
      enderecoEntrega,
      stripePagamento,
      clienteNome,
      clienteEmail,
      status
    } = req.body;

    // Validar dados obrigatórios
    if (!usuarioId || !produtos || !Array.isArray(produtos) || produtos.length === 0) {
      return res.status(400).json({ erro: 'Dados do pedido inválidos' });
    }

    // Verificar se o usuário existe, se não existir, criar um temporário
    let usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId }
    });

    if (!usuario) {
      // Criar usuário temporário se não existir
      // Verificar se o email já existe
      const emailBase = clienteEmail || `cliente${usuarioId}@exemplo.com`;
      let emailFinal = emailBase;
      let tentativas = 0;
      
      while (await prisma.usuario.findUnique({ where: { email: emailFinal } })) {
        tentativas++;
        emailFinal = `${emailBase.split('@')[0]}+${tentativas}@${emailBase.split('@')[1]}`;
      }

      usuario = await prisma.usuario.create({
        data: {
          nome: clienteNome || 'Cliente',
          email: emailFinal,
          senha: 'temp' // Senha temporária
        }
      });
    }

    // Criar o pedido
    const pedido = await prisma.pedido.create({
      data: {
        usuarioId: usuario.id,
        total: parseFloat(total),
        status: status || 'pago',
        produtos: {
          create: produtos.map((prod: any) => ({
            produtoId: parseInt(prod.produtoId)
            // Nota: PedidoProduto não tem campos de quantidade/preço no schema atual
            // Os dados de quantidade e preço estão sendo armazenados apenas no total do pedido
          }))
        }
      },
      include: {
        produtos: {
          include: {
            produto: true
          }
        }
      }
    });

    res.json({
      id: pedido.id,
      total: pedido.total,
      status: pedido.status,
      emailEnviado: false, // Por enquanto false, você pode integrar com serviço de email
      criadoEm: pedido.criadoEm
    });
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ erro: 'Erro ao criar pedido', detalhes: error.message });
  }
});

export default router;

