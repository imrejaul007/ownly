import express from 'express';
import {
  getWebhooks,
  getWebhook,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  testWebhook,
  getWebhookDeliveries,
  getWebhookDelivery,
  retryDelivery,
  getAvailableEvents,
} from '../controllers/webhookController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Available events (public for authenticated users)
router.get('/events', getAvailableEvents);

// Webhook CRUD
router.get('/', getWebhooks);
router.post('/', createWebhook);
router.get('/:id', getWebhook);
router.patch('/:id', updateWebhook);
router.delete('/:id', deleteWebhook);

// Test webhook
router.post('/:id/test', testWebhook);

// Delivery logs
router.get('/:id/deliveries', getWebhookDeliveries);
router.get('/:webhookId/deliveries/:deliveryId', getWebhookDelivery);
router.post('/:webhookId/deliveries/:deliveryId/retry', retryDelivery);

export default router;
