import db from '../config/database.js';
import Deal from '../models/Deal.js';

async function verifyDeals() {
  try {
    await db.authenticate();
    console.log('✅ Database connected\n');

    // Get total count
    const count = await Deal.count();
    console.log('📊 DEAL CREATION SUMMARY');
    console.log('========================');
    console.log(`Total deals in database: ${count}\n`);

    // Get deals by category
    const dealsByCategory = await Deal.findAll({
      attributes: [
        'category',
        [db.fn('COUNT', db.col('id')), 'count']
      ],
      group: ['category'],
      raw: true
    });

    console.log('📁 Deals by Category:');
    dealsByCategory.forEach(item => {
      console.log(`   ${item.category}: ${item.count} deals`);
    });

    // Get sample deals
    console.log('\n🔍 Sample of recently created deals:');
    const sampleDeals = await Deal.findAll({
      attributes: ['title', 'category', 'subcategory', 'min_ticket', 'expected_roi'],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    sampleDeals.forEach(deal => {
      console.log(`\n  • ${deal.title}`);
      console.log(`    Category: ${deal.category}`);
      console.log(`    Subcategory: ${deal.subcategory}`);
      console.log(`    Min Investment: AED ${deal.min_ticket}`);
      console.log(`    Expected ROI: ${deal.expected_roi}%`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyDeals();
