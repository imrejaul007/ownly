import { Deal, SPV, Asset } from '../models/index.js';
import { success, error } from '../utils/response.js';
import { calculateLockInEndDate } from '../utils/lockInValidator.js';
import sequelize from '../config/database.js';

/**
 * Transition deal from 'funded' to 'lock-in' phase
 * POST /api/admin/deals/:id/transition-to-lock-in
 */
export const transitionToLockIn = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    const deal = await Deal.findByPk(id, {
      include: [{ model: SPV, as: 'spv' }],
      transaction: t,
    });

    if (!deal) {
      await t.rollback();
      return error(res, 'Deal not found', 404);
    }

    // Validate current status
    if (deal.status !== 'funded') {
      await t.rollback();
      return error(
        res,
        `Deal must be in 'funded' status to transition to lock-in. Current status: ${deal.status}`,
        400
      );
    }

    // Validate lock-in period is set
    if (!deal.lock_in_period_months) {
      await t.rollback();
      return error(
        res,
        'Deal does not have a lock-in period defined. Cannot transition to lock-in phase.',
        400
      );
    }

    // Calculate lock-in dates
    const lockInStartDate = new Date();
    const lockInEndDate = calculateLockInEndDate(
      lockInStartDate,
      deal.lock_in_period_months
    );

    // Update deal status
    await deal.update(
      {
        status: 'lock-in',
        lock_in_start_date: lockInStartDate,
        lock_in_end_date: lockInEndDate,
      },
      { transaction: t }
    );

    // Update SPV status if exists
    if (deal.spv) {
      await deal.spv.update(
        {
          status: 'operating',
        },
        { transaction: t }
      );
    }

    await t.commit();

    return success(
      res,
      {
        deal,
        lockInInfo: {
          startDate: lockInStartDate,
          endDate: lockInEndDate,
          durationMonths: deal.lock_in_period_months,
        },
      },
      'Deal successfully transitioned to lock-in phase'
    );
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

/**
 * Transition deal from 'lock-in' to 'operational' phase
 * POST /api/admin/deals/:id/transition-to-operational
 */
export const transitionToOperational = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    const deal = await Deal.findByPk(id, {
      include: [{ model: SPV, as: 'spv' }],
      transaction: t,
    });

    if (!deal) {
      await t.rollback();
      return error(res, 'Deal not found', 404);
    }

    // Validate current status
    if (deal.status !== 'lock-in') {
      await t.rollback();
      return error(
        res,
        `Deal must be in 'lock-in' status to transition to operational. Current status: ${deal.status}`,
        400
      );
    }

    // Check if lock-in period has ended
    const now = new Date();
    const lockInEnd = new Date(deal.lock_in_end_date);

    if (now < lockInEnd) {
      await t.rollback();
      const daysRemaining = Math.ceil((lockInEnd - now) / (1000 * 60 * 60 * 24));
      return error(
        res,
        `Lock-in period has not ended yet. ${daysRemaining} days remaining until ${lockInEnd.toLocaleDateString()}`,
        400
      );
    }

    // Update deal status
    await deal.update(
      {
        status: 'operational',
      },
      { transaction: t }
    );

    await t.commit();

    return success(
      res,
      { deal },
      'Deal successfully transitioned to operational phase. Trading is now enabled.'
    );
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

/**
 * Manually update lock-in dates for a deal
 * PUT /api/admin/deals/:id/lock-in-dates
 */
export const updateLockInDates = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lockInStartDate, lockInEndDate, lockInPeriodMonths } = req.body;

    const deal = await Deal.findByPk(id);

    if (!deal) {
      return error(res, 'Deal not found', 404);
    }

    const updates = {};

    if (lockInStartDate) {
      updates.lock_in_start_date = new Date(lockInStartDate);

      // Auto-calculate end date if period is provided
      if (lockInPeriodMonths) {
        updates.lock_in_end_date = calculateLockInEndDate(
          updates.lock_in_start_date,
          lockInPeriodMonths
        );
        updates.lock_in_period_months = lockInPeriodMonths;
      }
    }

    if (lockInEndDate) {
      updates.lock_in_end_date = new Date(lockInEndDate);
    }

    await deal.update(updates);

    return success(res, { deal }, 'Lock-in dates updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Deploy asset for a deal (create Asset record)
 * POST /api/admin/deals/:id/deploy-asset
 */
export const deployAsset = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const {
      assetType,
      name,
      address,
      city,
      country,
      images,
      metadata,
      acquisitionCost,
      currentValuation,
    } = req.body;

    const deal = await Deal.findByPk(id, {
      include: [{ model: SPV, as: 'spv' }],
      transaction: t,
    });

    if (!deal) {
      await t.rollback();
      return error(res, 'Deal not found', 404);
    }

    if (!deal.spv) {
      await t.rollback();
      return error(res, 'Deal does not have an SPV. Create SPV first.', 400);
    }

    // Create asset record
    const asset = await Asset.create(
      {
        spv_id: deal.spv.id,
        asset_type: assetType || 'property',
        name,
        address,
        city,
        country,
        images: images || [],
        metadata: metadata || {},
        operation_status: 'operational',
        acquisition_cost: acquisitionCost || deal.target_amount,
        current_valuation: currentValuation || deal.target_amount,
        occupancy_rate: 0,
        monthly_revenue: 0,
        monthly_expenses: 0,
      },
      { transaction: t }
    );

    await t.commit();

    return success(
      res,
      { asset, deal },
      'Asset deployed successfully for the deal',
      201
    );
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

/**
 * Get all deals in lock-in phase
 * GET /api/admin/deals/lock-in
 */
export const getDealsInLockIn = async (req, res, next) => {
  try {
    const deals = await Deal.findAll({
      where: { status: 'lock-in' },
      include: [
        {
          model: SPV,
          as: 'spv',
          include: ['assets'],
        },
      ],
      order: [['lock_in_end_date', 'ASC']],
    });

    // Enhance with days remaining
    const enrichedDeals = deals.map((deal) => {
      const plainDeal = deal.toJSON();
      const now = new Date();
      const lockInEnd = new Date(deal.lock_in_end_date);
      const daysRemaining = Math.ceil((lockInEnd - now) / (1000 * 60 * 60 * 24));

      return {
        ...plainDeal,
        daysRemainingInLockIn: daysRemaining > 0 ? daysRemaining : 0,
        canTransitionToOperational: daysRemaining <= 0,
      };
    });

    return success(res, { deals: enrichedDeals, count: enrichedDeals.length });
  } catch (err) {
    next(err);
  }
};
