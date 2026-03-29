import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ erro: err.message });
  }

  if (err instanceof ZodError) {
    const mensagens = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
    return res.status(400).json({ erro: 'Dados inválidos', detalhes: mensagens });
  }

  console.error('Erro não tratado:', err);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}
