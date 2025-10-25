import cron from 'node-cron';
import { processDuePayouts } from '../controllers/payoutScheduleController.js';

/**
 * Cron job to process due payout schedules
 * Runs every day at 9:00 AM
 */
export function startPayoutScheduler() {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('[CRON] Running payout scheduler at', new Date().toISOString());

    try {
      // Create a mock request/response for the controller
      const mockReq = {
        user: { id: 'system', role: 'admin' },
      };

      const mockRes = {
        status: (code) => ({
          json: (data) => {
            console.log('[CRON] Payout scheduler result:', data);
            return data;
          },
        }),
      };

      const mockNext = (error) => {
        if (error) {
          console.error('[CRON] Error in payout scheduler:', error);
        }
      };

      await processDuePayouts(mockReq, mockRes, mockNext);
    } catch (error) {
      console.error('[CRON] Fatal error in payout scheduler:', error);
    }
  });

  console.log('[CRON] Payout scheduler started - runs daily at 9:00 AM');
}

/**
 * Manual trigger for testing (can be called via API endpoint)
 */
export async function triggerPayoutScheduler() {
  console.log('[MANUAL] Triggering payout scheduler at', new Date().toISOString());

  const mockReq = {
    user: { id: 'manual-trigger', role: 'admin' },
  };

  const results = [];
  const mockRes = {
    status: (code) => ({
      json: (data) => {
        results.push(data);
        return data;
      },
    }),
  };

  const mockNext = (error) => {
    if (error) throw error;
  };

  await processDuePayouts(mockReq, mockRes, mockNext);
  return results[0];
}

export default { startPayoutScheduler, triggerPayoutScheduler };
