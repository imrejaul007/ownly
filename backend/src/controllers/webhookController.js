import { Webhook, WebhookDelivery, User } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { Op } from 'sequelize';
import logger from '../config/logger.js';
import crypto from 'crypto';
import axios from 'axios';

/**
 * Get user's webhooks
 * GET /api/webhooks
 */
export const getWebhooks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const where = { user_id: userId };
    if (status) where.status = status;

    const webhooks = await Webhook.findAll({
      where,
      order: [['created_at', 'DESC']],
    });

    successResponse(res, { webhooks });
  } catch (error) {
    logger.error('Error fetching webhooks:', error);
    next(error);
  }
};

/**
 * Get specific webhook
 * GET /api/webhooks/:id
 */
export const getWebhook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const webhook = await Webhook.findOne({
      where: { id, user_id: userId },
      include: [
        {
          model: WebhookDelivery,
          as: 'deliveries',
          limit: 10,
          order: [['created_at', 'DESC']],
        },
      ],
    });

    if (!webhook) {
      return errorResponse(res, 'Webhook not found', 404);
    }

    successResponse(res, { webhook });
  } catch (error) {
    logger.error('Error fetching webhook:', error);
    next(error);
  }
};

/**
 * Create new webhook
 * POST /api/webhooks
 */
export const createWebhook = async (req, res, next) => {
  try {
    const { name, url, events, description, headers } = req.body;
    const userId = req.user.id;

    if (!name || !url || !events || events.length === 0) {
      return errorResponse(res, 'Name, URL, and events are required', 400);
    }

    // Validate URL
    try {
      new URL(url);
    } catch (error) {
      return errorResponse(res, 'Invalid URL format', 400);
    }

    // Generate webhook secret for signature verification
    const secret = crypto.randomBytes(32).toString('hex');

    const webhook = await Webhook.create({
      user_id: userId,
      name,
      url,
      events,
      description,
      secret,
      headers: headers || {},
      status: 'active',
    });

    logger.info(`Webhook created: ${webhook.id} for user ${userId}`);
    successResponse(res, { webhook, message: 'Webhook created successfully' }, 201);
  } catch (error) {
    logger.error('Error creating webhook:', error);
    next(error);
  }
};

/**
 * Update webhook
 * PATCH /api/webhooks/:id
 */
export const updateWebhook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, url, events, description, headers, status } = req.body;
    const userId = req.user.id;

    const webhook = await Webhook.findOne({
      where: { id, user_id: userId },
    });

    if (!webhook) {
      return errorResponse(res, 'Webhook not found', 404);
    }

    // Validate URL if provided
    if (url) {
      try {
        new URL(url);
      } catch (error) {
        return errorResponse(res, 'Invalid URL format', 400);
      }
    }

    const updates = {};
    if (name) updates.name = name;
    if (url) updates.url = url;
    if (events) updates.events = events;
    if (description !== undefined) updates.description = description;
    if (headers) updates.headers = headers;
    if (status) updates.status = status;

    await webhook.update(updates);

    logger.info(`Webhook updated: ${id} for user ${userId}`);
    successResponse(res, { webhook, message: 'Webhook updated successfully' });
  } catch (error) {
    logger.error('Error updating webhook:', error);
    next(error);
  }
};

/**
 * Delete webhook
 * DELETE /api/webhooks/:id
 */
export const deleteWebhook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const webhook = await Webhook.findOne({
      where: { id, user_id: userId },
    });

    if (!webhook) {
      return errorResponse(res, 'Webhook not found', 404);
    }

    await webhook.destroy();

    logger.info(`Webhook deleted: ${id} for user ${userId}`);
    successResponse(res, { message: 'Webhook deleted successfully' });
  } catch (error) {
    logger.error('Error deleting webhook:', error);
    next(error);
  }
};

/**
 * Test webhook delivery
 * POST /api/webhooks/:id/test
 */
export const testWebhook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const webhook = await Webhook.findOne({
      where: { id, user_id: userId },
    });

    if (!webhook) {
      return errorResponse(res, 'Webhook not found', 404);
    }

    // Create test payload
    const testPayload = {
      event: 'test',
      timestamp: new Date().toISOString(),
      data: {
        message: 'This is a test webhook delivery',
        webhook_id: webhook.id,
      },
    };

    // Trigger webhook delivery
    const delivery = await deliverWebhook(webhook, 'test', testPayload);

    successResponse(res, {
      delivery,
      message: 'Test webhook sent',
    });
  } catch (error) {
    logger.error('Error testing webhook:', error);
    next(error);
  }
};

/**
 * Get webhook delivery logs
 * GET /api/webhooks/:id/deliveries
 */
export const getWebhookDeliveries = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 20, status } = req.query;

    // Verify webhook ownership
    const webhook = await Webhook.findOne({
      where: { id, user_id: userId },
    });

    if (!webhook) {
      return errorResponse(res, 'Webhook not found', 404);
    }

    const offset = (page - 1) * limit;
    const where = { webhook_id: id };
    if (status) where.status = status;

    const { count, rows: deliveries } = await WebhookDelivery.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    successResponse(res, {
      deliveries,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching webhook deliveries:', error);
    next(error);
  }
};

/**
 * Get specific delivery
 * GET /api/webhooks/:webhookId/deliveries/:deliveryId
 */
export const getWebhookDelivery = async (req, res, next) => {
  try {
    const { webhookId, deliveryId } = req.params;
    const userId = req.user.id;

    // Verify webhook ownership
    const webhook = await Webhook.findOne({
      where: { id: webhookId, user_id: userId },
    });

    if (!webhook) {
      return errorResponse(res, 'Webhook not found', 404);
    }

    const delivery = await WebhookDelivery.findOne({
      where: { id: deliveryId, webhook_id: webhookId },
    });

    if (!delivery) {
      return errorResponse(res, 'Delivery not found', 404);
    }

    successResponse(res, { delivery });
  } catch (error) {
    logger.error('Error fetching webhook delivery:', error);
    next(error);
  }
};

/**
 * Retry failed delivery
 * POST /api/webhooks/:webhookId/deliveries/:deliveryId/retry
 */
export const retryDelivery = async (req, res, next) => {
  try {
    const { webhookId, deliveryId } = req.params;
    const userId = req.user.id;

    // Verify webhook ownership
    const webhook = await Webhook.findOne({
      where: { id: webhookId, user_id: userId },
    });

    if (!webhook) {
      return errorResponse(res, 'Webhook not found', 404);
    }

    const delivery = await WebhookDelivery.findOne({
      where: { id: deliveryId, webhook_id: webhookId },
    });

    if (!delivery) {
      return errorResponse(res, 'Delivery not found', 404);
    }

    if (delivery.status === 'sent') {
      return errorResponse(res, 'Cannot retry successful delivery', 400);
    }

    // Retry delivery
    await retryWebhookDelivery(delivery, webhook);

    // Reload delivery
    await delivery.reload();

    successResponse(res, {
      delivery,
      message: 'Delivery retry initiated',
    });
  } catch (error) {
    logger.error('Error retrying delivery:', error);
    next(error);
  }
};

/**
 * Get available webhook events
 * GET /api/webhooks/events
 */
export const getAvailableEvents = async (req, res, next) => {
  try {
    const events = [
      {
        category: 'Investment',
        events: [
          { name: 'investment.created', description: 'New investment created' },
          { name: 'investment.updated', description: 'Investment updated' },
          { name: 'investment.completed', description: 'Investment completed' },
          { name: 'investment.cancelled', description: 'Investment cancelled' },
        ],
      },
      {
        category: 'Deal',
        events: [
          { name: 'deal.created', description: 'New deal published' },
          { name: 'deal.updated', description: 'Deal updated' },
          { name: 'deal.funded', description: 'Deal reached funding goal' },
          { name: 'deal.closed', description: 'Deal closed' },
        ],
      },
      {
        category: 'Payout',
        events: [
          { name: 'payout.created', description: 'Payout generated' },
          { name: 'payout.distributed', description: 'Payout distributed' },
          { name: 'payout.completed', description: 'Payout completed' },
          { name: 'payout.failed', description: 'Payout failed' },
        ],
      },
      {
        category: 'Document',
        events: [
          { name: 'document.uploaded', description: 'Document uploaded' },
          { name: 'document.signed', description: 'Document signed' },
          { name: 'document.shared', description: 'Document shared' },
        ],
      },
      {
        category: 'User',
        events: [
          { name: 'user.created', description: 'New user registered' },
          { name: 'user.kyc_approved', description: 'KYC approved' },
          { name: 'user.kyc_rejected', description: 'KYC rejected' },
        ],
      },
      {
        category: 'Transaction',
        events: [
          { name: 'transaction.created', description: 'Transaction created' },
          { name: 'transaction.completed', description: 'Transaction completed' },
          { name: 'transaction.failed', description: 'Transaction failed' },
        ],
      },
    ];

    successResponse(res, { events });
  } catch (error) {
    logger.error('Error fetching available events:', error);
    next(error);
  }
};

/**
 * Trigger webhook (helper function - called by other controllers)
 * @param {string} eventType - Event type (e.g., 'investment.created')
 * @param {object} data - Event data
 * @param {string} userId - Optional user ID to filter webhooks
 */
export const triggerWebhook = async (eventType, data, userId = null) => {
  try {
    const where = {
      status: 'active',
      events: { [Op.contains]: [eventType] },
    };

    if (userId) where.user_id = userId;

    const webhooks = await Webhook.findAll({ where });

    logger.info(`Triggering ${webhooks.length} webhooks for event: ${eventType}`);

    // Trigger all matching webhooks asynchronously
    const deliveryPromises = webhooks.map((webhook) =>
      deliverWebhook(webhook, eventType, data)
    );

    await Promise.allSettled(deliveryPromises);
  } catch (error) {
    logger.error('Error triggering webhooks:', error);
  }
};

/**
 * Deliver webhook (internal function)
 */
async function deliverWebhook(webhook, eventType, data) {
  const payload = {
    event: eventType,
    timestamp: new Date().toISOString(),
    webhook_id: webhook.id,
    data,
  };

  // Generate signature
  const signature = generateSignature(payload, webhook.secret);

  // Create delivery record
  const delivery = await WebhookDelivery.create({
    webhook_id: webhook.id,
    event_type: eventType,
    event_id: data.id || null,
    payload,
    status: 'pending',
    request_url: webhook.url,
    request_method: 'POST',
    request_headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': signature,
      'X-Event-Type': eventType,
      'X-Webhook-ID': webhook.id,
      ...webhook.headers,
    },
  });

  // Attempt delivery
  try {
    const startTime = Date.now();

    const response = await axios.post(webhook.url, payload, {
      headers: delivery.request_headers,
      timeout: webhook.timeout * 1000,
    });

    const responseTime = Date.now() - startTime;

    await delivery.update({
      status: 'sent',
      attempt_count: delivery.attempt_count + 1,
      response_status_code: response.status,
      response_body: JSON.stringify(response.data).substring(0, 10000), // Limit size
      response_headers: response.headers,
      response_time_ms: responseTime,
      sent_at: new Date(),
      completed_at: new Date(),
    });

    // Update webhook statistics
    await webhook.update({
      total_deliveries: webhook.total_deliveries + 1,
      successful_deliveries: webhook.successful_deliveries + 1,
      last_delivery_at: new Date(),
      last_successful_at: new Date(),
    });

    logger.info(`Webhook delivered successfully: ${delivery.id} in ${responseTime}ms`);
    return delivery;
  } catch (error) {
    const errorMessage = error.response
      ? `HTTP ${error.response.status}: ${error.response.statusText}`
      : error.message;

    await delivery.update({
      status: 'failed',
      attempt_count: delivery.attempt_count + 1,
      error_message: errorMessage,
      error_code: error.code || 'DELIVERY_FAILED',
      response_status_code: error.response?.status,
      failed_at: new Date(),
    });

    // Update webhook statistics
    await webhook.update({
      total_deliveries: webhook.total_deliveries + 1,
      failed_deliveries: webhook.failed_deliveries + 1,
      last_delivery_at: new Date(),
      last_failed_at: new Date(),
    });

    // Schedule retry if attempts < max_attempts
    if (delivery.attempt_count < delivery.max_attempts) {
      const retryDelay = calculateRetryDelay(
        delivery.attempt_count,
        webhook.retry_config.retry_delay,
        webhook.retry_config.backoff_multiplier
      );

      await delivery.update({
        status: 'retrying',
        next_retry_at: new Date(Date.now() + retryDelay * 1000),
      });

      logger.info(`Scheduling retry for delivery ${delivery.id} in ${retryDelay}s`);

      // In production, this should be handled by a background job queue
      setTimeout(() => retryWebhookDelivery(delivery, webhook), retryDelay * 1000);
    }

    logger.error(`Webhook delivery failed: ${delivery.id} - ${errorMessage}`);
    return delivery;
  }
}

/**
 * Retry webhook delivery
 */
async function retryWebhookDelivery(delivery, webhook) {
  logger.info(`Retrying webhook delivery: ${delivery.id}`);

  try {
    const startTime = Date.now();

    const response = await axios.post(delivery.request_url, delivery.payload, {
      headers: delivery.request_headers,
      timeout: webhook.timeout * 1000,
    });

    const responseTime = Date.now() - startTime;

    await delivery.update({
      status: 'sent',
      attempt_count: delivery.attempt_count + 1,
      response_status_code: response.status,
      response_body: JSON.stringify(response.data).substring(0, 10000),
      response_time_ms: responseTime,
      sent_at: new Date(),
      completed_at: new Date(),
      next_retry_at: null,
    });

    await webhook.update({
      successful_deliveries: webhook.successful_deliveries + 1,
      last_successful_at: new Date(),
    });

    logger.info(`Webhook retry successful: ${delivery.id}`);
  } catch (error) {
    await delivery.update({
      attempt_count: delivery.attempt_count + 1,
      error_message: error.message,
    });

    // Schedule another retry if attempts < max
    if (delivery.attempt_count < delivery.max_attempts) {
      const retryDelay = calculateRetryDelay(
        delivery.attempt_count,
        webhook.retry_config.retry_delay,
        webhook.retry_config.backoff_multiplier
      );

      await delivery.update({
        next_retry_at: new Date(Date.now() + retryDelay * 1000),
      });

      setTimeout(() => retryWebhookDelivery(delivery, webhook), retryDelay * 1000);
    } else {
      await delivery.update({
        status: 'failed',
        failed_at: new Date(),
      });
    }

    logger.error(`Webhook retry failed: ${delivery.id}`);
  }
}

/**
 * Generate webhook signature
 */
function generateSignature(payload, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
}

/**
 * Calculate retry delay with exponential backoff
 */
function calculateRetryDelay(attemptCount, baseDelay, multiplier) {
  return baseDelay * Math.pow(multiplier, attemptCount - 1);
}

export default {
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
  triggerWebhook, // Export for use in other controllers
};
