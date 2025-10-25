import express from 'express';
import {
  listDeals,
  getDeal,
  createDeal,
  updateDeal,
  publishDeal,
  closeDeal,
} from '../controllers/dealController.js';
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

export default router;
