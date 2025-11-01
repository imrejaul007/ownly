import cron from 'node-cron';
import { Deal } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * Check for deals that have completed their lock-in period
 * and transition them to operational status
 */
async function processLockInExpirations() {
  try {
    console.log('[LOCK-IN] Checking for deals with expired lock-in periods...');

    // Find deals where:
    // 1. Status is 'lock-in' or 'funded'
    // 2. lock_in_end_date has passed
    const now = new Date();

    const dealsToTransition = await Deal.findAll({
      where: {
        status: {
          [Op.in]: ['lock-in', 'funded'],
        },
        lock_in_end_date: {
          [Op.lte]: now,
          [Op.not]: null,
        },
      },
    });

    if (dealsToTransition.length === 0) {
      console.log('[LOCK-IN] No deals found with expired lock-in periods');
      return {
        success: true,
        processed: 0,
      };
    }

    console.log(`[LOCK-IN] Found ${dealsToTransition.length} deal(s) ready to transition to operational status`);

    const results = [];

    for (const deal of dealsToTransition) {
      try {
        // Transition deal status to 'operational'
        await deal.update({
          status: 'operational',
        });

        console.log(`[LOCK-IN] ✓ Deal "${deal.title}" (${deal.id}) transitioned to operational status`);

        results.push({
          dealId: deal.id,
          title: deal.title,
          status: 'success',
          lockInEndDate: deal.lock_in_end_date,
        });

        // TODO: Send notifications to investors
        // - Email: "Your investment in [deal] is now tradeable"
        // - Push notification
        // await notifyInvestors(deal.id, 'lock_in_expired');

      } catch (error) {
        console.error(`[LOCK-IN] ✗ Failed to transition deal "${deal.title}":`, error.message);
        results.push({
          dealId: deal.id,
          title: deal.title,
          status: 'error',
          error: error.message,
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    console.log(`[LOCK-IN] Completed: ${successCount}/${dealsToTransition.length} deals transitioned successfully`);

    return {
      success: true,
      processed: successCount,
      results,
    };

  } catch (error) {
    console.error('[LOCK-IN] Error processing lock-in expirations:', error);
    throw error;
  }
}

/**
 * Cron job to check lock-in expirations
 * Runs every day at 1:00 AM
 */
export function startLockInScheduler() {
  // Run every day at 1:00 AM
  cron.schedule('0 1 * * *', async () => {
    console.log('[CRON] Running lock-in expiration checker at', new Date().toISOString());

    try {
      await processLockInExpirations();
    } catch (error) {
      console.error('[CRON] Fatal error in lock-in scheduler:', error);
    }
  });

  console.log('[CRON] Lock-in expiration scheduler started - runs daily at 1:00 AM');
}

/**
 * Manual trigger for testing (can be called via API endpoint)
 */
export async function triggerLockInScheduler() {
  console.log('[MANUAL] Triggering lock-in expiration checker at', new Date().toISOString());

  try {
    const result = await processLockInExpirations();
    return result;
  } catch (error) {
    console.error('[MANUAL] Error triggering lock-in scheduler:', error);
    throw error;
  }
}

export default { startLockInScheduler, triggerLockInScheduler };
