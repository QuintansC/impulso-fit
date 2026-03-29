import express from 'express';
import prisma from '../../lib/prisma';
import { autenticarToken } from '../../middleware/autenticarToken';
import { isAdmin } from '../../middleware/isAdmin';

const router = express.Router();
router.use(autenticarToken, isAdmin);

// GET /api/admin/categorias
router.get('/', async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      include: { subcategorias: true, produtos: true },
      orderBy: { id: 'asc' },
    });
    return res.json(categorias);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// POST /api/admin/categorias
router.post('/', async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: 'Nome é obrigatório' });
    }

    const categoria = await prisma.categoria.create({
      data: { nome },
    });

    return res.status(201).json(categoria);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// PUT /api/admin/categorias/:id
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: 'Nome é obrigatório' });
    }

    const existente = await prisma.categoria.findUnique({ where: { id } });
    if (!existente) return res.status(404).json({ erro: 'Categoria não encontrada' });

    const categoria = await prisma.categoria.update({
      where: { id },
      data: { nome },
    });

    return res.json(categoria);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

export default router;
