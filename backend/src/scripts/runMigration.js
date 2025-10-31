import { up as upDealSpv, down as downDealSpv } from '../migrations/20251101-update-deal-spv-models.js';
import { up as upLockInDates, down as downLockInDates } from '../migrations/20251101-add-lock-in-dates.js';
import { up as upAutoReinvest, down as downAutoReinvest } from '../migrations/20251101-add-auto-reinvest.js';

const command = process.argv[2];
const migration = process.argv[3]; // 'deal-spv' or 'lock-in-dates' or 'auto-reinvest'

async function main() {
  try {
    if (!migration || !['deal-spv', 'lock-in-dates', 'auto-reinvest', 'all'].includes(migration)) {
      console.log('Usage: node src/scripts/runMigration.js [up|down] [deal-spv|lock-in-dates|auto-reinvest|all]');
      process.exit(1);
    }

    if (command === 'up') {
      console.log('Running migrations UP...\n');

      if (migration === 'deal-spv' || migration === 'all') {
        console.log('=== Running Deal & SPV model updates ===');
        await upDealSpv();
        console.log('✓ Deal & SPV migration completed\n');
      }

      if (migration === 'lock-in-dates' || migration === 'all') {
        console.log('=== Running Lock-in dates migration ===');
        await upLockInDates();
        console.log('✓ Lock-in dates migration completed\n');
      }

      if (migration === 'auto-reinvest' || migration === 'all') {
        console.log('=== Running Auto-reinvest migration ===');
        await upAutoReinvest();
        console.log('✓ Auto-reinvest migration completed\n');
      }

      console.log('All migrations completed successfully!');
    } else if (command === 'down') {
      console.log('Rolling back migrations...\n');

      // Rollback in reverse order
      if (migration === 'auto-reinvest' || migration === 'all') {
        console.log('=== Rolling back Auto-reinvest migration ===');
        await downAutoReinvest();
        console.log('✓ Auto-reinvest rollback completed\n');
      }

      if (migration === 'lock-in-dates' || migration === 'all') {
        console.log('=== Rolling back Lock-in dates migration ===');
        await downLockInDates();
        console.log('✓ Lock-in dates rollback completed\n');
      }

      if (migration === 'deal-spv' || migration === 'all') {
        console.log('=== Rolling back Deal & SPV model updates ===');
        await downDealSpv();
        console.log('✓ Deal & SPV rollback completed\n');
      }

      console.log('All rollbacks completed successfully!');
    } else {
      console.log('Usage: node src/scripts/runMigration.js [up|down] [deal-spv|lock-in-dates|all]');
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

main();
