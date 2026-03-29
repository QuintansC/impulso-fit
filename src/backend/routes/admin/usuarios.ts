import { Router } from 'express';
import { autenticarToken } from '../../middleware/autenticarToken';
import { isAdmin } from '../../middleware/isAdmin';
import * as usuariosController from '../../controllers/admin/usuariosController';

const router = Router();
router.use(autenticarToken, isAdmin);

router.get('/', usuariosController.listar);
router.put('/:id/role', usuariosController.atualizarRole);

export default router;
