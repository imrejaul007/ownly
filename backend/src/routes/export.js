import express from 'express';
import {
  exportPortfolio,
  exportTransactions,
  exportDeals,
  exportInvestors,
} from '../controllers/exportController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Export portfolio (own data)
router.get('/portfolio', exportPortfolio);
router.get('/portfolio/:userId', exportPortfolio);

// Export transactions (own data)
router.get('/transactions', exportTransactions);
router.get('/transactions/:userId', exportTransactions);

// Export deals (admin only)
router.get(
  '/deals',
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  exportDeals
);

// Export investors (admin only)
router.get(
  '/investors',
  authorize(authConfig.roles.ADMIN),
  exportInvestors
);

export default router;
