import express from 'express';
import {
  getAgentDashboard,
  getAgentLeaderboard,
  getReferralDetails,
  getCommissionHistory,
} from '../controllers/agentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Agent dashboard (agent must be authenticated)
router.get('/dashboard', getAgentDashboard);

// Get commission history
router.get('/commissions', getCommissionHistory);

// Get specific referral details
router.get('/referrals/:referralId', getReferralDetails);

// Leaderboard (available to admins and agents)
router.get(
  '/leaderboard',
  authorize(authConfig.roles.ADMIN, authConfig.roles.AGENT),
  getAgentLeaderboard
);

export default router;
