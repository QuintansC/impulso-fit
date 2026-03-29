import { Router } from 'express';
import { autenticarToken } from '../../middleware/autenticarToken';
import { isAdmin } from '../../middleware/isAdmin';
import * as pedidosController from '../../controllers/admin/pedidosController';

const router = Router();
router.use(autenticarToken, isAdmin);

router.get('/', pedidosController.listar);
router.get('/:id', pedidosController.buscarPorId);
router.put('/:id/status', pedidosController.atualizarStatus);

export default router;
