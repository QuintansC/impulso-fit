import { Router } from 'express';
import { autenticarToken } from '../../middleware/autenticarToken';
import { isAdmin } from '../../middleware/isAdmin';
import * as categoriasController from '../../controllers/admin/categoriasController';

const router = Router();
router.use(autenticarToken, isAdmin);

router.get('/', categoriasController.listar);
router.post('/', categoriasController.criar);
router.put('/:id', categoriasController.atualizar);

export default router;
