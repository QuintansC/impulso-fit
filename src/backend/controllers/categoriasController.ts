import { Request, Response, NextFunction } from 'express';
import * as categoriasService from '../services/categoriasService';

export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    const categorias = await categoriasService.listar();
    res.json(categorias);
  } catch (err) {
    next(err);
  }
}
