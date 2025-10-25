import express from 'express';
import {
  getDocuments,
  getDocumentDetails,
  uploadDocument,
  downloadDocument,
  updateDocument,
  deleteDocument,
  getDocumentStats,
} from '../controllers/documentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get documents (with filters)
router.get('/', getDocuments);

// Get document statistics
router.get('/stats', getDocumentStats);

// Get document details
router.get('/:documentId', getDocumentDetails);

// Upload document (admin, spv_admin, operations)
router.post(
  '/',
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN, authConfig.roles.OPERATIONS),
  uploadDocument
);

// Download document
router.get('/:documentId/download', downloadDocument);

// Update document
router.patch('/:documentId', updateDocument);

// Delete document
router.delete('/:documentId', deleteDocument);

export default router;
