import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as categoriasService from '../../services/admin/categoriasService';

const nomeSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
});

export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await categoriasService.listar());
  } catch (err) {
    next(err);
  }
}

export async function criar(req: Request, res: Response, next: NextFunction) {
  try {
    const { nome } = nomeSchema.parse(req.body);
    const categoria = await categoriasService.criar(nome);
    res.status(201).json(categoria);
  } catch (err) {
    next(err);
  }
}

export async function atualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const { nome } = nomeSchema.parse(req.body);
    const categoria = await categoriasService.atualizar(parseInt(req.params.id), nome);
    res.json(categoria);
  } catch (err) {
    next(err);
  }
}
