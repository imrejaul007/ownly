import { Op } from 'sequelize';
import {
  Deal,
  Investment,
  Document,
  Announcement,
  SPV,
  User,
  SecondaryMarketListing,
} from '../models/index.js';
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Global search across all entities
 */
export const globalSearch = async (req, res, next) => {
  try {
    const { q: query, limit = 10 } = req.query;

    if (!query || query.length < 2) {
      return errorResponse(res, 'Search query must be at least 2 characters', 400);
    }

    const searchPattern = `%${query}%`;

    // Search deals
    const deals = await Deal.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: searchPattern } },
          { description: { [Op.iLike]: searchPattern } },
          { location: { [Op.iLike]: searchPattern } },
        ],
      },
      limit: parseInt(limit),
      attributes: ['id', 'title', 'type', 'target_raise', 'status', 'location'],
    });

    // Search investments (user's own)
    const investments = await Investment.findAll({
      where: {
        user_id: req.user.id,
      },
      include: [
        {
          model: Deal,
          as: 'deal',
          where: {
            [Op.or]: [
              { title: { [Op.iLike]: searchPattern } },
              { description: { [Op.iLike]: searchPattern } },
            ],
          },
          attributes: ['id', 'title', 'type'],
        },
      ],
      limit: parseInt(limit),
    });

    // Search documents
    const documents = await Document.findAll({
      where: {
        [Op.or]: [
          { file_name: { [Op.iLike]: searchPattern } },
          { description: { [Op.iLike]: searchPattern } },
        ],
      },
      include: [
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title'],
        },
      ],
      limit: parseInt(limit),
      attributes: ['id', 'file_name', 'document_type', 'created_at'],
    });

    // Search announcements
    const announcements = await Announcement.findAll({
      where: {
        published: true,
        [Op.or]: [
          { title: { [Op.iLike]: searchPattern } },
          { content: { [Op.iLike]: searchPattern } },
        ],
      },
      limit: parseInt(limit),
      attributes: ['id', 'title', 'type', 'published_at'],
    });

    const results = {
      query,
      deals: deals.map((d) => ({ ...d.toJSON(), resultType: 'deal' })),
      investments: investments.map((i) => ({ ...i.toJSON(), resultType: 'investment' })),
      documents: documents.map((d) => ({ ...d.toJSON(), resultType: 'document' })),
      announcements: announcements.map((a) => ({ ...a.toJSON(), resultType: 'announcement' })),
      totalResults:
        deals.length + investments.length + documents.length + announcements.length,
    };

    successResponse(res, { results });
  } catch (error) {
    next(error);
  }
};

/**
 * Search deals with advanced filters
 */
export const searchDeals = async (req, res, next) => {
  try {
    const {
      q: query,
      type,
      status,
      minRaise,
      maxRaise,
      location,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      limit = 20,
      offset = 0,
    } = req.query;

    const where = {};

    if (query) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ];
    }

    if (type) where.type = type;
    if (status) where.status = status;
    if (location) where.location = { [Op.iLike]: `%${location}%` };

    if (minRaise || maxRaise) {
      where.target_raise = {};
      if (minRaise) where.target_raise[Op.gte] = parseFloat(minRaise);
      if (maxRaise) where.target_raise[Op.lte] = parseFloat(maxRaise);
    }

    const deals = await Deal.findAll({
      where,
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const total = await Deal.count({ where });

    successResponse(res, {
      deals,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search user's investments
 */
export const searchInvestments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      q: query,
      status,
      minAmount,
      maxAmount,
      dealType,
      sortBy = 'invested_at',
      sortOrder = 'DESC',
      limit = 20,
      offset = 0,
    } = req.query;

    const where = { user_id: userId };

    if (status) where.status = status;

    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount[Op.gte] = parseFloat(minAmount);
      if (maxAmount) where.amount[Op.lte] = parseFloat(maxAmount);
    }

    const includeWhere = {};
    if (query) {
      includeWhere[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ];
    }
    if (dealType) includeWhere.type = dealType;

    const investments = await Investment.findAll({
      where,
      include: [
        {
          model: Deal,
          as: 'deal',
          where: Object.keys(includeWhere).length > 0 ? includeWhere : undefined,
          attributes: ['id', 'title', 'type', 'status'],
        },
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const total = await Investment.count({
      where,
      include: [
        {
          model: Deal,
          as: 'deal',
          where: Object.keys(includeWhere).length > 0 ? includeWhere : undefined,
        },
      ],
    });

    successResponse(res, {
      investments,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search documents
 */
export const searchDocuments = async (req, res, next) => {
  try {
    const {
      q: query,
      documentType,
      dealId,
      spvId,
      visibility,
      limit = 20,
      offset = 0,
    } = req.query;

    const where = {};

    if (query) {
      where[Op.or] = [
        { file_name: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ];
    }

    if (documentType) where.document_type = documentType;
    if (dealId) where.deal_id = dealId;
    if (spvId) where.spv_id = spvId;
    if (visibility) where.visibility = visibility;

    const documents = await Document.findAll({
      where,
      include: [
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title'],
        },
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'full_name'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const total = await Document.count({ where });

    successResponse(res, {
      documents,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search announcements
 */
export const searchAnnouncements = async (req, res, next) => {
  try {
    const {
      q: query,
      type,
      dealId,
      spvId,
      limit = 20,
      offset = 0,
    } = req.query;

    const where = { published: true };

    if (query) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { content: { [Op.iLike]: `%${query}%` } },
      ];
    }

    if (type) where.type = type;
    if (dealId) where.deal_id = dealId;
    if (spvId) where.spv_id = spvId;

    const announcements = await Announcement.findAll({
      where,
      include: [
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title'],
        },
      ],
      order: [['published_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const total = await Announcement.count({ where });

    successResponse(res, {
      announcements,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get search suggestions (autocomplete)
 */
export const getSearchSuggestions = async (req, res, next) => {
  try {
    const { q: query, type = 'all', limit = 5 } = req.query;

    if (!query || query.length < 2) {
      return successResponse(res, { suggestions: [] });
    }

    const searchPattern = `%${query}%`;
    const suggestions = [];

    if (type === 'all' || type === 'deals') {
      const deals = await Deal.findAll({
        where: {
          title: { [Op.iLike]: searchPattern },
        },
        attributes: ['id', 'title'],
        limit: parseInt(limit),
      });

      suggestions.push(
        ...deals.map((d) => ({
          type: 'deal',
          id: d.id,
          text: d.title,
          label: `Deal: ${d.title}`,
        }))
      );
    }

    if (type === 'all' || type === 'documents') {
      const documents = await Document.findAll({
        where: {
          file_name: { [Op.iLike]: searchPattern },
        },
        attributes: ['id', 'file_name'],
        limit: parseInt(limit),
      });

      suggestions.push(
        ...documents.map((d) => ({
          type: 'document',
          id: d.id,
          text: d.file_name,
          label: `Document: ${d.file_name}`,
        }))
      );
    }

    successResponse(res, {
      query,
      suggestions: suggestions.slice(0, parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

export default {
  globalSearch,
  searchDeals,
  searchInvestments,
  searchDocuments,
  searchAnnouncements,
  getSearchSuggestions,
};
