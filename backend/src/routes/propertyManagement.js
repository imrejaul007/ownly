import express from 'express';
import {
  getProperties,
  getPropertyDetails,
  recordRent,
  recordExpense,
  updateOccupancy,
  updateValuation,
  getPropertyReport,
  deleteRecord,
} from '../controllers/propertyManagementController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all properties
router.get('/', getProperties);

// Get property details
router.get('/:propertyId', getPropertyDetails);

// Record rental income
router.post('/:propertyId/rent', recordRent);

// Record expense
router.post('/:propertyId/expense', recordExpense);

// Update occupancy rate
router.patch('/:propertyId/occupancy', updateOccupancy);

// Update valuation
router.patch('/:propertyId/valuation', updateValuation);

// Get property financial report
router.get('/:propertyId/report', getPropertyReport);

// Delete rent/expense record
router.delete('/:propertyId/records/:recordId', deleteRecord);

export default router;
