import { Router } from 'express';
import { autenticarToken } from '../middleware/autenticarToken';
import * as pedidosController from '../controllers/pedidosController';

const router = Router();
router.use(autenticarToken);

router.get('/', pedidosController.listar);
router.get('/:id', pedidosController.buscarPorId);

export default router;
