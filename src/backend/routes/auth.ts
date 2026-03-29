import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { autenticarToken } from '../middleware/autenticarToken';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ erro: 'Senha deve ter no mínimo 6 caracteres' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ erro: 'Email inválido' });
    }

    const existente = await prisma.usuario.findUnique({ where: { email } });
    if (existente) {
      return res.status(409).json({ erro: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash },
    });

    return res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }

    const secret = process.env.JWT_SECRET!;
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      secret,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// GET /api/auth/me
router.get('/me', autenticarToken, async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario!.id },
      select: { id: true, nome: true, email: true, role: true, criadoEm: true },
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    return res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

export default router;
