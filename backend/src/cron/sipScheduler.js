import cron from 'node-cron';
import { SIPSubscription, SIPPlan, Bundle, Deal, Investment, Wallet, Transaction } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * Process a single SIP subscription's monthly investment
 */
async function processSIPSubscription(subscription) {
  const t = await sequelize.transaction();

  try {
    const plan = await SIPPlan.findByPk(subscription.sip_plan_id, {
      include: [
        {
          model: Bundle,
          as: 'bundle',
          include: [
            {
              model: Deal,
              as: 'deals',
              where: { status: { [Op.in]: ['active', 'funding'] } },
              required: false,
            },
          ],
        },
      ],
      transaction: t,
    });

    if (!plan) {
      throw new Error(`SIP Plan not found for subscription ${subscription.id}`);
    }

    // Get user's wallet
    const wallet = await Wallet.findOne({
      where: { user_id: subscription.user_id },
      transaction: t,
    });

    if (!wallet) {
      throw new Error(`Wallet not found for user ${subscription.user_id}`);
    }

    const monthlyAmount = parseFloat(subscription.monthly_amount);
    const currentBalance = parseFloat(wallet.balance_dummy);

    // Check if user has sufficient balance
    if (currentBalance < monthlyAmount) {
      // Mark as failed for this month
      await subscription.update(
        {
          metadata: {
            ...subscription.metadata,
            last_failed_execution: new Date(),
            failure_reason: 'Insufficient balance',
          },
        },
        { transaction: t }
      );

      await t.rollback();
      return {
        success: false,
        subscription_id: subscription.id,
        reason: 'Insufficient balance',
      };
    }

    // Deduct from wallet
    await wallet.update(
      { balance_dummy: currentBalance - monthlyAmount },
      { transaction: t }
    );

    // Create transaction record
    await Transaction.create(
      {
        user_id: subscription.user_id,
        type: 'sip_deduction',
        amount: -monthlyAmount,
        description: `SIP monthly investment for ${plan.name}`,
        reference_type: 'sip_subscription',
        reference_id: subscription.id,
        metadata: {
          plan_name: plan.name,
          execution_date: new Date(),
        },
      },
      { transaction: t }
    );

    const investments = [];

    if (plan.bundle_id && plan.bundle?.deals && plan.bundle.deals.length > 0) {
      // Allocate based on bundle allocation strategy
      const allocationStrategy = plan.allocation_strategy || {};

      for (const deal of plan.bundle.deals) {
        const dealAllocation = deal.BundleDeal?.allocation_percentage || 0;
        const dealAmount = (monthlyAmount * dealAllocation) / 100;

        if (dealAmount > 0) {
          const sharePrice = parseFloat(deal.share_price) || 1;
          const sharesIssued = Math.floor(dealAmount / sharePrice);

          if (sharesIssued > 0) {
            const investment = await Investment.create(
              {
                user_id: subscription.user_id,
                deal_id: deal.id,
                spv_id: deal.spv_id,
                bundle_id: plan.bundle_id,
                sip_subscription_id: subscription.id,
                amount: dealAmount,
                shares_issued: sharesIssued,
                share_price: sharePrice,
                status: 'active',
                invested_at: new Date(),
                metadata: {
                  source: 'sip_auto_invest',
                  plan_id: plan.id,
                  plan_name: plan.name,
                },
              },
              { transaction: t }
            );

            investments.push(investment);

            // Update deal raised amount and investor count
            await deal.increment(
              {
                raised_amount: dealAmount,
                investor_count: 1,
              },
              { transaction: t }
            );
          }
        }
      }
    } else {
      // If no bundle, find active deals based on allocation_strategy
      const strategy = plan.allocation_strategy || {
        franchise: 40,
        real_estate: 30,
        asset: 20,
        equity: 10,
      };

      for (const [category, percentage] of Object.entries(strategy)) {
        const categoryAmount = (monthlyAmount * percentage) / 100;

        if (categoryAmount > 0) {
          // Find active deal in this category
          const deal = await Deal.findOne({
            where: {
              type: category,
              status: { [Op.in]: ['active', 'funding'] },
            },
            order: [['created_at', 'DESC']],
            transaction: t,
          });

          if (deal) {
            const sharePrice = parseFloat(deal.share_price) || 1;
            const sharesIssued = Math.floor(categoryAmount / sharePrice);

            if (sharesIssued > 0) {
              const investment = await Investment.create(
                {
                  user_id: subscription.user_id,
                  deal_id: deal.id,
                  spv_id: deal.spv_id,
                  sip_subscription_id: subscription.id,
                  amount: categoryAmount,
                  shares_issued: sharesIssued,
                  share_price: sharePrice,
                  status: 'active',
                  invested_at: new Date(),
                  metadata: {
                    source: 'sip_auto_invest',
                    plan_id: plan.id,
                    plan_name: plan.name,
                    category,
                  },
                },
                { transaction: t }
              );

              investments.push(investment);

              await deal.increment(
                {
                  raised_amount: categoryAmount,
                  investor_count: 1,
                },
                { transaction: t }
              );
            }
          }
        }
      }
    }

    // Update subscription
    const executionCount = (subscription.execution_count || 0) + 1;
    const totalInvested = parseFloat(subscription.total_invested || 0) + monthlyAmount;
    const newCurrentValue = parseFloat(subscription.current_value || 0) + monthlyAmount;

    await subscription.update(
      {
        execution_count: executionCount,
        total_invested: totalInvested,
        current_value: newCurrentValue,
        last_execution_date: new Date(),
        metadata: {
          ...subscription.metadata,
          last_successful_execution: new Date(),
          investments_created: investments.map((inv) => inv.id),
        },
      },
      { transaction: t }
    );

    await t.commit();

    return {
      success: true,
      subscription_id: subscription.id,
      amount_invested: monthlyAmount,
      investments_count: investments.length,
    };
  } catch (error) {
    await t.rollback();
    console.error(`[SIP] Error processing subscription ${subscription.id}:`, error);
    return {
      success: false,
      subscription_id: subscription.id,
      reason: error.message,
    };
  }
}

/**
 * Process all due SIP subscriptions
 */
async function processMonthlySIPSubscriptions() {
  console.log('[SIP CRON] Starting monthly SIP processing at', new Date().toISOString());

  try {
    // Get all active subscriptions
    const subscriptions = await SIPSubscription.findAll({
      where: {
        status: 'active',
      },
      include: [
        {
          model: SIPPlan,
          as: 'plan',
          where: { status: 'active' },
        },
      ],
    });

    console.log(`[SIP CRON] Found ${subscriptions.length} active subscriptions to process`);

    const results = [];

    for (const subscription of subscriptions) {
      // Check if this subscription is due for execution
      const lastExecution = subscription.last_execution_date
        ? new Date(subscription.last_execution_date)
        : new Date(subscription.start_date);

      const now = new Date();
      const daysSinceLastExecution = Math.floor(
        (now - lastExecution) / (1000 * 60 * 60 * 24)
      );

      // Execute if it's been at least 28 days (approximately monthly)
      if (daysSinceLastExecution >= 28) {
        console.log(`[SIP CRON] Processing subscription ${subscription.id}`);
        const result = await processSIPSubscription(subscription);
        results.push(result);
      } else {
        console.log(
          `[SIP CRON] Skipping subscription ${subscription.id} - last execution was ${daysSinceLastExecution} days ago`
        );
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    console.log(
      `[SIP CRON] Completed: ${successCount} successful, ${failCount} failed`
    );

    return {
      total_processed: results.length,
      successful: successCount,
      failed: failCount,
      results,
    };
  } catch (error) {
    console.error('[SIP CRON] Fatal error in SIP processing:', error);
    throw error;
  }
}

/**
 * Start SIP monthly scheduler
 * Runs on the 1st of every month at 10:00 AM
 */
export function startSIPScheduler() {
  // Run on the 1st of every month at 10:00 AM
  cron.schedule('0 10 1 * *', async () => {
    console.log('[CRON] Running SIP scheduler at', new Date().toISOString());
    try {
      await processMonthlySIPSubscriptions();
    } catch (error) {
      console.error('[CRON] Error in SIP scheduler:', error);
    }
  });

  console.log('[CRON] SIP scheduler started - runs monthly on 1st at 10:00 AM');
}

/**
 * Manual trigger for testing
 */
export async function triggerSIPScheduler() {
  console.log('[MANUAL] Triggering SIP scheduler at', new Date().toISOString());
  return await processMonthlySIPSubscriptions();
}

export default { startSIPScheduler, triggerSIPScheduler };
