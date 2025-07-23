// src/backend/routes/categorias.ts

import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/api/categorias', async (req, res) => {
    const categorias = await prisma.categoria.findMany({ include: { produtos: true } });
    res.json(categorias);
});

export default router;
