import api from '@/lib/api';
import type { Avaliacao } from '@/types';

export async function getAvaliacoes(produtoId: number): Promise<Avaliacao[]> {
  const { data } = await api.get<Avaliacao[]>(`/avaliacoes/produto/${produtoId}`);
  return data;
}

export async function enviarAvaliacao(
  produtoId: number,
  nota: number,
  comentario: string,
): Promise<Avaliacao> {
  const { data } = await api.post<Avaliacao>(`/avaliacoes/produto/${produtoId}`, { nota, comentario });
  return data;
}
