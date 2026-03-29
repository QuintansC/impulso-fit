import { Router } from 'express';
import * as produtosController from '../controllers/produtosController';

const router = Router();

router.get('/', produtosController.listar);
router.get('/:id', produtosController.buscarPorId);

export default router;
