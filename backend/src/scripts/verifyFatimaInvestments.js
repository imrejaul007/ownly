import { Investment, Deal, User, Wallet } from '../models/index.js';

async function verify() {
  try {
    const fatima = await User.findOne({ where: { email: 'fatima.alhashimi@example.ae' } });

    const investments = await Investment.findAll({
      where: { user_id: fatima.id },
      include: [{ model: Deal, as: 'deal' }],
      order: [['created_at', 'DESC']]
    });

    console.log('\n📊 Fatima\'s Investment Portfolio:\n');
    console.log('Total Investments:', investments.length);

    let totalInvested = 0;
    const categories = { real_estate: 0, franchise: 0, startup: 0, asset: 0 };

    investments.slice(0, 12).forEach((inv, idx) => {
      const deal = inv.deal;
      console.log(`\n${idx + 1}. ${deal.title}`);
      console.log(`   Type: ${deal.type}`);
      console.log(`   Amount: AED ${inv.amount.toLocaleString()}`);
      console.log(`   Shares: ${inv.shares_issued}`);
      console.log(`   ROI: ${deal.expected_roi}%`);
      totalInvested += parseFloat(inv.amount);
      categories[deal.type] = (categories[deal.type] || 0) + 1;
    });

    console.log('\n\n💰 Summary:');
    console.log('Total Invested: AED', totalInvested.toLocaleString());
    console.log('\nBreakdown by Category:');
    console.log('  Real Estate:', categories.real_estate, 'deals');
    console.log('  Franchise:', categories.franchise, 'deals');
    console.log('  Startups:', categories.startup, 'deals');
    console.log('  Luxury Assets:', categories.asset, 'deals');

    const wallet = await Wallet.findOne({ where: { user_id: fatima.id } });
    console.log('\n🔄 Wallet Balance:');
    console.log('  Available:', wallet.balance_dummy?.available || 0);
    console.log('  Invested:', wallet.balance_dummy?.invested || 0);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

verify();
