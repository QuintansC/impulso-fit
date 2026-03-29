import request from 'supertest';
import { app, clearDb, criarUsuario, criarCategoria, criarProduto, getToken } from './helpers';

beforeEach(clearDb);

describe('GET /api/avaliacoes/produto/:produtoId', () => {
  it('deve retornar lista vazia para produto sem avaliações', async () => {
    const cat = await criarCategoria();
    const prod = await criarProduto(cat.id);

    const res = await request(app).get(`/api/avaliacoes/produto/${prod.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /api/avaliacoes/produto/:produtoId', () => {
  it('deve retornar 401 sem token', async () => {
    const cat = await criarCategoria();
    const prod = await criarProduto(cat.id);

    const res = await request(app)
      .post(`/api/avaliacoes/produto/${prod.id}`)
      .send({ nota: 5, comentario: 'Ótimo!' });

    expect(res.status).toBe(401);
  });

  it('deve criar avaliação com dados válidos', async () => {
    await criarUsuario('João', 'joao@teste.com', 'senha123');
    const cat = await criarCategoria();
    const prod = await criarProduto(cat.id);
    const token = await getToken('joao@teste.com', 'senha123');

    const res = await request(app)
      .post(`/api/avaliacoes/produto/${prod.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nota: 5, comentario: 'Produto excelente!' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ nota: 5, comentario: 'Produto excelente!' });
    expect(res.body.usuario.nome).toBe('João');
  });

  it('deve atualizar avaliação existente (upsert)', async () => {
    await criarUsuario('João', 'joao@teste.com', 'senha123');
    const cat = await criarCategoria();
    const prod = await criarProduto(cat.id);
    const token = await getToken('joao@teste.com', 'senha123');

    await request(app)
      .post(`/api/avaliacoes/produto/${prod.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nota: 3, comentario: 'Regular.' });

    const res = await request(app)
      .post(`/api/avaliacoes/produto/${prod.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nota: 5, comentario: 'Mudei de ideia — ótimo!' });

    expect(res.status).toBe(201);
    expect(res.body.nota).toBe(5);

    // Confirma que só existe uma avaliação
    const listagem = await request(app).get(`/api/avaliacoes/produto/${prod.id}`);
    expect(listagem.body).toHaveLength(1);
  });

  it('deve rejeitar nota fora do intervalo 1-5', async () => {
    await criarUsuario('João', 'joao@teste.com', 'senha123');
    const cat = await criarCategoria();
    const prod = await criarProduto(cat.id);
    const token = await getToken('joao@teste.com', 'senha123');

    const res = await request(app)
      .post(`/api/avaliacoes/produto/${prod.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nota: 6, comentario: 'Nota inválida' });

    expect(res.status).toBe(400);
  });
});
