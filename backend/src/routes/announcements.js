import express from 'express';
import {
  getAnnouncements,
  getAnnouncementDetails,
  createAnnouncement,
  updateAnnouncement,
  publishAnnouncement,
  deleteAnnouncement,
  getRecentAnnouncements,
} from '../controllers/announcementController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get recent announcements (public feed)
router.get('/recent', getRecentAnnouncements);

// Get announcements (with filters)
router.get('/', getAnnouncements);

// Get announcement details
router.get('/:announcementId', getAnnouncementDetails);

// Create announcement (admin, spv_admin)
router.post(
  '/',
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  createAnnouncement
);

// Update announcement
router.patch('/:announcementId', updateAnnouncement);

// Publish announcement (admin, spv_admin)
router.post(
  '/:announcementId/publish',
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  publishAnnouncement
);

// Delete announcement
router.delete('/:announcementId', deleteAnnouncement);

export default router;
