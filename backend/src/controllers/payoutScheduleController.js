import sequelize from '../config/database.js';
import { PayoutSchedule, SPV, Payout, Investment } from '../models/index.js';
import { successResponse, errorResponse } from "../utils/response.js";
import { generatePayout } from './payoutController.js';

/**
 * Get all payout schedules
 */
export const getSchedules = async (req, res, next) => {
  try {
    const { spvId, status, frequency } = req.query;

    const where = {};
    if (spvId) where.spv_id = spvId;
    if (status) where.status = status;
    if (frequency) where.frequency = frequency;

    const schedules = await PayoutSchedule.findAll({
      where,
      include: [
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'name', 'entity_name', 'status'],
        },
      ],
      order: [['next_payout_date', 'ASC']],
    });

    successResponse(res, { schedules, count: schedules.length });
  } catch (error) {
    next(error);
  }
};

/**
 * Get schedule details
 */
export const getScheduleDetails = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;

    const schedule = await PayoutSchedule.findByPk(scheduleId, {
      include: [
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'name', 'entity_name', 'status', 'operating_balance'],
        },
      ],
    });

    if (!schedule) {
      return errorResponse(res, 'Payout schedule not found', 404);
    }

    // Get history of payouts generated from this schedule
    const generatedPayouts = await Payout.findAll({
      where: {
        spv_id: schedule.spv_id,
        metadata: sequelize.where(
          sequelize.cast(sequelize.col('metadata'), 'text'),
          {
            [sequelize.Op.like]: `%"schedule_id":"${scheduleId}"%`,
          }
        ),
      },
      order: [['created_at', 'DESC']],
      limit: 10,
    });

    successResponse(res, {
      schedule,
      payoutHistory: generatedPayouts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new payout schedule
 */
export const createSchedule = async (req, res, next) => {
  try {
    const {
      spvId,
      scheduleName,
      frequency,
      amountPerPeriod,
      percentageOfRevenue,
      startDate,
      endDate,
      autoDistribute,
    } = req.body;

    // Validate SPV exists
    const spv = await SPV.findByPk(spvId);
    if (!spv) {
      return errorResponse(res, 'SPV not found', 404);
    }

    // Calculate next payout date based on frequency and start date
    const nextPayoutDate = new Date(startDate);

    const schedule = await PayoutSchedule.create({
      spv_id: spvId,
      schedule_name: scheduleName,
      frequency,
      amount_per_period: amountPerPeriod || 0,
      percentage_of_revenue: percentageOfRevenue || null,
      start_date: startDate,
      end_date: endDate || null,
      next_payout_date: nextPayoutDate,
      status: 'active',
      auto_distribute: autoDistribute || false,
      metadata: {
        created_by: req.user.id,
      },
    });

    const fullSchedule = await PayoutSchedule.findByPk(schedule.id, {
      include: [
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'name', 'entity_name', 'status'],
        },
      ],
    });

    successResponse(res, { schedule: fullSchedule }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update a payout schedule
 */
export const updateSchedule = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const updates = req.body;

    const schedule = await PayoutSchedule.findByPk(scheduleId);
    if (!schedule) {
      return errorResponse(res, 'Payout schedule not found', 404);
    }

    await schedule.update(updates);

    const updatedSchedule = await PayoutSchedule.findByPk(scheduleId, {
      include: [
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'name', 'entity_name', 'status'],
        },
      ],
    });

    successResponse(res, { schedule: updatedSchedule });
  } catch (error) {
    next(error);
  }
};

/**
 * Pause/Resume a schedule
 */
export const toggleScheduleStatus = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const { action } = req.body; // 'pause' or 'resume'

    const schedule = await PayoutSchedule.findByPk(scheduleId);
    if (!schedule) {
      return errorResponse(res, 'Payout schedule not found', 404);
    }

    if (action === 'pause') {
      await schedule.update({ status: 'paused' });
    } else if (action === 'resume') {
      await schedule.update({ status: 'active' });
    } else {
      return errorResponse(res, 'Invalid action. Must be "pause" or "resume"', 400);
    }

    successResponse(res, { schedule });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a schedule
 */
export const deleteSchedule = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;

    const schedule = await PayoutSchedule.findByPk(scheduleId);
    if (!schedule) {
      return errorResponse(res, 'Payout schedule not found', 404);
    }

    await schedule.update({ status: 'cancelled' });

    successResponse(res, { message: 'Payout schedule cancelled' });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate next payout date based on frequency
 */
function calculateNextPayoutDate(currentDate, frequency) {
  const nextDate = new Date(currentDate);

  switch (frequency) {
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'semi_annual':
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case 'annual':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    case 'one_time':
      return null; // No next payout for one-time schedules
    default:
      return null;
  }

  return nextDate;
}

/**
 * Process due payout schedules (called by cron job)
 */
export const processDuePayouts = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const now = new Date();

    // Find all active schedules with next_payout_date <= now
    const dueSchedules = await PayoutSchedule.findAll({
      where: {
        status: 'active',
        next_payout_date: {
          [sequelize.Op.lte]: now,
        },
      },
      include: [
        {
          model: SPV,
          as: 'spv',
        },
      ],
    });

    const results = [];

    for (const schedule of dueSchedules) {
      try {
        // Determine payout amount
        let payoutAmount = parseFloat(schedule.amount_per_period);

        if (schedule.percentage_of_revenue) {
          // Calculate from SPV revenue (if metadata tracks revenue)
          const spv = schedule.spv;
          const totalRevenue = parseFloat(spv.metadata?.total_revenue || 0);
          payoutAmount = (totalRevenue * parseFloat(schedule.percentage_of_revenue)) / 100;
        }

        // Check if SPV has enough balance
        if (parseFloat(schedule.spv.operating_balance) < payoutAmount) {
          results.push({
            scheduleId: schedule.id,
            status: 'skipped',
            reason: 'Insufficient SPV balance',
          });
          continue;
        }

        // Generate payout (reusing existing generatePayout logic)
        const payout = await Payout.create(
          {
            spv_id: schedule.spv_id,
            total_amount: payoutAmount,
            payout_date: now,
            type: 'distribution',
            status: 'pending',
            metadata: {
              schedule_id: schedule.id,
              schedule_name: schedule.schedule_name,
              auto_generated: true,
            },
          },
          { transaction: t }
        );

        // If auto_distribute is true, distribute immediately
        if (schedule.auto_distribute) {
          // Get all investments for this SPV
          const investments = await Investment.findAll({
            where: { spv_id: schedule.spv_id, status: 'active' },
          });

          const totalShares = investments.reduce(
            (sum, inv) => sum + parseInt(inv.shares_issued),
            0
          );

          // Distribute to each investor
          for (const investment of investments) {
            const ownershipPercentage = parseInt(investment.shares_issued) / totalShares;
            const investorPayout = payoutAmount * ownershipPercentage;

            await investment.update(
              {
                total_payouts_received:
                  parseFloat(investment.total_payouts_received || 0) + investorPayout,
              },
              { transaction: t }
            );
          }

          // Update SPV balance
          await schedule.spv.update(
            {
              operating_balance:
                parseFloat(schedule.spv.operating_balance) - payoutAmount,
            },
            { transaction: t }
          );

          await payout.update(
            {
              status: 'completed',
              distributed_at: now,
            },
            { transaction: t }
          );
        }

        // Update schedule
        const nextPayoutDate = calculateNextPayoutDate(
          schedule.next_payout_date,
          schedule.frequency
        );

        const updateData = {
          last_payout_date: now,
          metadata: {
            ...schedule.metadata,
            last_payout_id: payout.id,
            last_payout_amount: payoutAmount,
          },
        };

        if (nextPayoutDate) {
          updateData.next_payout_date = nextPayoutDate;
        } else {
          // One-time schedule - mark as completed
          updateData.status = 'completed';
        }

        // Check if end_date has passed
        if (schedule.end_date && new Date(schedule.end_date) <= now) {
          updateData.status = 'completed';
        }

        await schedule.update(updateData, { transaction: t });

        results.push({
          scheduleId: schedule.id,
          status: 'processed',
          payoutId: payout.id,
          amount: payoutAmount,
          autoDistributed: schedule.auto_distribute,
        });
      } catch (error) {
        results.push({
          scheduleId: schedule.id,
          status: 'error',
          error: error.message,
        });
      }
    }

    await t.commit();

    successResponse(res, {
      message: `Processed ${dueSchedules.length} due payout schedules`,
      results,
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * Get upcoming payouts for all schedules
 */
export const getUpcomingPayouts = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));

    const schedules = await PayoutSchedule.findAll({
      where: {
        status: 'active',
        next_payout_date: {
          [sequelize.Op.lte]: endDate,
        },
      },
      include: [
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'name', 'entity_name', 'operating_balance'],
        },
      ],
      order: [['next_payout_date', 'ASC']],
    });

    const upcoming = schedules.map((schedule) => ({
      schedule_id: schedule.id,
      schedule_name: schedule.schedule_name,
      spv: schedule.spv,
      next_payout_date: schedule.next_payout_date,
      amount: schedule.amount_per_period,
      frequency: schedule.frequency,
      auto_distribute: schedule.auto_distribute,
      days_until_payout: Math.ceil(
        (new Date(schedule.next_payout_date) - new Date()) / (1000 * 60 * 60 * 24)
      ),
    }));

    successResponse(res, { upcoming, count: upcoming.length });
  } catch (error) {
    next(error);
  }
};
