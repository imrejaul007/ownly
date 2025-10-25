import sequelize from '../config/database.js';
import { Agent, User, Deal, Investment } from '../models/index.js';
import { successResponse, errorResponse } from "../utils/response.js";
import { Op } from 'sequelize';

/**
 * Get agent dashboard with detailed metrics
 */
export const getAgentDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get agent profile
    const agent = await Agent.findOne({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email'],
        },
      ],
    });

    if (!agent) {
      return errorResponse(res, 'Agent profile not found', 404);
    }

    // Get all referred users
    const referredUsers = await User.findAll({
      where: { referred_by: agent.referral_code },
      attributes: ['id', 'full_name', 'email', 'kyc_status', 'created_at'],
    });

    // Get all investments made by referred users
    const referredUserIds = referredUsers.map((u) => u.id);
    const referredInvestments = await Investment.findAll({
      where: {
        user_id: { [Op.in]: referredUserIds },
      },
      include: [
        {
          model: User,
          as: 'investor',
          attributes: ['id', 'full_name', 'email'],
        },
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title', 'type'],
        },
      ],
    });

    // Calculate metrics
    const totalReferrals = referredUsers.length;
    const totalInvestmentVolume = referredInvestments.reduce(
      (sum, inv) => sum + parseFloat(inv.amount),
      0
    );
    const totalCommissionEarned = parseFloat(agent.commission_earned || 0);
    const totalCommissionPaid = parseFloat(agent.commission_paid || 0);
    const pendingCommission = totalCommissionEarned - totalCommissionPaid;

    // Active referrals (users who have made at least one investment)
    const activeReferralIds = [...new Set(referredInvestments.map((inv) => inv.user_id))];
    const activeReferrals = activeReferralIds.length;

    // Conversion rate
    const conversionRate = totalReferrals > 0 ? (activeReferrals / totalReferrals) * 100 : 0;

    // Monthly performance (last 12 months)
    const monthlyPerformance = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthInvestments = referredInvestments.filter((inv) => {
        const investedAt = new Date(inv.invested_at);
        return investedAt >= monthStart && investedAt <= monthEnd;
      });

      const monthVolume = monthInvestments.reduce(
        (sum, inv) => sum + parseFloat(inv.amount),
        0
      );

      const monthReferrals = referredUsers.filter((user) => {
        const createdAt = new Date(user.created_at);
        return createdAt >= monthStart && createdAt <= monthEnd;
      });

      monthlyPerformance.push({
        month: monthStart.toISOString().slice(0, 7), // YYYY-MM format
        referrals: monthReferrals.length,
        investments: monthInvestments.length,
        volume: monthVolume,
      });
    }

    // Top referred investors (by investment volume)
    const investorVolumes = {};
    referredInvestments.forEach((inv) => {
      if (!investorVolumes[inv.user_id]) {
        investorVolumes[inv.user_id] = {
          user: inv.investor,
          totalInvested: 0,
          investmentCount: 0,
        };
      }
      investorVolumes[inv.user_id].totalInvested += parseFloat(inv.amount);
      investorVolumes[inv.user_id].investmentCount += 1;
    });

    const topInvestors = Object.values(investorVolumes)
      .sort((a, b) => b.totalInvested - a.totalInvested)
      .slice(0, 10);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentReferrals = referredUsers.filter(
      (user) => new Date(user.created_at) >= thirtyDaysAgo
    );

    const recentInvestments = referredInvestments.filter(
      (inv) => new Date(inv.invested_at) >= thirtyDaysAgo
    );

    // Performance by deal type
    const dealTypePerformance = {};
    referredInvestments.forEach((inv) => {
      const dealType = inv.deal?.type || 'unknown';
      if (!dealTypePerformance[dealType]) {
        dealTypePerformance[dealType] = {
          count: 0,
          volume: 0,
        };
      }
      dealTypePerformance[dealType].count += 1;
      dealTypePerformance[dealType].volume += parseFloat(inv.amount);
    });

    successResponse(res, {
      agent: {
        id: agent.id,
        user: agent.user,
        referral_code: agent.referral_code,
        status: agent.status,
        commission_earned: totalCommissionEarned,
        commission_paid: totalCommissionPaid,
        pending_commission: pendingCommission,
      },
      metrics: {
        totalReferrals,
        activeReferrals,
        conversionRate: conversionRate.toFixed(2),
        totalInvestmentVolume,
        totalCommissionEarned,
        pendingCommission,
      },
      monthlyPerformance,
      topInvestors,
      dealTypePerformance: Object.entries(dealTypePerformance).map(([type, data]) => ({
        dealType: type,
        count: data.count,
        volume: data.volume,
      })),
      recentActivity: {
        referrals: recentReferrals.length,
        investments: recentInvestments.length,
        volume: recentInvestments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0),
      },
      allReferrals: referredUsers,
      allInvestments: referredInvestments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get agent leaderboard (all agents ranked by performance)
 */
export const getAgentLeaderboard = async (req, res, next) => {
  try {
    const { sortBy = 'referrals', limit = 50 } = req.query;

    // Get all active agents
    const agents = await Agent.findAll({
      where: { status: 'active' },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email'],
        },
      ],
    });

    // Calculate metrics for each agent
    const agentMetrics = await Promise.all(
      agents.map(async (agent) => {
        const referredUsers = await User.findAll({
          where: { referred_by: agent.referral_code },
        });

        const referredUserIds = referredUsers.map((u) => u.id);
        const referredInvestments = await Investment.findAll({
          where: {
            user_id: { [Op.in]: referredUserIds },
          },
        });

        const totalVolume = referredInvestments.reduce(
          (sum, inv) => sum + parseFloat(inv.amount),
          0
        );

        return {
          agent: {
            id: agent.id,
            user: agent.user,
            referral_code: agent.referral_code,
          },
          referrals: referredUsers.length,
          investmentCount: referredInvestments.length,
          totalVolume,
          commissionEarned: parseFloat(agent.commission_earned || 0),
        };
      })
    );

    // Sort by selected metric
    let sorted = [...agentMetrics];
    switch (sortBy) {
      case 'volume':
        sorted.sort((a, b) => b.totalVolume - a.totalVolume);
        break;
      case 'commission':
        sorted.sort((a, b) => b.commissionEarned - a.commissionEarned);
        break;
      case 'investments':
        sorted.sort((a, b) => b.investmentCount - a.investmentCount);
        break;
      case 'referrals':
      default:
        sorted.sort((a, b) => b.referrals - a.referrals);
        break;
    }

    // Add rank
    const leaderboard = sorted.slice(0, parseInt(limit)).map((item, index) => ({
      rank: index + 1,
      ...item,
    }));

    successResponse(res, {
      leaderboard,
      sortBy,
      count: leaderboard.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get referral details for an agent
 */
export const getReferralDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { referralId } = req.params;

    // Verify the referral belongs to this agent
    const agent = await Agent.findOne({ where: { user_id: userId } });
    if (!agent) {
      return errorResponse(res, 'Agent profile not found', 404);
    }

    const referredUser = await User.findOne({
      where: {
        id: referralId,
        referred_by: agent.referral_code,
      },
      attributes: ['id', 'full_name', 'email', 'kyc_status', 'created_at'],
    });

    if (!referredUser) {
      return errorResponse(res, 'Referral not found', 404);
    }

    // Get all investments by this referral
    const investments = await Investment.findAll({
      where: { user_id: referralId },
      include: [
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title', 'type', 'status'],
        },
      ],
      order: [['invested_at', 'DESC']],
    });

    const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);

    successResponse(res, {
      referral: referredUser,
      investments,
      totalInvested,
      investmentCount: investments.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get agent commission history
 */
export const getCommissionHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const agent = await Agent.findOne({ where: { user_id: userId } });
    if (!agent) {
      return errorResponse(res, 'Agent profile not found', 404);
    }

    // In a real system, this would come from a commission_transactions table
    // For sandbox, we'll simulate commission history from metadata
    const commissionHistory = agent.metadata?.commission_history || [];

    const summary = {
      totalEarned: parseFloat(agent.commission_earned || 0),
      totalPaid: parseFloat(agent.commission_paid || 0),
      pending: parseFloat(agent.commission_earned || 0) - parseFloat(agent.commission_paid || 0),
    };

    successResponse(res, {
      summary,
      history: commissionHistory,
    });
  } catch (error) {
    next(error);
  }
};
