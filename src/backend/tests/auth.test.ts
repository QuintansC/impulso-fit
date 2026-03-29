import request from 'supertest';
import { app, clearDb, criarUsuario } from './helpers';

beforeEach(clearDb);

describe('POST /api/auth/register', () => {
  it('deve registrar novo usuário', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nome: 'João', email: 'joao@teste.com', senha: 'senha123' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ nome: 'João', email: 'joao@teste.com', role: 'cliente' });
    expect(res.body.senha).toBeUndefined();
  });

  it('deve rejeitar email duplicado', async () => {
    await criarUsuario('João', 'joao@teste.com');
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nome: 'João 2', email: 'joao@teste.com', senha: 'senha123' });

    expect(res.status).toBe(409);
    expect(res.body.erro).toMatch(/email já cadastrado/i);
  });

  it('deve rejeitar senha curta', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ nome: 'João', email: 'joao@teste.com', senha: '123' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(() => criarUsuario('João', 'joao@teste.com', 'senha123'));

  it('deve retornar token com credenciais corretas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'joao@teste.com', senha: 'senha123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.usuario).toMatchObject({ email: 'joao@teste.com' });
  });

  it('deve rejeitar senha errada', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'joao@teste.com', senha: 'errada' });

    expect(res.status).toBe(401);
  });

  it('deve rejeitar email inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'naoexiste@teste.com', senha: 'senha123' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('deve retornar perfil com token válido', async () => {
    await criarUsuario('Maria', 'maria@teste.com', 'senha123');
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@teste.com', senha: 'senha123' });
    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('maria@teste.com');
  });

  it('deve retornar 401 sem token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
