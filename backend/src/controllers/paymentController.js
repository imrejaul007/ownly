import { PaymentMethod, Transaction, User, Investment } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { Op } from 'sequelize';
import logger from '../config/logger.js';

// Stripe integration (will be initialized when Stripe keys are provided)
let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    const Stripe = await import('stripe');
    stripe = Stripe.default(process.env.STRIPE_SECRET_KEY);
    logger.info('Stripe initialized successfully');
  } else {
    logger.warn('Stripe not initialized - STRIPE_SECRET_KEY not set');
  }
} catch (error) {
  logger.error('Failed to initialize Stripe:', error);
}

/**
 * Get user's payment methods
 * GET /api/payments/methods
 */
export const getPaymentMethods = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const paymentMethods = await PaymentMethod.findAll({
      where: { user_id: userId },
      order: [
        ['is_default', 'DESC'],
        ['created_at', 'DESC'],
      ],
    });

    successResponse(res, { paymentMethods });
  } catch (error) {
    logger.error('Error fetching payment methods:', error);
    next(error);
  }
};

/**
 * Get specific payment method
 * GET /api/payments/methods/:id
 */
export const getPaymentMethod = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const paymentMethod = await PaymentMethod.findOne({
      where: { id, user_id: userId },
    });

    if (!paymentMethod) {
      return errorResponse(res, 'Payment method not found', 404);
    }

    successResponse(res, { paymentMethod });
  } catch (error) {
    logger.error('Error fetching payment method:', error);
    next(error);
  }
};

/**
 * Create Stripe setup intent (for adding payment method)
 * POST /api/payments/stripe/setup-intent
 */
export const createSetupIntent = async (req, res, next) => {
  try {
    if (!stripe) {
      return errorResponse(res, 'Payment processing is not configured', 500);
    }

    const userId = req.user.id;
    const user = await User.findByPk(userId);

    // Create or get Stripe customer
    let stripeCustomerId = user.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.full_name,
        metadata: { user_id: userId },
      });
      stripeCustomerId = customer.id;

      await user.update({ stripe_customer_id: stripeCustomerId });
    }

    // Create setup intent
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
    });

    successResponse(res, {
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
    });
  } catch (error) {
    logger.error('Error creating setup intent:', error);
    next(error);
  }
};

/**
 * Add payment method after Stripe confirmation
 * POST /api/payments/methods
 */
export const addPaymentMethod = async (req, res, next) => {
  try {
    if (!stripe) {
      return errorResponse(res, 'Payment processing is not configured', 500);
    }

    const { payment_method_id, nickname } = req.body;
    const userId = req.user.id;

    if (!payment_method_id) {
      return errorResponse(res, 'Payment method ID is required', 400);
    }

    // Retrieve payment method from Stripe
    const stripePaymentMethod = await stripe.paymentMethods.retrieve(payment_method_id);

    // Check if this is the first payment method
    const existingCount = await PaymentMethod.count({ where: { user_id: userId } });
    const isDefault = existingCount === 0;

    // If setting as default, unset other defaults
    if (isDefault) {
      await PaymentMethod.update(
        { is_default: false },
        { where: { user_id: userId } }
      );
    }

    // Create payment method record
    const paymentMethod = await PaymentMethod.create({
      user_id: userId,
      type: 'card',
      provider: 'stripe',
      provider_payment_method_id: payment_method_id,
      provider_customer_id: stripePaymentMethod.customer,
      card_brand: stripePaymentMethod.card?.brand,
      card_last4: stripePaymentMethod.card?.last4,
      card_exp_month: stripePaymentMethod.card?.exp_month,
      card_exp_year: stripePaymentMethod.card?.exp_year,
      nickname: nickname || `${stripePaymentMethod.card?.brand} ****${stripePaymentMethod.card?.last4}`,
      is_default: isDefault,
      is_verified: true,
      status: 'active',
      verified_at: new Date(),
    });

    logger.info(`Payment method added for user ${userId}`);
    successResponse(res, { paymentMethod, message: 'Payment method added successfully' }, 201);
  } catch (error) {
    logger.error('Error adding payment method:', error);
    next(error);
  }
};

/**
 * Set default payment method
 * POST /api/payments/methods/:id/set-default
 */
export const setDefaultPaymentMethod = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const paymentMethod = await PaymentMethod.findOne({
      where: { id, user_id: userId },
    });

    if (!paymentMethod) {
      return errorResponse(res, 'Payment method not found', 404);
    }

    // Unset all other defaults
    await PaymentMethod.update(
      { is_default: false },
      { where: { user_id: userId } }
    );

    // Set this as default
    await paymentMethod.update({ is_default: true });

    logger.info(`Default payment method set to ${id} for user ${userId}`);
    successResponse(res, { paymentMethod, message: 'Default payment method updated' });
  } catch (error) {
    logger.error('Error setting default payment method:', error);
    next(error);
  }
};

/**
 * Remove payment method
 * DELETE /api/payments/methods/:id
 */
export const removePaymentMethod = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const paymentMethod = await PaymentMethod.findOne({
      where: { id, user_id: userId },
    });

    if (!paymentMethod) {
      return errorResponse(res, 'Payment method not found', 404);
    }

    // If Stripe is configured, detach from Stripe
    if (stripe && paymentMethod.provider_payment_method_id) {
      try {
        await stripe.paymentMethods.detach(paymentMethod.provider_payment_method_id);
      } catch (stripeError) {
        logger.warn('Failed to detach payment method from Stripe:', stripeError);
      }
    }

    // If this was the default, set another as default
    if (paymentMethod.is_default) {
      const otherMethod = await PaymentMethod.findOne({
        where: {
          user_id: userId,
          id: { [Op.ne]: id },
        },
        order: [['created_at', 'DESC']],
      });

      if (otherMethod) {
        await otherMethod.update({ is_default: true });
      }
    }

    await paymentMethod.destroy();

    logger.info(`Payment method ${id} removed for user ${userId}`);
    successResponse(res, { message: 'Payment method removed successfully' });
  } catch (error) {
    logger.error('Error removing payment method:', error);
    next(error);
  }
};

/**
 * Get transaction history
 * GET /api/payments/transactions
 */
export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, type, status, startDate, endDate } = req.query;

    const offset = (page - 1) * limit;
    const where = { user_id: userId };

    if (type) where.type = type;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate) where.created_at[Op.lte] = new Date(endDate);
    }

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where,
      include: [
        {
          model: PaymentMethod,
          as: 'paymentMethod',
          attributes: ['id', 'type', 'card_brand', 'card_last4', 'nickname'],
        },
        {
          model: Investment,
          as: 'investment',
          attributes: ['id', 'amount', 'deal_id'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    successResponse(res, {
      transactions,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    next(error);
  }
};

/**
 * Get specific transaction
 * GET /api/payments/transactions/:id
 */
export const getTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findOne({
      where: { id, user_id: userId },
      include: [
        {
          model: PaymentMethod,
          as: 'paymentMethod',
        },
        {
          model: Investment,
          as: 'investment',
        },
      ],
    });

    if (!transaction) {
      return errorResponse(res, 'Transaction not found', 404);
    }

    successResponse(res, { transaction });
  } catch (error) {
    logger.error('Error fetching transaction:', error);
    next(error);
  }
};

/**
 * Create payment charge
 * POST /api/payments/charge
 */
export const createCharge = async (req, res, next) => {
  try {
    if (!stripe) {
      return errorResponse(res, 'Payment processing is not configured', 500);
    }

    const { amount, payment_method_id, description, investment_id } = req.body;
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!amount || amount <= 0) {
      return errorResponse(res, 'Invalid amount', 400);
    }

    // Get payment method
    let paymentMethod;
    if (payment_method_id) {
      paymentMethod = await PaymentMethod.findOne({
        where: { id: payment_method_id, user_id: userId },
      });
    } else {
      // Use default payment method
      paymentMethod = await PaymentMethod.findOne({
        where: { user_id: userId, is_default: true },
      });
    }

    if (!paymentMethod) {
      return errorResponse(res, 'No payment method found', 400);
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: user.stripe_customer_id,
      payment_method: paymentMethod.provider_payment_method_id,
      confirm: true,
      description: description || 'OWNLY Platform Payment',
      metadata: {
        user_id: userId,
        investment_id: investment_id || '',
      },
    });

    // Create transaction record
    const transaction = await Transaction.create({
      user_id: userId,
      payment_method_id: paymentMethod.id,
      investment_id: investment_id || null,
      type: 'investment',
      direction: 'inbound',
      status: paymentIntent.status === 'succeeded' ? 'succeeded' : 'processing',
      amount,
      currency: 'USD',
      fee_amount: 0, // Calculate platform fee if needed
      net_amount: amount,
      provider: 'stripe',
      provider_transaction_id: paymentIntent.id,
      provider_status: paymentIntent.status,
      description,
      processed_at: paymentIntent.status === 'succeeded' ? new Date() : null,
      completed_at: paymentIntent.status === 'succeeded' ? new Date() : null,
    });

    // Update payment method last used
    await paymentMethod.update({ last_used_at: new Date() });

    logger.info(`Payment charge created: ${transaction.id} for user ${userId}`);
    successResponse(res, {
      transaction,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
      },
      message: 'Payment processed successfully',
    }, 201);
  } catch (error) {
    logger.error('Error creating charge:', error);

    // Create failed transaction record
    if (req.body.amount) {
      await Transaction.create({
        user_id: req.user.id,
        type: 'investment',
        direction: 'inbound',
        status: 'failed',
        amount: req.body.amount,
        currency: 'USD',
        net_amount: req.body.amount,
        provider: 'stripe',
        description: req.body.description,
        failure_message: error.message,
        failed_at: new Date(),
      });
    }

    next(error);
  }
};

/**
 * Refund transaction
 * POST /api/payments/refund/:id
 */
export const refundTransaction = async (req, res, next) => {
  try {
    if (!stripe) {
      return errorResponse(res, 'Payment processing is not configured', 500);
    }

    const { id } = req.params;
    const { amount, reason } = req.body;
    const userId = req.user.id;

    const transaction = await Transaction.findOne({
      where: { id, user_id: userId, status: 'succeeded' },
    });

    if (!transaction) {
      return errorResponse(res, 'Transaction not found or cannot be refunded', 404);
    }

    if (!transaction.provider_transaction_id) {
      return errorResponse(res, 'Transaction cannot be refunded', 400);
    }

    // Create Stripe refund
    const refundAmount = amount ? Math.round(amount * 100) : undefined;
    const refund = await stripe.refunds.create({
      payment_intent: transaction.provider_transaction_id,
      amount: refundAmount,
      reason: reason || 'requested_by_customer',
    });

    // Create refund transaction record
    const refundTransaction = await Transaction.create({
      user_id: userId,
      payment_method_id: transaction.payment_method_id,
      investment_id: transaction.investment_id,
      type: 'refund',
      direction: 'outbound',
      status: refund.status === 'succeeded' ? 'succeeded' : 'processing',
      amount: refund.amount / 100,
      currency: 'USD',
      net_amount: refund.amount / 100,
      provider: 'stripe',
      provider_transaction_id: refund.id,
      description: `Refund for transaction ${id}`,
      metadata: { original_transaction_id: id },
      processed_at: refund.status === 'succeeded' ? new Date() : null,
      completed_at: refund.status === 'succeeded' ? new Date() : null,
    });

    // Update original transaction
    await transaction.update({ status: 'refunded' });

    logger.info(`Refund created: ${refundTransaction.id} for transaction ${id}`);
    successResponse(res, {
      refundTransaction,
      message: 'Refund processed successfully',
    }, 201);
  } catch (error) {
    logger.error('Error processing refund:', error);
    next(error);
  }
};

/**
 * Handle Stripe webhooks
 * POST /api/payments/stripe/webhook
 */
export const handleStripeWebhook = async (req, res, next) => {
  try {
    if (!stripe) {
      return errorResponse(res, 'Payment processing is not configured', 500);
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      logger.warn('Stripe webhook secret not configured');
      return res.sendStatus(400);
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err) {
      logger.error('Webhook signature verification failed:', err);
      return res.sendStatus(400);
    }

    logger.info(`Stripe webhook received: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;
      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Error handling Stripe webhook:', error);
    next(error);
  }
};

// Helper functions for webhook events
async function handlePaymentIntentSucceeded(paymentIntent) {
  const transaction = await Transaction.findOne({
    where: { provider_transaction_id: paymentIntent.id },
  });

  if (transaction) {
    await transaction.update({
      status: 'succeeded',
      provider_status: paymentIntent.status,
      completed_at: new Date(),
    });
    logger.info(`Payment intent succeeded: ${paymentIntent.id}`);
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  const transaction = await Transaction.findOne({
    where: { provider_transaction_id: paymentIntent.id },
  });

  if (transaction) {
    await transaction.update({
      status: 'failed',
      provider_status: paymentIntent.status,
      failure_message: paymentIntent.last_payment_error?.message,
      failed_at: new Date(),
    });
    logger.warn(`Payment intent failed: ${paymentIntent.id}`);
  }
}

async function handleChargeRefunded(charge) {
  // Update related transactions
  logger.info(`Charge refunded: ${charge.id}`);
}

export default {
  getPaymentMethods,
  getPaymentMethod,
  createSetupIntent,
  addPaymentMethod,
  setDefaultPaymentMethod,
  removePaymentMethod,
  getTransactions,
  getTransaction,
  createCharge,
  refundTransaction,
  handleStripeWebhook,
};
