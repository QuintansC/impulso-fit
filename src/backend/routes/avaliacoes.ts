import { Router } from 'express';
import { autenticarToken } from '../middleware/autenticarToken';
import * as avaliacoesController from '../controllers/avaliacoesController';

const router = Router();

router.get('/produto/:produtoId', avaliacoesController.listar);
router.post('/produto/:produtoId', autenticarToken, avaliacoesController.criarOuAtualizar);

export default router;
