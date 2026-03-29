import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as produtosService from '../../services/admin/produtosService';

const criarSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  preco: z.coerce.number().positive('Preço deve ser positivo'),
  imagemUrl: z.string().url('URL da imagem inválida'),
  categoriaId: z.coerce.number().int().positive(),
  peso: z.coerce.number().int().positive().nullish(),
  estoque: z.coerce.number().int().min(0).default(0),
});

const atualizarSchema = criarSchema.partial();

export async function listar(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await produtosService.listar());
  } catch (err) {
    next(err);
  }
}

export async function buscarPorId(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await produtosService.buscarPorId(parseInt(req.params.id)));
  } catch (err) {
    next(err);
  }
}

export async function criar(req: Request, res: Response, next: NextFunction) {
  try {
    const dados = criarSchema.parse(req.body);
    const produto = await produtosService.criar({
      ...dados,
      peso: dados.peso ?? null,
      estoque: dados.estoque,
    });
    res.status(201).json(produto);
  } catch (err) {
    next(err);
  }
}

export async function atualizar(req: Request, res: Response, next: NextFunction) {
  try {
    const dados = atualizarSchema.parse(req.body);
    const produto = await produtosService.atualizar(parseInt(req.params.id), {
      ...dados,
      peso: dados.peso ?? undefined,
    });
    res.json(produto);
  } catch (err) {
    next(err);
  }
}

export async function remover(req: Request, res: Response, next: NextFunction) {
  try {
    await produtosService.remover(parseInt(req.params.id));
    res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (err) {
    next(err);
  }
}
