import db from '../config/database.js';
import Deal from '../models/Deal.js';
import SPV from '../models/SPV.js';

async function syncDatabase() {
  try {
    await db.authenticate();
    console.log('✅ Database connected\n');

    console.log('🔄 Synchronizing database schema with models...');
    console.log('   Using alter:true to add missing columns without dropping data\n');

    // Sync with alter: true to add new columns without dropping existing data
    await Deal.sync({ alter: true });
    console.log('✅ Deal model synced');

    await SPV.sync({ alter: true });
    console.log('✅ SPV model synced');

    console.log('\n✅ Database schema synchronized successfully!');
    console.log('   All category and subcategory columns have been added.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error.message);
    process.exit(1);
  }
}

syncDatabase();
