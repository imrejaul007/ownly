import express from 'express';
import {
  createSPVForDeal,
  getSPV,
  getSPVCapTable,
  updateSPV,
} from '../controllers/spvController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// Public routes
router.get('/:id', optionalAuth, getSPV);
router.get('/:id/cap-table', optionalAuth, getSPVCapTable);

// Admin routes
router.post(
  '/deal/:dealId',
  authenticate,
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  createSPVForDeal
);

router.patch(
  '/:id',
  authenticate,
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  updateSPV
);

export default router;
