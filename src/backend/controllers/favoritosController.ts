import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as favoritosService from '../services/favoritosService';

const toggleSchema = z.object({
  produtoId: z.coerce.number().int().positive(),
});

export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = (req as any).usuario.id as number;
    res.json(await favoritosService.listar(usuarioId));
  } catch (err) {
    next(err);
  }
}

export async function toggle(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = (req as any).usuario.id as number;
    const { produtoId } = toggleSchema.parse(req.body);
    res.json(await favoritosService.toggle(usuarioId, produtoId));
  } catch (err) {
    next(err);
  }
}
