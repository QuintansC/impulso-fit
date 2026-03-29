import { Router } from 'express';
import { autenticarToken } from '../middleware/autenticarToken';
import * as favoritosController from '../controllers/favoritosController';

const router = Router();
router.use(autenticarToken);

router.get('/', favoritosController.listar);
router.post('/toggle', favoritosController.toggle);

export default router;
