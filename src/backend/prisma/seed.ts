// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import categorias from './data/categorias.json';
import produtos from './data/produtos.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Popula categorias e subcategorias
  for (const categoria of categorias) {
    await prisma.categoria.upsert({
      where: { id: categoria.id },
      update: {},
      create: {
        id: categoria.id,
        nome: categoria.nome,
      },
    });

    // Popula subcategorias se existirem
    if (categoria.subcategorias && categoria.subcategorias.length > 0) {
      for (const sub of categoria.subcategorias) {
        await prisma.subcategoria.upsert({
          where: { id: sub.id },
          update: {},
          create: {
            id: sub.id,
            nome: sub.nome,
            categoriaId: categoria.id,
          },
        });
      }
    }
  }

  // Popula produtos (ajuste se quiser relacionar com subcategoria)
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
        // subcategoriaId: produto.subcategoriaId, // se quiser usar
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
