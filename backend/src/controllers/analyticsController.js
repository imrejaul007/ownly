import { Deal, SPV, Investment, User, Wallet, Transaction, Payout, Agent } from '../models/index.js';
import { success, error } from '../utils/response.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

export const getPlatformAnalytics = async (req, res, next) => {
  try {
    // Get date range (default: last 30 days)
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate) {
      dateFilter[Op.gte] = new Date(startDate);
    }
    if (endDate) {
      dateFilter[Op.lte] = new Date(endDate);
    }

    // Total deals
    const totalDeals = await Deal.count();
    const activeDeals = await Deal.count({
      where: { status: { [Op.in]: ['open', 'funding'] } },
    });

    // Total raised
    const totalRaisedResult = await Deal.sum('raised_amount');
    const totalRaised = totalRaisedResult || 0;

    // Total investors
    const totalInvestors = await User.count({
      where: { role: { [Op.in]: ['investor_retail', 'investor_hni', 'investor_institutional'] } },
    });

    // Active investments
    const totalInvestments = await Investment.count();
    const activeInvestments = await Investment.count({
      where: { status: 'active' },
    });

    // Average deal size
    const avgDealSize = totalDeals > 0 ? totalRaised / totalDeals : 0;

    // SPV metrics
    const totalSPVs = await SPV.count();
    const activeSPVs = await SPV.count({
      where: { status: { [Op.in]: ['active', 'operating'] } },
    });

    // Total SPV balance
    const spvBalanceResult = await SPV.sum('operating_balance');
    const totalSPVBalance = spvBalanceResult || 0;

    // Total payouts distributed
    const totalPayoutsResult = await SPV.sum('total_distributed');
    const totalPayoutsDistributed = totalPayoutsResult || 0;

    // Recent deals (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentDeals = await Deal.count({
      where: { created_at: { [Op.gte]: sevenDaysAgo } },
    });

    // Recent investments
    const recentInvestments = await Investment.count({
      where: { invested_at: { [Op.gte]: sevenDaysAgo } },
    });

    // Deal by type breakdown
    const dealsByType = await Deal.findAll({
      attributes: [
        'type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('raised_amount')), 'total_raised'],
      ],
      group: ['type'],
    });

    // Deal by status breakdown
    const dealsByStatus = await Deal.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
    });

    // Top performing deals (by raised amount)
    const topDeals = await Deal.findAll({
      attributes: ['id', 'title', 'type', 'raised_amount', 'target_amount', 'investor_count'],
      order: [['raised_amount', 'DESC']],
      limit: 10,
    });

    // Recent transactions
    const recentTransactions = await Transaction.findAll({
      where: { created_at: { [Op.gte]: sevenDaysAgo } },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: 20,
    });

    // Monthly investment trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await Investment.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('invested_at')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount'],
      ],
      where: { invested_at: { [Op.gte]: sixMonthsAgo } },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('invested_at'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('invested_at')), 'ASC']],
    });

    // Agent performance
    const topAgents = await Agent.findAll({
      attributes: ['id', 'code', 'referral_count', 'total_investment_referred', 'commissions_earned'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['total_investment_referred', 'DESC']],
      limit: 10,
    });

    // Funding success rate
    const fundedDeals = await Deal.count({ where: { status: 'funded' } });
    const closedOrFailed = await Deal.count({
      where: { status: { [Op.in]: ['funded', 'failed', 'closed'] } },
    });
    const fundingSuccessRate = closedOrFailed > 0 ? (fundedDeals / closedOrFailed) * 100 : 0;

    // Average investment size
    const avgInvestmentResult = await Investment.findOne({
      attributes: [[sequelize.fn('AVG', sequelize.col('amount')), 'avg_amount']],
    });
    const avgInvestmentSize = avgInvestmentResult?.dataValues?.avg_amount || 0;

    return success(res, {
      overview: {
        totalDeals,
        activeDeals,
        totalRaised: parseFloat(totalRaised),
        totalInvestors,
        totalInvestments,
        activeInvestments,
        avgDealSize: parseFloat(avgDealSize),
        totalSPVs,
        activeSPVs,
        totalSPVBalance: parseFloat(totalSPVBalance),
        totalPayoutsDistributed: parseFloat(totalPayoutsDistributed),
        fundingSuccessRate: parseFloat(fundingSuccessRate.toFixed(2)),
        avgInvestmentSize: parseFloat(avgInvestmentSize),
      },
      recentActivity: {
        recentDeals,
        recentInvestments,
        recentTransactions: recentTransactions.length,
      },
      breakdown: {
        dealsByType: dealsByType.map((d) => ({
          type: d.type,
          count: parseInt(d.dataValues.count),
          totalRaised: parseFloat(d.dataValues.total_raised || 0),
        })),
        dealsByStatus: dealsByStatus.map((d) => ({
          status: d.status,
          count: parseInt(d.dataValues.count),
        })),
      },
      topPerformers: {
        topDeals: topDeals.map((d) => ({
          id: d.id,
          title: d.title,
          type: d.type,
          raisedAmount: parseFloat(d.raised_amount),
          targetAmount: parseFloat(d.target_amount),
          investorCount: d.investor_count,
          fundingPercentage: parseFloat(((d.raised_amount / d.target_amount) * 100).toFixed(2)),
        })),
        topAgents: topAgents.map((a) => ({
          id: a.id,
          code: a.code,
          name: a.user?.name,
          referralCount: a.referral_count,
          totalReferred: parseFloat(a.total_investment_referred),
          commissionsEarned: parseFloat(a.commissions_earned),
        })),
      },
      trends: {
        monthlyInvestments: monthlyTrend.map((m) => ({
          month: m.dataValues.month,
          count: parseInt(m.dataValues.count),
          totalAmount: parseFloat(m.dataValues.total_amount || 0),
        })),
      },
      recentTransactions: recentTransactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: parseFloat(t.amount),
        status: t.status,
        user: t.user?.name,
        createdAt: t.created_at,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const getDealAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deal = await Deal.findByPk(id, {
      include: [
        {
          model: SPV,
          as: 'spv',
          include: ['investments', 'payouts'],
        },
      ],
    });

    if (!deal) {
      return error(res, 'Deal not found', 404);
    }

    const spv = deal.spv;

    // Calculate metrics
    const fundingProgress = (deal.raised_amount / deal.target_amount) * 100;
    const daysActive = spv
      ? Math.floor((new Date() - new Date(spv.inception_date)) / (1000 * 60 * 60 * 24))
      : 0;

    const investmentsByDay = spv?.investments
      ? spv.investments.reduce((acc, inv) => {
          const date = new Date(inv.invested_at).toISOString().split('T')[0];
          if (!acc[date]) acc[date] = { count: 0, amount: 0 };
          acc[date].count++;
          acc[date].amount += parseFloat(inv.amount);
          return acc;
        }, {})
      : {};

    const avgInvestmentSize =
      spv && spv.investments.length > 0
        ? deal.raised_amount / spv.investments.length
        : 0;

    return success(res, {
      deal: {
        id: deal.id,
        title: deal.title,
        type: deal.type,
        status: deal.status,
        targetAmount: parseFloat(deal.target_amount),
        raisedAmount: parseFloat(deal.raised_amount),
        investorCount: deal.investor_count,
        fundingProgress: parseFloat(fundingProgress.toFixed(2)),
      },
      metrics: {
        daysActive,
        avgInvestmentSize: parseFloat(avgInvestmentSize.toFixed(2)),
        minInvestment: spv?.investments.length
          ? Math.min(...spv.investments.map((i) => parseFloat(i.amount)))
          : 0,
        maxInvestment: spv?.investments.length
          ? Math.max(...spv.investments.map((i) => parseFloat(i.amount)))
          : 0,
        totalPayoutsDistributed: spv ? parseFloat(spv.total_distributed) : 0,
      },
      timeline: {
        investmentsByDay: Object.entries(investmentsByDay).map(([date, data]) => ({
          date,
          count: data.count,
          amount: data.amount,
        })),
      },
      investors: spv?.investments.map((inv) => ({
        investmentId: inv.id,
        amount: parseFloat(inv.amount),
        shares: inv.shares_issued,
        investedAt: inv.invested_at,
      })) || [],
    });
  } catch (err) {
    next(err);
  }
};

export const getUserAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Investment,
          as: 'investments',
          include: ['deal', 'spv'],
        },
        {
          model: Wallet,
          as: 'wallet',
        },
        {
          model: Transaction,
          as: 'transactions',
        },
      ],
    });

    if (!user) {
      return error(res, 'User not found', 404);
    }

    // Calculate portfolio metrics
    const totalInvested = user.investments.reduce(
      (sum, inv) => sum + parseFloat(inv.amount),
      0
    );
    const totalCurrentValue = user.investments.reduce(
      (sum, inv) => sum + parseFloat(inv.current_value || inv.amount),
      0
    );
    const totalPayoutsReceived = user.investments.reduce(
      (sum, inv) => sum + parseFloat(inv.total_payouts_received),
      0
    );
    const totalReturn = totalPayoutsReceived + (totalCurrentValue - totalInvested);
    const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    // Investment by type
    const investmentsByType = user.investments.reduce((acc, inv) => {
      const type = inv.deal?.type || 'unknown';
      if (!acc[type]) acc[type] = { count: 0, amount: 0 };
      acc[type].count++;
      acc[type].amount += parseFloat(inv.amount);
      return acc;
    }, {});

    // Recent activity
    const recentTransactions = user.transactions
      .slice(0, 10)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return success(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        kycStatus: user.kyc_status,
        joinedAt: user.created_at,
      },
      portfolio: {
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        totalCurrentValue: parseFloat(totalCurrentValue.toFixed(2)),
        totalPayoutsReceived: parseFloat(totalPayoutsReceived.toFixed(2)),
        totalReturn: parseFloat(totalReturn.toFixed(2)),
        returnPercentage: parseFloat(returnPercentage.toFixed(2)),
        totalInvestments: user.investments.length,
        activeInvestments: user.investments.filter((i) => i.status === 'active').length,
      },
      breakdown: {
        investmentsByType: Object.entries(investmentsByType).map(([type, data]) => ({
          type,
          count: data.count,
          amount: parseFloat(data.amount.toFixed(2)),
        })),
      },
      wallet: {
        balance: user.wallet ? parseFloat(user.wallet.balance_dummy) : 0,
        currency: user.wallet?.currency || 'USD',
      },
      recentActivity: recentTransactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: parseFloat(t.amount),
        status: t.status,
        description: t.description,
        createdAt: t.created_at,
      })),
    });
  } catch (err) {
    next(err);
  }
};
