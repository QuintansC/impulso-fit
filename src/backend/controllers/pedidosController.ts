import { Request, Response, NextFunction } from 'express';
import * as pedidosService from '../services/pedidosService';

export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = (req as any).usuario.id as number;
    res.json(await pedidosService.listarPedidosUsuario(usuarioId));
  } catch (err) {
    next(err);
  }
}

export async function buscarPorId(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarioId = (req as any).usuario.id as number;
    res.json(await pedidosService.buscarPedidoUsuario(parseInt(req.params.id), usuarioId));
  } catch (err) {
    next(err);
  }
}
