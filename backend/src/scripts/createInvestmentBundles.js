import { Bundle, BundleDeal, Deal } from '../models/index.js';
import sequelize from '../config/database.js';

// Helper function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper function to calculate weighted average ROI
function calculateWeightedROI(deals, allocations) {
  let totalWeightedROI = 0;
  allocations.forEach((allocation, index) => {
    totalWeightedROI += deals[index].expected_roi * (allocation / 100);
  });
  return totalWeightedROI;
}

async function createBundles() {
  const t = await sequelize.transaction();

  try {
    console.log('🎯 Starting bundle creation process...\n');

    // Fetch all deals to work with
    const allDeals = await Deal.findAll({ order: [['created_at', 'DESC']] });
    console.log(`📦 Found ${allDeals.length} deals to work with\n`);

    // Organize deals by type
    const franchiseDeals = allDeals.filter(d => d.type === 'franchise');
    const realEstateDeals = allDeals.filter(d => d.type === 'real_estate');
    const startupDeals = allDeals.filter(d => d.type === 'startup');
    const assetDeals = allDeals.filter(d => d.type === 'asset');

    const bundlesData = [
      // ==========================================
      // CATEGORY-BASED BUNDLES
      // ==========================================
      {
        name: 'Franchise Power Bundle',
        bundle_type: 'category_based',
        category: 'retail_mix',
        description: 'A curated collection of high-performing franchise opportunities across luxury retail, fitness, food, and services sectors. Perfect for investors looking to tap into proven business models with strong brand recognition.',
        min_investment: 100000,
        target_amount: 2000000,
        expected_roi_min: 25,
        expected_roi_max: 67,
        holding_period_months: 10,
        status: 'open',
        risk_level: 'medium',
        diversification_score: 75,
        features: [
          'Diversified across 5+ franchise sectors',
          'Proven business models',
          'Strong brand recognition',
          'Average ROI: 45%',
          'Professional management included',
        ],
        images: ['https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800'],
        deals: franchiseDeals.slice(0, 6),
        allocations: [20, 20, 20, 15, 15, 10], // Equal-weighted with slight core holdings
        coreDeals: [0, 1] // First two are core
      },

      {
        name: 'Real Estate Diversified Portfolio',
        bundle_type: 'category_based',
        category: 'property_pool',
        description: 'A balanced real estate portfolio spanning commercial offices, retail spaces, residential units, and hospitality properties. Provides stable returns through rental income and capital appreciation.',
        min_investment: 75000,
        target_amount: 1500000,
        expected_roi_min: 10,
        expected_roi_max: 16,
        holding_period_months: 24,
        status: 'open',
        risk_level: 'low',
        diversification_score: 85,
        features: [
          'Prime Dubai locations',
          'Multiple property types',
          'Steady rental income',
          'Capital appreciation potential',
          'Professional property management',
        ],
        images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
        deals: realEstateDeals.slice(0, 5),
        allocations: [25, 25, 20, 20, 10],
        coreDeals: [0, 1]
      },

      {
        name: 'Tech Startup Growth Bundle',
        bundle_type: 'category_based',
        category: 'growthtech_basket',
        description: 'High-growth potential technology startups in HealthTech, EdTech, FinTech, and SaaS sectors. Designed for investors seeking exponential returns and willing to accept higher risk.',
        min_investment: 50000,
        target_amount: 1000000,
        expected_roi_min: 150,
        expected_roi_max: 400,
        holding_period_months: 36,
        status: 'open',
        risk_level: 'high',
        diversification_score: 70,
        features: [
          'High-growth tech sectors',
          'Experienced founding teams',
          'Proven market traction',
          'Potential 3-4x returns',
          'Exit strategy planned',
        ],
        images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'],
        deals: startupDeals.slice(0, 4),
        allocations: [30, 30, 25, 15],
        coreDeals: [0, 1]
      },

      {
        name: 'Luxury Assets Collection',
        bundle_type: 'category_based',
        category: 'luxury_basket',
        description: 'Exclusive collection of luxury assets including supercars, yachts, classic cars, and high-end collectibles. Generates income through premium rentals and appreciation.',
        min_investment: 150000,
        target_amount: 2500000,
        expected_roi_min: 15,
        expected_roi_max: 22,
        holding_period_months: 18,
        status: 'open',
        risk_level: 'medium',
        diversification_score: 65,
        features: [
          'Premium luxury assets',
          'High rental demand',
          'Asset appreciation',
          'Professional maintenance',
          'Insurance included',
        ],
        images: ['https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800'],
        deals: assetDeals.slice(0, 4),
        allocations: [30, 30, 25, 15],
        coreDeals: [0, 1]
      },

      // ==========================================
      // ROI-BASED BUNDLES
      // ==========================================
      {
        name: 'Conservative Income Bundle',
        bundle_type: 'roi_based',
        category: 'stable_basket',
        description: 'Low-risk investment bundle focused on stable, predictable returns through real estate rentals and established franchises. Ideal for risk-averse investors seeking steady income.',
        min_investment: 50000,
        target_amount: 1000000,
        expected_roi_min: 8,
        expected_roi_max: 15,
        holding_period_months: 24,
        status: 'open',
        risk_level: 'low',
        diversification_score: 80,
        features: [
          'Low-risk investments',
          'Stable monthly income',
          'Established assets',
          'Capital preservation focus',
          'Ideal for beginners',
        ],
        images: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'],
        deals: [
          ...realEstateDeals.filter(d => d.expected_roi <= 15).slice(0, 3),
          ...franchiseDeals.filter(d => d.expected_roi <= 30).slice(0, 2),
        ],
        allocations: [25, 25, 20, 15, 15],
        coreDeals: [0, 1, 2]
      },

      {
        name: 'Balanced Growth Bundle',
        bundle_type: 'roi_based',
        category: 'balanced_basket',
        description: 'Optimal mix of stable income-generating assets and growth opportunities. Balances risk and reward for investors seeking moderate returns with controlled risk.',
        min_investment: 75000,
        target_amount: 1500000,
        expected_roi_min: 18,
        expected_roi_max: 35,
        holding_period_months: 18,
        status: 'open',
        risk_level: 'medium',
        diversification_score: 85,
        features: [
          'Balanced risk-reward profile',
          'Mixed asset classes',
          'Moderate growth potential',
          'Income + appreciation',
          'Professional rebalancing',
        ],
        images: ['https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800'],
        deals: [
          ...realEstateDeals.slice(0, 2),
          ...franchiseDeals.filter(d => d.expected_roi >= 25 && d.expected_roi <= 35).slice(0, 2),
          ...assetDeals.slice(0, 1),
        ],
        allocations: [20, 20, 25, 25, 10],
        coreDeals: [2, 3]
      },

      {
        name: 'Aggressive High-Yield Bundle',
        bundle_type: 'roi_based',
        category: 'aggressive_basket',
        description: 'Maximum growth potential bundle featuring high-ROI franchises, tech startups, and alternative assets. For experienced investors comfortable with higher risk for exceptional returns.',
        min_investment: 100000,
        target_amount: 2000000,
        expected_roi_min: 45,
        expected_roi_max: 300,
        holding_period_months: 24,
        status: 'open',
        risk_level: 'high',
        diversification_score: 70,
        features: [
          'Maximum ROI potential',
          'High-growth opportunities',
          'Tech and franchise focus',
          'Active management',
          'For experienced investors',
        ],
        images: ['https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800'],
        deals: [
          ...franchiseDeals.filter(d => d.expected_roi >= 45).slice(0, 3),
          ...startupDeals.slice(0, 2),
        ],
        allocations: [25, 25, 20, 15, 15],
        coreDeals: [0, 1]
      },

      // ==========================================
      // THEMATIC BUNDLES
      // ==========================================
      {
        name: 'OWNLY Brands Premier Bundle',
        bundle_type: 'thematic',
        category: 'custom',
        description: 'Exclusive bundle featuring OWNLY\'s flagship franchise brands including Al Mutalib, Aroma Souq, Glowzy Studio, FitEarn Gym, and Shopazy Local. Premium opportunities with proven track records.',
        min_investment: 200000,
        target_amount: 3000000,
        expected_roi_min: 47,
        expected_roi_max: 67,
        holding_period_months: 10,
        status: 'open',
        risk_level: 'medium',
        diversification_score: 75,
        features: [
          'Exclusive OWNLY brands',
          'Proven business models',
          'Premium locations',
          'Full operational support',
          'Brand portfolio value',
        ],
        images: ['https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800'],
        deals: franchiseDeals.filter(d =>
          d.title.includes('Al Mutalib') ||
          d.title.includes('Aroma Souq') ||
          d.title.includes('Glowzy') ||
          d.title.includes('FitEarn') ||
          d.title.includes('Shopazy')
        ).slice(0, 5),
        allocations: [25, 25, 20, 15, 15],
        coreDeals: [0, 1]
      },

      {
        name: 'Quick Flip Bundle - 6-12 Months',
        bundle_type: 'thematic',
        category: 'custom',
        description: 'Short-term investment bundle targeting 6-12 month holding periods. Features trade & inventory deals, TikTok products, and quick-turn franchises for fast returns.',
        min_investment: 25000,
        target_amount: 500000,
        expected_roi_min: 30,
        expected_roi_max: 67,
        holding_period_months: 9,
        status: 'open',
        risk_level: 'medium',
        diversification_score: 60,
        features: [
          'Short holding periods',
          'Fast returns',
          'Trade & inventory focus',
          'Trending products',
          'Quick exit strategy',
        ],
        images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'],
        deals: allDeals.filter(d =>
          d.holding_period_months <= 12 && d.expected_roi >= 30
        ).slice(0, 5),
        allocations: [25, 25, 20, 15, 15],
        coreDeals: [0, 1]
      },

      {
        name: 'Monthly Income Generator',
        bundle_type: 'thematic',
        category: 'creator_bundle',
        description: 'Designed for passive monthly income through rental properties, established franchises, and asset leasing. Provides consistent cash flow month after month.',
        min_investment: 100000,
        target_amount: 2000000,
        expected_roi_min: 12,
        expected_roi_max: 28,
        holding_period_months: 24,
        status: 'open',
        risk_level: 'low',
        diversification_score: 80,
        features: [
          'Monthly cash distributions',
          'Passive income focus',
          'Rental properties included',
          'Stable franchises',
          'Predictable returns',
        ],
        images: ['https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=800'],
        deals: [
          ...realEstateDeals.slice(0, 3),
          ...franchiseDeals.filter(d => d.expected_roi >= 20 && d.expected_roi <= 35).slice(0, 2),
        ],
        allocations: [25, 25, 20, 15, 15],
        coreDeals: [0, 1, 2]
      },

      {
        name: 'Trade & Inventory Accelerator',
        bundle_type: 'thematic',
        category: 'custom',
        description: 'High-velocity trade and inventory bundle featuring perfume batches, TikTok products, and import/export deals. For investors seeking quick turnaround and high margins.',
        min_investment: 25000,
        target_amount: 500000,
        expected_roi_min: 27,
        expected_roi_max: 65,
        holding_period_months: 6,
        status: 'open',
        risk_level: 'high',
        diversification_score: 50,
        features: [
          'Ultra-short holding periods',
          'High margins',
          'Trending products',
          'Fast inventory turns',
          'E-commerce focused',
        ],
        images: ['https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800'],
        deals: allDeals.filter(d =>
          d.title.includes('Perfume Batch') ||
          d.title.includes('TikTok') ||
          d.title.includes('Import/Export') ||
          d.holding_period_months <= 6
        ).slice(0, 3),
        allocations: [35, 35, 30],
        coreDeals: [0]
      },

      {
        name: 'Equity & HoldCo Ultra Growth',
        bundle_type: 'thematic',
        category: 'growthtech_basket',
        description: 'Premium bundle featuring equity stakes in high-growth SaaS platforms, brand equity pools, and holding company shares. Maximum growth potential for sophisticated investors.',
        min_investment: 500000,
        target_amount: 5000000,
        expected_roi_min: 250,
        expected_roi_max: 400,
        holding_period_months: 36,
        status: 'open',
        risk_level: 'high',
        diversification_score: 60,
        features: [
          'Equity ownership',
          'Unicorn potential',
          'Strategic holdings',
          'Brand portfolio value',
          'Exit strategy planned',
        ],
        images: ['https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800'],
        deals: allDeals.filter(d =>
          d.title.includes('Tech IP') ||
          d.title.includes('Brand Equity') ||
          d.title.includes('HoldCo') ||
          d.expected_roi >= 250
        ).slice(0, 3),
        allocations: [40, 35, 25],
        coreDeals: [0, 1]
      },

      // ==========================================
      // STARTER BUNDLES
      // ==========================================
      {
        name: 'Starter Investment Bundle',
        bundle_type: 'roi_based',
        category: 'stable_basket',
        description: 'Perfect first investment bundle for newcomers. Carefully selected low-risk opportunities with stable returns. Minimum investment of just AED 25,000 makes it accessible to new investors.',
        min_investment: 25000,
        target_amount: 500000,
        expected_roi_min: 10,
        expected_roi_max: 18,
        holding_period_months: 18,
        status: 'open',
        risk_level: 'low',
        diversification_score: 75,
        features: [
          'Beginner-friendly',
          'Low minimum investment',
          'Stable returns',
          'Educational resources',
          'Guided investment journey',
        ],
        images: ['https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800'],
        deals: [
          ...realEstateDeals.filter(d => d.expected_roi <= 15).slice(0, 2),
          ...franchiseDeals.filter(d => d.expected_roi >= 20 && d.expected_roi <= 30).slice(0, 2),
        ],
        allocations: [30, 30, 20, 20],
        coreDeals: [0, 1]
      },

      {
        name: 'Diversification Plus Bundle',
        bundle_type: 'category_based',
        category: 'custom',
        description: 'Maximum diversification across all asset classes - real estate, franchises, startups, luxury assets, and trade. Spreads risk while maintaining strong return potential.',
        min_investment: 150000,
        target_amount: 3000000,
        expected_roi_min: 20,
        expected_roi_max: 50,
        holding_period_months: 24,
        status: 'open',
        risk_level: 'medium',
        diversification_score: 95,
        features: [
          'Maximum diversification',
          'All asset classes',
          'Risk mitigation',
          'Balanced portfolio',
          'Professional rebalancing',
        ],
        images: ['https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800'],
        deals: [
          ...realEstateDeals.slice(0, 2),
          ...franchiseDeals.slice(0, 2),
          ...startupDeals.slice(0, 1),
          ...assetDeals.slice(0, 1),
        ],
        allocations: [20, 20, 20, 15, 15, 10],
        coreDeals: [0, 1, 2]
      },
    ];

    const createdBundles = [];
    let successCount = 0;
    let errorCount = 0;

    for (const bundleData of bundlesData) {
      try {
        const { deals: selectedDeals, allocations, coreDeals, ...bundleFields } = bundleData;

        // Skip if we don't have enough deals
        if (!selectedDeals || selectedDeals.length === 0) {
          console.log(`⚠️  Skipping "${bundleData.name}" - No deals available`);
          continue;
        }

        // Ensure allocations match deals count
        const finalAllocations = allocations.slice(0, selectedDeals.length);

        // Calculate weighted average ROI
        const avgROI = calculateWeightedROI(selectedDeals, finalAllocations);

        // Generate slug
        bundleFields.slug = generateSlug(bundleFields.name);

        // Create the bundle
        const bundle = await Bundle.create(bundleFields, { transaction: t });

        // Create bundle-deal relationships
        for (let i = 0; i < selectedDeals.length; i++) {
          const deal = selectedDeals[i];
          const allocation = finalAllocations[i];
          const isCore = coreDeals && coreDeals.includes(i);

          await BundleDeal.create({
            bundle_id: bundle.id,
            deal_id: deal.id,
            allocation_percentage: allocation,
            weight: isCore ? 2 : 1,
            is_core: isCore,
            metadata: {
              deal_title: deal.title,
              deal_type: deal.type,
              deal_roi: deal.expected_roi,
            }
          }, { transaction: t });
        }

        createdBundles.push({
          name: bundle.name,
          type: bundle.bundle_type,
          category: bundle.category,
          dealsCount: selectedDeals.length,
          minInvestment: bundleFields.min_investment,
          roiRange: `${bundleFields.expected_roi_min}-${bundleFields.expected_roi_max}%`,
        });

        successCount++;
        console.log(`✅ Created: ${bundle.name} (${selectedDeals.length} deals)`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error creating bundle "${bundleData.name}":`, error.message);
      }
    }

    await t.commit();

    console.log('\n' + '='.repeat(60));
    console.log('📊 BUNDLE CREATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Bundles Created: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('\n📦 Created Bundles:\n');

    // Group by type
    const byType = {
      category_based: createdBundles.filter(b => b.type === 'category_based'),
      roi_based: createdBundles.filter(b => b.type === 'roi_based'),
      thematic: createdBundles.filter(b => b.type === 'thematic'),
    };

    console.log('🏢 CATEGORY-BASED BUNDLES:');
    byType.category_based.forEach(b => {
      console.log(`   • ${b.name}`);
      console.log(`     Deals: ${b.dealsCount} | Min: AED ${(b.minInvestment/1000).toFixed(0)}K | ROI: ${b.roiRange}`);
    });

    console.log('\n📈 ROI-BASED BUNDLES:');
    byType.roi_based.forEach(b => {
      console.log(`   • ${b.name}`);
      console.log(`     Deals: ${b.dealsCount} | Min: AED ${(b.minInvestment/1000).toFixed(0)}K | ROI: ${b.roiRange}`);
    });

    console.log('\n🎨 THEMATIC BUNDLES:');
    byType.thematic.forEach(b => {
      console.log(`   • ${b.name}`);
      console.log(`     Deals: ${b.dealsCount} | Min: AED ${(b.minInvestment/1000).toFixed(0)}K | ROI: ${b.roiRange}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ Bundle creation completed successfully!');
    console.log('='.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    await t.rollback();
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

createBundles();
