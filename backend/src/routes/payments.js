import express from 'express';
import {
  getPaymentMethods,
  getPaymentMethod,
  createSetupIntent,
  addPaymentMethod,
  setDefaultPaymentMethod,
  removePaymentMethod,
  getTransactions,
  getTransaction,
  createCharge,
  refundTransaction,
  handleStripeWebhook,
} from '../controllers/paymentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// Stripe webhook (no authentication - verified by signature)
router.post('/stripe/webhook', handleStripeWebhook);

// All other routes require authentication
router.use(authenticate);

// Payment Methods
router.get('/methods', getPaymentMethods);
router.get('/methods/:id', getPaymentMethod);
router.post('/methods', addPaymentMethod);
router.post('/methods/:id/set-default', setDefaultPaymentMethod);
router.delete('/methods/:id', removePaymentMethod);

// Stripe Setup Intent
router.post('/stripe/setup-intent', createSetupIntent);

// Transactions
router.get('/transactions', getTransactions);
router.get('/transactions/:id', getTransaction);

// Charges
router.post('/charge', createCharge);

// Refunds (admin only or owner)
router.post('/refund/:id', refundTransaction);

export default router;
