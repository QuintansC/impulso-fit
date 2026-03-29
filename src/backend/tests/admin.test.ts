import request from 'supertest';
import { app, clearDb, criarUsuario, criarAdmin, criarCategoria, criarProduto, getToken } from './helpers';

beforeEach(clearDb);

describe('Proteção de rotas admin', () => {
  it('deve retornar 401 sem token em rota admin', async () => {
    const res = await request(app).get('/api/admin/produtos');
    expect(res.status).toBe(401);
  });

  it('deve retornar 403 para usuário não-admin', async () => {
    await criarUsuario('Cliente', 'cliente@teste.com', 'senha123');
    const token = await getToken('cliente@teste.com', 'senha123');

    const res = await request(app)
      .get('/api/admin/produtos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe('Admin — Produtos', () => {
  it('deve listar produtos como admin', async () => {
    await criarAdmin();
    const cat = await criarCategoria();
    await criarProduto(cat.id, { nome: 'Whey' });
    const token = await getToken('admin@teste.com', 'admin123');

    const res = await request(app)
      .get('/api/admin/produtos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('deve criar produto como admin', async () => {
    await criarAdmin();
    const cat = await criarCategoria();
    const token = await getToken('admin@teste.com', 'admin123');

    const res = await request(app)
      .post('/api/admin/produtos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Creatina Monohidratada',
        descricao: 'Creatina pura 300g',
        preco: 59.90,
        imagemUrl: 'https://exemplo.com/creatina.jpg',
        categoriaId: cat.id,
        estoque: 50,
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ nome: 'Creatina Monohidratada', estoque: 50 });
  });

  it('deve atualizar status de pedido como admin', async () => {
    await criarAdmin();
    const cat = await criarCategoria();
    const prod = await criarProduto(cat.id);
    const { prisma } = await import('./helpers');
    const usuario = await criarUsuario();
    const pedido = await prisma.pedido.create({
      data: {
        usuarioId: usuario.id, total: 99.90, status: 'pago',
        produtos: { create: [{ produtoId: prod.id, quantidade: 1, precoUnitario: 99.90 }] },
      },
    });

    const token = await getToken('admin@teste.com', 'admin123');
    const res = await request(app)
      .put(`/api/admin/pedidos/${pedido.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'enviado' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('enviado');
  });
});
