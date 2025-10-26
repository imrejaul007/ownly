import { User, Deal, Bundle, BundleDeal, SIPPlan, SIPSubscription, Investment, SPV, PaymentMethod } from '../models/index.js';
import sequelize from '../config/database.js';

async function seedBundlesAndSIP() {
  try {
    console.log('\n🌱 Starting Bundles and SIP Plans seed...\n');

    // Find Fatima's user
    const fatima = await User.findOne({
      where: { email: 'fatima.alhashimi@example.ae' }
    });

    if (!fatima) {
      console.error('❌ Fatima user not found!');
      process.exit(1);
    }

    console.log(`✅ Found Fatima: ${fatima.first_name} ${fatima.last_name} (${fatima.id})`);

    // Find admin user for creating bundles
    const admin = await User.findOne({
      where: { email: 'admin@ownly.ae' }
    });

    if (!admin) {
      console.error('❌ Admin user not found!');
      process.exit(1);
    }

    console.log(`✅ Found Admin: ${admin.email} (${admin.id})`);

    // Get some existing deals to add to bundles
    const deals = await Deal.findAll({
      where: { status: 'open' },
      limit: 8,
      include: [
        {
          model: SPV,
          as: 'spv'
        }
      ]
    });

    if (deals.length < 4) {
      console.error('❌ Not enough deals found. Need at least 4 open deals.');
      process.exit(1);
    }

    console.log(`✅ Found ${deals.length} deals to work with\n`);

    // ===== CREATE BUNDLE 1: Retail Mix Bundle =====
    console.log('📦 Creating Bundle 1: Retail Mix Bundle...');

    const retailBundle = await Bundle.create({
      name: 'Retail Mix Bundle',
      slug: 'retail-mix-bundle',
      description: 'Diversified portfolio of retail and franchise opportunities across Dubai and Abu Dhabi. Includes premium coffee shops, fast food franchises, and retail stores in high-traffic locations. Balanced risk with steady monthly returns.',
      bundle_type: 'category_based',
      category: 'retail_mix',
      min_investment: 50000,
      target_amount: 5000000,
      raised_amount: 0,
      expected_roi_min: 22,
      expected_roi_max: 35,
      holding_period_months: 36,
      risk_level: 'medium',
      diversification_score: 85,
      status: 'open',
      features: [
        'Diversified across 4 retail assets',
        'High-traffic locations',
        'Professional management',
        'Monthly dividend payouts',
        'Exit flexibility after 12 months'
      ],
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'
      ],
      created_by: admin.id,
    });

    // Add deals to retail bundle with allocations
    const retailDeals = [
      { deal: deals[0], allocation: 30, weight: 2, is_core: true },
      { deal: deals[1], allocation: 30, weight: 2, is_core: true },
      { deal: deals[2], allocation: 25, weight: 1, is_core: false },
      { deal: deals[3], allocation: 15, weight: 1, is_core: false },
    ];

    for (const { deal, allocation, weight, is_core } of retailDeals) {
      await BundleDeal.create({
        bundle_id: retailBundle.id,
        deal_id: deal.id,
        allocation_percentage: allocation,
        weight,
        is_core,
      });
    }

    console.log(`  ✅ Created Retail Mix Bundle with ${retailDeals.length} deals`);
    console.log(`     - Min Investment: AED ${retailBundle.min_investment.toLocaleString()}`);
    console.log(`     - Expected ROI: ${retailBundle.expected_roi_min}% - ${retailBundle.expected_roi_max}%`);
    console.log(`     - Holding Period: ${retailBundle.holding_period_months} months\n`);

    // ===== CREATE BUNDLE 2: Balanced Growth Basket =====
    console.log('📦 Creating Bundle 2: Balanced Growth Basket...');

    const balancedBundle = await Bundle.create({
      name: 'Balanced Growth Basket',
      slug: 'balanced-growth-basket',
      description: 'Carefully curated mix of real estate flips, rental properties, and development projects. Optimized for balanced growth with a mix of quick returns and long-term appreciation. Ideal for investors seeking stability with growth potential.',
      bundle_type: 'roi_based',
      category: 'balanced_basket',
      min_investment: 100000,
      target_amount: 10000000,
      raised_amount: 0,
      expected_roi_min: 28,
      expected_roi_max: 45,
      holding_period_months: 48,
      risk_level: 'medium',
      diversification_score: 92,
      status: 'open',
      features: [
        'Mix of flips, rentals, and developments',
        'Quarterly rebalancing',
        'Professional asset management',
        'Monthly performance reports',
        'Tax-optimized structure'
      ],
      images: [
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
        'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800'
      ],
      created_by: admin.id,
    });

    // Add deals to balanced bundle with allocations
    const balancedDeals = deals.length >= 8 ? [
      { deal: deals[4], allocation: 35, weight: 3, is_core: true },
      { deal: deals[5], allocation: 30, weight: 2, is_core: true },
      { deal: deals[6], allocation: 20, weight: 1, is_core: false },
      { deal: deals[7], allocation: 15, weight: 1, is_core: false },
    ] : [
      { deal: deals[0], allocation: 35, weight: 3, is_core: true },
      { deal: deals[1], allocation: 30, weight: 2, is_core: true },
      { deal: deals[2], allocation: 20, weight: 1, is_core: false },
      { deal: deals[3], allocation: 15, weight: 1, is_core: false },
    ];

    for (const { deal, allocation, weight, is_core } of balancedDeals) {
      await BundleDeal.create({
        bundle_id: balancedBundle.id,
        deal_id: deal.id,
        allocation_percentage: allocation,
        weight,
        is_core,
      });
    }

    console.log(`  ✅ Created Balanced Growth Basket with ${balancedDeals.length} deals`);
    console.log(`     - Min Investment: AED ${balancedBundle.min_investment.toLocaleString()}`);
    console.log(`     - Expected ROI: ${balancedBundle.expected_roi_min}% - ${balancedBundle.expected_roi_max}%`);
    console.log(`     - Holding Period: ${balancedBundle.holding_period_months} months\n`);

    // ===== CREATE SIP PLAN 1: OWNLY SmartSaver =====
    console.log('💰 Creating SIP Plan 1: OWNLY SmartSaver...');

    const smartSaverPlan = await SIPPlan.create({
      name: 'OWNLY SmartSaver',
      slug: 'ownly-smartsaver',
      description: 'Start your wealth journey with as little as AED 1,000 per month. This conservative SIP plan automatically invests in our Retail Mix Bundle, perfect for first-time investors looking for steady, predictable returns.',
      plan_type: 'conservative',
      monthly_amount_min: 1000,
      monthly_amount_max: 10000,
      duration_months_min: 12,
      duration_months_max: 60,
      expected_roi_min: 18,
      expected_roi_max: 28,
      bundle_id: retailBundle.id,
      auto_rebalance: true,
      auto_compound: false,
      risk_level: 'low',
      status: 'active',
      features: [
        'As low as AED 1,000/month',
        'Auto-invest in Retail Mix Bundle',
        'Monthly dividend payouts',
        'Pause/resume anytime',
        'No lock-in period',
        'Professional portfolio management'
      ],
      allocation_strategy: {
        type: 'fixed_bundle',
        bundle_id: retailBundle.id,
        rebalance_frequency: 'quarterly'
      },
      images: [
        'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800'
      ],
    });

    console.log(`  ✅ Created OWNLY SmartSaver SIP Plan`);
    console.log(`     - Monthly: AED ${smartSaverPlan.monthly_amount_min.toLocaleString()} - ${smartSaverPlan.monthly_amount_max.toLocaleString()}`);
    console.log(`     - Duration: ${smartSaverPlan.duration_months_min} - ${smartSaverPlan.duration_months_max} months`);
    console.log(`     - Expected ROI: ${smartSaverPlan.expected_roi_min}% - ${smartSaverPlan.expected_roi_max}%\n`);

    // ===== CREATE SIP PLAN 2: OWNLY Growth+ =====
    console.log('💰 Creating SIP Plan 2: OWNLY Growth+...');

    const growthPlusPlan = await SIPPlan.create({
      name: 'OWNLY Growth+',
      slug: 'ownly-growth-plus',
      description: 'Accelerated wealth creation through our Balanced Growth Basket. Invest AED 5,000 or more monthly in a diversified portfolio of high-growth assets. Ideal for experienced investors seeking maximum returns.',
      plan_type: 'aggressive',
      monthly_amount_min: 5000,
      monthly_amount_max: 50000,
      duration_months_min: 24,
      duration_months_max: 60,
      expected_roi_min: 28,
      expected_roi_max: 45,
      bundle_id: balancedBundle.id,
      auto_rebalance: true,
      auto_compound: true,
      risk_level: 'medium',
      status: 'active',
      features: [
        'Starting from AED 5,000/month',
        'Auto-invest in Balanced Growth Basket',
        'Compound interest option',
        'Quarterly rebalancing',
        'Priority exit options',
        'Dedicated relationship manager'
      ],
      allocation_strategy: {
        type: 'fixed_bundle',
        bundle_id: balancedBundle.id,
        rebalance_frequency: 'quarterly',
        compound_enabled: true
      },
      images: [
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800'
      ],
    });

    console.log(`  ✅ Created OWNLY Growth+ SIP Plan`);
    console.log(`     - Monthly: AED ${growthPlusPlan.monthly_amount_min.toLocaleString()} - ${growthPlusPlan.monthly_amount_max.toLocaleString()}`);
    console.log(`     - Duration: ${growthPlusPlan.duration_months_min} - ${growthPlusPlan.duration_months_max} months`);
    console.log(`     - Expected ROI: ${growthPlusPlan.expected_roi_min}% - ${growthPlusPlan.expected_roi_max}%\n`);

    // ===== CREATE FATIMA'S BUNDLE INVESTMENT 1 =====
    console.log('💳 Creating investment for Fatima in Retail Mix Bundle...');

    const retailInvestment = await Investment.create({
      user_id: fatima.id,
      deal_id: deals[0].id,
      spv_id: deals[0].spv.id,
      bundle_id: retailBundle.id,
      amount: 100000,
      shares_issued: Math.floor(100000 / (deals[0].share_price || 1)),
      share_price: deals[0].share_price || 1,
      status: 'confirmed',
      invested_at: new Date(),
      confirmed_at: new Date(),
    });

    // Update bundle raised amount
    await retailBundle.update({
      raised_amount: parseFloat(retailBundle.raised_amount) + 100000
    });

    console.log(`  ✅ Created AED 100,000 investment in Retail Mix Bundle for Fatima\n`);

    // ===== CREATE FATIMA'S BUNDLE INVESTMENT 2 =====
    console.log('💳 Creating investment for Fatima in Balanced Growth Basket...');

    const balancedInvestment = await Investment.create({
      user_id: fatima.id,
      deal_id: balancedDeals[0].deal.id,
      spv_id: balancedDeals[0].deal.spv.id,
      bundle_id: balancedBundle.id,
      amount: 150000,
      shares_issued: Math.floor(150000 / (balancedDeals[0].deal.share_price || 1)),
      share_price: balancedDeals[0].deal.share_price || 1,
      status: 'confirmed',
      invested_at: new Date(),
      confirmed_at: new Date(),
    });

    // Update bundle raised amount
    await balancedBundle.update({
      raised_amount: parseFloat(balancedBundle.raised_amount) + 150000
    });

    console.log(`  ✅ Created AED 150,000 investment in Balanced Growth Basket for Fatima\n`);

    // ===== CREATE FATIMA'S SIP SUBSCRIPTION 1 =====
    console.log('📅 Creating SIP subscription for Fatima - OWNLY SmartSaver...');

    const startDate1 = new Date('2025-01-01');
    const endDate1 = new Date('2026-01-01');
    const nextDebit1 = new Date('2025-02-01');

    const sipSub1 = await SIPSubscription.create({
      user_id: fatima.id,
      plan_id: smartSaverPlan.id,
      monthly_amount: 3000,
      duration_months: 12,
      start_date: startDate1,
      end_date: endDate1,
      next_debit_date: nextDebit1,
      total_invested: 3000,
      total_installments: 1,
      current_value: 3000,
      returns_earned: 0,
      status: 'active',
      auto_compound: false,
    });

    console.log(`  ✅ Created SmartSaver subscription: AED 3,000/month for 12 months`);
    console.log(`     - Start: ${startDate1.toLocaleDateString()}`);
    console.log(`     - Next Debit: ${nextDebit1.toLocaleDateString()}\n`);

    // ===== CREATE FATIMA'S SIP SUBSCRIPTION 2 =====
    console.log('📅 Creating SIP subscription for Fatima - OWNLY Growth+...');

    const startDate2 = new Date('2025-01-15');
    const endDate2 = new Date('2027-01-15');
    const nextDebit2 = new Date('2025-02-15');

    const sipSub2 = await SIPSubscription.create({
      user_id: fatima.id,
      plan_id: growthPlusPlan.id,
      monthly_amount: 10000,
      duration_months: 24,
      start_date: startDate2,
      end_date: endDate2,
      next_debit_date: nextDebit2,
      total_invested: 10000,
      total_installments: 1,
      current_value: 10000,
      returns_earned: 0,
      status: 'active',
      auto_compound: true,
    });

    console.log(`  ✅ Created Growth+ subscription: AED 10,000/month for 24 months`);
    console.log(`     - Start: ${startDate2.toLocaleDateString()}`);
    console.log(`     - Next Debit: ${nextDebit2.toLocaleDateString()}`);
    console.log(`     - Auto-compound: Enabled\n`);

    // ===== SUMMARY =====
    console.log('═══════════════════════════════════════════════');
    console.log('✅ SEED COMPLETE - Summary:');
    console.log('═══════════════════════════════════════════════');
    console.log(`\n📦 BUNDLES CREATED:`);
    console.log(`   1. ${retailBundle.name} (${retailDeals.length} deals)`);
    console.log(`   2. ${balancedBundle.name} (${balancedDeals.length} deals)`);
    console.log(`\n💰 SIP PLANS CREATED:`);
    console.log(`   1. ${smartSaverPlan.name} - AED ${smartSaverPlan.monthly_amount_min}-${smartSaverPlan.monthly_amount_max}/mo`);
    console.log(`   2. ${growthPlusPlan.name} - AED ${growthPlusPlan.monthly_amount_min}-${growthPlusPlan.monthly_amount_max}/mo`);
    console.log(`\n💳 FATIMA'S INVESTMENTS:`);
    console.log(`   1. ${retailBundle.name} - AED 100,000`);
    console.log(`   2. ${balancedBundle.name} - AED 150,000`);
    console.log(`\n📅 FATIMA'S SIP SUBSCRIPTIONS:`);
    console.log(`   1. ${smartSaverPlan.name} - AED 3,000/month x 12 months`);
    console.log(`   2. ${growthPlusPlan.name} - AED 10,000/month x 24 months`);
    console.log(`\n🎯 Total Monthly SIP: AED 13,000`);
    console.log(`💰 Total Bundle Investments: AED 250,000`);
    console.log('═══════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error seeding bundles and SIP:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the seed
seedBundlesAndSIP()
  .then(() => {
    console.log('✅ Seed completed successfully\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
