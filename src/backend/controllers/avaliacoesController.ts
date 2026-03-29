import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as avaliacoesService from '../services/avaliacoesService';

const avaliacaoSchema = z.object({
  nota: z.coerce.number().int().min(1).max(5),
  comentario: z.string().min(1, 'Comentário é obrigatório').max(1000),
});

export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await avaliacoesService.listarPorProduto(parseInt(req.params.produtoId)));
  } catch (err) {
    next(err);
  }
}

export async function criarOuAtualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = (req as any).usuario.id as number;
    const produtoId = parseInt(req.params.produtoId);
    const { nota, comentario } = avaliacaoSchema.parse(req.body);
    const avaliacao = await avaliacoesService.criarOuAtualizar(usuarioId, produtoId, nota, comentario);
    res.status(201).json(avaliacao);
  } catch (err) {
    next(err);
  }
}
