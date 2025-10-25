import express from 'express';
import {
  globalSearch,
  searchDeals,
  searchInvestments,
  searchDocuments,
  searchAnnouncements,
  getSearchSuggestions,
} from '../controllers/searchController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Global search
router.get('/', globalSearch);

// Search specific entities
router.get('/deals', searchDeals);
router.get('/investments', searchInvestments);
router.get('/documents', searchDocuments);
router.get('/announcements', searchAnnouncements);

// Get search suggestions (autocomplete)
router.get('/suggestions', getSearchSuggestions);

export default router;
