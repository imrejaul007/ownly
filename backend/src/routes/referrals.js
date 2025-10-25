import express from 'express';
import {
  getReferralDashboard,
  getLeaderboard,
  applyReferralCode,
  getRewards,
  getReferralActivity,
} from '../controllers/referralController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/apply', applyReferralCode);
router.get('/rewards', getRewards);
router.get('/leaderboard', getLeaderboard);

// Protected routes
router.use(authenticate);
router.get('/dashboard', getReferralDashboard);
router.get('/activity', getReferralActivity);

export default router;
