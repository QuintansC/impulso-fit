import { Router } from 'express';
import * as pagamentosController from '../controllers/pagamentosController';

const router = Router();

router.post('/create-payment-intent', pagamentosController.criarPaymentIntent);
router.post('/create-order', pagamentosController.criarPedido);

export default router;
