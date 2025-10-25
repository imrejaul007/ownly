import express from 'express';
import {
  getSchedules,
  getScheduleDetails,
  createSchedule,
  updateSchedule,
  toggleScheduleStatus,
  deleteSchedule,
  processDuePayouts,
  getUpcomingPayouts,
} from '../controllers/payoutScheduleController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all schedules (with filters)
router.get('/', getSchedules);

// Get upcoming payouts
router.get('/upcoming', getUpcomingPayouts);

// Get schedule details
router.get('/:scheduleId', getScheduleDetails);

// Admin/SPV Admin routes
router.post(
  '/',
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  createSchedule
);

router.patch(
  '/:scheduleId',
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  updateSchedule
);

router.post(
  '/:scheduleId/toggle',
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  toggleScheduleStatus
);

router.delete(
  '/:scheduleId',
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  deleteSchedule
);

// Cron job endpoint (should be protected by API key in production)
router.post(
  '/process/due',
  authorize(authConfig.roles.ADMIN),
  processDuePayouts
);

export default router;
