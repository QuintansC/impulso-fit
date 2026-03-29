import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { AppError } from '../errors/AppError';

export async function registrar(nome: string, email: string, senha: string) {
  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) throw new AppError('Email já cadastrado', 409);

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await prisma.usuario.create({
    data: { nome, email, senha: senhaHash },
  });

  return { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role };
}

export async function login(email: string, senha: string) {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) throw new AppError('Email ou senha incorretos', 401);

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) throw new AppError('Email ou senha incorretos', 401);

  const secret = process.env.JWT_SECRET!;
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, role: usuario.role },
    secret,
    { expiresIn: '7d' },
  );

  return {
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role },
  };
}

export async function buscarPerfil(id: number) {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: { id: true, nome: true, email: true, role: true, criadoEm: true },
  });
  if (!usuario) throw new AppError('Usuário não encontrado', 404);
  return usuario;
}
