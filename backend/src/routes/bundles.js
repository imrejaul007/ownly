import express from 'express';
import {
  listBundles,
  getBundle,
  createBundle,
  updateBundle,
  publishBundle,
  closeBundle,
  investInBundle,
  getBundlesByCategory,
} from '../controllers/bundleController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// Public/optional auth routes
router.get('/', optionalAuth, listBundles);
router.get('/:id', optionalAuth, getBundle);
router.get('/category/:category', optionalAuth, getBundlesByCategory);

// Investor routes
router.post(
  '/:id/invest',
  authenticate,
  authorize(authConfig.roles.INVESTOR_HNI, authConfig.roles.INVESTOR_RETAIL),
  investInBundle
);

// Admin/SPV Admin routes
router.post(
  '/',
  authenticate,
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  createBundle
);

router.patch(
  '/:id',
  authenticate,
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  updateBundle
);

router.post(
  '/:id/publish',
  authenticate,
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  publishBundle
);

router.post(
  '/:id/close',
  authenticate,
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  closeBundle
);

export default router;
