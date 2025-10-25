import express from 'express';
import {
  listScenarios,
  getScenarioTemplates,
  createScenario,
  runScenario,
  getScenarioResults,
  deleteScenario,
} from '../controllers/scenarioController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import authConfig from '../config/auth.js';

const router = express.Router();

// Get scenario templates (public)
router.get('/templates', getScenarioTemplates);

// All other routes require authentication
router.use(authenticate);

// List scenarios
router.get('/', listScenarios);

// Create scenario
router.post('/', createScenario);

// Run scenario
router.post('/:id/run', runScenario);

// Get scenario results
router.get('/:id/results', getScenarioResults);

// Delete scenario (admin only)
router.delete(
  '/:id',
  authorize(authConfig.roles.ADMIN, authConfig.roles.SPV_ADMIN),
  deleteScenario
);

export default router;
