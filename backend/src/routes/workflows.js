import express from 'express';
import {
  getWorkflows,
  getWorkflow,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  triggerWorkflow,
  getWorkflowExecutions,
  getWorkflowExecution,
  retryWorkflowExecution,
  cancelWorkflowExecution,
  getAvailableTriggers,
  getAvailableActions,
} from '../controllers/workflowController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Available triggers and actions (public for authenticated users)
router.get('/triggers', getAvailableTriggers);
router.get('/actions', getAvailableActions);

// Workflow CRUD
router.get('/', getWorkflows);
router.post('/', createWorkflow);
router.get('/:id', getWorkflow);
router.patch('/:id', updateWorkflow);
router.delete('/:id', deleteWorkflow);

// Trigger workflow
router.post('/:id/trigger', triggerWorkflow);

// Workflow executions
router.get('/:id/executions', getWorkflowExecutions);
router.get('/:workflowId/executions/:executionId', getWorkflowExecution);
router.post('/:workflowId/executions/:executionId/retry', retryWorkflowExecution);
router.post('/:workflowId/executions/:executionId/cancel', cancelWorkflowExecution);

export default router;
