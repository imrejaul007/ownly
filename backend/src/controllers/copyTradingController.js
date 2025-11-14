import { CopyTrader, CopyFollower, InvestorBundle, CopyTrade, User, Investment, Deal, SPV, Wallet, Transaction } from '../models/index.js';
import { success, error } from '../utils/response.js';
import sequelize from '../config/database.js';
import { Op, Sequelize } from 'sequelize';

// Get all copy traders with stats
export const getTraders = async (req, res, next) => {
  try {
    const { search, risk_level, min_return, sortBy = 'total_copiers_count' } = req.query;

    const where = { is_active: true };

    if (risk_level) {
      where.risk_level = risk_level;
    }

    if (min_return) {
      where.total_return = { [Op.gte]: parseFloat(min_return) };
    }

    const traders = await CopyTrader.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar', 'country'],
        },
        {
          model: InvestorBundle,
          as: 'bundles',
          where: { is_active: true },
          required: false,
        },
      ],
      order: [[sortBy, 'DESC']],
    });

    // Filter by search if provided
    let filteredTraders = traders;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTraders = traders.filter(trader =>
        trader.user.name.toLowerCase().includes(searchLower) ||
        trader.user.email.toLowerCase().includes(searchLower) ||
        (trader.bio && trader.bio.toLowerCase().includes(searchLower))
      );
    }

    // Convert DECIMAL fields from strings to numbers for frontend
    const tradersWithNumericFields = filteredTraders.map(trader => {
      const traderJson = trader.toJSON();
      return {
        ...traderJson,
        total_return: parseFloat(traderJson.total_return || 0),
        monthly_return: parseFloat(traderJson.monthly_return || 0),
        win_rate: parseFloat(traderJson.win_rate || 0),
        min_copy_amount: parseFloat(traderJson.min_copy_amount || 0),
        commission_rate: parseFloat(traderJson.commission_rate || 0),
      };
    });

    return success(res, { traders: tradersWithNumericFields, total: tradersWithNumericFields.length });

  } catch (err) {
    next(err);
  }
};

// Get detailed trader profile
export const getTraderProfile = async (req, res, next) => {
  try {
    const { traderId } = req.params;

    const trader = await CopyTrader.findByPk(traderId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar', 'country', 'city'],
          include: [
            {
              model: Investment,
              as: 'investments',
              where: { status: { [Op.in]: ['confirmed', 'active'] } },
              required: false,
              include: [
                {
                  model: Deal,
                  as: 'deal',
                  attributes: ['id', 'title', 'type', 'category', 'expected_roi', 'images'],
                },
              ],
            },
          ],
        },
        {
          model: InvestorBundle,
          as: 'bundles',
          where: { is_active: true },
          required: false,
        },
      ],
    });

    if (!trader) {
      return error(res, 'Trader not found', 404);
    }

    if (!trader.is_active) {
      return error(res, 'Trader profile is inactive', 400);
    }

    // Get portfolio breakdown
    const investments = trader.user.investments || [];
    const portfolioBreakdown = {};
    let totalInvested = 0;

    investments.forEach(inv => {
      const category = inv.deal?.category || 'other';
      const amount = parseFloat(inv.amount);
      totalInvested += amount;

      if (!portfolioBreakdown[category]) {
        portfolioBreakdown[category] = 0;
      }
      portfolioBreakdown[category] += amount;
    });

    // Convert to percentages
    Object.keys(portfolioBreakdown).forEach(category => {
      portfolioBreakdown[category] = totalInvested > 0
        ? parseFloat(((portfolioBreakdown[category] / totalInvested) * 100).toFixed(2))
        : 0;
    });

    // Convert trader DECIMAL fields to numbers
    const traderJson = trader.toJSON();
    const traderWithNumericFields = {
      ...traderJson,
      total_return: parseFloat(traderJson.total_return || 0),
      monthly_return: parseFloat(traderJson.monthly_return || 0),
      win_rate: parseFloat(traderJson.win_rate || 0),
      min_copy_amount: parseFloat(traderJson.min_copy_amount || 0),
      commission_rate: parseFloat(traderJson.commission_rate || 0),
    };

    return success(res, {
      trader: traderWithNumericFields,
      portfolioBreakdown,
      activeDealsCount: investments.length,
      totalInvested: parseFloat(totalInvested.toFixed(2)),
    });

  } catch (err) {
    next(err);
  }
};

// Create bundle (for traders)
export const createBundle = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, description, deal_ids, category, min_copy_amount } = req.body;

    // Check if user is a copy trader
    let copyTrader = await CopyTrader.findOne({ where: { user_id: userId } });

    if (!copyTrader) {
      // Create copy trader profile if doesn't exist
      copyTrader = await CopyTrader.create({
        user_id: userId,
        is_active: true,
      });
    }

    // Validate deals exist
    if (deal_ids && deal_ids.length > 0) {
      const deals = await Deal.findAll({
        where: { id: { [Op.in]: deal_ids } },
      });

      if (deals.length !== deal_ids.length) {
        return error(res, 'Some deals not found', 404);
      }
    }

    // Create bundle
    const bundle = await InvestorBundle.create({
      trader_id: copyTrader.id,
      name,
      description,
      deal_ids: deal_ids || [],
      category,
      min_copy_amount: min_copy_amount || 2000.00,
      is_active: true,
    });

    return success(res, { bundle }, 'Bundle created successfully', 201);

  } catch (err) {
    next(err);
  }
};

// Start copying (profile/bundle/individual deal)
export const startCopying = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const followerId = req.user.id;
    const { trader_user_id, copy_type, bundle_id, deal_id, copy_amount, auto_reinvest, stop_loss_percentage } = req.body;

    // Validate copy_type
    if (!['full_profile', 'bundle', 'individual_deal'].includes(copy_type)) {
      await t.rollback();
      return error(res, 'Invalid copy_type', 400);
    }

    // Validate required fields based on copy_type
    if (copy_type === 'bundle' && !bundle_id) {
      await t.rollback();
      return error(res, 'bundle_id required for bundle copy type', 400);
    }

    if (copy_type === 'individual_deal' && !deal_id) {
      await t.rollback();
      return error(res, 'deal_id required for individual_deal copy type', 400);
    }

    // Check trader exists
    const traderUser = await User.findByPk(trader_user_id);
    if (!traderUser) {
      await t.rollback();
      return error(res, 'Trader not found', 404);
    }

    // Check if trader has copy trader profile
    const copyTrader = await CopyTrader.findOne({
      where: { user_id: trader_user_id, is_active: true },
    });

    if (!copyTrader) {
      await t.rollback();
      return error(res, 'User is not an active copy trader', 400);
    }

    // Validate minimum copy amount
    const minAmount = copy_type === 'bundle' && bundle_id
      ? await InvestorBundle.findByPk(bundle_id).then(b => parseFloat(b?.min_copy_amount || copyTrader.min_copy_amount))
      : parseFloat(copyTrader.min_copy_amount);

    if (parseFloat(copy_amount) < minAmount) {
      await t.rollback();
      return error(res, `Minimum copy amount is ${minAmount}`, 400);
    }

    // Check follower wallet balance
    const wallet = await Wallet.findOne({
      where: { user_id: followerId },
      transaction: t,
    });

    if (!wallet || parseFloat(wallet.balance_dummy) < parseFloat(copy_amount)) {
      await t.rollback();
      return error(res, 'Insufficient wallet balance', 400);
    }

    // Check if already copying this configuration
    const existingCopy = await CopyFollower.findOne({
      where: {
        follower_user_id: followerId,
        trader_user_id,
        copy_type,
        ...(bundle_id && { bundle_id }),
        ...(deal_id && { deal_id }),
        is_active: true,
      },
      transaction: t,
    });

    if (existingCopy) {
      await t.rollback();
      return error(res, 'Already copying this configuration', 400);
    }

    // Create copy follower relationship
    const copyFollower = await CopyFollower.create({
      follower_user_id: followerId,
      trader_user_id,
      copy_type,
      bundle_id: bundle_id || null,
      deal_id: deal_id || null,
      copy_amount: parseFloat(copy_amount),
      auto_reinvest: auto_reinvest || false,
      stop_loss_percentage: stop_loss_percentage || 20.00,
      is_active: true,
      started_at: new Date(),
    }, { transaction: t });

    // Update trader's copier count
    await copyTrader.update({
      total_copiers_count: parseInt(copyTrader.total_copiers_count) + 1,
    }, { transaction: t });

    // If bundle copy, update bundle copier count
    if (copy_type === 'bundle' && bundle_id) {
      const bundle = await InvestorBundle.findByPk(bundle_id, { transaction: t });
      if (bundle) {
        await bundle.update({
          total_copiers: parseInt(bundle.total_copiers) + 1,
        }, { transaction: t });
      }
    }

    await t.commit();

    return success(res, { copyFollower }, 'Copy trading started successfully', 201);

  } catch (err) {
    await t.rollback();
    next(err);
  }
};

// Stop copying
export const stopCopying = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { copyFollowerId } = req.params;
    const userId = req.user.id;

    const copyFollower = await CopyFollower.findByPk(copyFollowerId, { transaction: t });

    if (!copyFollower) {
      await t.rollback();
      return error(res, 'Copy relationship not found', 404);
    }

    // Check authorization
    if (copyFollower.follower_user_id !== userId) {
      await t.rollback();
      return error(res, 'Not authorized', 403);
    }

    if (!copyFollower.is_active) {
      await t.rollback();
      return error(res, 'Copy relationship already inactive', 400);
    }

    // Deactivate copy relationship
    await copyFollower.update({
      is_active: false,
      stopped_at: new Date(),
    }, { transaction: t });

    // Update trader's copier count
    const copyTrader = await CopyTrader.findOne({
      where: { user_id: copyFollower.trader_user_id },
      transaction: t,
    });

    if (copyTrader) {
      await copyTrader.update({
        total_copiers_count: Math.max(0, parseInt(copyTrader.total_copiers_count) - 1),
      }, { transaction: t });
    }

    // If bundle copy, update bundle copier count
    if (copyFollower.copy_type === 'bundle' && copyFollower.bundle_id) {
      const bundle = await InvestorBundle.findByPk(copyFollower.bundle_id, { transaction: t });
      if (bundle) {
        await bundle.update({
          total_copiers: Math.max(0, parseInt(bundle.total_copiers) - 1),
        }, { transaction: t });
      }
    }

    await t.commit();

    return success(res, { copyFollower }, 'Copy trading stopped successfully');

  } catch (err) {
    await t.rollback();
    next(err);
  }
};

// Get who's copying me (for traders)
export const getMyCopiers = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const copiers = await CopyFollower.findAll({
      where: {
        trader_user_id: userId,
        is_active: true,
      },
      include: [
        {
          model: User,
          as: 'follower',
          attributes: ['id', 'name', 'email', 'avatar'],
        },
        {
          model: InvestorBundle,
          as: 'bundle',
          required: false,
        },
        {
          model: Deal,
          as: 'deal',
          required: false,
          attributes: ['id', 'title', 'type'],
        },
      ],
      order: [['started_at', 'DESC']],
    });

    // Calculate total capital being copied
    const totalCapital = copiers.reduce((sum, copier) => sum + parseFloat(copier.copy_amount), 0);

    return success(res, {
      copiers,
      total: copiers.length,
      totalCapital: totalCapital.toFixed(2),
    });

  } catch (err) {
    next(err);
  }
};

// Get who I'm copying (for followers)
export const getMyFollowing = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const following = await CopyFollower.findAll({
      where: {
        follower_user_id: userId,
        is_active: true,
      },
      include: [
        {
          model: User,
          as: 'trader',
          attributes: ['id', 'name', 'email', 'avatar'],
          include: [
            {
              model: CopyTrader,
              as: 'copyTraderProfile',
              attributes: ['total_return', 'monthly_return', 'win_rate', 'risk_level'],
            },
          ],
        },
        {
          model: InvestorBundle,
          as: 'bundle',
          required: false,
        },
        {
          model: Deal,
          as: 'deal',
          required: false,
          attributes: ['id', 'title', 'type'],
        },
        {
          model: CopyTrade,
          as: 'copyTrades',
          required: false,
          where: { status: 'active' },
        },
      ],
      order: [['started_at', 'DESC']],
    });

    // Calculate total invested through copy trading
    const totalInvested = following.reduce((sum, f) => sum + parseFloat(f.copy_amount), 0);

    return success(res, {
      following,
      total: following.length,
      totalInvested: totalInvested.toFixed(2),
    });

  } catch (err) {
    next(err);
  }
};

// Auto-execute copy when trader makes investment (called from investment controller)
export const autoExecuteCopy = async (originalInvestment, transaction) => {
  try {
    const traderId = originalInvestment.user_id;
    const dealId = originalInvestment.deal_id;
    const spvId = originalInvestment.spv_id;
    const originalAmount = parseFloat(originalInvestment.amount);

    // Find all active followers of this trader
    const followers = await CopyFollower.findAll({
      where: {
        trader_user_id: traderId,
        is_active: true,
        [Op.or]: [
          { copy_type: 'full_profile' },
          { copy_type: 'individual_deal', deal_id: dealId },
          { copy_type: 'bundle' }, // Placeholder - will be filtered by include condition
        ],
      },
      include: [
        {
          model: InvestorBundle,
          as: 'bundle',
          required: false,
        },
        {
          model: User,
          as: 'follower',
          include: [
            {
              model: Wallet,
              as: 'wallet',
            },
          ],
        },
      ],
      transaction,
    });

    // Filter bundle followers manually to check if their bundle contains the dealId
    const filteredFollowers = followers.filter(follower => {
      if (follower.copy_type === 'bundle') {
        // Check if bundle exists and contains the dealId
        if (follower.bundle && follower.bundle.deal_ids && Array.isArray(follower.bundle.deal_ids)) {
          return follower.bundle.deal_ids.includes(dealId);
        }
        return false; // Skip if bundle data is missing
      }
      return true; // Include non-bundle followers
    });

    // Get SPV for share price calculation
    const spv = await SPV.findByPk(spvId, { transaction });
    if (!spv) return;

    // Process each follower
    for (const follower of filteredFollowers) {
      try {
        // Calculate proportional amount
        const copyAmount = parseFloat(follower.copy_amount);
        const proportion = copyAmount / 10000; // Assuming 10k base, adjust as needed
        let followerAmount = originalAmount * proportion;

        // Check minimum ticket
        const deal = await Deal.findByPk(dealId, { transaction });
        if (followerAmount < parseFloat(deal.min_ticket)) {
          followerAmount = parseFloat(deal.min_ticket);
        }

        // Check follower wallet
        const wallet = follower.follower.wallet;
        if (!wallet || parseFloat(wallet.balance_dummy) < followerAmount) {
          continue; // Skip if insufficient balance
        }

        // Create follower's investment
        const followerInvestment = await Investment.create({
          user_id: follower.follower_user_id,
          spv_id: spvId,
          deal_id: dealId,
          amount: followerAmount,
          shares_issued: Math.floor(followerAmount / spv.share_price),
          share_price: spv.share_price,
          status: 'confirmed',
          invested_at: new Date(),
          confirmed_at: new Date(),
          current_value: followerAmount,
        }, { transaction });

        // Deduct from follower wallet
        const newBalance = parseFloat(wallet.balance_dummy) - followerAmount;
        await wallet.update({
          balance_dummy: newBalance,
        }, { transaction });

        // Create transaction record
        await Transaction.create({
          user_id: follower.follower_user_id,
          type: 'investment',
          amount: -followerAmount,
          currency: 'USD',
          status: 'completed',
          reference_type: 'investment',
          reference_id: followerInvestment.id,
          description: `Copy trade: ${deal.title} (copying ${follower.trader.name})`,
          balance_before: wallet.balance_dummy,
          balance_after: newBalance,
          completed_at: new Date(),
        }, { transaction });

        // Update SPV
        await spv.update({
          issued_shares: parseInt(spv.issued_shares) + followerInvestment.shares_issued,
          escrow_balance: parseFloat(spv.escrow_balance) + followerAmount,
        }, { transaction });

        // Update Deal
        await deal.update({
          raised_amount: parseFloat(deal.raised_amount) + followerAmount,
          investor_count: parseInt(deal.investor_count) + 1,
        }, { transaction });

        // Create copy trade record
        await CopyTrade.create({
          copy_follower_id: follower.id,
          original_investment_id: originalInvestment.id,
          follower_investment_id: followerInvestment.id,
          copy_proportion: proportion,
          original_amount: originalAmount,
          copied_amount: followerAmount,
          status: 'active',
        }, { transaction });

        // Update copy follower stats
        await follower.update({
          total_copied_investments: parseInt(follower.total_copied_investments) + 1,
        }, { transaction });

      } catch (err) {
        console.error(`Error processing copy for follower ${follower.follower_user_id}:`, err);
        // Continue with next follower
      }
    }

  } catch (err) {
    console.error('Error in autoExecuteCopy:', err);
    throw err;
  }
};

// Get trader bundles
export const getTraderBundles = async (req, res, next) => {
  try {
    const { traderId } = req.params;

    const bundles = await InvestorBundle.findAll({
      where: {
        trader_id: traderId,
        is_active: true,
      },
      include: [
        {
          model: CopyTrader,
          as: 'trader',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'avatar'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    // Enrich with deal details
    const enrichedBundles = await Promise.all(
      bundles.map(async (bundle) => {
        const bundleJson = bundle.toJSON();

        if (bundleJson.deal_ids && bundleJson.deal_ids.length > 0) {
          const deals = await Deal.findAll({
            where: { id: { [Op.in]: bundleJson.deal_ids } },
            attributes: ['id', 'title', 'type', 'expected_roi', 'images', 'min_ticket'],
          });
          bundleJson.deals = deals;
        } else {
          bundleJson.deals = [];
        }

        return bundleJson;
      })
    );

    return success(res, { bundles: enrichedBundles, total: enrichedBundles.length });

  } catch (err) {
    next(err);
  }
};

// Update bundle
export const updateBundle = async (req, res, next) => {
  try {
    const { bundleId } = req.params;
    const userId = req.user.id;
    const { name, description, deal_ids, category, min_copy_amount, is_active } = req.body;

    const bundle = await InvestorBundle.findByPk(bundleId, {
      include: [
        {
          model: CopyTrader,
          as: 'trader',
        },
      ],
    });

    if (!bundle) {
      return error(res, 'Bundle not found', 404);
    }

    // Check authorization
    if (bundle.trader.user_id !== userId) {
      return error(res, 'Not authorized to update this bundle', 403);
    }

    // Update bundle
    await bundle.update({
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(deal_ids && { deal_ids }),
      ...(category && { category }),
      ...(min_copy_amount && { min_copy_amount }),
      ...(is_active !== undefined && { is_active }),
    });

    return success(res, { bundle }, 'Bundle updated successfully');

  } catch (err) {
    next(err);
  }
};

// Update copy trader profile
export const updateTraderProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { bio, specialty, min_copy_amount, commission_rate, risk_level, is_active } = req.body;

    let copyTrader = await CopyTrader.findOne({ where: { user_id: userId } });

    if (!copyTrader) {
      // Create if doesn't exist
      copyTrader = await CopyTrader.create({
        user_id: userId,
        is_active: true,
        bio,
        specialty,
        min_copy_amount,
        commission_rate,
        risk_level,
      });
    } else {
      // Update existing
      await copyTrader.update({
        ...(bio !== undefined && { bio }),
        ...(specialty && { specialty }),
        ...(min_copy_amount && { min_copy_amount }),
        ...(commission_rate && { commission_rate }),
        ...(risk_level && { risk_level }),
        ...(is_active !== undefined && { is_active }),
      });
    }

    return success(res, { copyTrader }, 'Trader profile updated successfully');

  } catch (err) {
    next(err);
  }
};
