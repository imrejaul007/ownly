import sequelize from '../config/database.js';
import { Announcement, Deal, SPV, User, Investment } from '../models/index.js';
import { successResponse, errorResponse } from "../utils/response.js";
import { createBulkNotifications } from './notificationController.js';

/**
 * Get announcements
 */
export const getAnnouncements = async (req, res, next) => {
  try {
    const { dealId, spvId, type, publishedOnly = 'true' } = req.query;

    const where = {};

    if (dealId) where.deal_id = dealId;
    if (spvId) where.spv_id = spvId;
    if (type) where.type = type;
    if (publishedOnly === 'true') where.published = true;

    const announcements = await Announcement.findAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'full_name', 'email'],
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title'],
        },
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'name'],
        },
      ],
      order: [['published_at', 'DESC'], ['created_at', 'DESC']],
    });

    successResponse(res, { announcements, count: announcements.length });
  } catch (error) {
    next(error);
  }
};

/**
 * Get announcement details
 */
export const getAnnouncementDetails = async (req, res, next) => {
  try {
    const { announcementId } = req.params;

    const announcement = await Announcement.findByPk(announcementId, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'full_name', 'email'],
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title'],
        },
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!announcement) {
      return errorResponse(res, 'Announcement not found', 404);
    }

    // Increment view count
    await announcement.update({
      view_count: announcement.view_count + 1,
    });

    successResponse(res, { announcement });
  } catch (error) {
    next(error);
  }
};

/**
 * Create announcement
 */
export const createAnnouncement = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const {
      dealId,
      spvId,
      type,
      title,
      content,
      summary,
      audience,
      priority,
      publishNow,
      sendNotification,
    } = req.body;

    const announcement = await Announcement.create(
      {
        deal_id: dealId || null,
        spv_id: spvId || null,
        created_by: userId,
        type: type || 'general',
        title,
        content,
        summary: summary || null,
        published: publishNow || false,
        published_at: publishNow ? new Date() : null,
        audience: audience || 'all',
        priority: priority || 'normal',
        send_notification: sendNotification !== false,
      },
      { transaction: t }
    );

    // If published and send_notification is true, create notifications
    if (publishNow && sendNotification !== false) {
      let targetUserIds = [];

      if (audience === 'specific_deal' && dealId) {
        // Get all investors in this deal
        const investments = await Investment.findAll({
          where: { deal_id: dealId },
          attributes: ['user_id'],
        });
        targetUserIds = [...new Set(investments.map((inv) => inv.user_id))];
      } else if (audience === 'specific_spv' && spvId) {
        // Get all investors in this SPV
        const investments = await Investment.findAll({
          where: { spv_id: spvId },
          attributes: ['user_id'],
        });
        targetUserIds = [...new Set(investments.map((inv) => inv.user_id))];
      } else if (audience === 'investors_only') {
        // Get all users with role 'investor'
        const investors = await User.findAll({
          where: { role: 'investor' },
          attributes: ['id'],
        });
        targetUserIds = investors.map((inv) => inv.id);
      } else {
        // audience === 'all' - get all users
        const allUsers = await User.findAll({
          attributes: ['id'],
        });
        targetUserIds = allUsers.map((user) => user.id);
      }

      // Create notifications
      if (targetUserIds.length > 0) {
        await createBulkNotifications(targetUserIds, {
          type: 'announcement',
          title: `New Announcement: ${title}`,
          message: summary || content.substring(0, 200) + '...',
          link: `/announcements/${announcement.id}`,
          priority: priority || 'normal',
          referenceType: 'announcement',
          referenceId: announcement.id,
        });
      }
    }

    await t.commit();

    const fullAnnouncement = await Announcement.findByPk(announcement.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'full_name', 'email'],
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title'],
        },
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'name'],
        },
      ],
    });

    successResponse(res, { announcement: fullAnnouncement }, 201);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * Update announcement
 */
export const updateAnnouncement = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { announcementId } = req.params;
    const updates = req.body;

    const announcement = await Announcement.findByPk(announcementId);

    if (!announcement) {
      return errorResponse(res, 'Announcement not found', 404);
    }

    // Check if user is the creator or admin
    if (announcement.created_by !== userId && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to update this announcement', 403);
    }

    await announcement.update(updates);

    const updatedAnnouncement = await Announcement.findByPk(announcementId, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'full_name', 'email'],
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title'],
        },
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'name'],
        },
      ],
    });

    successResponse(res, { announcement: updatedAnnouncement });
  } catch (error) {
    next(error);
  }
};

/**
 * Publish announcement
 */
export const publishAnnouncement = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { announcementId } = req.params;

    const announcement = await Announcement.findByPk(announcementId, {
      include: [
        {
          model: Deal,
          as: 'deal',
        },
        {
          model: SPV,
          as: 'spv',
        },
      ],
    });

    if (!announcement) {
      return errorResponse(res, 'Announcement not found', 404);
    }

    if (announcement.published) {
      return errorResponse(res, 'Announcement is already published', 400);
    }

    await announcement.update(
      {
        published: true,
        published_at: new Date(),
      },
      { transaction: t }
    );

    // Send notifications if enabled
    if (announcement.send_notification) {
      let targetUserIds = [];

      if (announcement.audience === 'specific_deal' && announcement.deal_id) {
        const investments = await Investment.findAll({
          where: { deal_id: announcement.deal_id },
          attributes: ['user_id'],
        });
        targetUserIds = [...new Set(investments.map((inv) => inv.user_id))];
      } else if (announcement.audience === 'specific_spv' && announcement.spv_id) {
        const investments = await Investment.findAll({
          where: { spv_id: announcement.spv_id },
          attributes: ['user_id'],
        });
        targetUserIds = [...new Set(investments.map((inv) => inv.user_id))];
      } else if (announcement.audience === 'investors_only') {
        const investors = await User.findAll({
          where: { role: 'investor' },
          attributes: ['id'],
        });
        targetUserIds = investors.map((inv) => inv.id);
      } else {
        const allUsers = await User.findAll({
          attributes: ['id'],
        });
        targetUserIds = allUsers.map((user) => user.id);
      }

      if (targetUserIds.length > 0) {
        await createBulkNotifications(targetUserIds, {
          type: 'announcement',
          title: `New Announcement: ${announcement.title}`,
          message: announcement.summary || announcement.content.substring(0, 200) + '...',
          link: `/announcements/${announcement.id}`,
          priority: announcement.priority,
          referenceType: 'announcement',
          referenceId: announcement.id,
        });
      }
    }

    await t.commit();

    successResponse(res, {
      message: 'Announcement published successfully',
      announcement,
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * Delete announcement
 */
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { announcementId } = req.params;

    const announcement = await Announcement.findByPk(announcementId);

    if (!announcement) {
      return errorResponse(res, 'Announcement not found', 404);
    }

    // Check if user is the creator or admin
    if (announcement.created_by !== userId && req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized to delete this announcement', 403);
    }

    await announcement.destroy();

    successResponse(res, { message: 'Announcement deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get recent announcements (public feed)
 */
export const getRecentAnnouncements = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const announcements = await Announcement.findAll({
      where: { published: true },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'full_name'],
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title'],
        },
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'name'],
        },
      ],
      order: [['published_at', 'DESC']],
      limit: parseInt(limit),
    });

    successResponse(res, { announcements, count: announcements.length });
  } catch (error) {
    next(error);
  }
};

export default {
  getAnnouncements,
  getAnnouncementDetails,
  createAnnouncement,
  updateAnnouncement,
  publishAnnouncement,
  deleteAnnouncement,
  getRecentAnnouncements,
};
