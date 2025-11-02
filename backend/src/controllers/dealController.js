import { Deal, SPV, Investment, User } from '../models/index.js';
import { success, error, paginate } from '../utils/response.js';
import { Op } from 'sequelize';
import { enrichDealsWithRiskData, enrichDealWithRiskData } from '../utils/riskScoring.js';

export const listDeals = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 100,
      type,
      status,
      minRoi,
      maxRoi,
      search,
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filters
    if (type) where.type = type;
    if (status) where.status = status;
    if (minRoi) where.expected_roi = { [Op.gte]: minRoi };
    if (maxRoi) {
      where.expected_roi = where.expected_roi
        ? { ...where.expected_roi, [Op.lte]: maxRoi }
        : { [Op.lte]: maxRoi };
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Deal.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'spv_name', 'status'],
        },
      ],
    });

    // Convert Sequelize instances to plain objects
    const plainDeals = rows.map(deal => deal.toJSON());

    // Enrich deals with risk scoring and badges
    const enrichedDeals = enrichDealsWithRiskData(plainDeals);

    return paginate(res, enrichedDeals, page, limit, count, 'Deals retrieved successfully');

  } catch (err) {
    next(err);
  }
};

export const getDeal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deal = await Deal.findByPk(id, {
      include: [
        {
          model: SPV,
          as: 'spv',
          include: [
            {
              model: Investment,
              as: 'investments',
              attributes: ['id', 'amount', 'shares_issued', 'invested_at'],
              include: [
                {
                  model: User,
                  as: 'investor',
                  attributes: ['id', 'name', 'avatar'],
                },
              ],
            },
          ],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!deal) {
      return error(res, 'Deal not found', 404);
    }

    // Convert Sequelize instance to plain object
    const plainDeal = deal.toJSON();

    // Enrich deal with risk scoring and badges
    const enrichedDeal = enrichDealWithRiskData(plainDeal);

    return success(res, { deal: enrichedDeal }, 'Deal retrieved successfully');

  } catch (err) {
    next(err);
  }
};

export const createDeal = async (req, res, next) => {
  try {
    const {
      title,
      type,
      jurisdiction,
      location,
      description,
      target_amount,
      min_ticket,
      max_ticket,
      holding_period_months,
      expected_roi,
      expected_irr,
      fees,
      images,
      documents,
      metadata,
    } = req.body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') +
      '-' + Date.now();

    const deal = await Deal.create({
      title,
      slug,
      type,
      jurisdiction,
      location,
      description,
      target_amount,
      min_ticket,
      max_ticket,
      holding_period_months,
      expected_roi,
      expected_irr,
      fees,
      images,
      documents,
      metadata,
      created_by: req.user.id,
      status: 'draft',
    });

    return success(res, { deal }, 'Deal created successfully', 201);

  } catch (err) {
    next(err);
  }
};

export const updateDeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const deal = await Deal.findByPk(id);
    if (!deal) {
      return error(res, 'Deal not found', 404);
    }

    // Only creator or admin can update
    if (deal.created_by !== req.user.id && req.user.role !== 'admin') {
      return error(res, 'Not authorized to update this deal', 403);
    }

    await deal.update(updates);

    return success(res, { deal }, 'Deal updated successfully');

  } catch (err) {
    next(err);
  }
};

export const publishDeal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deal = await Deal.findByPk(id);
    if (!deal) {
      return error(res, 'Deal not found', 404);
    }

    // Update status to open
    await deal.update({
      status: 'open',
      open_date: new Date(),
    });

    return success(res, { deal }, 'Deal published successfully');

  } catch (err) {
    next(err);
  }
};

export const closeDeal = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deal = await Deal.findByPk(id, { include: ['spv'] });
    if (!deal) {
      return error(res, 'Deal not found', 404);
    }

    const spv = deal.spv;

    // Check if funding target met
    const fundingPercentage = (deal.raised_amount / deal.target_amount) * 100;

    if (fundingPercentage >= 100) {
      // Deal successful - close and activate SPV
      await deal.update({
        status: 'funded',
        close_date: new Date(),
      });

      if (spv) {
        await spv.update({
          status: 'operating',
          operating_balance: spv.escrow_balance,
          escrow_balance: 0,
        });
      }

      return success(res, { deal }, 'Deal closed successfully - Target reached');
    } else {
      // Deal failed - refund investors
      await deal.update({
        status: 'failed',
        close_date: new Date(),
      });

      return success(res, { deal }, 'Deal closed - Target not reached, investors will be refunded');
    }

  } catch (err) {
    next(err);
  }
};
