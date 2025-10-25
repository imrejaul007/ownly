import express from 'express';
import {
  uploadKYCDocument,
  updateKYCStatus,
  getKYCQueue,
  getUserKYC,
  bulkApproveKYC,
} from '../controllers/kycController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Upload KYC document (user can upload their own, admin can upload for anyone)
router.post('/upload', uploadKYCDocument);
router.post('/upload/:userId', uploadKYCDocument);

// Get user KYC details
router.get('/user/:userId', getUserKYC);

// Admin only routes
router.get(
  '/queue',
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  getKYCQueue
);

router.patch(
  '/:userId/status',
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  updateKYCStatus
);

router.post(
  '/bulk-approve',
  authorize(authConfig.roles.ADMIN),
  bulkApproveKYC
);

export default router;
