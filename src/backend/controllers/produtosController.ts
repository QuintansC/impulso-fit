import { Request, Response, NextFunction } from 'express';
import * as produtosService from '../services/produtosService';

export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const produtos = await produtosService.listar();
    res.json(produtos);
  } catch (err) {
    next(err);
  }
}

export async function buscarPorId(req: Request, res: Response, next: NextFunction) {
  try {
    const produto = await produtosService.buscarPorId(parseInt(req.params.id));
    res.json(produto);
  } catch (err) {
    next(err);
  }
}
