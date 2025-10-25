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
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all active listings (public to authenticated users)
router.get('/listings', getActiveListings);

// Get my listings (as seller)
router.get('/my-listings', getMyListings);

// Create a new listing
router.post('/listings', createListing);

// Get listing details
router.get('/listings/:listingId', getListingDetails);

// Make an offer on a listing
router.post('/listings/:listingId/offer', makeOffer);

// Accept or reject an offer (seller only)
router.post('/listings/:listingId/respond', respondToOffer);

// Cancel a listing (seller only)
router.post('/listings/:listingId/cancel', cancelListing);

export default router;
