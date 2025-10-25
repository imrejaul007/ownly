import express from 'express';
import {
  generatePayout,
  distributePayout,
  listPayouts,
  getPayoutDetails,
  simulateMonthlyPayout,
} from '../controllers/payoutController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// List payouts
router.get('/', listPayouts);

// Get payout details
router.get('/:id', getPayoutDetails);

// Generate payout (admin/operations only)
router.post(
  '/generate',
  authorize(authConfig.roles.ADMIN, authConfig.roles.OPERATIONS, authConfig.roles.SPV_ADMIN),
  generatePayout
);

// Distribute payout (admin/operations only)
router.post(
  '/:id/distribute',
  authorize(authConfig.roles.ADMIN, authConfig.roles.OPERATIONS),
  distributePayout
);

// Simulate monthly payout
router.get('/spv/:spvId/simulate', simulateMonthlyPayout);

export default router;
