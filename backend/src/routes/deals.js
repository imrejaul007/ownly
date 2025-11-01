import express from 'express';
import {
  listDeals,
  getDeal,
  createDeal,
  updateDeal,
  publishDeal,
  closeDeal,
} from '../controllers/dealController.js';
import {
  processDealExit,
  getExitEligibility,
  getExitHistory,
} from '../controllers/exitController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// Public/optional auth routes
router.get('/', optionalAuth, listDeals);
router.get('/:id', optionalAuth, getDeal);

// Admin/SPV Admin routes
router.post(
  '/',
  authenticate,
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  createDeal
);

router.patch(
  '/:id',
  authenticate,
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  updateDeal
);

router.post(
  '/:id/publish',
  authenticate,
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  publishDeal
);

router.post(
  '/:id/close',
  authenticate,
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  closeDeal
);

// Exit/Redemption routes
router.post(
  '/:dealId/exit',
  authenticate,
  authorize(authConfig.roles.ADMIN),
  processDealExit
);

router.get(
  '/:dealId/exit/eligibility',
  authenticate,
  getExitEligibility
);

router.get(
  '/:dealId/exit/history',
  authenticate,
  getExitHistory
);

export default router;
