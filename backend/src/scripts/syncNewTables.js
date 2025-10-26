import sequelize from '../config/database.js';
import Bundle from '../models/Bundle.js';
import BundleDeal from '../models/BundleDeal.js';
import SIPPlan from '../models/SIPPlan.js';
import SIPSubscription from '../models/SIPSubscription.js';

async function syncNewTables() {
  try {
    console.log('\n🔄 Syncing new Bundle and SIP tables...\n');

    // Sync tables in the correct order (respecting foreign keys)
    await Bundle.sync({ alter: true });
    console.log('✅ Bundles table synced');

    await BundleDeal.sync({ alter: true });
    console.log('✅ Bundle Deals table synced');

    await SIPPlan.sync({ alter: true });
    console.log('✅ SIP Plans table synced');

    await SIPSubscription.sync({ alter: true });
    console.log('✅ SIP Subscriptions table synced');

    console.log('\n✅ All new tables synced successfully!\n');
  } catch (error) {
    console.error('❌ Error syncing tables:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

syncNewTables()
  .then(() => {
    console.log('✅ Sync completed\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  });
