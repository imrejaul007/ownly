import Joi from 'joi';
import { errorResponse } from '../utils/response.js';

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} property - Property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware
 */
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return errorResponse(res, errorMessage, 400);
    }

    // Replace the request property with validated value
    req[property] = value;
    next();
  };
};

// Common validation schemas
export const schemas = {
  // UUID validation
  uuid: Joi.string().uuid().required(),

  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().optional(),
    order: Joi.string().valid('ASC', 'DESC').default('DESC'),
  }),

  // Date range
  dateRange: Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
  }),

  // User registration
  userSignup: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      }),
    full_name: Joi.string().min(2).max(100).required(),
    role: Joi.string().valid('investor', 'admin', 'agent').default('investor'),
  }),

  // User login
  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  // Deal creation
  createDeal: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().min(10).required(),
    deal_type: Joi.string().valid('equity', 'debt', 'revenue_share').required(),
    target_raise: Joi.number().min(0).required(),
    minimum_investment: Joi.number().min(0).required(),
    maximum_investment: Joi.number().min(Joi.ref('minimum_investment')).optional(),
    deadline: Joi.date().iso().min('now').required(),
    location: Joi.string().optional(),
    industry: Joi.string().optional(),
    risk_level: Joi.string().valid('low', 'medium', 'high').optional(),
    expected_return: Joi.number().min(0).max(100).optional(),
    deal_terms: Joi.object().optional(),
    metadata: Joi.object().optional(),
  }),

  // Investment creation
  createInvestment: Joi.object({
    deal_id: Joi.string().uuid().required(),
    amount: Joi.number().min(0).required(),
    payment_method: Joi.string().valid('wire', 'ach', 'check', 'card').default('wire'),
    notes: Joi.string().max(500).optional(),
  }),

  // Payout generation
  generatePayout: Joi.object({
    spv_id: Joi.string().uuid().required(),
    payout_type: Joi.string().valid('dividend', 'distribution', 'return_of_capital').required(),
    total_amount: Joi.number().min(0).required(),
    payout_date: Joi.date().iso().required(),
    description: Joi.string().max(500).optional(),
  }),

  // Webhook creation
  createWebhook: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    url: Joi.string().uri().required(),
    events: Joi.array().items(Joi.string()).min(1).required(),
    secret: Joi.string().optional(),
    description: Joi.string().max(500).optional(),
  }),

  // Email template creation
  createEmailTemplate: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    display_name: Joi.string().min(3).max(100).required(),
    category: Joi.string().valid('transactional', 'marketing', 'notification', 'system', 'custom').required(),
    subject: Joi.string().min(3).max(200).required(),
    html_body: Joi.string().required(),
    text_body: Joi.string().optional(),
    variables: Joi.array().items(Joi.string()).optional(),
    from_name: Joi.string().optional(),
    from_email: Joi.string().email().optional(),
    reply_to: Joi.string().email().optional(),
  }),

  // Send email
  sendEmail: Joi.object({
    to: Joi.string().email().required(),
    template_id: Joi.string().uuid().optional(),
    subject: Joi.string().when('template_id', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    html: Joi.string().when('template_id', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    variables: Joi.object().optional(),
  }),

  // Workflow creation
  createWorkflow: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).optional(),
    trigger_type: Joi.string().valid('event', 'schedule', 'manual', 'webhook', 'condition').required(),
    trigger_config: Joi.object().required(),
    steps: Joi.array().items(Joi.object()).min(1).required(),
    timeout_seconds: Joi.number().integer().min(1).max(3600).default(300),
    max_retries: Joi.number().integer().min(0).max(10).default(3),
  }),
};

// Export validation middleware with common schemas
export default validate;
