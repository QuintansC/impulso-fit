import api from '@/lib/api';
import { UsuarioAdmin } from '@/types';

export async function getUsuarios(): Promise<UsuarioAdmin[]> {
  const { data } = await api.get('/admin/usuarios');
  return data;
}

export async function atualizarRole(id: number, role: string): Promise<Pick<UsuarioAdmin, 'id' | 'nome' | 'email' | 'role'>> {
  const { data } = await api.put(`/admin/usuarios/${id}/role`, { role });
  return data;
}
