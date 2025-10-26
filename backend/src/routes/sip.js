import express from 'express';
import {
  listSIPPlans,
  getSIPPlan,
  createSIPPlan,
  updateSIPPlan,
  subscribeToPlan,
  getMySubscriptions,
  getSubscription,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
} from '../controllers/sipController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// Public/optional auth routes - SIP Plans
router.get('/plans', optionalAuth, listSIPPlans);
router.get('/plans/:id', optionalAuth, getSIPPlan);

// Admin routes - SIP Plans
router.post(
  '/plans',
  authenticate,
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  createSIPPlan
);

router.patch(
  '/plans/:id',
  authenticate,
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  updateSIPPlan
);

// Investor routes - SIP Subscriptions
router.post(
  '/plans/:id/subscribe',
  authenticate,
  authorize(authConfig.roles.INVESTOR_HNI, authConfig.roles.INVESTOR_RETAIL),
  subscribeToPlan
);

router.get(
  '/subscriptions',
  authenticate,
  authorize(authConfig.roles.INVESTOR_HNI, authConfig.roles.INVESTOR_RETAIL),
  getMySubscriptions
);

router.get(
  '/subscriptions/:id',
  authenticate,
  authorize(authConfig.roles.INVESTOR_HNI, authConfig.roles.INVESTOR_RETAIL),
  getSubscription
);

router.post(
  '/subscriptions/:id/pause',
  authenticate,
  authorize(authConfig.roles.INVESTOR_HNI, authConfig.roles.INVESTOR_RETAIL),
  pauseSubscription
);

router.post(
  '/subscriptions/:id/resume',
  authenticate,
  authorize(authConfig.roles.INVESTOR_HNI, authConfig.roles.INVESTOR_RETAIL),
  resumeSubscription
);

router.post(
  '/subscriptions/:id/cancel',
  authenticate,
  authorize(authConfig.roles.INVESTOR_HNI, authConfig.roles.INVESTOR_RETAIL),
  cancelSubscription
);

export default router;
