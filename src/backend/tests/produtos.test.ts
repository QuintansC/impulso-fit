import request from 'supertest';
import { app, clearDb, criarCategoria, criarProduto } from './helpers';

beforeEach(clearDb);

describe('GET /api/produtos', () => {
  it('deve retornar lista vazia quando não há produtos', async () => {
    const res = await request(app).get('/api/produtos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('deve retornar produtos cadastrados', async () => {
    const cat = await criarCategoria();
    await criarProduto(cat.id, { nome: 'Creatina' });
    await criarProduto(cat.id, { nome: 'Whey' });

    const res = await request(app).get('/api/produtos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toMatchObject({ nome: expect.any(String), preco: expect.any(Number) });
  });
});

describe('GET /api/produtos/:id', () => {
  it('deve retornar produto por ID', async () => {
    const cat = await criarCategoria();
    const produto = await criarProduto(cat.id, { nome: 'Creatina', preco: 49.90 });

    const res = await request(app).get(`/api/produtos/${produto.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: produto.id, nome: 'Creatina', preco: 49.90 });
  });

  it('deve retornar 404 para produto inexistente', async () => {
    const res = await request(app).get('/api/produtos/99999');
    expect(res.status).toBe(404);
    expect(res.body.erro).toBeDefined();
  });
});
