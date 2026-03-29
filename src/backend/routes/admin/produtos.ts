import { Router } from 'express';
import { autenticarToken } from '../../middleware/autenticarToken';
import { isAdmin } from '../../middleware/isAdmin';
import * as produtosController from '../../controllers/admin/produtosController';

const router = Router();
router.use(autenticarToken, isAdmin);

router.get('/', produtosController.listar);
router.get('/:id', produtosController.buscarPorId);
router.post('/', produtosController.criar);
router.put('/:id', produtosController.atualizar);
router.delete('/:id', produtosController.remover);

export default router;
