import express from 'express';
import prisma from '../../lib/prisma';
import { autenticarToken } from '../../middleware/autenticarToken';
import { isAdmin } from '../../middleware/isAdmin';

const router = express.Router();
router.use(autenticarToken, isAdmin);

// GET /api/admin/usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
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
    return res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// PUT /api/admin/usuarios/:id/role
router.put('/:id/role', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { role } = req.body;

    if (!role || !['cliente', 'admin'].includes(role)) {
      return res.status(400).json({ erro: 'Role inválido. Valores aceitos: cliente, admin' });
    }

    const usuario = await prisma.usuario.update({
      where: { id },
      data: { role },
      select: { id: true, nome: true, email: true, role: true },
    }).catch(() => null);

    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    return res.json(usuario);
  } catch (error) {
    console.error('Erro ao atualizar role:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

export default router;
