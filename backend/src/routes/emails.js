import express from 'express';
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  previewTemplate,
  sendEmail,
  sendTemplatedEmail,
  getEmailLogs,
  getEmailLog,
  getEmailStats,
  handleSendGridWebhook,
} from '../controllers/emailController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// SendGrid webhook (no auth - verified by SendGrid signature)
router.post('/sendgrid/webhook', handleSendGridWebhook);

// All other routes require authentication
router.use(authenticate);

// Email Templates
router.get('/templates', getTemplates);
router.post('/templates', createTemplate);
router.get('/templates/:id', getTemplate);
router.patch('/templates/:id', updateTemplate);
router.delete('/templates/:id', deleteTemplate);
router.post('/templates/:id/preview', previewTemplate);

// Send Emails
router.post('/send', sendEmail);
router.post('/send-template', sendTemplatedEmail);

// Email Logs
router.get('/logs', getEmailLogs);
router.get('/logs/:id', getEmailLog);

// Statistics
router.get('/stats', getEmailStats);

export default router;
