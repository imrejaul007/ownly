import express from 'express';
import {
  getPlatformAnalytics,
  getDealAnalytics,
  getUserAnalytics,
} from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Platform analytics (admin only)
router.get(
  '/platform',
  authorize(authConfig.roles.ADMIN, authConfig.roles.AUDITOR),
  getPlatformAnalytics
);

// Deal analytics
router.get('/deals/:id', getDealAnalytics);

// User analytics (own data or admin)
router.get('/users/:id', getUserAnalytics);

export default router;
