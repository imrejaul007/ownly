import { Investment, Deal, SPV, Wallet, Transaction, User } from '../models/index.js';
import { success, error } from '../utils/response.js';
import sequelize from '../config/database.js';

export const invest = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { spvId, amount, referralCode } = req.body;
    const userId = req.user.id;

    // Validate amount
    if (!amount || amount <= 0) {
      await t.rollback();
      return error(res, 'Invalid investment amount', 400);
    }

    // Get SPV and Deal
    const spv = await SPV.findByPk(spvId, {
      include: ['deal'],
      transaction: t,
    });

    if (!spv) {
      await t.rollback();
      return error(res, 'SPV not found', 404);
    }

    const deal = spv.deal;

    // Check deal status
    if (!['open', 'funding'].includes(deal.status)) {
      await t.rollback();
      return error(res, 'Deal is not open for investment', 400);
    }

    // Check minimum ticket
    if (amount < deal.min_ticket) {
      await t.rollback();
      return error(res, `Minimum investment is ${deal.min_ticket}`, 400);
    }

    // Check maximum ticket
    if (deal.max_ticket && amount > deal.max_ticket) {
      await t.rollback();
      return error(res, `Maximum investment is ${deal.max_ticket}`, 400);
    }

    // Check if investment would exceed target
    const newTotal = parseFloat(deal.raised_amount) + parseFloat(amount);
    if (newTotal > parseFloat(deal.target_amount)) {
      await t.rollback();
      return error(res, 'Investment would exceed deal target', 400);
    }

    // Check user wallet balance
    const wallet = await Wallet.findOne({
      where: { user_id: userId },
      transaction: t,
    });

    if (!wallet || parseFloat(wallet.balance_dummy) < parseFloat(amount)) {
      await t.rollback();
      return error(res, 'Insufficient wallet balance', 400);
    }

    // Calculate shares
    const sharesIssued = Math.floor(amount / spv.share_price);

    // Create investment
    const investment = await Investment.create({
      user_id: userId,
      spv_id: spv.id,
      deal_id: deal.id,
      amount,
      shares_issued: sharesIssued,
      share_price: spv.share_price,
      status: 'confirmed',
      invested_at: new Date(),
      confirmed_at: new Date(),
      current_value: amount,
      referral_code: referralCode || null,
    }, { transaction: t });

    // Deduct from wallet
    const newBalance = parseFloat(wallet.balance_dummy) - parseFloat(amount);
    await wallet.update({
      balance_dummy: newBalance,
    }, { transaction: t });

    // Create transaction record
    await Transaction.create({
      user_id: userId,
      type: 'investment',
      amount: -amount,
      currency: 'USD',
      status: 'completed',
      reference_type: 'investment',
      reference_id: investment.id,
      description: `Investment in ${deal.title}`,
      balance_before: wallet.balance_dummy,
      balance_after: newBalance,
      completed_at: new Date(),
    }, { transaction: t });

    // Update SPV
    await spv.update({
      issued_shares: parseInt(spv.issued_shares) + sharesIssued,
      escrow_balance: parseFloat(spv.escrow_balance) + parseFloat(amount),
    }, { transaction: t });

    // Update Deal
    const currentInvestorCount = await Investment.count({
      where: { deal_id: deal.id },
      transaction: t,
    });

    await deal.update({
      raised_amount: parseFloat(deal.raised_amount) + parseFloat(amount),
      investor_count: currentInvestorCount,
      status: newTotal >= parseFloat(deal.target_amount) ? 'funded' : 'funding',
    }, { transaction: t });

    await t.commit();

    return success(res, {
      investment,
      wallet: { balance: newBalance },
    }, 'Investment successful', 201);

  } catch (err) {
    await t.rollback();
    next(err);
  }
};

export const getUserInvestments = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.id;

    const investments = await Investment.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Deal,
          as: 'deal',
          attributes: ['id', 'title', 'type', 'images', 'status', 'expected_roi', 'holding_period_months'],
        },
        {
          model: SPV,
          as: 'spv',
          attributes: ['id', 'spv_name', 'status'],
        },
      ],
      order: [['invested_at', 'DESC']],
    });

    // Enhance each investment with detailed earnings calculations
    const enhancedInvestments = investments.map(inv => {
      const amount = parseFloat(inv.amount);
      const currentValue = parseFloat(inv.current_value || inv.amount);
      const totalPayouts = parseFloat(inv.total_payouts_received || 0);
      const expectedRoi = parseFloat(inv.deal?.expected_roi || 0);
      const holdingPeriod = parseInt(inv.deal?.holding_period_months || 36);

      // Calculate months since investment
      const investedDate = new Date(inv.invested_at);
      const now = new Date();
      const monthsSinceInvestment = Math.max(
        0,
        (now.getFullYear() - investedDate.getFullYear()) * 12 +
        (now.getMonth() - investedDate.getMonth())
      );

      // Calculate expected monthly earnings based on deal's expected ROI
      const totalExpectedReturn = (amount * expectedRoi) / 100;
      const monthlyExpectedEarning = totalExpectedReturn / holdingPeriod;

      // Calculate actual earnings
      const unrealizedGain = currentValue - amount;
      const totalEarnings = totalPayouts + unrealizedGain;
      const actualRoi = (totalEarnings / amount) * 100;

      // Calculate average monthly actual earning
      const avgMonthlyEarning = monthsSinceInvestment > 0
        ? totalPayouts / monthsSinceInvestment
        : 0;

      // Exit earnings (if exited)
      const exitEarnings = inv.exited_at ? unrealizedGain : null;

      return {
        ...inv.toJSON(),
        earnings: {
          monthlyExpectedEarning: monthlyExpectedEarning.toFixed(2),
          avgMonthlyActualEarning: avgMonthlyEarning.toFixed(2),
          totalPayoutsReceived: totalPayouts.toFixed(2),
          unrealizedGain: unrealizedGain.toFixed(2),
          totalEarnings: totalEarnings.toFixed(2),
          actualRoi: actualRoi.toFixed(2),
          expectedRoi: expectedRoi.toFixed(2),
          exitEarnings: exitEarnings ? exitEarnings.toFixed(2) : null,
          monthsHeld: monthsSinceInvestment,
        }
      };
    });

    // Calculate portfolio summary
    const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + parseFloat(inv.current_value || inv.amount), 0);
    const totalPayoutsReceived = investments.reduce((sum, inv) => sum + parseFloat(inv.total_payouts_received), 0);

    return success(res, {
      investments: enhancedInvestments,
      summary: {
        totalInvested,
        totalCurrentValue,
        totalPayoutsReceived,
        totalReturn: totalPayoutsReceived + (totalCurrentValue - totalInvested),
        returnPercentage: totalInvested > 0
          ? ((totalPayoutsReceived + (totalCurrentValue - totalInvested)) / totalInvested * 100).toFixed(2)
          : "0.00",
      },
    });

  } catch (err) {
    next(err);
  }
};

export const getInvestmentDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const investment = await Investment.findByPk(id, {
      include: [
        {
          model: Deal,
          as: 'deal',
        },
        {
          model: SPV,
          as: 'spv',
          include: ['assets', 'payouts'],
        },
        {
          model: User,
          as: 'investor',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!investment) {
      return error(res, 'Investment not found', 404);
    }

    // Only investor or admin can view
    if (investment.user_id !== req.user.id && req.user.role !== 'admin') {
      return error(res, 'Not authorized to view this investment', 403);
    }

    return success(res, { investment });

  } catch (err) {
    next(err);
  }
};

export const requestExit = async (req, res, next) => {
  try {
    const { id } = req.params;

    const investment = await Investment.findByPk(id);

    if (!investment) {
      return error(res, 'Investment not found', 404);
    }

    if (investment.user_id !== req.user.id) {
      return error(res, 'Not authorized', 403);
    }

    if (investment.status !== 'active') {
      return error(res, 'Investment is not active', 400);
    }

    // In sandbox, we'll simulate exit request
    // In production, this would create a secondary market listing

    return success(res, {
      investment,
      message: 'Exit request submitted. This is a simulated secondary market request.',
    });

  } catch (err) {
    next(err);
  }
};

export const getUserTransactions = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.id;
    const { type, limit = 50, offset = 0 } = req.query;

    const where = { user_id: userId };
    if (type) {
      where.type = type;
    }

    const transactions = await Transaction.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Group payouts by month
    const payoutsByMonth = {};
    const payoutTransactions = transactions.filter(t => t.type === 'payout');

    payoutTransactions.forEach(txn => {
      const metadata = txn.metadata || {};
      const month = metadata.month || txn.created_at.toISOString().substring(0, 7);

      if (!payoutsByMonth[month]) {
        payoutsByMonth[month] = {
          month,
          totalAmount: 0,
          withdrawn: 0,
          reinvested: 0,
          roiPercent: 0,
          transactions: [],
        };
      }

      payoutsByMonth[month].totalAmount += parseFloat(txn.amount);
      payoutsByMonth[month].withdrawn += parseFloat(metadata.withdrawn || 0);
      payoutsByMonth[month].reinvested += parseFloat(metadata.reinvested || 0);
      payoutsByMonth[month].roiPercent = parseFloat(metadata.roi_percent || 0);
      payoutsByMonth[month].transactions.push({
        id: txn.id,
        amount: txn.amount,
        description: txn.description,
        created_at: txn.created_at,
      });
    });

    // Convert to array and sort by month descending
    const monthlyPayouts = Object.values(payoutsByMonth).sort((a, b) =>
      b.month.localeCompare(a.month)
    );

    return success(res, {
      transactions,
      monthlyPayouts,
      summary: {
        total: transactions.length,
        payouts: payoutTransactions.length,
      },
    });

  } catch (err) {
    next(err);
  }
};

export const updateInvestmentSettings = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { auto_reinvest_enabled } = req.body;

    // Find investment
    const investment = await Investment.findByPk(id);

    if (!investment) {
      return error(res, 'Investment not found', 404);
    }

    // Check authorization - only investor can update their investment
    if (investment.user_id !== req.user.id) {
      return error(res, 'Not authorized to update this investment', 403);
    }

    // Check if investment is active
    if (investment.status !== 'active' && investment.status !== 'confirmed') {
      return error(res, 'Only active investments can have settings updated', 400);
    }

    // Update auto_reinvest_enabled setting
    if (typeof auto_reinvest_enabled !== 'undefined') {
      await investment.update({
        auto_reinvest_enabled: Boolean(auto_reinvest_enabled),
      });
    }

    return success(res, { investment }, 'Investment settings updated successfully');

  } catch (err) {
    next(err);
  }
};
