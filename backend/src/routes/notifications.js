import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationStats,
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user's notifications
router.get('/', getNotifications);

// Get notification statistics
router.get('/stats', getNotificationStats);

// Mark all notifications as read
router.post('/mark-all-read', markAllAsRead);

// Mark specific notification as read
router.patch('/:notificationId/read', markAsRead);

// Delete notification
router.delete('/:notificationId', deleteNotification);

export default router;
