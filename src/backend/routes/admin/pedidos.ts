import express from 'express';
import prisma from '../../lib/prisma';
import { autenticarToken } from '../../middleware/autenticarToken';
import { isAdmin } from '../../middleware/isAdmin';

const router = express.Router();
router.use(autenticarToken, isAdmin);

const STATUS_VALIDOS = ['pendente', 'pago', 'enviado', 'entregue', 'cancelado'];

// GET /api/admin/pedidos
router.get('/', async (req, res) => {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        usuario: {
          select: { id: true, nome: true, email: true },
        },
        produtos: {
          include: { produto: true },
        },
      },
      orderBy: { criadoEm: 'desc' },
    });
    return res.json(pedidos);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// GET /api/admin/pedidos/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        usuario: { select: { id: true, nome: true, email: true } },
        produtos: { include: { produto: true } },
      },
    });
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    return res.json(pedido);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// PUT /api/admin/pedidos/:id/status
router.put('/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!status || !STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({
        erro: `Status inválido. Valores aceitos: ${STATUS_VALIDOS.join(', ')}`,
      });
    }

    const pedido = await prisma.pedido.update({
      where: { id },
      data: { status },
    }).catch(() => null);

    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });

    return res.json(pedido);
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

export default router;
