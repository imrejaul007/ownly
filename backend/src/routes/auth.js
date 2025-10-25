import express from 'express';
import {
  signup,
  login,
  getProfile,
  updateProfile,
  impersonate,
} from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfile);

// Admin only
router.post('/impersonate', authenticate, authorize(authConfig.roles.ADMIN), impersonate);

export default router;
