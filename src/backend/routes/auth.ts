import { Router } from 'express';
import { autenticarToken } from '../middleware/autenticarToken';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/register', authController.registrar);
router.post('/login', authController.login);
router.get('/me', autenticarToken, authController.me);

export default router;
