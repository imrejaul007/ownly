import express from 'express';
import {
  updateAssetOperations,
  recordRevenue,
  recordExpense,
  getSPVFinancials,
} from '../controllers/operationsController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Asset operations (operations/property manager only)
router.patch(
  '/assets/:assetId',
  authorize(
    authConfig.roles.ADMIN,
    authConfig.roles.OPERATIONS,
    authConfig.roles.PROPERTY_MANAGER
  ),
  updateAssetOperations
);

// Record revenue
router.post(
  '/spv/:spvId/revenue',
  authorize(
    authConfig.roles.ADMIN,
    authConfig.roles.OPERATIONS,
    authConfig.roles.SPV_ADMIN
  ),
  recordRevenue
);

// Record expense
router.post(
  '/spv/:spvId/expense',
  authorize(
    authConfig.roles.ADMIN,
    authConfig.roles.OPERATIONS,
    authConfig.roles.SPV_ADMIN
  ),
  recordExpense
);

// Get SPV financials
router.get('/spv/:spvId/financials', getSPVFinancials);

export default router;
