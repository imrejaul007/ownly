import express from 'express';
import {
  getActiveListings,
  getMyListings,
  createListing,
  makeOffer,
  respondToOffer,
  cancelListing,
  getListingDetails,
} from '../controllers/secondaryMarketController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes (browsing) - use optionalAuth
router.get('/listings', optionalAuth, getActiveListings);
router.get('/listings/:listingId', optionalAuth, getListingDetails);

// Private routes (require authentication)
// Get my listings (as seller)
router.get('/my-listings', authenticate, getMyListings);

// Create a new listing
router.post('/listings', authenticate, createListing);

// Make an offer on a listing
router.post('/listings/:listingId/offer', authenticate, makeOffer);

// Accept or reject an offer (seller only)
router.post('/listings/:listingId/respond', authenticate, respondToOffer);

// Cancel a listing (seller only)
router.post('/listings/:listingId/cancel', authenticate, cancelListing);

export default router;
