import { Deal, SPV, Investment, Wallet, Transaction, User } from '../models/index.js';
import { success, error } from '../utils/response.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

/**
 * Process deal exit/redemption
 * - Calculate final NAV per share
 * - Distribute final payouts to all investors
 * - Update deal and investment statuses
 * - Credit investor wallets
 *
 * POST /api/deals/:dealId/exit
 */
export const processDealExit = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { dealId } = req.params;
    const { final_nav_per_share, exit_notes } = req.body;

    // Authorization check - only admin can trigger exit
    if (req.user.role !== 'admin') {
      await t.rollback();
      return error(res, 'Only administrators can process deal exits', 403);
    }

    // Get deal with SPV
    const deal = await Deal.findByPk(dealId, {
      include: [{
        model: SPV,
        as: 'spvs',
      }],
      transaction: t,
    });

    if (!deal) {
      await t.rollback();
      return error(res, 'Deal not found', 404);
    }

    // Validate deal status
    if (deal.status === 'exited') {
      await t.rollback();
      return error(res, 'Deal has already been exited', 400);
    }

    if (!['operational', 'secondary', 'exchange'].includes(deal.status)) {
      await t.rollback();
      return error(res, 'Deal must be operational, secondary, or exchange status to exit', 400);
    }

    // Get SPV
    const spv = deal.spvs && deal.spvs.length > 0 ? deal.spvs[0] : null;

    if (!spv) {
      await t.rollback();
      return error(res, 'SPV not found for this deal', 404);
    }

    // Calculate final NAV per share if not provided
    let finalNavPerShare = final_nav_per_share;

    if (!finalNavPerShare) {
      // Calculate based on current SPV valuation
      const totalShares = parseInt(spv.total_shares);
      const currentNavTotal = parseFloat(spv.nav_total);
      finalNavPerShare = currentNavTotal / totalShares;
    }

    // Get all active investments for this deal
    const investments = await Investment.findAll({
      where: {
        deal_id: dealId,
        status: {
          [Op.in]: ['active', 'confirmed'],
        },
      },
      include: [{
        model: User,
        as: 'investor',
        attributes: ['id', 'name', 'email'],
      }],
      transaction: t,
    });

    if (investments.length === 0) {
      await t.rollback();
      return error(res, 'No active investments found for this deal', 400);
    }

    console.log(`[EXIT] Processing exit for deal ${deal.title} (${dealId})`);
    console.log(`[EXIT] Final NAV per share: ${finalNavPerShare} AED`);
    console.log(`[EXIT] Processing ${investments.length} investment(s)`);

    const exitResults = [];
    let totalRedemptionAmount = 0;

    // Process each investment
    for (const investment of investments) {
      try {
        const sharesIssued = parseInt(investment.shares_issued);
        const originalInvestment = parseFloat(investment.amount);
        const totalPayoutsReceived = parseFloat(investment.total_payouts_received || 0);

        // Calculate redemption amount (final NAV value of shares)
        const redemptionAmount = sharesIssued * finalNavPerShare;

        // Calculate total return (redemption + payouts - original investment)
        const totalGain = redemptionAmount + totalPayoutsReceived - originalInvestment;
        const totalReturnPercent = (totalGain / originalInvestment) * 100;

        console.log(`[EXIT] Processing investment ${investment.id}:`);
        console.log(`   - Investor: ${investment.investor.name} (${investment.investor.email})`);
        console.log(`   - Shares: ${sharesIssued}`);
        console.log(`   - Original Investment: ${originalInvestment} AED`);
        console.log(`   - Payouts Received: ${totalPayoutsReceived} AED`);
        console.log(`   - Redemption Amount: ${redemptionAmount} AED`);
        console.log(`   - Total Gain: ${totalGain} AED (${totalReturnPercent.toFixed(2)}%)`);

        // Credit investor wallet
        const wallet = await Wallet.findOne({
          where: { user_id: investment.user_id },
          transaction: t,
        });

        if (!wallet) {
          throw new Error(`Wallet not found for user ${investment.user_id}`);
        }

        const newWalletBalance = parseFloat(wallet.balance_dummy) + redemptionAmount;

        await wallet.update({
          balance_dummy: newWalletBalance,
        }, { transaction: t });

        // Create transaction record
        await Transaction.create({
          user_id: investment.user_id,
          type: 'exit_redemption',
          amount: redemptionAmount,
          currency: 'USD',
          status: 'completed',
          reference_type: 'investment',
          reference_id: investment.id,
          description: `Exit redemption for ${deal.title}`,
          balance_before: wallet.balance_dummy,
          balance_after: newWalletBalance,
          completed_at: new Date(),
          metadata: {
            deal_id: dealId,
            deal_title: deal.title,
            shares_redeemed: sharesIssued,
            nav_per_share: finalNavPerShare,
            original_investment: originalInvestment,
            total_payouts_received: totalPayoutsReceived,
            total_gain: totalGain,
            total_return_percent: totalReturnPercent,
            exit_notes: exit_notes || '',
          },
        }, { transaction: t });

        // Update investment status
        await investment.update({
          status: 'exited',
          exited_at: new Date(),
          current_value: redemptionAmount,
        }, { transaction: t });

        exitResults.push({
          investmentId: investment.id,
          userId: investment.user_id,
          userName: investment.investor.name,
          userEmail: investment.investor.email,
          sharesRedeemed: sharesIssued,
          originalInvestment,
          totalPayoutsReceived,
          redemptionAmount,
          totalGain,
          totalReturnPercent: totalReturnPercent.toFixed(2),
          status: 'success',
        });

        totalRedemptionAmount += redemptionAmount;

      } catch (investmentError) {
        console.error(`[EXIT] Error processing investment ${investment.id}:`, investmentError.message);

        exitResults.push({
          investmentId: investment.id,
          userId: investment.user_id,
          status: 'error',
          error: investmentError.message,
        });
      }
    }

    // Update SPV status
    await spv.update({
      status: 'closed',
      nav_per_share: finalNavPerShare,
    }, { transaction: t });

    // Update deal status
    await deal.update({
      status: 'exited',
      exit_date: new Date(),
    }, { transaction: t });

    await t.commit();

    console.log(`[EXIT] ✓ Deal exit completed successfully`);
    console.log(`   - Total redemption amount: ${totalRedemptionAmount.toFixed(2)} AED`);
    console.log(`   - Investors processed: ${exitResults.filter(r => r.status === 'success').length}/${investments.length}`);

    return success(res, {
      deal: {
        id: deal.id,
        title: deal.title,
        status: 'exited',
        exit_date: new Date(),
      },
      exit_summary: {
        final_nav_per_share: finalNavPerShare,
        total_investors: investments.length,
        successful_exits: exitResults.filter(r => r.status === 'success').length,
        failed_exits: exitResults.filter(r => r.status === 'error').length,
        total_redemption_amount: totalRedemptionAmount,
      },
      investor_details: exitResults,
    }, 'Deal exit processed successfully', 200);

  } catch (err) {
    await t.rollback();
    console.error('[EXIT] Error processing deal exit:', err);
    next(err);
  }
};

/**
 * Get exit eligibility for a deal
 *
 * GET /api/deals/:dealId/exit/eligibility
 */
export const getExitEligibility = async (req, res, next) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findByPk(dealId, {
      include: [{
        model: SPV,
        as: 'spvs',
      }],
    });

    if (!deal) {
      return error(res, 'Deal not found', 404);
    }

    const spv = deal.spvs && deal.spvs.length > 0 ? deal.spvs[0] : null;

    // Check exit eligibility
    const isEligible = ['operational', 'secondary', 'exchange'].includes(deal.status);
    const hasReachedExitDate = deal.exit_date ? new Date(deal.exit_date) <= new Date() : false;
    const isAlreadyExited = deal.status === 'exited';

    // Count active investments
    const activeInvestmentsCount = await Investment.count({
      where: {
        deal_id: dealId,
        status: {
          [Op.in]: ['active', 'confirmed'],
        },
      },
    });

    // Calculate recommended NAV per share
    let recommendedNavPerShare = null;
    if (spv) {
      const totalShares = parseInt(spv.total_shares);
      const currentNavTotal = parseFloat(spv.nav_total);
      recommendedNavPerShare = currentNavTotal / totalShares;
    }

    return success(res, {
      deal: {
        id: deal.id,
        title: deal.title,
        status: deal.status,
        exit_date: deal.exit_date,
      },
      eligibility: {
        is_eligible: isEligible && !isAlreadyExited,
        has_reached_exit_date: hasReachedExitDate,
        is_already_exited: isAlreadyExited,
        active_investments_count: activeInvestmentsCount,
        recommended_nav_per_share: recommendedNavPerShare,
      },
      warnings: [
        ...(!isEligible ? ['Deal must be in operational, secondary, or exchange status'] : []),
        ...(isAlreadyExited ? ['Deal has already been exited'] : []),
        ...(activeInvestmentsCount === 0 ? ['No active investments found'] : []),
      ],
    });

  } catch (err) {
    next(err);
  }
};

/**
 * Get exit history for a deal
 *
 * GET /api/deals/:dealId/exit/history
 */
export const getExitHistory = async (req, res, next) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findByPk(dealId);

    if (!deal) {
      return error(res, 'Deal not found', 404);
    }

    // Get all exited investments for this deal
    const exitedInvestments = await Investment.findAll({
      where: {
        deal_id: dealId,
        status: 'exited',
        exited_at: {
          [Op.not]: null,
        },
      },
      include: [{
        model: User,
        as: 'investor',
        attributes: ['id', 'name', 'email'],
      }],
      order: [['exited_at', 'DESC']],
    });

    // Get exit transactions
    const exitTransactions = await Transaction.findAll({
      where: {
        type: 'exit_redemption',
        reference_type: 'investment',
        reference_id: {
          [Op.in]: exitedInvestments.map(inv => inv.id),
        },
      },
      order: [['completed_at', 'DESC']],
    });

    // Calculate summary
    const totalRedemptionAmount = exitTransactions.reduce((sum, txn) =>
      sum + parseFloat(txn.amount), 0
    );

    const totalOriginalInvestment = exitedInvestments.reduce((sum, inv) =>
      sum + parseFloat(inv.amount), 0
    );

    const totalPayoutsReceived = exitedInvestments.reduce((sum, inv) =>
      sum + parseFloat(inv.total_payouts_received || 0), 0
    );

    const totalGain = totalRedemptionAmount + totalPayoutsReceived - totalOriginalInvestment;
    const avgReturnPercent = totalOriginalInvestment > 0
      ? (totalGain / totalOriginalInvestment) * 100
      : 0;

    return success(res, {
      deal: {
        id: deal.id,
        title: deal.title,
        status: deal.status,
        exit_date: deal.exit_date,
      },
      summary: {
        total_exited_investments: exitedInvestments.length,
        total_redemption_amount: totalRedemptionAmount,
        total_original_investment: totalOriginalInvestment,
        total_payouts_received: totalPayoutsReceived,
        total_gain: totalGain,
        average_return_percent: avgReturnPercent.toFixed(2),
      },
      exited_investments: exitedInvestments.map(inv => ({
        id: inv.id,
        investor: {
          id: inv.investor.id,
          name: inv.investor.name,
          email: inv.investor.email,
        },
        shares_redeemed: inv.shares_issued,
        original_investment: parseFloat(inv.amount),
        total_payouts_received: parseFloat(inv.total_payouts_received || 0),
        redemption_amount: parseFloat(inv.current_value || 0),
        exited_at: inv.exited_at,
      })),
      transactions: exitTransactions,
    });

  } catch (err) {
    next(err);
  }
};
