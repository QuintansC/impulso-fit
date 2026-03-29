import { Request, Response, NextFunction } from 'express';

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.usuario?.role !== 'admin') {
    return res.status(403).json({ erro: 'Acesso restrito a administradores' });
  }
  next();
}
