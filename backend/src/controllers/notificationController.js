import sequelize from '../config/database.js';
import { Notification, User } from '../models/index.js';
import { successResponse, errorResponse } from "../utils/response.js";
import { Op } from 'sequelize';

/**
 * Get user's notifications
 */
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { unreadOnly, type, limit = 50, offset = 0 } = req.query;

    const where = { user_id: userId };

    if (unreadOnly === 'true') {
      where.read = false;
    }

    if (type) {
      where.type = type;
    }

    const notifications = await Notification.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const unreadCount = await Notification.count({
      where: { user_id: userId, read: false },
    });

    successResponse(res, {
      notifications,
      unreadCount,
      total: notifications.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }

    await notification.update({
      read: true,
      read_at: new Date(),
    });

    successResponse(res, { notification });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Notification.update(
      {
        read: true,
        read_at: new Date(),
      },
      {
        where: {
          user_id: userId,
          read: false,
        },
      }
    );

    successResponse(res, { message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }

    await notification.destroy();

    successResponse(res, { message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get notification statistics
 */
export const getNotificationStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const stats = {
      total: await Notification.count({ where: { user_id: userId } }),
      unread: await Notification.count({ where: { user_id: userId, read: false } }),
      byType: {},
    };

    const typeGroups = await Notification.findAll({
      where: { user_id: userId },
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['type'],
      raw: true,
    });

    typeGroups.forEach((group) => {
      stats.byType[group.type] = parseInt(group.count);
    });

    successResponse(res, { stats });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to create notification (can be called from other controllers)
 */
export const createNotification = async (data) => {
  try {
    const notification = await Notification.create({
      user_id: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link || null,
      priority: data.priority || 'normal',
      reference_type: data.referenceType || null,
      reference_id: data.referenceId || null,
      metadata: data.metadata || {},
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Helper function to create notifications for multiple users
 */
export const createBulkNotifications = async (userIds, data) => {
  try {
    const notifications = userIds.map((userId) => ({
      user_id: userId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link || null,
      priority: data.priority || 'normal',
      reference_type: data.referenceType || null,
      reference_id: data.referenceId || null,
      metadata: data.metadata || {},
    }));

    const created = await Notification.bulkCreate(notifications);
    return created;
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    throw error;
  }
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationStats,
  createNotification,
  createBulkNotifications,
};
