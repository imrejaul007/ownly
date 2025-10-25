import express from 'express';
import {
  getWalletBalance,
  getWalletTransactions,
  addFunds,
  withdrawFunds,
  getWalletStats,
} from '../controllers/walletController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All wallet routes require authentication
router.get('/balance', authenticate, getWalletBalance);
router.get('/transactions', authenticate, getWalletTransactions);
router.get('/stats', authenticate, getWalletStats);
router.post('/add-funds', authenticate, addFunds);
router.post('/withdraw', authenticate, withdrawFunds);

export default router;
