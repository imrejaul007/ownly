import cron from 'node-cron';
import { SIPSubscription, SIPPlan, Deal, Investment, Wallet, Transaction, Bundle } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * Process monthly SIP debits and create investments
 */
async function processMonthlySIPDebits() {
  try {
    console.log('[SIP-MONTHLY] Checking for SIP subscriptions due for monthly debit...');

    const now = new Date();

    // Find active subscriptions where next_debit_date has passed
    const subscriptionsDue = await SIPSubscription.findAll({
      where: {
        status: 'active',
        next_debit_date: {
          [Op.lte]: now,
          [Op.not]: null,
        },
      },
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

    if (subscriptionsDue.length === 0) {
      console.log('[SIP-MONTHLY] No subscriptions found due for monthly debit');
      return {
        success: true,
        processed: 0,
      };
    }

    console.log(`[SIP-MONTHLY] Found ${subscriptionsDue.length} subscription(s) due for monthly debit`);

    const results = [];

    for (const subscription of subscriptionsDue) {
      const t = await sequelize.transaction();

      try {
        const plan = subscription.plan;
        const monthlyAmount = parseFloat(subscription.monthly_amount);
        const userId = subscription.user_id;

        console.log(`[SIP-MONTHLY] Processing subscription ${subscription.id} (User: ${userId}, Amount: ${monthlyAmount})`);

        // Check wallet balance
        const wallet = await Wallet.findOne({
          where: { user_id: userId },
          transaction: t,
        });

        if (!wallet || parseFloat(wallet.balance_dummy) < monthlyAmount) {
          console.log(`[SIP-MONTHLY] ⚠️  Insufficient balance for subscription ${subscription.id}. Skipping...`);
          await t.rollback();

          results.push({
            subscriptionId: subscription.id,
            userId,
            status: 'skipped',
            reason: 'Insufficient wallet balance',
          });
          continue;
        }

        // Debit wallet
        const newBalance = parseFloat(wallet.balance_dummy) - monthlyAmount;
        await wallet.update({
          balance_dummy: newBalance,
        }, { transaction: t });

        // Create transaction record for debit
        await Transaction.create({
          user_id: userId,
          type: 'sip_debit',
          amount: -monthlyAmount,
          currency: 'USD',
          status: 'completed',
          reference_type: 'sip_subscription',
          reference_id: subscription.id,
          description: `SIP monthly debit: ${plan.name}`,
          balance_before: wallet.balance_dummy,
          balance_after: newBalance,
          completed_at: new Date(),
        }, { transaction: t });

        // Get deals from bundle based on allocation strategy
        let dealsToInvest = [];

        if (plan.bundle_id) {
          // TODO: Get deals from bundle
          // For now, we'll create a placeholder investment record
          // In production, you would:
          // 1. Get deals from the bundle
          // 2. Apply allocation strategy (equal weight, risk-based, etc.)
          // 3. Create investments in each deal proportionally

          console.log(`[SIP-MONTHLY] Bundle-based investment for ${plan.name} (Bundle: ${plan.bundle_id})`);

          // Placeholder: Create single investment record linked to SIP
          await Investment.create({
            user_id: userId,
            sip_subscription_id: subscription.id,
            amount: monthlyAmount,
            status: 'confirmed',
            invested_at: new Date(),
            confirmed_at: new Date(),
            current_value: monthlyAmount,
          }, { transaction: t });
        } else {
          console.log(`[SIP-MONTHLY] ⚠️  No bundle linked to plan ${plan.id}. Creating generic investment record.`);

          // Create generic investment record
          await Investment.create({
            user_id: userId,
            sip_subscription_id: subscription.id,
            amount: monthlyAmount,
            status: 'confirmed',
            invested_at: new Date(),
            confirmed_at: new Date(),
            current_value: monthlyAmount,
          }, { transaction: t });
        }

        // Update subscription
        const nextDebitDate = new Date(subscription.next_debit_date);
        nextDebitDate.setMonth(nextDebitDate.getMonth() + 1);

        const totalInvested = parseFloat(subscription.total_invested || 0) + monthlyAmount;

        // Check if subscription has reached end date
        const shouldComplete = subscription.end_date && nextDebitDate >= new Date(subscription.end_date);

        await subscription.update({
          next_debit_date: shouldComplete ? null : nextDebitDate,
          total_invested: totalInvested,
          status: shouldComplete ? 'cancelled' : 'active', // Using 'cancelled' for completed subscriptions
        }, { transaction: t });

        await t.commit();

        console.log(`[SIP-MONTHLY] ✓ Subscription ${subscription.id} processed successfully`);
        console.log(`   - Debited: ${monthlyAmount}`);
        console.log(`   - Total Invested: ${totalInvested}`);
        console.log(`   - Next Debit: ${shouldComplete ? 'Completed' : nextDebitDate.toISOString()}`);

        results.push({
          subscriptionId: subscription.id,
          userId,
          amount: monthlyAmount,
          status: 'success',
          nextDebitDate: shouldComplete ? null : nextDebitDate,
        });

        // TODO: Send notification to user
        // await notifyUser(userId, 'sip_debit_success', { amount: monthlyAmount, plan: plan.name });

      } catch (error) {
        await t.rollback();
        console.error(`[SIP-MONTHLY] ✗ Failed to process subscription ${subscription.id}:`, error.message);

        results.push({
          subscriptionId: subscription.id,
          userId: subscription.user_id,
          status: 'error',
          error: error.message,
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    console.log(`[SIP-MONTHLY] Completed: ${successCount}/${subscriptionsDue.length} subscriptions processed successfully`);

    return {
      success: true,
      processed: successCount,
      results,
    };

  } catch (error) {
    console.error('[SIP-MONTHLY] Error processing monthly SIP debits:', error);
    throw error;
  }
}

/**
 * Cron job to process monthly SIP debits
 * Runs every day at 2:00 AM
 */
export function startSIPMonthlyScheduler() {
  // Run every day at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('[CRON] Running SIP monthly debit processor at', new Date().toISOString());

    try {
      await processMonthlySIPDebits();
    } catch (error) {
      console.error('[CRON] Fatal error in SIP monthly scheduler:', error);
    }
  });

  console.log('[CRON] SIP monthly debit scheduler started - runs daily at 2:00 AM');
}

/**
 * Manual trigger for testing (can be called via API endpoint)
 */
export async function triggerSIPMonthlyScheduler() {
  console.log('[MANUAL] Triggering SIP monthly debit processor at', new Date().toISOString());

  try {
    const result = await processMonthlySIPDebits();
    return result;
  } catch (error) {
    console.error('[MANUAL] Error triggering SIP monthly scheduler:', error);
    throw error;
  }
}

export default { startSIPMonthlyScheduler, triggerSIPMonthlyScheduler };
