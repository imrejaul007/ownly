import express from 'express';
import {
  getActivityLogs,
  getMyActivity,
  getActivityStats,
  getActivityLogDetails,
  cleanupOldLogs,
} from '../controllers/activityLogController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get current user's activity
router.get('/my-activity', getMyActivity);

// Get activity statistics
router.get('/stats', getActivityStats);

// Get specific log entry
router.get('/:logId', getActivityLogDetails);

// Get all activity logs (admin only)
router.get(
  '/',
  authorize(authConfig.roles.ADMIN),
  getActivityLogs
);

// Cleanup old logs (admin only)
router.post(
  '/cleanup',
  authorize(authConfig.roles.ADMIN),
  cleanupOldLogs
);

export default router;
