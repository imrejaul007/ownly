import { EmailTemplate, EmailLog, User } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { Op } from 'sequelize';
import logger from '../config/logger.js';

// SendGrid integration (will be initialized when API key is provided)
let sgMail = null;
try {
  if (process.env.SENDGRID_API_KEY) {
    const sendgrid = await import('@sendgrid/mail');
    sgMail = sendgrid.default;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    logger.info('SendGrid initialized successfully');
  } else {
    logger.warn('SendGrid not initialized - SENDGRID_API_KEY not set');
  }
} catch (error) {
  logger.error('Failed to initialize SendGrid:', error);
}

/**
 * Get email templates
 * GET /api/emails/templates
 */
export const getTemplates = async (req, res, next) => {
  try {
    const { category, status } = req.query;

    const where = {};
    if (category) where.category = category;
    if (status) where.status = status;

    const templates = await EmailTemplate.findAll({
      where,
      order: [
        ['is_system', 'DESC'],
        ['created_at', 'DESC'],
      ],
    });

    successResponse(res, { templates });
  } catch (error) {
    logger.error('Error fetching email templates:', error);
    next(error);
  }
};

/**
 * Get specific template
 * GET /api/emails/templates/:id
 */
export const getTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;

    const template = await EmailTemplate.findByPk(id);

    if (!template) {
      return errorResponse(res, 'Template not found', 404);
    }

    successResponse(res, { template });
  } catch (error) {
    logger.error('Error fetching email template:', error);
    next(error);
  }
};

/**
 * Create email template
 * POST /api/emails/templates
 */
export const createTemplate = async (req, res, next) => {
  try {
    const {
      name,
      display_name,
      category,
      subject,
      html_body,
      text_body,
      preview_text,
      variables,
      from_name,
      from_email,
      reply_to,
      description,
    } = req.body;

    if (!name || !display_name || !category || !subject || !html_body) {
      return errorResponse(res, 'Required fields: name, display_name, category, subject, html_body', 400);
    }

    // Check if name already exists
    const existing = await EmailTemplate.findOne({ where: { name } });
    if (existing) {
      return errorResponse(res, 'Template with this name already exists', 400);
    }

    const template = await EmailTemplate.create({
      name,
      display_name,
      category,
      subject,
      html_body,
      text_body,
      preview_text,
      variables: variables || [],
      from_name,
      from_email,
      reply_to,
      description,
      status: 'active',
      is_system: false,
    });

    logger.info(`Email template created: ${template.id}`);
    successResponse(res, { template, message: 'Template created successfully' }, 201);
  } catch (error) {
    logger.error('Error creating email template:', error);
    next(error);
  }
};

/**
 * Update email template
 * PATCH /api/emails/templates/:id
 */
export const updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const template = await EmailTemplate.findByPk(id);

    if (!template) {
      return errorResponse(res, 'Template not found', 404);
    }

    if (template.is_system) {
      return errorResponse(res, 'Cannot modify system templates', 403);
    }

    // Update version on content change
    if (updates.html_body || updates.subject) {
      updates.version = template.version + 1;
    }

    await template.update(updates);

    logger.info(`Email template updated: ${id}`);
    successResponse(res, { template, message: 'Template updated successfully' });
  } catch (error) {
    logger.error('Error updating email template:', error);
    next(error);
  }
};

/**
 * Delete email template
 * DELETE /api/emails/templates/:id
 */
export const deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;

    const template = await EmailTemplate.findByPk(id);

    if (!template) {
      return errorResponse(res, 'Template not found', 404);
    }

    if (template.is_system) {
      return errorResponse(res, 'Cannot delete system templates', 403);
    }

    await template.destroy();

    logger.info(`Email template deleted: ${id}`);
    successResponse(res, { message: 'Template deleted successfully' });
  } catch (error) {
    logger.error('Error deleting email template:', error);
    next(error);
  }
};

/**
 * Preview email template
 * POST /api/emails/templates/:id/preview
 */
export const previewTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { variables } = req.body;

    const template = await EmailTemplate.findByPk(id);

    if (!template) {
      return errorResponse(res, 'Template not found', 404);
    }

    // Render template with variables
    const renderedHtml = renderTemplate(template.html_body, variables || template.sample_data);
    const renderedSubject = renderTemplate(template.subject, variables || template.sample_data);
    const renderedText = template.text_body
      ? renderTemplate(template.text_body, variables || template.sample_data)
      : null;

    successResponse(res, {
      subject: renderedSubject,
      html: renderedHtml,
      text: renderedText,
      preview_text: template.preview_text,
    });
  } catch (error) {
    logger.error('Error previewing email template:', error);
    next(error);
  }
};

/**
 * Send email directly
 * POST /api/emails/send
 */
export const sendEmail = async (req, res, next) => {
  try {
    if (!sgMail) {
      return errorResponse(res, 'Email service is not configured', 500);
    }

    const { to, subject, html, text, cc, bcc, from_name, from_email, reply_to } = req.body;
    const userId = req.user?.id;

    if (!to || !subject || !html) {
      return errorResponse(res, 'To, subject, and HTML body are required', 400);
    }

    // Get user email if user_id is provided in 'to'
    let toEmail = to;
    let toName = null;
    if (userId && !to.includes('@')) {
      const user = await User.findByPk(to);
      if (user) {
        toEmail = user.email;
        toName = user.full_name;
      }
    }

    // Prepare email message
    const msg = {
      to: toEmail,
      from: {
        email: from_email || process.env.DEFAULT_FROM_EMAIL,
        name: from_name || process.env.DEFAULT_FROM_NAME || 'OWNLY Platform',
      },
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    if (reply_to) msg.replyTo = reply_to;
    if (cc) msg.cc = cc;
    if (bcc) msg.bcc = bcc;

    // Send email
    const result = await sgMail.send(msg);

    // Create email log
    const emailLog = await EmailLog.create({
      user_id: userId || null,
      to_email: toEmail,
      to_name: toName,
      cc: cc || [],
      bcc: bcc || [],
      from_email: msg.from.email,
      from_name: msg.from.name,
      reply_to: reply_to || null,
      subject,
      html_body: html,
      text_body: text,
      provider: 'sendgrid',
      provider_message_id: result[0].headers['x-message-id'],
      status: 'sent',
      sent_at: new Date(),
    });

    logger.info(`Email sent: ${emailLog.id} to ${toEmail}`);
    successResponse(res, {
      emailLog,
      message: 'Email sent successfully',
    }, 201);
  } catch (error) {
    logger.error('Error sending email:', error);

    // Create failed email log
    if (req.body.to) {
      await EmailLog.create({
        user_id: req.user?.id || null,
        to_email: req.body.to,
        from_email: req.body.from_email || process.env.DEFAULT_FROM_EMAIL,
        subject: req.body.subject,
        html_body: req.body.html,
        provider: 'sendgrid',
        status: 'failed',
        error_message: error.message,
        failed_at: new Date(),
      });
    }

    next(error);
  }
};

/**
 * Send templated email
 * POST /api/emails/send-template
 */
export const sendTemplatedEmail = async (req, res, next) => {
  try {
    if (!sgMail) {
      return errorResponse(res, 'Email service is not configured', 500);
    }

    const { template_id, to, variables, cc, bcc } = req.body;
    const userId = req.user?.id;

    if (!template_id || !to) {
      return errorResponse(res, 'Template ID and recipient are required', 400);
    }

    // Get template
    const template = await EmailTemplate.findByPk(template_id);
    if (!template) {
      return errorResponse(res, 'Template not found', 404);
    }

    // Get user
    let user = null;
    if (to) {
      user = await User.findByPk(to);
      if (!user) {
        user = await User.findOne({ where: { email: to } });
      }
    }

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Prepare variables with user data
    const templateVariables = {
      ...variables,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        first_name: user.full_name?.split(' ')[0] || '',
      },
    };

    // Render template
    const renderedHtml = renderTemplate(template.html_body, templateVariables);
    const renderedSubject = renderTemplate(template.subject, templateVariables);
    const renderedText = template.text_body
      ? renderTemplate(template.text_body, templateVariables)
      : null;

    // Prepare email message
    const msg = {
      to: user.email,
      from: {
        email: template.from_email || process.env.DEFAULT_FROM_EMAIL,
        name: template.from_name || process.env.DEFAULT_FROM_NAME || 'OWNLY Platform',
      },
      subject: renderedSubject,
      html: renderedHtml,
      text: renderedText || renderedHtml.replace(/<[^>]*>/g, ''),
    };

    if (template.reply_to) msg.replyTo = template.reply_to;
    if (cc) msg.cc = cc;
    if (bcc) msg.bcc = bcc;

    // Send email
    const result = await sgMail.send(msg);

    // Create email log
    const emailLog = await EmailLog.create({
      email_template_id: template_id,
      user_id: user.id,
      to_email: user.email,
      to_name: user.full_name,
      cc: cc || [],
      bcc: bcc || [],
      from_email: msg.from.email,
      from_name: msg.from.name,
      reply_to: template.reply_to,
      subject: renderedSubject,
      html_body: renderedHtml,
      text_body: renderedText,
      provider: 'sendgrid',
      provider_message_id: result[0].headers['x-message-id'],
      status: 'sent',
      template_data: templateVariables,
      sent_at: new Date(),
    });

    // Update template statistics
    await template.update({
      send_count: template.send_count + 1,
      last_used_at: new Date(),
    });

    logger.info(`Templated email sent: ${emailLog.id} to ${user.email}`);
    successResponse(res, {
      emailLog,
      message: 'Email sent successfully',
    }, 201);
  } catch (error) {
    logger.error('Error sending templated email:', error);
    next(error);
  }
};

/**
 * Get email logs
 * GET /api/emails/logs
 */
export const getEmailLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, template_id, startDate, endDate } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (template_id) where.email_template_id = template_id;
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate) where.created_at[Op.lte] = new Date(endDate);
    }

    const { count, rows: logs } = await EmailLog.findAndCountAll({
      where,
      include: [
        {
          model: EmailTemplate,
          as: 'template',
          attributes: ['id', 'name', 'display_name', 'category'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'full_name'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    successResponse(res, {
      logs,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching email logs:', error);
    next(error);
  }
};

/**
 * Get specific email log
 * GET /api/emails/logs/:id
 */
export const getEmailLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const log = await EmailLog.findByPk(id, {
      include: [
        {
          model: EmailTemplate,
          as: 'template',
        },
        {
          model: User,
          as: 'user',
        },
      ],
    });

    if (!log) {
      return errorResponse(res, 'Email log not found', 404);
    }

    successResponse(res, { log });
  } catch (error) {
    logger.error('Error fetching email log:', error);
    next(error);
  }
};

/**
 * Get email statistics
 * GET /api/emails/stats
 */
export const getEmailStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate) where.created_at[Op.lte] = new Date(endDate);
    }

    // Total emails
    const totalEmails = await EmailLog.count({ where });

    // By status
    const byStatus = await EmailLog.findAll({
      where,
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    // By template
    const byTemplate = await EmailLog.findAll({
      where: { ...where, email_template_id: { [Op.ne]: null } },
      attributes: [
        'email_template_id',
        [sequelize.fn('COUNT', sequelize.col('EmailLog.id')), 'count'],
      ],
      include: [
        {
          model: EmailTemplate,
          as: 'template',
          attributes: ['name', 'display_name'],
        },
      ],
      group: ['email_template_id', 'template.id', 'template.name', 'template.display_name'],
      order: [[sequelize.fn('COUNT', sequelize.col('EmailLog.id')), 'DESC']],
      limit: 10,
    });

    // Open rate (if tracking is enabled)
    const openedEmails = await EmailLog.count({
      where: { ...where, opened_at: { [Op.ne]: null } },
    });

    // Click rate (if tracking is enabled)
    const clickedEmails = await EmailLog.count({
      where: { ...where, clicked_at: { [Op.ne]: null } },
    });

    successResponse(res, {
      stats: {
        totalEmails,
        openRate: totalEmails > 0 ? ((openedEmails / totalEmails) * 100).toFixed(2) : 0,
        clickRate: totalEmails > 0 ? ((clickedEmails / totalEmails) * 100).toFixed(2) : 0,
        byStatus,
        byTemplate,
      },
    });
  } catch (error) {
    logger.error('Error fetching email stats:', error);
    next(error);
  }
};

/**
 * Handle email provider webhooks (SendGrid)
 * POST /api/emails/sendgrid/webhook
 */
export const handleSendGridWebhook = async (req, res, next) => {
  try {
    const events = req.body;

    for (const event of events) {
      const messageId = event.sg_message_id?.split('.')[0];

      if (!messageId) continue;

      const emailLog = await EmailLog.findOne({
        where: { provider_message_id: messageId },
      });

      if (!emailLog) continue;

      // Handle different event types
      switch (event.event) {
        case 'delivered':
          await emailLog.update({
            status: 'delivered',
            delivered_at: new Date(event.timestamp * 1000),
          });
          break;

        case 'open':
          await emailLog.update({
            status: 'opened',
            opened_count: emailLog.opened_count + 1,
            opened_at: emailLog.opened_at || new Date(event.timestamp * 1000),
          });
          break;

        case 'click':
          await emailLog.update({
            status: 'clicked',
            clicked_count: emailLog.clicked_count + 1,
            clicked_at: emailLog.clicked_at || new Date(event.timestamp * 1000),
          });
          break;

        case 'bounce':
          await emailLog.update({
            status: 'bounced',
            bounce_type: event.type === 'blocked' ? 'hard' : 'soft',
            bounce_reason: event.reason,
          });
          break;

        case 'dropped':
        case 'failed':
          await emailLog.update({
            status: 'failed',
            error_message: event.reason,
            failed_at: new Date(event.timestamp * 1000),
          });
          break;

        case 'spamreport':
          await emailLog.update({
            status: 'spam',
          });
          break;
      }

      logger.info(`SendGrid webhook processed: ${event.event} for ${messageId}`);
    }

    res.sendStatus(200);
  } catch (error) {
    logger.error('Error handling SendGrid webhook:', error);
    res.sendStatus(500);
  }
};

/**
 * Render email template with variables
 * Simple template engine (replace {{variable}} with values)
 */
function renderTemplate(template, variables) {
  let rendered = template;

  for (const [key, value] of Object.entries(variables || {})) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    rendered = rendered.replace(regex, value);
  }

  // Handle nested variables (e.g., {{user.name}})
  const nestedRegex = /{{\\s*([\\w.]+)\\s*}}/g;
  rendered = rendered.replace(nestedRegex, (match, path) => {
    const value = path.split('.').reduce((obj, key) => obj?.[key], variables);
    return value !== undefined ? value : match;
  });

  return rendered;
}

export default {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  previewTemplate,
  sendEmail,
  sendTemplatedEmail,
  getEmailLogs,
  getEmailLog,
  getEmailStats,
  handleSendGridWebhook,
};
