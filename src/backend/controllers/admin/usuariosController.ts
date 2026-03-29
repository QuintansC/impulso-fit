import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as usuariosService from '../../services/admin/usuariosService';

const roleSchema = z.object({
  role: z.string().min(1, 'Role é obrigatório'),
});

export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await usuariosService.listar());
  } catch (err) {
    next(err);
  }
}

export async function atualizarRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { role } = roleSchema.parse(req.body);
    const usuario = await usuariosService.atualizarRole(parseInt(req.params.id), role);
    res.json(usuario);
  } catch (err) {
    next(err);
  }
}
