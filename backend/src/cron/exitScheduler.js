import cron from 'node-cron';
import { Deal, SPV, Investment, Wallet, Transaction, User } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * Check for deals that have reached their exit date and process exit/redemption
 */
async function processExitDueDates() {
  try {
    console.log('[EXIT-SCHEDULER] Checking for deals due for exit...');

    const now = new Date();

    // Find deals where:
    // 1. Status is 'operational', 'secondary', or 'exchange'
    // 2. exit_date has been reached
    const dealsDueForExit = await Deal.findAll({
      where: {
        status: {
          [Op.in]: ['operational', 'secondary', 'exchange'],
        },
        exit_date: {
          [Op.lte]: now,
          [Op.not]: null,
        },
      },
      include: [{
        model: SPV,
        as: 'spvs',
      }],
    });

    if (dealsDueForExit.length === 0) {
      console.log('[EXIT-SCHEDULER] No deals found due for exit');
      return {
        success: true,
        processed: 0,
      };
    }

    console.log(`[EXIT-SCHEDULER] Found ${dealsDueForExit.length} deal(s) due for exit`);

    const results = [];

    for (const deal of dealsDueForExit) {
      const t = await sequelize.transaction();

      try {
        console.log(`[EXIT-SCHEDULER] Processing exit for deal "${deal.title}" (${deal.id})`);

        const spv = deal.spvs && deal.spvs.length > 0 ? deal.spvs[0] : null;

        if (!spv) {
          console.error(`[EXIT-SCHEDULER] ✗ No SPV found for deal ${deal.id}. Skipping...`);
          await t.rollback();
          results.push({
            dealId: deal.id,
            title: deal.title,
            status: 'error',
            error: 'No SPV found',
          });
          continue;
        }

        // Calculate final NAV per share
        const totalShares = parseInt(spv.total_shares);
        const currentNavTotal = parseFloat(spv.nav_total);
        const finalNavPerShare = currentNavTotal / totalShares;

        console.log(`[EXIT-SCHEDULER]    Final NAV per share: ${finalNavPerShare} AED`);

        // Get all active investments for this deal
        const investments = await Investment.findAll({
          where: {
            deal_id: deal.id,
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
          console.log(`[EXIT-SCHEDULER]    No active investments found. Marking deal as exited.`);

          // Still mark deal as exited even if no active investments
          await spv.update({
            status: 'closed',
            nav_per_share: finalNavPerShare,
          }, { transaction: t });

          await deal.update({
            status: 'exited',
          }, { transaction: t });

          await t.commit();

          results.push({
            dealId: deal.id,
            title: deal.title,
            status: 'success',
            investorsProcessed: 0,
            totalRedemptionAmount: 0,
          });
          continue;
        }

        console.log(`[EXIT-SCHEDULER]    Processing ${investments.length} investment(s)`);

        let totalRedemptionAmount = 0;
        let successfulExits = 0;

        // Process each investment
        for (const investment of investments) {
          try {
            const sharesIssued = parseInt(investment.shares_issued);
            const originalInvestment = parseFloat(investment.amount);
            const totalPayoutsReceived = parseFloat(investment.total_payouts_received || 0);

            // Calculate redemption amount
            const redemptionAmount = sharesIssued * finalNavPerShare;

            // Calculate total return
            const totalGain = redemptionAmount + totalPayoutsReceived - originalInvestment;
            const totalReturnPercent = (totalGain / originalInvestment) * 100;

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
                deal_id: deal.id,
                deal_title: deal.title,
                shares_redeemed: sharesIssued,
                nav_per_share: finalNavPerShare,
                original_investment: originalInvestment,
                total_payouts_received: totalPayoutsReceived,
                total_gain: totalGain,
                total_return_percent: totalReturnPercent,
                automated: true,
              },
            }, { transaction: t });

            // Update investment status
            await investment.update({
              status: 'exited',
              exited_at: new Date(),
              current_value: redemptionAmount,
            }, { transaction: t });

            totalRedemptionAmount += redemptionAmount;
            successfulExits++;

            console.log(`[EXIT-SCHEDULER]       ✓ Investor: ${investment.investor.name} - Redemption: ${redemptionAmount} AED`);

            // TODO: Send notification to investor
            // await notifyInvestor(investment.user_id, 'deal_exit', {...});

          } catch (investmentError) {
            console.error(`[EXIT-SCHEDULER]       ✗ Error processing investment ${investment.id}:`, investmentError.message);
            // Continue processing other investments even if one fails
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
        }, { transaction: t });

        await t.commit();

        console.log(`[EXIT-SCHEDULER] ✓ Deal "${deal.title}" exit completed successfully`);
        console.log(`[EXIT-SCHEDULER]    - Total redemption: ${totalRedemptionAmount.toFixed(2)} AED`);
        console.log(`[EXIT-SCHEDULER]    - Investors processed: ${successfulExits}/${investments.length}`);

        results.push({
          dealId: deal.id,
          title: deal.title,
          status: 'success',
          investorsProcessed: successfulExits,
          totalRedemptionAmount,
        });

        // TODO: Send notifications to all investors
        // await notifyDealExit(deal.id, {...});

      } catch (error) {
        await t.rollback();
        console.error(`[EXIT-SCHEDULER] ✗ Failed to process exit for deal "${deal.title}":`, error.message);
        results.push({
          dealId: deal.id,
          title: deal.title,
          status: 'error',
          error: error.message,
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    console.log(`[EXIT-SCHEDULER] Completed: ${successCount}/${dealsDueForExit.length} deals processed successfully`);

    return {
      success: true,
      processed: successCount,
      results,
    };

  } catch (error) {
    console.error('[EXIT-SCHEDULER] Error processing exit due dates:', error);
    throw error;
  }
}

/**
 * Cron job to check exit due dates
 * Runs every day at 3:00 AM
 */
export function startExitScheduler() {
  // Run every day at 3:00 AM
  cron.schedule('0 3 * * *', async () => {
    console.log('[CRON] Running exit due date checker at', new Date().toISOString());

    try {
      await processExitDueDates();
    } catch (error) {
      console.error('[CRON] Fatal error in exit scheduler:', error);
    }
  });

  console.log('[CRON] Exit due date scheduler started - runs daily at 3:00 AM');
}

/**
 * Manual trigger for testing (can be called via API endpoint)
 */
export async function triggerExitScheduler() {
  console.log('[MANUAL] Triggering exit due date checker at', new Date().toISOString());

  try {
    const result = await processExitDueDates();
    return result;
  } catch (error) {
    console.error('[MANUAL] Error triggering exit scheduler:', error);
    throw error;
  }
}

export default { startExitScheduler, triggerExitScheduler };
