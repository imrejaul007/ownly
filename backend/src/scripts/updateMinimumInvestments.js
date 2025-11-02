import sequelize from '../config/database.js';

async function updateMinimumInvestments() {
  try {
    console.log('Updating minimum investment amounts...\n');

    // 1. Update Micro Investment Baskets (SIP) to 100 AED
    const [sipResult] = await sequelize.query(`
      UPDATE deals
      SET min_ticket = 100, updated_at = CURRENT_TIMESTAMP
      WHERE category = 'micro_investment_baskets'
      RETURNING id, title, min_ticket
    `);

    console.log(`✓ Updated ${sipResult.length} Micro Investment Baskets (SIP) to min 100 AED`);
    sipResult.forEach(deal => {
      console.log(`  - ${deal.title}: ${deal.min_ticket} AED`);
    });

    // 2. Update Bundles to 2000 AED
    const [bundleResult] = await sequelize.query(`
      UPDATE deals
      SET min_ticket = 2000, updated_at = CURRENT_TIMESTAMP
      WHERE category = 'bundles_thematic'
      RETURNING id, title, min_ticket
    `);

    console.log(`\n✓ Updated ${bundleResult.length} Bundles to min 2,000 AED`);
    bundleResult.forEach(deal => {
      console.log(`  - ${deal.title}: ${deal.min_ticket} AED`);
    });

    // 3. Update all other deals (SVP) to have minimum 500 AED
    // But keep higher minimums if they already exist
    const [svpResult] = await sequelize.query(`
      UPDATE deals
      SET min_ticket = CASE
        WHEN min_ticket < 500 THEN 500
        ELSE min_ticket
      END,
      updated_at = CURRENT_TIMESTAMP
      WHERE category NOT IN ('micro_investment_baskets', 'bundles_thematic')
      RETURNING id, title, category, min_ticket
    `);

    console.log(`\n✓ Updated ${svpResult.length} Regular Deals (SVP) to min 500 AED (or kept higher amounts)`);

    // Group by category
    const byCategory = {};
    svpResult.forEach(deal => {
      if (!byCategory[deal.category]) {
        byCategory[deal.category] = [];
      }
      byCategory[deal.category].push(deal);
    });

    Object.keys(byCategory).sort().forEach(category => {
      console.log(`\n  ${category}:`);
      byCategory[category].forEach(deal => {
        console.log(`    - ${deal.title}: ${deal.min_ticket} AED`);
      });
    });

    console.log('\n✅ All minimum investments updated successfully!');
    console.log('\n📊 Summary:');
    console.log(`   SIP (Micro Investment Baskets): 100 AED minimum`);
    console.log(`   Bundles (Thematic): 2,000 AED minimum`);
    console.log(`   SVP (Regular Deals): 500 AED minimum (or higher for premium deals)`);

  } catch (error) {
    console.error('Error updating minimum investments:', error);
    throw error;
  }
}

// Run the script
updateMinimumInvestments()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

export { updateMinimumInvestments };
