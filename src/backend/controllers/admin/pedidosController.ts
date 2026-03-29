import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as pedidosService from '../../services/admin/pedidosService';

const statusSchema = z.object({
  status: z.string().min(1, 'Status é obrigatório'),
});

export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await pedidosService.listar());
  } catch (err) {
    next(err);
  }
}

export async function buscarPorId(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await pedidosService.buscarPorId(parseInt(req.params.id)));
  } catch (err) {
    next(err);
  }
}

export async function atualizarStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = statusSchema.parse(req.body);
    const pedido = await pedidosService.atualizarStatus(parseInt(req.params.id), status);
    res.json(pedido);
  } catch (err) {
    next(err);
  }
}
