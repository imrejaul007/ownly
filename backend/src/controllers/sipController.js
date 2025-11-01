import { SIPPlan, SIPSubscription, Bundle, User, PaymentMethod, Investment } from '../models/index.js';
import { success, error, paginate } from '../utils/response.js';
import { Op } from 'sequelize';

// List all SIP plans
export const listSIPPlans = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      plan_type,
      risk_level,
      status,
      search,
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filters
    if (plan_type) where.plan_type = plan_type;
    if (risk_level) where.risk_level = risk_level;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await SIPPlan.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Bundle,
          as: 'bundle',
          attributes: ['id', 'name', 'category'],
        },
      ],
    });

    return paginate(res, rows, page, limit, count, 'SIP Plans retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// Get single SIP plan
export const getSIPPlan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const plan = await SIPPlan.findByPk(id, {
      include: [
        {
          model: Bundle,
          as: 'bundle',
        },
        {
          model: SIPSubscription,
          as: 'subscriptions',
          attributes: ['id', 'user_id', 'status', 'total_invested', 'current_value'],
        },
      ],
    });

    if (!plan) {
      return error(res, 'SIP Plan not found', 404);
    }

    return success(res, plan, 'SIP Plan retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// Create new SIP plan
export const createSIPPlan = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      description,
      plan_type,
      monthly_amount_min,
      monthly_amount_max,
      duration_months_min,
      duration_months_max,
      expected_roi_min,
      expected_roi_max,
      bundle_id,
      auto_rebalance,
      auto_compound,
      risk_level,
      features,
      allocation_strategy,
      images,
    } = req.body;

    const plan = await SIPPlan.create({
      name,
      slug,
      description,
      plan_type,
      monthly_amount_min,
      monthly_amount_max,
      duration_months_min,
      duration_months_max,
      expected_roi_min,
      expected_roi_max,
      bundle_id,
      auto_rebalance,
      auto_compound,
      risk_level,
      features,
      allocation_strategy,
      images,
      status: 'active',
    });

    return success(res, plan, 'SIP Plan created successfully', 201);
  } catch (err) {
    next(err);
  }
};

// Update SIP plan
export const updateSIPPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const plan = await SIPPlan.findByPk(id);
    if (!plan) {
      return error(res, 'SIP Plan not found', 404);
    }

    await plan.update(updates);

    return success(res, plan, 'SIP Plan updated successfully');
  } catch (err) {
    next(err);
  }
};

// Subscribe to SIP plan
export const subscribeToPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      monthly_amount,
      duration_months,
      start_date,
      payment_method_id,
      auto_compound,
    } = req.body;
    const userId = req.user.id;

    const plan = await SIPPlan.findByPk(id);
    if (!plan) {
      return error(res, 'SIP Plan not found', 404);
    }

    if (plan.status !== 'active') {
      return error(res, 'SIP Plan is not active', 400);
    }

    // Validate monthly amount
    if (monthly_amount < plan.monthly_amount_min) {
      return error(res, `Minimum monthly amount is ${plan.monthly_amount_min}`, 400);
    }

    if (plan.monthly_amount_max && monthly_amount > plan.monthly_amount_max) {
      return error(res, `Maximum monthly amount is ${plan.monthly_amount_max}`, 400);
    }

    // Validate duration
    if (duration_months < plan.duration_months_min) {
      return error(res, `Minimum duration is ${plan.duration_months_min} months`, 400);
    }

    if (plan.duration_months_max && duration_months > plan.duration_months_max) {
      return error(res, `Maximum duration is ${plan.duration_months_max} months`, 400);
    }

    // Calculate dates
    const subscriptionStartDate = new Date(start_date || Date.now());
    const endDate = new Date(subscriptionStartDate);
    endDate.setMonth(endDate.getMonth() + duration_months);

    const nextDebitDate = new Date(subscriptionStartDate);
    nextDebitDate.setMonth(nextDebitDate.getMonth() + 1);

    // Create subscription
    const subscription = await SIPSubscription.create({
      user_id: userId,
      plan_id: plan.id,
      monthly_amount,
      duration_months,
      start_date: subscriptionStartDate,
      end_date: endDate,
      next_debit_date: nextDebitDate,
      payment_method_id,
      auto_compound: auto_compound !== undefined ? auto_compound : plan.auto_compound,
      status: 'active',
    });

    return success(res, subscription, 'SIP subscription created successfully', 201);
  } catch (err) {
    next(err);
  }
};

// Get user's SIP subscriptions
export const getMySubscriptions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const where = { user_id: userId };
    if (status) where.status = status;

    const subscriptions = await SIPSubscription.findAll({
      where,
      include: [
        {
          model: SIPPlan,
          as: 'plan',
          include: [
            {
              model: Bundle,
              as: 'bundle',
            },
          ],
        },
        {
          model: PaymentMethod,
          as: 'paymentMethod',
        },
        {
          model: Investment,
          as: 'investments',
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return success(res, subscriptions, 'SIP subscriptions retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// Get single subscription
export const getSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const subscription = await SIPSubscription.findOne({
      where: { id, user_id: userId },
      include: [
        {
          model: SIPPlan,
          as: 'plan',
          include: [
            {
              model: Bundle,
              as: 'bundle',
            },
          ],
        },
        {
          model: PaymentMethod,
          as: 'paymentMethod',
        },
        {
          model: Investment,
          as: 'investments',
        },
      ],
    });

    if (!subscription) {
      return error(res, 'SIP subscription not found', 404);
    }

    return success(res, subscription, 'SIP subscription retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// Pause subscription
export const pauseSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const subscription = await SIPSubscription.findOne({
      where: { id, user_id: userId },
    });

    if (!subscription) {
      return error(res, 'SIP subscription not found', 404);
    }

    if (subscription.status !== 'active') {
      return error(res, 'Only active subscriptions can be paused', 400);
    }

    await subscription.update({
      status: 'paused',
      paused_at: new Date(),
    });

    return success(res, subscription, 'SIP subscription paused successfully');
  } catch (err) {
    next(err);
  }
};

// Resume subscription
export const resumeSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const subscription = await SIPSubscription.findOne({
      where: { id, user_id: userId },
    });

    if (!subscription) {
      return error(res, 'SIP subscription not found', 404);
    }

    if (subscription.status !== 'paused') {
      return error(res, 'Only paused subscriptions can be resumed', 400);
    }

    await subscription.update({
      status: 'active',
      paused_at: null,
    });

    return success(res, subscription, 'SIP subscription resumed successfully');
  } catch (err) {
    next(err);
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const subscription = await SIPSubscription.findOne({
      where: { id, user_id: userId },
    });

    if (!subscription) {
      return error(res, 'SIP subscription not found', 404);
    }

    if (subscription.status === 'cancelled') {
      return error(res, 'Subscription is already cancelled', 400);
    }

    await subscription.update({
      status: 'cancelled',
      cancelled_at: new Date(),
      cancellation_reason: reason,
    });

    return success(res, subscription, 'SIP subscription cancelled successfully');
  } catch (err) {
    next(err);
  }
};

// Get SIP Dashboard Summary
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all user subscriptions
    const subscriptions = await SIPSubscription.findAll({
      where: { user_id: userId },
      include: [
        {
          model: SIPPlan,
          as: 'plan',
          include: [
            {
              model: Bundle,
              as: 'bundle',
            },
          ],
        },
      ],
    });

    // Calculate dashboard metrics
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
    const totalMonthlyCommitment = subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((sum, sub) => sum + parseFloat(sub.monthly_amount || 0), 0);

    const totalInvested = subscriptions.reduce((sum, sub) => sum + parseFloat(sub.total_invested || 0), 0);

    // Calculate estimated returns (simplified - using average 30% annual return on invested amount)
    // In production, this should be calculated from actual investment performance
    const totalReturns = totalInvested * 0.30;

    const dashboard = {
      active_subscriptions: activeSubscriptions,
      total_monthly_commitment: parseFloat(totalMonthlyCommitment.toFixed(2)),
      total_invested: parseFloat(totalInvested.toFixed(2)),
      total_returns: parseFloat(totalReturns.toFixed(2)),
      subscriptions_summary: {
        active: subscriptions.filter(sub => sub.status === 'active').length,
        paused: subscriptions.filter(sub => sub.status === 'paused').length,
        cancelled: subscriptions.filter(sub => sub.status === 'cancelled').length,
        total: subscriptions.length,
      },
    };

    return success(res, dashboard, 'SIP dashboard retrieved successfully');
  } catch (err) {
    next(err);
  }
};
