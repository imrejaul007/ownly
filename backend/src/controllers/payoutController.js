import { Payout, SPV, Investment, Wallet, Transaction, User } from '../models/index.js';
import { success, error } from '../utils/response.js';
import sequelize from '../config/database.js';

export const generatePayout = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { spvId, amount, payoutType, periodStart, periodEnd, notes } = req.body;

    // Validate payout amount
    if (!amount || amount <= 0) {
      await t.rollback();
      return error(res, 'Invalid payout amount', 400);
    }

    // Get SPV with investments
    const spv = await SPV.findByPk(spvId, {
      include: [
        {
          model: Investment,
          as: 'investments',
          where: { status: 'active' },
          include: [
            {
              model: User,
              as: 'investor',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
      transaction: t,
    });

    if (!spv) {
      await t.rollback();
      return error(res, 'SPV not found', 404);
    }

    if (spv.investments.length === 0) {
      await t.rollback();
      return error(res, 'No active investments found', 400);
    }

    // Check if SPV has sufficient balance
    if (parseFloat(spv.operating_balance) < parseFloat(amount)) {
      await t.rollback();
      return error(res, 'Insufficient SPV balance', 400);
    }

    // Calculate total shares
    const totalShares = spv.investments.reduce(
      (sum, inv) => sum + parseInt(inv.shares_issued),
      0
    );

    // Calculate payout per share
    const payoutPerShare = parseFloat(amount) / totalShares;

    // Generate payout items for each investor
    const payoutItems = spv.investments.map((inv) => ({
      investor_id: inv.user_id,
      investor_name: inv.investor.name,
      investment_id: inv.id,
      shares: inv.shares_issued,
      amount: payoutPerShare * inv.shares_issued,
    }));

    // Create payout record
    const payout = await Payout.create(
      {
        spv_id: spvId,
        payout_date: new Date(),
        period_start: periodStart || null,
        period_end: periodEnd || null,
        total_amount: amount,
        payout_type: payoutType || 'dividend',
        payout_items: payoutItems,
        distributed: false,
        notes,
        created_by: req.user.id,
      },
      { transaction: t }
    );

    // Deduct from SPV operating balance
    await spv.update(
      {
        operating_balance: parseFloat(spv.operating_balance) - parseFloat(amount),
        total_distributed: parseFloat(spv.total_distributed) + parseFloat(amount),
      },
      { transaction: t }
    );

    await t.commit();

    return success(res, { payout }, 'Payout generated successfully', 201);
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

export const distributePayout = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    const payout = await Payout.findByPk(id, {
      transaction: t,
    });

    if (!payout) {
      await t.rollback();
      return error(res, 'Payout not found', 404);
    }

    if (payout.distributed) {
      await t.rollback();
      return error(res, 'Payout already distributed', 400);
    }

    // Distribute to each investor
    const distributionResults = [];

    for (const item of payout.payout_items) {
      // Get the original investment to check auto_reinvest setting
      const originalInvestment = await Investment.findByPk(item.investment_id, {
        transaction: t,
      });

      if (!originalInvestment) {
        console.error(`Investment not found: ${item.investment_id}`);
        continue;
      }

      // Check if auto-reinvest is enabled
      if (originalInvestment.auto_reinvest_enabled) {
        // AUTO-REINVEST: Create new investment instead of crediting wallet
        const payoutAmount = parseFloat(item.amount);
        const sharePrice = parseFloat(originalInvestment.share_price);
        const reinvestShares = Math.floor(payoutAmount / sharePrice);

        if (reinvestShares > 0) {
          // Create new investment (compounding)
          await Investment.create(
            {
              user_id: item.investor_id,
              deal_id: originalInvestment.deal_id,
              spv_id: originalInvestment.spv_id,
              bundle_id: originalInvestment.bundle_id,
              amount: payoutAmount,
              shares_issued: reinvestShares,
              share_price: sharePrice,
              status: 'active',
              invested_at: new Date(),
              auto_reinvest_enabled: true, // Inherit the setting
            },
            { transaction: t }
          );

          // Create transaction record for reinvestment
          await Transaction.create(
            {
              user_id: item.investor_id,
              type: 'payout_reinvested',
              amount: payoutAmount,
              currency: 'USD',
              status: 'completed',
              reference_type: 'payout',
              reference_id: payout.id,
              description: `Auto-reinvested ${payout.payout_type} payout (${reinvestShares} shares)`,
              completed_at: new Date(),
            },
            { transaction: t }
          );

          distributionResults.push({
            investor_id: item.investor_id,
            amount: item.amount,
            status: 'success',
            reinvested: true,
            shares_acquired: reinvestShares,
          });
        }
      } else {
        // NORMAL FLOW: Credit to wallet
        const wallet = await Wallet.findOne({
          where: { user_id: item.investor_id },
          transaction: t,
        });

        if (!wallet) {
          console.error(`Wallet not found for investor ${item.investor_id}`);
          continue;
        }

        // Add to wallet balance
        const oldBalance = parseFloat(wallet.balance_dummy);
        const newBalance = oldBalance + parseFloat(item.amount);

        await wallet.update(
          {
            balance_dummy: newBalance,
          },
          { transaction: t }
        );

        // Create transaction record
        await Transaction.create(
          {
            user_id: item.investor_id,
            type: 'payout',
            amount: item.amount,
            currency: 'USD',
            status: 'completed',
            reference_type: 'payout',
            reference_id: payout.id,
            description: `${payout.payout_type} payout from SPV`,
            balance_before: oldBalance,
            balance_after: newBalance,
            completed_at: new Date(),
          },
          { transaction: t }
        );

        distributionResults.push({
          investor_id: item.investor_id,
          amount: item.amount,
          status: 'success',
          reinvested: false,
        });
      }

      // Update investment record (for both cases)
      await Investment.update(
        {
          total_payouts_received: sequelize.literal(`total_payouts_received + ${item.amount}`),
        },
        {
          where: { id: item.investment_id },
          transaction: t,
        }
      );
    }

    // Mark payout as distributed
    await payout.update(
      {
        distributed: true,
        distributed_at: new Date(),
      },
      { transaction: t }
    );

    await t.commit();

    return success(
      res,
      {
        payout,
        distributionResults,
      },
      'Payout distributed successfully'
    );
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

export const listPayouts = async (req, res, next) => {
  try {
    const { spvId, distributed } = req.query;

    const where = {};
    if (spvId) where.spv_id = spvId;
    if (distributed !== undefined) where.distributed = distributed === 'true';

    const payouts = await Payout.findAll({
      where,
      include: [
        {
          model: SPV,
          as: 'spv',
          include: ['deal'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['payout_date', 'DESC']],
    });

    return success(res, { payouts });
  } catch (err) {
    next(err);
  }
};

export const getPayoutDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payout = await Payout.findByPk(id, {
      include: [
        {
          model: SPV,
          as: 'spv',
          include: ['deal'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!payout) {
      return error(res, 'Payout not found', 404);
    }

    return success(res, { payout });
  } catch (err) {
    next(err);
  }
};

export const simulateMonthlyPayout = async (req, res, next) => {
  try {
    const { spvId } = req.params;

    // Get SPV with deal and assets
    const spv = await SPV.findByPk(spvId, {
      include: ['deal', 'assets', 'investments'],
    });

    if (!spv) {
      return error(res, 'SPV not found', 404);
    }

    // Calculate simulated monthly revenue based on asset type
    let monthlyRevenue = 0;

    if (spv.assets && spv.assets.length > 0) {
      monthlyRevenue = spv.assets.reduce(
        (sum, asset) => sum + parseFloat(asset.monthly_revenue || 0),
        0
      );
    } else {
      // Fallback: estimate based on deal target
      const estimatedAnnualReturn = parseFloat(spv.deal.target_amount) * 0.12; // 12% annual
      monthlyRevenue = estimatedAnnualReturn / 12;
    }

    // Deduct expenses (estimate 30% of revenue)
    const monthlyExpenses = monthlyRevenue * 0.3;
    const netMonthlyIncome = monthlyRevenue - monthlyExpenses;

    // Calculate payout per investor
    const totalShares = spv.investments.reduce(
      (sum, inv) => sum + parseInt(inv.shares_issued),
      0
    );

    const payoutPerShare = netMonthlyIncome / totalShares;

    const simulatedPayouts = spv.investments.map((inv) => ({
      investor_id: inv.user_id,
      shares: inv.shares_issued,
      payout: payoutPerShare * inv.shares_issued,
    }));

    return success(res, {
      spv: {
        id: spv.id,
        name: spv.spv_name,
      },
      simulation: {
        monthlyRevenue,
        monthlyExpenses,
        netMonthlyIncome,
        totalInvestors: spv.investments.length,
        totalShares,
        payoutPerShare,
      },
      simulatedPayouts,
    });
  } catch (err) {
    next(err);
  }
};
