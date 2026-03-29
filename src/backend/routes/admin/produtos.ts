import express from 'express';
import prisma from '../../lib/prisma';
import { autenticarToken } from '../../middleware/autenticarToken';
import { isAdmin } from '../../middleware/isAdmin';

const router = express.Router();
router.use(autenticarToken, isAdmin);

// GET /api/admin/produtos
router.get('/', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: { categoria: true },
      orderBy: { criadoEm: 'desc' },
    });
    return res.json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// GET /api/admin/produtos/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: { categoria: true },
    });
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    return res.json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// POST /api/admin/produtos
router.post('/', async (req, res) => {
  try {
    const { nome, descricao, preco, imagemUrl, categoriaId, peso } = req.body;

    if (!nome || !descricao || preco === undefined || !imagemUrl || !categoriaId) {
      return res.status(400).json({ erro: 'nome, descricao, preco, imagemUrl e categoriaId são obrigatórios' });
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: parseFloat(preco),
        imagemUrl,
        categoriaId: parseInt(categoriaId),
        peso: peso ? parseInt(peso) : null,
      },
      include: { categoria: true },
    });

    return res.status(201).json(produto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// PUT /api/admin/produtos/:id
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, descricao, preco, imagemUrl, categoriaId, peso } = req.body;

    const existente = await prisma.produto.findUnique({ where: { id } });
    if (!existente) return res.status(404).json({ erro: 'Produto não encontrado' });

    const produto = await prisma.produto.update({
      where: { id },
      data: {
        ...(nome !== undefined && { nome }),
        ...(descricao !== undefined && { descricao }),
        ...(preco !== undefined && { preco: parseFloat(preco) }),
        ...(imagemUrl !== undefined && { imagemUrl }),
        ...(categoriaId !== undefined && { categoriaId: parseInt(categoriaId) }),
        ...(peso !== undefined && { peso: peso ? parseInt(peso) : null }),
      },
      include: { categoria: true },
    });

    return res.json(produto);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// DELETE /api/admin/produtos/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existente = await prisma.produto.findUnique({ where: { id } });
    if (!existente) return res.status(404).json({ erro: 'Produto não encontrado' });

    // Remover vínculos com pedidos antes de deletar
    await prisma.pedidoProduto.deleteMany({ where: { produtoId: id } });
    await prisma.produto.delete({ where: { id } });

    return res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

export default router;
