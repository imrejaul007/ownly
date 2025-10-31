import express from 'express';
import {
  transitionToLockIn,
  transitionToOperational,
  updateLockInDates,
  deployAsset,
  getDealsInLockIn,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin role
router.use(authenticate);
router.use(authorize(['admin']));

// Deal phase transitions
router.post('/deals/:id/transition-to-lock-in', transitionToLockIn);
router.post('/deals/:id/transition-to-operational', transitionToOperational);

// Lock-in management
router.put('/deals/:id/lock-in-dates', updateLockInDates);
router.get('/deals/lock-in', getDealsInLockIn);

// Asset deployment
router.post('/deals/:id/deploy-asset', deployAsset);

export default router;
