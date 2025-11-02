import sequelize from '../config/database.js';
import { User, CopyTrader, Deal, SPV, Investment, InvestorBundle, SIPPlan, Wallet } from '../models/index.js';
import bcrypt from 'bcryptjs';

const createCopyTradingData = async () => {
  try {
    console.log('🚀 Starting copy trading data creation...\n');

    // Clean up existing copy trading data
    console.log('Cleaning up existing copy trading data...');
    const existingTraderEmails = [
      'ahmed.realestate@ownly.ae',
      'sarah.franchise@ownly.ae',
      'omar.tech@ownly.ae',
      'fatima.balanced@ownly.ae',
    ];

    const existingUsers = await User.findAll({ where: { email: existingTraderEmails } });
    const userIds = existingUsers.map(u => u.id);

    if (userIds.length > 0) {
      // Get all deals created by these users
      const dealIds = await Deal.findAll({
        where: { created_by: userIds },
        attributes: ['id']
      });
      const dealIdList = dealIds.map(d => d.id);

      if (dealIdList.length > 0) {
        // Delete in proper order
        await sequelize.query('DELETE FROM investments WHERE deal_id IN (:dealIds)', {
          replacements: { dealIds: dealIdList }
        });
        await sequelize.query('DELETE FROM spvs WHERE deal_id IN (:dealIds)', {
          replacements: { dealIds: dealIdList }
        });
        await sequelize.query('DELETE FROM deals WHERE id IN (:dealIds)', {
          replacements: { dealIds: dealIdList }
        });
      }

      // Delete user investments
      await sequelize.query('DELETE FROM investments WHERE user_id IN (:userIds)', {
        replacements: { userIds }
      });

      // Delete copy trading records
      const traderIds = await CopyTrader.findAll({
        where: { user_id: userIds },
        attributes: ['id']
      });
      const traderIdList = traderIds.map(t => t.id);

      if (traderIdList.length > 0) {
        const bundleIds = await InvestorBundle.findAll({
          where: { trader_id: traderIdList },
          attributes: ['id']
        });
        const bundleIdList = bundleIds.map(b => b.id);

        if (bundleIdList.length > 0) {
          await sequelize.query('DELETE FROM sip_plans WHERE bundle_id IN (:bundleIds)', {
            replacements: { bundleIds: bundleIdList }
          });
        }
        await sequelize.query('DELETE FROM investor_bundles WHERE trader_id IN (:traderIds)', {
          replacements: { traderIds: traderIdList }
        });
        await sequelize.query('DELETE FROM copy_traders WHERE user_id IN (:userIds)', {
          replacements: { userIds }
        });
      }
    }
    console.log('✓ Cleanup complete\n');

    // Trader 1: Real Estate Mogul
    console.log('Creating Trader 1: Real Estate Mogul...');
    let trader1User = await User.findOne({ where: { email: 'ahmed.realestate@ownly.ae' } });
    if (!trader1User) {
      trader1User = await User.create({
        name: 'Ahmed Al Mansoori',
        email: 'ahmed.realestate@ownly.ae',
        password: await bcrypt.hash('password123', 10),
        role: 'investor_hni',
        kyc_status: 'approved',
      });
      await Wallet.create({ user_id: trader1User.id, balance_dummy: 500000 });
    }

    const trader1 = await CopyTrader.create({
      user_id: trader1User.id,
      is_active: true,
      bio: 'Real estate investment specialist with 10+ years of experience. Focus on high-yield commercial properties and luxury residential developments across UAE.',
      specialty: ['Real Estate', 'Commercial Properties', 'Luxury Residential'],
      min_copy_amount: 5000,
      commission_rate: 5,
      total_copiers_count: 0,
      total_return: 156.8,
      monthly_return: 12.4,
      win_rate: 94,
      risk_level: 'medium',
    });

    // Helper function to create slug
    const createSlug = (title) => {
      return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    };

    // Helper function to generate SPV code
    let spvCounter = 1;
    const generateSpvCode = () => {
      const year = new Date().getFullYear();
      const code = `SPV-${year}-${String(spvCounter).padStart(4, '0')}`;
      spvCounter++;
      return code;
    };

    // Create deals for Trader 1
    const deal1_1 = await Deal.create({
      title: 'Dubai Marina Luxury Tower',
      slug: 'dubai-marina-luxury-tower',
      description: 'Premium residential tower in Dubai Marina with guaranteed rental yields',
      type: 'real_estate',
      category: 'real_estate',
      subcategory: 'luxury_apartments',
      status: 'funding',
      target_amount: 5000000,
      raised_amount: 3200000,
      min_ticket: 10000,
      max_ticket: 500000,
      expected_roi: 28.5,
      holding_period_months: 24,
      risk_level: 'medium',
      investor_count: 32,
      allocation_direct_sale_pct: 60,
      direct_sale_raised: 1920000,
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'],
      created_by: trader1User.id,
    });

    const deal1_2 = await Deal.create({
      title: 'Business Bay Office Complex',
      slug: 'business-bay-office-complex',
      description: 'Grade A office space with pre-leased tenants',
      type: 'real_estate',
      category: 'real_estate',
      subcategory: 'office',
      status: 'funding',
      target_amount: 8000000,
      raised_amount: 5600000,
      min_ticket: 15000,
      max_ticket: 750000,
      expected_roi: 32.0,
      holding_period_months: 36,
      risk_level: 'medium',
      investor_count: 45,
      allocation_direct_sale_pct: 60,
      direct_sale_raised: 3360000,
      images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'],
      created_by: trader1User.id,
    });

    const deal1_3 = await Deal.create({
      title: 'Palm Jumeirah Villa',
      slug: 'palm-jumeirah-villa',
      description: 'Exclusive villa with private beach access',
      type: 'real_estate',
      category: 'real_estate',
      subcategory: 'villas',
      status: 'funding',
      target_amount: 12000000,
      raised_amount: 8400000,
      min_ticket: 25000,
      max_ticket: 1000000,
      expected_roi: 25.5,
      holding_period_months: 30,
      risk_level: 'low',
      investor_count: 28,
      allocation_direct_sale_pct: 60,
      direct_sale_raised: 5040000,
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811'],
      created_by: trader1User.id,
    });

    // Create SPVs and Investments for Trader 1
    for (const deal of [deal1_1, deal1_2, deal1_3]) {
      const spv = await SPV.create({
        deal_id: deal.id,
        spv_name: `${deal.title} SPV`,
        spv_code: generateSpvCode(),
        status: 'active',
        share_price: 100,
        total_shares: deal.target_amount / 100,
        issued_shares: deal.raised_amount / 100,
        escrow_balance: deal.raised_amount,
      });

      await Investment.create({
        user_id: trader1User.id,
        spv_id: spv.id,
        deal_id: deal.id,
        amount: 50000,
        shares_issued: 500,
        share_price: 100,
        status: 'active',
        invested_at: new Date(),
        confirmed_at: new Date(),
        current_value: 50000 * (1 + deal.expected_roi / 100 / 2),
      });
    }

    // Create bundle for Trader 1
    const bundle1 = await InvestorBundle.create({
      trader_id: trader1.id,
      name: 'Premium Real Estate Portfolio',
      description: 'Diversified portfolio of high-end residential and commercial properties across prime Dubai locations',
      deal_ids: [deal1_1.id, deal1_2.id, deal1_3.id],
      is_active: true,
      min_copy_amount: 15000,
      total_copiers: 0,
      category: 'real_estate',
    });

    // Create SIP plan for Trader 1
    await SIPPlan.create({
      name: 'Real Estate Growth SIP',
      slug: 'real-estate-growth-sip',
      description: 'Systematic investment in premium real estate deals',
      plan_type: 'balanced',
      monthly_amount_min: 5000,
      duration_months_min: 12,
      expected_roi_min: 25.0,
      expected_roi_max: 30.0,
      risk_level: 'medium',
      status: 'active',
    });

    // Trader 2: Franchise Expert
    console.log('\nCreating Trader 2: Franchise Expert...');
    let trader2User = await User.findOne({ where: { email: 'sarah.franchise@ownly.ae' } });
    if (!trader2User) {
      trader2User = await User.create({
        name: 'Sarah Al Hashimi',
        email: 'sarah.franchise@ownly.ae',
        password: await bcrypt.hash('password123', 10),
        role: 'investor_hni',
        kyc_status: 'approved',
      });
      await Wallet.create({ user_id: trader2User.id, balance_dummy: 400000 });
    }

    const trader2 = await CopyTrader.create({
      user_id: trader2User.id,
      is_active: true,
      bio: 'Franchise investment specialist focusing on F&B and retail franchises. Track record of identifying high-growth franchise opportunities.',
      specialty: ['Franchises', 'F&B', 'Retail'],
      min_copy_amount: 3000,
      commission_rate: 4.5,
      total_copiers_count: 0,
      total_return: 142.3,
      monthly_return: 11.8,
      win_rate: 91,
      risk_level: 'low',
    });

    // Create deals for Trader 2
    const deal2_1 = await Deal.create({
      title: 'Premium Coffee Chain - 5 Outlets',
      slug: 'premium-coffee-chain-5-outlets',
      description: 'Established coffee franchise with proven business model',
      type: 'franchise',
      category: 'food_beverage',
      subcategory: 'coffee_shop',
      status: 'funding',
      target_amount: 2500000,
      raised_amount: 1750000,
      min_ticket: 5000,
      max_ticket: 250000,
      expected_roi: 35.2,
      holding_period_months: 18,
      risk_level: 'low',
      investor_count: 38,
      allocation_direct_sale_pct: 60,
      direct_sale_raised: 1050000,
      images: ['https://images.unsplash.com/photo-1453614512568-c4024d13c247'],
      created_by: trader2User.id,
    });

    const deal2_2 = await Deal.create({
      title: 'Fast Food Franchise - Mall Locations',
      slug: 'fast-food-franchise-mall-locations',
      description: 'Popular fast food brand with 3 mall locations',
      type: 'franchise',
      category: 'food_beverage',
      subcategory: 'restaurant',
      status: 'funding',
      target_amount: 3000000,
      raised_amount: 2100000,
      min_ticket: 8000,
      max_ticket: 300000,
      expected_roi: 42.5,
      holding_period_months: 24,
      risk_level: 'medium',
      investor_count: 42,
      allocation_direct_sale_pct: 60,
      direct_sale_raised: 1260000,
      images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1'],
      created_by: trader2User.id,
    });

    const deal2_3 = await Deal.create({
      title: 'Fitness Franchise Network',
      slug: 'fitness-franchise-network',
      description: 'Growing fitness franchise with 4 locations',
      type: 'franchise',
      category: 'health_wellness',
      subcategory: 'gym',
      status: 'funding',
      target_amount: 1800000,
      raised_amount: 1260000,
      min_ticket: 4000,
      max_ticket: 180000,
      expected_roi: 38.7,
      holding_period_months: 20,
      risk_level: 'low',
      investor_count: 35,
      allocation_direct_sale_pct: 60,
      direct_sale_raised: 756000,
      images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48'],
      created_by: trader2User.id,
    });

    // Create SPVs and Investments for Trader 2
    for (const deal of [deal2_1, deal2_2, deal2_3]) {
      const spv = await SPV.create({
        deal_id: deal.id,
        spv_name: `${deal.title} SPV`,
        spv_code: generateSpvCode(),
        status: 'active',
        share_price: 100,
        total_shares: deal.target_amount / 100,
        issued_shares: deal.raised_amount / 100,
        escrow_balance: deal.raised_amount,
      });

      await Investment.create({
        user_id: trader2User.id,
        spv_id: spv.id,
        deal_id: deal.id,
        amount: 40000,
        shares_issued: 400,
        share_price: 100,
        status: 'active',
        invested_at: new Date(),
        confirmed_at: new Date(),
        current_value: 40000 * (1 + deal.expected_roi / 100 / 2),
      });
    }

    // Create bundle for Trader 2
    const bundle2 = await InvestorBundle.create({
      trader_id: trader2.id,
      name: 'Franchise Success Portfolio',
      description: 'Curated selection of proven franchise opportunities in F&B and retail sectors',
      deal_ids: [deal2_1.id, deal2_2.id, deal2_3.id],
      is_active: true,
      min_copy_amount: 10000,
      total_copiers: 0,
      category: 'franchise',
    });

    // Create SIP plan for Trader 2
    await SIPPlan.create({
      name: 'Franchise Builder SIP',
      slug: 'franchise-builder-sip',
      description: 'Build wealth through systematic franchise investments',
      plan_type: 'conservative',
      monthly_amount_min: 3000,
      duration_months_min: 24,
      expected_roi_min: 18.0,
      expected_roi_max: 24.0,
      risk_level: 'low',
      status: 'active',
    });

    // Trader 3: Tech Investor
    console.log('\nCreating Trader 3: Tech Investor...');
    let trader3User = await User.findOne({ where: { email: 'omar.tech@ownly.ae' } });
    if (!trader3User) {
      trader3User = await User.create({
        name: 'Omar Al Falasi',
        email: 'omar.tech@ownly.ae',
        password: await bcrypt.hash('password123', 10),
        role: 'investor_hni',
        kyc_status: 'approved',
      });
      await Wallet.create({ user_id: trader3User.id, balance_dummy: 750000 });
    }

    const trader3 = await CopyTrader.create({
      user_id: trader3User.id,
      is_active: true,
      bio: 'Technology and startup investment expert. Specializing in high-growth tech startups and innovative business models in MENA region.',
      specialty: ['Startups', 'Technology', 'Innovation'],
      min_copy_amount: 10000,
      commission_rate: 6,
      total_copiers_count: 0,
      total_return: 198.5,
      monthly_return: 15.2,
      win_rate: 87,
      risk_level: 'high',
    });

    // Create deals for Trader 3
    const deal3_1 = await Deal.create({
      title: 'FinTech Payment Platform',
      slug: 'fintech-payment-platform',
      description: 'Revolutionary payment solution for MENA market',
      type: 'startup',
      category: 'technology_innovation',
      subcategory: 'fintech',
      status: 'funding',
      target_amount: 4000000,
      raised_amount: 2800000,
      min_ticket: 15000,
      max_ticket: 400000,
      expected_roi: 68.5,
      holding_period_months: 36,
      risk_level: 'high',
      investor_count: 28,
      allocation_direct_sale_pct: 60,
      direct_sale_raised: 1680000,
      images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3'],
      created_by: trader3User.id,
    });

    const deal3_2 = await Deal.create({
      title: 'AI-Powered E-commerce Platform',
      slug: 'ai-powered-e-commerce-platform',
      description: 'Next-gen e-commerce with AI recommendations',
      type: 'startup',
      category: 'technology_innovation',
      subcategory: 'e_commerce',
      status: 'funding',
      target_amount: 3500000,
      raised_amount: 2450000,
      min_ticket: 12000,
      max_ticket: 350000,
      expected_roi: 72.3,
      holding_period_months: 42,
      risk_level: 'high',
      investor_count: 25,
      allocation_direct_sale_pct: 60,
      direct_sale_raised: 1470000,
      images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f'],
      created_by: trader3User.id,
    });

    const deal3_3 = await Deal.create({
      title: 'HealthTech Telemedicine App',
      slug: 'healthtech-telemedicine-app',
      description: 'Comprehensive telemedicine platform for UAE',
      type: 'startup',
      category: 'health_wellness',
      subcategory: 'telemedicine',
      status: 'funding',
      target_amount: 2800000,
      raised_amount: 1960000,
      min_ticket: 10000,
      max_ticket: 280000,
      expected_roi: 55.8,
      holding_period_months: 30,
      risk_level: 'high',
      investor_count: 22,
      allocation_direct_sale_pct: 60,
      direct_sale_raised: 1176000,
      images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d'],
      created_by: trader3User.id,
    });

    // Create SPVs and Investments for Trader 3
    for (const deal of [deal3_1, deal3_2, deal3_3]) {
      const spv = await SPV.create({
        deal_id: deal.id,
        spv_name: `${deal.title} SPV`,
        spv_code: generateSpvCode(),
        status: 'active',
        share_price: 100,
        total_shares: deal.target_amount / 100,
        issued_shares: deal.raised_amount / 100,
        escrow_balance: deal.raised_amount,
      });

      await Investment.create({
        user_id: trader3User.id,
        spv_id: spv.id,
        deal_id: deal.id,
        amount: 75000,
        shares_issued: 750,
        share_price: 100,
        status: 'active',
        invested_at: new Date(),
        confirmed_at: new Date(),
        current_value: 75000 * (1 + deal.expected_roi / 100 / 2),
      });
    }

    // Create bundle for Trader 3
    const bundle3 = await InvestorBundle.create({
      trader_id: trader3.id,
      name: 'Tech Unicorn Portfolio',
      description: 'High-growth technology startups with unicorn potential',
      deal_ids: [deal3_1.id, deal3_2.id, deal3_3.id],
      is_active: true,
      min_copy_amount: 25000,
      total_copiers: 0,
      category: 'technology',
    });

    // Create SIP plan for Trader 3
    await SIPPlan.create({
      name: 'Tech Growth Accelerator SIP',
      slug: 'tech-growth-accelerator-sip',
      description: 'Aggressive growth through tech startup investments',
      plan_type: 'aggressive',
      monthly_amount_min: 10000,
      duration_months_min: 36,
      expected_roi_min: 35.0,
      expected_roi_max: 50.0,
      risk_level: 'high',
      status: 'active',
    });

    // Trader 4: Balanced Investor
    console.log('\nCreating Trader 4: Balanced Investor...');
    let trader4User = await User.findOne({ where: { email: 'fatima.balanced@ownly.ae' } });
    if (!trader4User) {
      trader4User = await User.create({
        name: 'Fatima Al Zaabi',
        email: 'fatima.balanced@ownly.ae',
        password: await bcrypt.hash('password123', 10),
        role: 'investor_hni',
        kyc_status: 'approved',
      });
      await Wallet.create({ user_id: trader4User.id, balance_dummy: 600000 });
    }

    const trader4 = await CopyTrader.create({
      user_id: trader4User.id,
      is_active: true,
      bio: 'Conservative investor with balanced portfolio approach. Focus on stable returns with minimal risk across multiple sectors.',
      specialty: ['Balanced Portfolio', 'Risk Management', 'Diversification'],
      min_copy_amount: 2000,
      commission_rate: 3.5,
      total_copiers_count: 0,
      total_return: 128.7,
      monthly_return: 9.8,
      win_rate: 96,
      risk_level: 'low',
    });

    // Create diverse deals for Trader 4
    const deal4_1 = await Deal.create({
      title: 'Retail Shopping Center',
      slug: 'retail-shopping-center',
      description: 'Established shopping center with stable tenant base',
      type: 'real_estate',
      category: 'real_estate',
      subcategory: 'retail',
      status: 'funding',
      target_amount: 6000000,
      raised_amount: 4200000,
      min_ticket: 8000,
      max_ticket: 600000,
      expected_roi: 22.5,
      holding_period_months: 24,
      risk_level: 'low',
      investor_count: 48,
      allocation_direct_sale_pct: 60,
      direct_sale_raised: 2520000,
      images: ['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a'],
      created_by: trader4User.id,
    });

    const deal4_2 = await Deal.create({
      title: 'Restaurant Franchise - Chain',
      slug: 'restaurant-franchise-chain',
      description: 'Well-established restaurant franchise',
      type: 'franchise',
      category: 'food_beverage',
      subcategory: 'restaurant',
      status: 'funding',
      target_amount: 2200000,
      raised_amount: 1540000,
      min_ticket: 5000,
      max_ticket: 220000,
      expected_roi: 28.3,
      holding_period_months: 18,
      risk_level: 'low',
      investor_count: 32,
      allocation_direct_sale_pct: 60,
      direct_sale_raised: 924000,
      images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'],
      created_by: trader4User.id,
    });

    const deal4_3 = await Deal.create({
      title: 'Educational Technology Platform',
      slug: 'educational-technology-platform',
      description: 'Established EdTech platform with steady growth',
      type: 'startup',
      category: 'education_training',
      subcategory: 'edtech',
      status: 'funding',
      target_amount: 1500000,
      raised_amount: 1050000,
      min_ticket: 4000,
      max_ticket: 150000,
      expected_roi: 32.5,
      holding_period_months: 24,
      risk_level: 'medium',
      investor_count: 28,
      allocation_direct_sale_pct: 60,
      direct_sale_raised: 630000,
      images: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b'],
      created_by: trader4User.id,
    });

    // Create SPVs and Investments for Trader 4
    for (const deal of [deal4_1, deal4_2, deal4_3]) {
      const spv = await SPV.create({
        deal_id: deal.id,
        spv_name: `${deal.title} SPV`,
        spv_code: generateSpvCode(),
        status: 'active',
        share_price: 100,
        total_shares: deal.target_amount / 100,
        issued_shares: deal.raised_amount / 100,
        escrow_balance: deal.raised_amount,
      });

      await Investment.create({
        user_id: trader4User.id,
        spv_id: spv.id,
        deal_id: deal.id,
        amount: 30000,
        shares_issued: 300,
        share_price: 100,
        status: 'active',
        invested_at: new Date(),
        confirmed_at: new Date(),
        current_value: 30000 * (1 + deal.expected_roi / 100 / 2),
      });
    }

    // Create bundle for Trader 4
    const bundle4 = await InvestorBundle.create({
      trader_id: trader4.id,
      name: 'Balanced Growth Portfolio',
      description: 'Diversified portfolio balancing risk and returns across multiple sectors',
      deal_ids: [deal4_1.id, deal4_2.id, deal4_3.id],
      is_active: true,
      min_copy_amount: 8000,
      total_copiers: 0,
      category: 'mixed',
    });

    // Create SIP plan for Trader 4
    await SIPPlan.create({
      name: 'Stable Growth SIP',
      slug: 'stable-growth-sip',
      description: 'Conservative systematic investment across sectors',
      plan_type: 'balanced',
      monthly_amount_min: 2000,
      duration_months_min: 18,
      expected_roi_min: 15.0,
      expected_roi_max: 22.0,
      risk_level: 'low',
      status: 'active',
    });

    console.log('\n✅ Copy trading data created successfully!');
    console.log('\n📊 Summary:');
    console.log('- 4 Traders created');
    console.log('- 12 Deals created (3 per trader)');
    console.log('- 12 SPVs created');
    console.log('- 12 Investments created');
    console.log('- 4 Bundles created');
    console.log('- 4 SIP Plans created');
    console.log('\n🔐 Login credentials for all traders: password123');
    console.log('\nTrader Emails:');
    console.log('1. ahmed.realestate@ownly.ae - Real Estate Mogul');
    console.log('2. sarah.franchise@ownly.ae - Franchise Expert');
    console.log('3. omar.tech@ownly.ae - Tech Investor');
    console.log('4. fatima.balanced@ownly.ae - Balanced Investor');

  } catch (error) {
    console.error('❌ Error creating copy trading data:', error);
    throw error;
  }
};

// Run the script
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');
    await createCopyTradingData();
    process.exit(0);
  } catch (error) {
    console.error('Failed:', error);
    process.exit(1);
  }
})();
