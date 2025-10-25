import express from 'express';
import {
  getPreferences,
  updatePreferences,
  updateNotificationPreferences,
  updateDisplayPreferences,
  updatePrivacyPreferences,
  updateSecurityPreferences,
  updateDashboardPreferences,
  resetToDefaults,
  getDefaults,
} from '../controllers/userPreferenceController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user preferences
router.get('/', getPreferences);

// Get default preferences
router.get('/defaults', getDefaults);

// Update general preferences
router.patch('/', updatePreferences);

// Update specific preference categories
router.patch('/notifications', updateNotificationPreferences);
router.patch('/display', updateDisplayPreferences);
router.patch('/privacy', updatePrivacyPreferences);
router.patch('/security', updateSecurityPreferences);
router.patch('/dashboard', updateDashboardPreferences);

// Reset to defaults
router.post('/reset', resetToDefaults);

export default router;
