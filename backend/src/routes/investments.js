import express from 'express';
import {
  invest,
  getUserInvestments,
  getInvestmentDetails,
  requestExit,
  getUserTransactions,
} from '../controllers/investmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All investment routes require authentication
router.post('/', authenticate, invest);
router.get('/my-investments', authenticate, getUserInvestments);
router.get('/my-transactions', authenticate, getUserTransactions);
router.get('/:id', authenticate, getInvestmentDetails);
router.post('/:id/exit', authenticate, requestExit);

// Admin route to view any user's investments
router.get('/user/:userId', authenticate, getUserInvestments);
router.get('/user/:userId/transactions', authenticate, getUserTransactions);

export default router;
