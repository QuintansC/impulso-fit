// src/backend/routes/produtos.ts

import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    const produtos = await prisma.produto.findMany({ include: { categoria: true } });
    res.json(produtos);
});

// GET /api/produtos/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const produto = await prisma.produto.findUnique({
        where: { id: Number(id) }
    });

    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    if (produto)  return res.json(produto);
});

export default router;
