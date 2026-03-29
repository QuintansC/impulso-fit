import request from 'supertest';
import { app, clearDb, criarUsuario, criarCategoria, criarProduto, getToken, prisma } from './helpers';

beforeEach(clearDb);

describe('GET /api/pedidos', () => {
  it('deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/pedidos');
    expect(res.status).toBe(401);
  });

  it('deve retornar lista vazia para usuário sem pedidos', async () => {
    await criarUsuario('João', 'joao@teste.com', 'senha123');
    const token = await getToken('joao@teste.com', 'senha123');

    const res = await request(app)
      .get('/api/pedidos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('deve retornar apenas pedidos do usuário autenticado', async () => {
    const u1 = await criarUsuario('U1', 'u1@teste.com', 'senha123');
    const u2 = await criarUsuario('U2', 'u2@teste.com', 'senha123');
    const cat = await criarCategoria();
    const prod = await criarProduto(cat.id);

    // Cria pedido para u1 e pedido para u2
    await prisma.pedido.create({
      data: {
        usuarioId: u1.id, total: 99.90, status: 'pago',
        produtos: { create: [{ produtoId: prod.id, quantidade: 1, precoUnitario: 99.90 }] },
      },
    });
    await prisma.pedido.create({
      data: {
        usuarioId: u2.id, total: 49.90, status: 'pago',
        produtos: { create: [{ produtoId: prod.id, quantidade: 1, precoUnitario: 49.90 }] },
      },
    });

    const token = await getToken('u1@teste.com', 'senha123');
    const res = await request(app)
      .get('/api/pedidos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].usuarioId).toBe(u1.id);
  });
});

describe('GET /api/pedidos/:id', () => {
  it('deve retornar 403 para pedido de outro usuário', async () => {
    const u1 = await criarUsuario('U1', 'u1@teste.com', 'senha123');
    const u2 = await criarUsuario('U2', 'u2@teste.com', 'senha123');
    const cat = await criarCategoria();
    const prod = await criarProduto(cat.id);

    const pedido = await prisma.pedido.create({
      data: {
        usuarioId: u2.id, total: 99.90, status: 'pago',
        produtos: { create: [{ produtoId: prod.id, quantidade: 1, precoUnitario: 99.90 }] },
      },
    });

    const token = await getToken('u1@teste.com', 'senha123');
    const res = await request(app)
      .get(`/api/pedidos/${pedido.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('deve retornar 404 para pedido inexistente', async () => {
    await criarUsuario('João', 'joao@teste.com', 'senha123');
    const token = await getToken('joao@teste.com', 'senha123');

    const res = await request(app)
      .get('/api/pedidos/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
