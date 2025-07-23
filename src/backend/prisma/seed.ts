// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import categorias from './data/categorias.json';
import produtos from './data/produtos.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Popula categorias
  for (const categoria of categorias) {
    await prisma.categoria.upsert({
      where: { id: categoria.id },
      update: {},
      create: {
        id: categoria.id,
        nome: categoria.nome,
      },
    });
  }

  // Popula produtos
  for (const produto of produtos) {
    await prisma.produto.upsert({
      where: { id: produto.id },
      update: {},
      create: {
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        imagemUrl: produto.imagem,
        categoriaId: produto.categoriaId,
        peso: produto.peso,
      },
    });
  }

  console.log('✅ Seed finalizado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
