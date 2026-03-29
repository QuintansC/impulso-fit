import { Router } from 'express';
import * as categoriasController from '../controllers/categoriasController';

const router = Router();

router.get('/', categoriasController.listar);

export default router;
