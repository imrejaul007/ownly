import express from 'express';
import {
  getTraders,
  getTraderProfile,
  createBundle,
  startCopying,
  stopCopying,
  getMyCopiers,
  getMyFollowing,
  getTraderBundles,
  updateBundle,
  updateTraderProfile,
} from '../controllers/copyTradingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes (anyone can browse traders)
router.get('/traders', getTraders);
router.get('/traders/:traderId', getTraderProfile);
router.get('/traders/:traderId/bundles', getTraderBundles);

// Protected routes (require authentication)
router.post('/bundles', authenticate, createBundle);
router.patch('/bundles/:bundleId', authenticate, updateBundle);

router.post('/start', authenticate, startCopying);
router.delete('/stop/:copyFollowerId', authenticate, stopCopying);

router.get('/my-copiers', authenticate, getMyCopiers);
router.get('/my-following', authenticate, getMyFollowing);

router.patch('/profile', authenticate, updateTraderProfile);

export default router;
