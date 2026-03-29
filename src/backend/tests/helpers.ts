import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../app';
import prisma from '../lib/prisma';

// ── Limpeza ────────────────────────────────────────────────────────────────
export async function clearDb() {
  await prisma.avaliacao.deleteMany();
  await prisma.favorito.deleteMany();
  await prisma.pedidoProduto.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.subcategoria.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.usuario.deleteMany();
}

// ── Seed ───────────────────────────────────────────────────────────────────
export async function criarUsuario(
  nome = 'Teste',
  email = 'teste@exemplo.com',
  senha = 'senha123',
  role = 'cliente',
) {
  const hash = await bcrypt.hash(senha, 10);
  return prisma.usuario.create({ data: { nome, email, senha: hash, role } });
}

export async function criarAdmin() {
  return criarUsuario('Admin', 'admin@teste.com', 'admin123', 'admin');
}

export async function criarCategoria(nome = 'Proteínas') {
  return prisma.categoria.create({ data: { nome } });
}

export async function criarProduto(categoriaId: number, overrides: Partial<{
  nome: string; preco: number; estoque: number;
}> = {}) {
  return prisma.produto.create({
    data: {
      nome: overrides.nome ?? 'Whey Protein',
      descricao: 'Produto de teste',
      preco: overrides.preco ?? 99.90,
      imagemUrl: 'https://exemplo.com/img.jpg',
      categoriaId,
      estoque: overrides.estoque ?? 10,
    },
  });
}

// ── Auth ───────────────────────────────────────────────────────────────────
export async function getToken(email: string, senha: string): Promise<string> {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, senha });
  return res.body.token as string;
}

export { app, prisma };
