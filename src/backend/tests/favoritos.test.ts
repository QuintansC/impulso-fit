import request from 'supertest';
import { app, clearDb, criarUsuario, criarCategoria, criarProduto, getToken } from './helpers';

beforeEach(clearDb);

describe('GET /api/favoritos', () => {
  it('deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/favoritos');
    expect(res.status).toBe(401);
  });

  it('deve retornar lista vazia inicialmente', async () => {
    await criarUsuario('João', 'joao@teste.com', 'senha123');
    const token = await getToken('joao@teste.com', 'senha123');

    const res = await request(app)
      .get('/api/favoritos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /api/favoritos/toggle', () => {
  it('deve adicionar produto aos favoritos', async () => {
    await criarUsuario('João', 'joao@teste.com', 'senha123');
    const cat = await criarCategoria();
    const prod = await criarProduto(cat.id);
    const token = await getToken('joao@teste.com', 'senha123');

    const res = await request(app)
      .post('/api/favoritos/toggle')
      .set('Authorization', `Bearer ${token}`)
      .send({ produtoId: prod.id });

    expect(res.status).toBe(200);
    expect(res.body.favoritado).toBe(true);
  });

  it('deve remover produto dos favoritos na segunda chamada', async () => {
    await criarUsuario('João', 'joao@teste.com', 'senha123');
    const cat = await criarCategoria();
    const prod = await criarProduto(cat.id);
    const token = await getToken('joao@teste.com', 'senha123');

    await request(app)
      .post('/api/favoritos/toggle')
      .set('Authorization', `Bearer ${token}`)
      .send({ produtoId: prod.id });

    const res = await request(app)
      .post('/api/favoritos/toggle')
      .set('Authorization', `Bearer ${token}`)
      .send({ produtoId: prod.id });

    expect(res.status).toBe(200);
    expect(res.body.favoritado).toBe(false);
  });

  it('deve listar produto favoritado após toggle', async () => {
    await criarUsuario('João', 'joao@teste.com', 'senha123');
    const cat = await criarCategoria();
    const prod = await criarProduto(cat.id, { nome: 'Creatina' });
    const token = await getToken('joao@teste.com', 'senha123');

    await request(app)
      .post('/api/favoritos/toggle')
      .set('Authorization', `Bearer ${token}`)
      .send({ produtoId: prod.id });

    const res = await request(app)
      .get('/api/favoritos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].nome).toBe('Creatina');
  });

  it('deve retornar 404 para produto inexistente', async () => {
    await criarUsuario('João', 'joao@teste.com', 'senha123');
    const token = await getToken('joao@teste.com', 'senha123');

    const res = await request(app)
      .post('/api/favoritos/toggle')
      .set('Authorization', `Bearer ${token}`)
      .send({ produtoId: 99999 });

    expect(res.status).toBe(404);
  });
});
