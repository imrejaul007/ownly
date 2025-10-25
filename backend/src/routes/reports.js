import express from 'express';
import {
  getReports,
  getReportDetails,
  generateReport,
  deleteReport,
  downloadReport,
  getTemplates,
} from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get available report templates
router.get('/templates', getTemplates);

// Get user's reports
router.get('/', getReports);

// Get specific report
router.get('/:reportId', getReportDetails);

// Generate new report
router.post('/generate', generateReport);

// Download report
router.get('/:reportId/download', downloadReport);

// Delete report
router.delete('/:reportId', deleteReport);

export default router;
