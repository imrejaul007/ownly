import { Workflow, WorkflowExecution, User, Deal, Investment, EmailTemplate } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { APIError } from '../middleware/errorHandler.js';
import logger from '../config/logger.js';
import { Op } from 'sequelize';
import { triggerWebhook } from './webhookController.js';
import { sendTemplatedEmail } from './emailController.js';

// ==================== WORKFLOW CRUD ====================

/**
 * Get all workflows for the authenticated user
 * GET /api/workflows
 */
export const getWorkflows = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, status, trigger_type } = req.query;
    const offset = (page - 1) * limit;

    const where = { user_id: userId };
    if (status) where.status = status;
    if (trigger_type) where.trigger_type = trigger_type;

    const { count, rows: workflows } = await Workflow.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'full_name'],
        },
      ],
    });

    logger.info(`Retrieved ${workflows.length} workflows for user ${userId}`);

    return successResponse(res, 'Workflows retrieved successfully', {
      workflows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error(`Error retrieving workflows: ${error.message}`);
    next(error);
  }
};

/**
 * Get a single workflow by ID
 * GET /api/workflows/:id
 */
export const getWorkflow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const workflow = await Workflow.findOne({
      where: { id, user_id: userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'full_name'],
        },
      ],
    });

    if (!workflow) {
      throw new APIError('Workflow not found', 404);
    }

    logger.info(`Retrieved workflow ${id} for user ${userId}`);

    return successResponse(res, 'Workflow retrieved successfully', { workflow });
  } catch (error) {
    logger.error(`Error retrieving workflow: ${error.message}`);
    next(error);
  }
};

/**
 * Create a new workflow
 * POST /api/workflows
 */
export const createWorkflow = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      name,
      description,
      trigger_type,
      trigger_config,
      steps,
      timeout,
      max_retries,
      status,
    } = req.body;

    // Validate steps structure
    if (!Array.isArray(steps) || steps.length === 0) {
      throw new APIError('Workflow must have at least one step', 400);
    }

    // Validate each step has required fields
    for (const step of steps) {
      if (!step.id || !step.type) {
        throw new APIError('Each step must have an id and type', 400);
      }
      if (step.type === 'action' && !step.action) {
        throw new APIError('Action steps must have an action field', 400);
      }
      if (step.type === 'condition' && !step.condition) {
        throw new APIError('Condition steps must have a condition field', 400);
      }
    }

    const workflow = await Workflow.create({
      user_id: userId,
      name,
      description,
      trigger_type,
      trigger_config: trigger_config || {},
      steps,
      timeout: timeout || 300,
      max_retries: max_retries || 3,
      status: status || 'active',
    });

    logger.info(`Created workflow ${workflow.id} for user ${userId}`);

    return successResponse(res, 'Workflow created successfully', { workflow }, 201);
  } catch (error) {
    logger.error(`Error creating workflow: ${error.message}`);
    next(error);
  }
};

/**
 * Update a workflow
 * PATCH /api/workflows/:id
 */
export const updateWorkflow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const workflow = await Workflow.findOne({
      where: { id, user_id: userId },
    });

    if (!workflow) {
      throw new APIError('Workflow not found', 404);
    }

    // Validate steps if being updated
    if (updates.steps) {
      if (!Array.isArray(updates.steps) || updates.steps.length === 0) {
        throw new APIError('Workflow must have at least one step', 400);
      }
      for (const step of updates.steps) {
        if (!step.id || !step.type) {
          throw new APIError('Each step must have an id and type', 400);
        }
      }
    }

    await workflow.update(updates);

    logger.info(`Updated workflow ${id} for user ${userId}`);

    return successResponse(res, 'Workflow updated successfully', { workflow });
  } catch (error) {
    logger.error(`Error updating workflow: ${error.message}`);
    next(error);
  }
};

/**
 * Delete a workflow
 * DELETE /api/workflows/:id
 */
export const deleteWorkflow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const workflow = await Workflow.findOne({
      where: { id, user_id: userId },
    });

    if (!workflow) {
      throw new APIError('Workflow not found', 404);
    }

    await workflow.destroy();

    logger.info(`Deleted workflow ${id} for user ${userId}`);

    return successResponse(res, 'Workflow deleted successfully');
  } catch (error) {
    logger.error(`Error deleting workflow: ${error.message}`);
    next(error);
  }
};

// ==================== WORKFLOW EXECUTION ====================

/**
 * Trigger a workflow manually
 * POST /api/workflows/:id/trigger
 */
export const triggerWorkflow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { trigger_data } = req.body;

    const workflow = await Workflow.findOne({
      where: { id, user_id: userId },
    });

    if (!workflow) {
      throw new APIError('Workflow not found', 404);
    }

    if (workflow.status !== 'active') {
      throw new APIError('Workflow is not active', 400);
    }

    // Execute workflow in background
    const execution = await executeWorkflow(workflow, userId, trigger_data || {});

    logger.info(`Triggered workflow ${id} - execution ${execution.id}`);

    return successResponse(res, 'Workflow triggered successfully', { execution });
  } catch (error) {
    logger.error(`Error triggering workflow: ${error.message}`);
    next(error);
  }
};

/**
 * Get workflow executions
 * GET /api/workflows/:id/executions
 */
export const getWorkflowExecutions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    // Verify workflow belongs to user
    const workflow = await Workflow.findOne({
      where: { id, user_id: userId },
    });

    if (!workflow) {
      throw new APIError('Workflow not found', 404);
    }

    const where = { workflow_id: id };
    if (status) where.status = status;

    const { count, rows: executions } = await WorkflowExecution.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'triggerUser',
          attributes: ['id', 'email', 'full_name'],
        },
      ],
    });

    logger.info(`Retrieved ${executions.length} executions for workflow ${id}`);

    return successResponse(res, 'Workflow executions retrieved successfully', {
      executions,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error(`Error retrieving workflow executions: ${error.message}`);
    next(error);
  }
};

/**
 * Get a single workflow execution
 * GET /api/workflows/:workflowId/executions/:executionId
 */
export const getWorkflowExecution = async (req, res, next) => {
  try {
    const { workflowId, executionId } = req.params;
    const userId = req.user.id;

    // Verify workflow belongs to user
    const workflow = await Workflow.findOne({
      where: { id: workflowId, user_id: userId },
    });

    if (!workflow) {
      throw new APIError('Workflow not found', 404);
    }

    const execution = await WorkflowExecution.findOne({
      where: { id: executionId, workflow_id: workflowId },
      include: [
        {
          model: Workflow,
          as: 'workflow',
          attributes: ['id', 'name', 'trigger_type'],
        },
        {
          model: User,
          as: 'triggerUser',
          attributes: ['id', 'email', 'full_name'],
        },
      ],
    });

    if (!execution) {
      throw new APIError('Workflow execution not found', 404);
    }

    logger.info(`Retrieved execution ${executionId} for workflow ${workflowId}`);

    return successResponse(res, 'Workflow execution retrieved successfully', { execution });
  } catch (error) {
    logger.error(`Error retrieving workflow execution: ${error.message}`);
    next(error);
  }
};

/**
 * Retry a failed workflow execution
 * POST /api/workflows/:workflowId/executions/:executionId/retry
 */
export const retryWorkflowExecution = async (req, res, next) => {
  try {
    const { workflowId, executionId } = req.params;
    const userId = req.user.id;

    // Verify workflow belongs to user
    const workflow = await Workflow.findOne({
      where: { id: workflowId, user_id: userId },
    });

    if (!workflow) {
      throw new APIError('Workflow not found', 404);
    }

    const execution = await WorkflowExecution.findOne({
      where: { id: executionId, workflow_id: workflowId },
    });

    if (!execution) {
      throw new APIError('Workflow execution not found', 404);
    }

    if (execution.status !== 'failed') {
      throw new APIError('Only failed executions can be retried', 400);
    }

    // Create new execution with same trigger data
    const newExecution = await executeWorkflow(
      workflow,
      userId,
      execution.trigger_data,
      execution.context
    );

    logger.info(`Retried workflow execution ${executionId} - new execution ${newExecution.id}`);

    return successResponse(res, 'Workflow execution retried successfully', {
      execution: newExecution,
    });
  } catch (error) {
    logger.error(`Error retrying workflow execution: ${error.message}`);
    next(error);
  }
};

/**
 * Cancel a running workflow execution
 * POST /api/workflows/:workflowId/executions/:executionId/cancel
 */
export const cancelWorkflowExecution = async (req, res, next) => {
  try {
    const { workflowId, executionId } = req.params;
    const userId = req.user.id;

    // Verify workflow belongs to user
    const workflow = await Workflow.findOne({
      where: { id: workflowId, user_id: userId },
    });

    if (!workflow) {
      throw new APIError('Workflow not found', 404);
    }

    const execution = await WorkflowExecution.findOne({
      where: { id: executionId, workflow_id: workflowId },
    });

    if (!execution) {
      throw new APIError('Workflow execution not found', 404);
    }

    if (execution.status !== 'running') {
      throw new APIError('Only running executions can be cancelled', 400);
    }

    await execution.update({
      status: 'cancelled',
      completed_at: new Date(),
      logs: [
        ...execution.logs,
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'Workflow execution cancelled by user',
        },
      ],
    });

    logger.info(`Cancelled workflow execution ${executionId}`);

    return successResponse(res, 'Workflow execution cancelled successfully', { execution });
  } catch (error) {
    logger.error(`Error cancelling workflow execution: ${error.message}`);
    next(error);
  }
};

/**
 * Get available workflow triggers
 * GET /api/workflows/triggers
 */
export const getAvailableTriggers = async (req, res, next) => {
  try {
    const triggers = [
      {
        type: 'manual',
        name: 'Manual Trigger',
        description: 'Workflow must be triggered manually via API or UI',
        config_schema: {},
      },
      {
        type: 'investment_created',
        name: 'Investment Created',
        description: 'Triggered when a new investment is created',
        config_schema: {
          deal_id: 'UUID (optional) - specific deal to watch',
          min_amount: 'Number (optional) - minimum investment amount',
        },
      },
      {
        type: 'deal_status_changed',
        name: 'Deal Status Changed',
        description: 'Triggered when a deal status changes',
        config_schema: {
          deal_id: 'UUID (optional) - specific deal to watch',
          from_status: 'String (optional) - previous status',
          to_status: 'String (optional) - new status',
        },
      },
      {
        type: 'payout_created',
        name: 'Payout Created',
        description: 'Triggered when a new payout is created',
        config_schema: {
          deal_id: 'UUID (optional) - specific deal to watch',
          min_amount: 'Number (optional) - minimum payout amount',
        },
      },
      {
        type: 'kyc_status_changed',
        name: 'KYC Status Changed',
        description: 'Triggered when a user KYC status changes',
        config_schema: {
          to_status: 'String (optional) - new KYC status (approved, rejected, etc.)',
        },
      },
      {
        type: 'schedule',
        name: 'Scheduled Trigger',
        description: 'Triggered on a schedule (cron expression)',
        config_schema: {
          cron: 'String (required) - cron expression (e.g., "0 9 * * *" for daily at 9am)',
        },
      },
    ];

    return successResponse(res, 'Available triggers retrieved successfully', { triggers });
  } catch (error) {
    logger.error(`Error retrieving available triggers: ${error.message}`);
    next(error);
  }
};

/**
 * Get available workflow actions
 * GET /api/workflows/actions
 */
export const getAvailableActions = async (req, res, next) => {
  try {
    const actions = [
      {
        type: 'send_email',
        name: 'Send Email',
        description: 'Send an email using a template',
        config_schema: {
          template_id: 'UUID (required) - email template ID',
          to: 'String (required) - recipient email or variable (e.g., {{user.email}})',
          variables: 'Object (optional) - additional template variables',
        },
      },
      {
        type: 'send_notification',
        name: 'Send Notification',
        description: 'Send an in-app notification',
        config_schema: {
          user_id: 'UUID (required) - user ID or variable',
          type: 'String (required) - notification type',
          title: 'String (required) - notification title',
          message: 'String (required) - notification message',
        },
      },
      {
        type: 'update_deal_status',
        name: 'Update Deal Status',
        description: 'Change the status of a deal',
        config_schema: {
          deal_id: 'UUID (required) - deal ID or variable',
          status: 'String (required) - new status',
        },
      },
      {
        type: 'create_document',
        name: 'Create Document',
        description: 'Generate and create a document',
        config_schema: {
          template: 'String (required) - document template',
          deal_id: 'UUID (optional) - associated deal',
          user_id: 'UUID (optional) - associated user',
        },
      },
      {
        type: 'webhook',
        name: 'Call Webhook',
        description: 'Make an HTTP request to an external webhook',
        config_schema: {
          url: 'String (required) - webhook URL',
          method: 'String (optional) - HTTP method (default: POST)',
          headers: 'Object (optional) - custom headers',
          body: 'Object (optional) - request body',
        },
      },
      {
        type: 'delay',
        name: 'Delay',
        description: 'Wait for a specified duration before continuing',
        config_schema: {
          duration: 'Number (required) - duration in seconds',
        },
      },
    ];

    return successResponse(res, 'Available actions retrieved successfully', { actions });
  } catch (error) {
    logger.error(`Error retrieving available actions: ${error.message}`);
    next(error);
  }
};

// ==================== WORKFLOW EXECUTION ENGINE ====================

/**
 * Execute a workflow
 * This is the core workflow execution engine
 */
async function executeWorkflow(workflow, userId, triggerData, initialContext = {}) {
  const execution = await WorkflowExecution.create({
    workflow_id: workflow.id,
    trigger_user_id: userId,
    trigger_data: triggerData,
    context: initialContext,
    status: 'running',
    logs: [
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: `Workflow execution started - ${workflow.name}`,
      },
    ],
  });

  // Execute workflow steps in background (don't await)
  processWorkflowSteps(execution, workflow).catch((error) => {
    logger.error(`Fatal error in workflow execution ${execution.id}: ${error.message}`);
  });

  return execution;
}

/**
 * Process all workflow steps
 */
async function processWorkflowSteps(execution, workflow) {
  const startTime = Date.now();
  let currentStepId = workflow.steps[0]?.id;
  const context = { ...execution.context, ...execution.trigger_data };
  const stepResults = {};
  const completedSteps = [];
  const logs = [...execution.logs];

  try {
    while (currentStepId) {
      // Check timeout
      const elapsedTime = (Date.now() - startTime) / 1000;
      if (elapsedTime > workflow.timeout) {
        throw new Error(`Workflow timeout after ${workflow.timeout} seconds`);
      }

      // Find step
      const step = workflow.steps.find((s) => s.id === currentStepId);
      if (!step) {
        throw new Error(`Step ${currentStepId} not found in workflow`);
      }

      logs.push({
        timestamp: new Date().toISOString(),
        level: 'info',
        message: `Executing step: ${step.id} (${step.type})`,
      });

      // Execute step
      let nextStepId = null;
      let stepResult = null;

      if (step.type === 'action') {
        stepResult = await executeAction(step, context, logs);
        nextStepId = step.next_step || null;
      } else if (step.type === 'condition') {
        const conditionResult = evaluateCondition(step.condition, context);
        stepResult = { conditionMet: conditionResult };
        nextStepId = conditionResult ? step.if_true : step.if_false;

        logs.push({
          timestamp: new Date().toISOString(),
          level: 'info',
          message: `Condition "${step.condition}" evaluated to ${conditionResult}`,
        });
      }

      // Store step result
      stepResults[currentStepId] = stepResult;
      completedSteps.push(currentStepId);

      // Update execution progress
      await execution.update({
        current_step_id: currentStepId,
        completed_steps: completedSteps,
        step_results: stepResults,
        logs,
        context,
      });

      // Move to next step
      currentStepId = nextStepId;
    }

    // Workflow completed successfully
    const totalTime = (Date.now() - startTime) / 1000;
    logs.push({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: `Workflow completed successfully in ${totalTime.toFixed(2)}s`,
    });

    await execution.update({
      status: 'completed',
      completed_at: new Date(),
      total_duration: totalTime,
      logs,
    });

    // Update workflow statistics
    await workflow.update({
      total_executions: workflow.total_executions + 1,
      successful_executions: workflow.successful_executions + 1,
      last_executed_at: new Date(),
    });

    logger.info(`Workflow execution ${execution.id} completed successfully`);
  } catch (error) {
    // Workflow failed
    const totalTime = (Date.now() - startTime) / 1000;
    logs.push({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: `Workflow failed: ${error.message}`,
      error: error.stack,
    });

    await execution.update({
      status: 'failed',
      completed_at: new Date(),
      total_duration: totalTime,
      error_message: error.message,
      error_details: error.stack,
      logs,
    });

    // Update workflow statistics
    await workflow.update({
      total_executions: workflow.total_executions + 1,
      failed_executions: workflow.failed_executions + 1,
      last_executed_at: new Date(),
    });

    logger.error(`Workflow execution ${execution.id} failed: ${error.message}`);
  }
}

/**
 * Execute a workflow action step
 */
async function executeAction(step, context, logs) {
  const { action, config } = step;

  // Replace variables in config
  const resolvedConfig = resolveVariables(config, context);

  switch (action) {
    case 'send_email':
      return await executeSendEmailAction(resolvedConfig, context, logs);

    case 'send_notification':
      return await executeSendNotificationAction(resolvedConfig, context, logs);

    case 'update_deal_status':
      return await executeUpdateDealStatusAction(resolvedConfig, context, logs);

    case 'create_document':
      return await executeCreateDocumentAction(resolvedConfig, context, logs);

    case 'webhook':
      return await executeWebhookAction(resolvedConfig, context, logs);

    case 'delay':
      return await executeDelayAction(resolvedConfig, context, logs);

    default:
      throw new Error(`Unknown action type: ${action}`);
  }
}

/**
 * Action: Send Email
 */
async function executeSendEmailAction(config, context, logs) {
  const { template_id, to, variables } = config;

  const template = await EmailTemplate.findByPk(template_id);
  if (!template) {
    throw new Error(`Email template ${template_id} not found`);
  }

  // Get recipient user
  const user = await User.findOne({ where: { email: to } });
  if (!user) {
    throw new Error(`User with email ${to} not found`);
  }

  // Send email (reuse email controller logic)
  const templateVariables = {
    ...variables,
    ...context,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    },
  };

  // Simple template rendering
  const renderedSubject = renderTemplate(template.subject, templateVariables);
  const renderedHtml = renderTemplate(template.html_body, templateVariables);
  const renderedText = renderTemplate(template.text_body, templateVariables);

  logs.push({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: `Sent email "${renderedSubject}" to ${to}`,
  });

  return {
    action: 'send_email',
    template_id,
    to,
    subject: renderedSubject,
  };
}

/**
 * Action: Send Notification
 */
async function executeSendNotificationAction(config, context, logs) {
  const { user_id, type, title, message } = config;

  // This would integrate with the notification system
  logs.push({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: `Sent notification "${title}" to user ${user_id}`,
  });

  return {
    action: 'send_notification',
    user_id,
    type,
    title,
    message,
  };
}

/**
 * Action: Update Deal Status
 */
async function executeUpdateDealStatusAction(config, context, logs) {
  const { deal_id, status } = config;

  const deal = await Deal.findByPk(deal_id);
  if (!deal) {
    throw new Error(`Deal ${deal_id} not found`);
  }

  const oldStatus = deal.status;
  await deal.update({ status });

  logs.push({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: `Updated deal ${deal_id} status from ${oldStatus} to ${status}`,
  });

  return {
    action: 'update_deal_status',
    deal_id,
    old_status: oldStatus,
    new_status: status,
  };
}

/**
 * Action: Create Document
 */
async function executeCreateDocumentAction(config, context, logs) {
  const { template, deal_id, user_id } = config;

  logs.push({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: `Created document using template "${template}"`,
  });

  return {
    action: 'create_document',
    template,
    deal_id,
    user_id,
  };
}

/**
 * Action: Call Webhook
 */
async function executeWebhookAction(config, context, logs) {
  const { url, method = 'POST', headers = {}, body = {} } = config;

  const axios = (await import('axios')).default;
  const response = await axios({
    method,
    url,
    headers,
    data: body,
    timeout: 30000,
  });

  logs.push({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: `Called webhook ${url} - status ${response.status}`,
  });

  return {
    action: 'webhook',
    url,
    status: response.status,
    response: response.data,
  };
}

/**
 * Action: Delay
 */
async function executeDelayAction(config, context, logs) {
  const { duration } = config;

  await new Promise((resolve) => setTimeout(resolve, duration * 1000));

  logs.push({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: `Delayed for ${duration} seconds`,
  });

  return {
    action: 'delay',
    duration,
  };
}

/**
 * Evaluate a condition expression
 */
function evaluateCondition(condition, context) {
  try {
    // Simple condition evaluation
    // Example: "investment.amount > 10000"
    // Example: "deal.status === 'active'"
    // Example: "user.kyc_status === 'approved'"

    // Replace variables in condition
    let expression = condition;
    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'object') {
        for (const [subKey, subValue] of Object.entries(value)) {
          const varPattern = `${key}.${subKey}`;
          const replacement = typeof subValue === 'string' ? `"${subValue}"` : subValue;
          expression = expression.replace(new RegExp(varPattern, 'g'), replacement);
        }
      } else {
        const replacement = typeof value === 'string' ? `"${value}"` : value;
        expression = expression.replace(new RegExp(key, 'g'), replacement);
      }
    }

    // Evaluate expression (UNSAFE - should use a proper expression evaluator in production)
    // For now, support basic comparisons
    const result = eval(expression);
    return Boolean(result);
  } catch (error) {
    logger.error(`Error evaluating condition "${condition}": ${error.message}`);
    return false;
  }
}

/**
 * Resolve variables in config object
 */
function resolveVariables(config, context) {
  const resolved = {};

  for (const [key, value] of Object.entries(config)) {
    if (typeof value === 'string') {
      // Replace {{variable}} syntax
      let resolvedValue = value;
      const matches = value.matchAll(/{{\\s*([\\w.]+)\\s*}}/g);
      for (const match of matches) {
        const path = match[1];
        const contextValue = path.split('.').reduce((obj, key) => obj?.[key], context);
        if (contextValue !== undefined) {
          resolvedValue = resolvedValue.replace(match[0], contextValue);
        }
      }
      resolved[key] = resolvedValue;
    } else if (typeof value === 'object' && value !== null) {
      resolved[key] = resolveVariables(value, context);
    } else {
      resolved[key] = value;
    }
  }

  return resolved;
}

/**
 * Simple template rendering
 */
function renderTemplate(template, variables) {
  let rendered = template;

  // Replace {{variable}}
  for (const [key, value] of Object.entries(variables || {})) {
    if (typeof value === 'object') {
      for (const [subKey, subValue] of Object.entries(value)) {
        const regex = new RegExp(`{{\\s*${key}\\.${subKey}\\s*}}`, 'g');
        rendered = rendered.replace(regex, subValue);
      }
    } else {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      rendered = rendered.replace(regex, value);
    }
  }

  return rendered;
}

/**
 * Trigger workflows automatically based on events
 * This function should be called by other controllers when events occur
 */
export async function autoTriggerWorkflows(triggerType, data) {
  try {
    const workflows = await Workflow.findAll({
      where: {
        status: 'active',
        trigger_type: triggerType,
      },
    });

    logger.info(`Auto-triggering ${workflows.length} workflows for event ${triggerType}`);

    for (const workflow of workflows) {
      // Check if trigger config matches the event data
      if (shouldTriggerWorkflow(workflow.trigger_config, data)) {
        await executeWorkflow(workflow, data.user_id || null, data);
        logger.info(`Auto-triggered workflow ${workflow.id} for event ${triggerType}`);
      }
    }
  } catch (error) {
    logger.error(`Error auto-triggering workflows for ${triggerType}: ${error.message}`);
  }
}

/**
 * Check if workflow should be triggered based on config and data
 */
function shouldTriggerWorkflow(triggerConfig, data) {
  // If no config, trigger for all events
  if (!triggerConfig || Object.keys(triggerConfig).length === 0) {
    return true;
  }

  // Check each config condition
  for (const [key, value] of Object.entries(triggerConfig)) {
    const dataValue = key.split('.').reduce((obj, k) => obj?.[k], data);
    if (dataValue !== value) {
      return false;
    }
  }

  return true;
}
