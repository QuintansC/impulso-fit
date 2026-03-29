import api from '@/lib/api';
import { Usuario } from '@/types';

export async function login(email: string, senha: string): Promise<{ token: string; usuario: Usuario }> {
  const { data } = await api.post('/auth/login', { email, senha });
  return data;
}

export async function register(nome: string, email: string, senha: string): Promise<Usuario> {
  const { data } = await api.post('/auth/register', { nome, email, senha });
  return data;
}

export async function getMe(): Promise<Usuario> {
  const { data } = await api.get('/auth/me');
  return data;
}
