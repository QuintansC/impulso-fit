import { Router, raw } from 'express';
import * as pagamentosController from '../controllers/pagamentosController';

const router = Router();

// Webhook precisa do body cru (sem JSON.parse) para verificar assinatura
router.post('/webhook', raw({ type: 'application/json' }), pagamentosController.webhook);

router.post('/create-payment-intent', pagamentosController.criarPaymentIntent);
router.post('/create-order', pagamentosController.criarPedido);

export default router;
