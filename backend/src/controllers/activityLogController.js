import sequelize from '../config/database.js';
import { ActivityLog, User } from '../models/index.js';
import { successResponse, errorResponse } from "../utils/response.js";
import { Op } from 'sequelize';

/**
 * Get activity logs with filters
 */
export const getActivityLogs = async (req, res, next) => {
  try {
    const {
      userId,
      action,
      actionCategory,
      entityType,
      severity,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
    } = req.query;

    const where = {};

    if (userId) where.user_id = userId;
    if (action) where.action = action;
    if (actionCategory) where.action_category = actionCategory;
    if (entityType) where.entity_type = entityType;
    if (severity) where.severity = severity;

    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate) where.created_at[Op.lte] = new Date(endDate);
    }

    const logs = await ActivityLog.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'role'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const total = await ActivityLog.count({ where });

    successResponse(res, {
      logs,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user's activity
 */
export const getMyActivity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { actionCategory, startDate, endDate, limit = 50, offset = 0 } = req.query;

    const where = { user_id: userId };

    if (actionCategory) where.action_category = actionCategory;

    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate) where.created_at[Op.lte] = new Date(endDate);
    }

    const logs = await ActivityLog.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const total = await ActivityLog.count({ where });

    successResponse(res, {
      logs,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get activity statistics
 */
export const getActivityStats = async (req, res, next) => {
  try {
    const { userId, startDate, endDate } = req.query;

    const where = {};
    if (userId) where.user_id = userId;

    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate) where.created_at[Op.lte] = new Date(endDate);
    }

    const stats = {
      total: await ActivityLog.count({ where }),
      byCategory: {},
      bySeverity: {},
      byUser: {},
      recentActivity: [],
    };

    // Group by category
    const categoryGroups = await ActivityLog.findAll({
      where,
      attributes: [
        'action_category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['action_category'],
      raw: true,
    });

    categoryGroups.forEach((group) => {
      stats.byCategory[group.action_category] = parseInt(group.count);
    });

    // Group by severity
    const severityGroups = await ActivityLog.findAll({
      where,
      attributes: [
        'severity',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['severity'],
      raw: true,
    });

    severityGroups.forEach((group) => {
      stats.bySeverity[group.severity] = parseInt(group.count);
    });

    // Top users by activity
    const userGroups = await ActivityLog.findAll({
      where,
      attributes: [
        'user_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['user_id'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10,
      raw: true,
    });

    for (const group of userGroups) {
      if (group.user_id) {
        const user = await User.findByPk(group.user_id, {
          attributes: ['id', 'full_name', 'email'],
        });
        stats.byUser[group.user_id] = {
          user,
          count: parseInt(group.count),
        };
      }
    }

    // Recent activity (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    stats.recentActivity = await ActivityLog.findAll({
      where: {
        ...where,
        created_at: { [Op.gte]: twentyFourHoursAgo },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: 10,
    });

    successResponse(res, { stats });
  } catch (error) {
    next(error);
  }
};

/**
 * Get specific activity log entry
 */
export const getActivityLogDetails = async (req, res, next) => {
  try {
    const { logId } = req.params;

    const log = await ActivityLog.findByPk(logId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'role'],
        },
      ],
    });

    if (!log) {
      return errorResponse(res, 'Activity log not found', 404);
    }

    successResponse(res, { log });
  } catch (error) {
    next(error);
  }
};

/**
 * Clean up old logs (admin only)
 */
export const cleanupOldLogs = async (req, res, next) => {
  try {
    const { days = 90 } = req.body;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const deletedCount = await ActivityLog.destroy({
      where: {
        created_at: { [Op.lt]: cutoffDate },
        severity: { [Op.in]: ['info', 'warning'] }, // Keep errors and critical
      },
    });

    successResponse(res, {
      message: `Deleted ${deletedCount} log entries older than ${days} days`,
      deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to log activity (callable from other controllers)
 */
export const logActivity = async (data) => {
  try {
    const log = await ActivityLog.create({
      user_id: data.userId || null,
      action: data.action,
      action_category: data.category || 'other',
      entity_type: data.entityType || null,
      entity_id: data.entityId || null,
      description: data.description,
      ip_address: data.ipAddress || null,
      user_agent: data.userAgent || null,
      changes: data.changes || null,
      metadata: data.metadata || {},
      severity: data.severity || 'info',
    });

    return log;
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - activity logging should not break main operations
    return null;
  }
};

export default {
  getActivityLogs,
  getMyActivity,
  getActivityStats,
  getActivityLogDetails,
  cleanupOldLogs,
  logActivity,
};
