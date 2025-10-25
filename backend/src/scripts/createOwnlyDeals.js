import { Deal, SPV } from '../models/index.js';
import sequelize from '../config/database.js';

const ownlyDeals = [
  // Franchise & Business SPVs
  {
    type: 'franchise',
    title: 'Whiff Theory Signature Lounge',
    slug: 'whiff-theory-signature-lounge',
    location: 'Dubai Marina, UAE',
    jurisdiction: 'DIFC',
    description: 'Premium fragrance brand with strong local following. Whiff Theory represents a unique investment opportunity in the luxury retail sector. With projected annual revenue of AED 2.4M and a strong customer base in Dubai Marina, this franchise unit offers investors monthly revenue share distributions. The deal includes an investor buyback option after 3 years, providing a clear exit strategy.',
    target_amount: 1200000,
    min_ticket: 5000,
    raised_amount: 420000,
    holding_period_months: 36,
    expected_roi: 55,
    expected_irr: 18,
    status: 'open',
    investor_count: 84,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'],
    metadata: {
      sector: 'Perfume & Retail',
      model: 'Revenue Share',
      distribution_frequency: 'Monthly',
      highlights: [
        'Premium fragrance brand with strong local following',
        'Projected annual revenue AED 2.4M',
        'Investor buyback option after 3 years'
      ]
    }
  },
  {
    type: 'franchise',
    title: 'Glowzy Spa & Salon Franchise',
    slug: 'glowzy-spa-salon-franchise',
    location: 'Downtown Dubai, UAE',
    jurisdiction: 'DIFC',
    description: 'Luxury salon chain with strong social media presence. Glowzy has established itself as a premier beauty destination in Downtown Dubai, with partnerships with local influencers driving consistent customer traffic. The franchise offers profit share distributions quarterly and comes with a guaranteed ROI floor of 20% annually, providing downside protection for investors.',
    target_amount: 850000,
    min_ticket: 5000,
    raised_amount: 637500,
    holding_period_months: 30,
    expected_roi: 48,
    expected_irr: 16,
    status: 'open',
    investor_count: 128,
    images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'],
    metadata: {
      sector: 'Beauty & Wellness',
      model: 'Profit Share',
      distribution_frequency: 'Quarterly',
      guaranteed_min_roi: 20,
      highlights: [
        'Luxury salon chain with strong social media presence',
        'Partnership with local influencers',
        'Guaranteed ROI floor of 20% annually'
      ]
    }
  },

  // Real Estate SPVs
  {
    type: 'real_estate',
    title: 'OWNLY Stay – Marina View Apartments',
    slug: 'ownly-stay-marina-view-apartments',
    location: 'Dubai Marina, UAE',
    jurisdiction: 'DIFC',
    description: 'Serviced apartments with Airbnb management in prime Dubai Marina location. These luxury apartments are professionally managed through Airbnb and other short-term rental platforms, achieving 70% occupancy in Q1 2025. Investors receive monthly rental yield distributions plus benefit from projected 15% resale appreciation over the 36-month investment period.',
    target_amount: 2000000,
    min_ticket: 10000,
    raised_amount: 1500000,
    holding_period_months: 36,
    expected_roi: 18,
    expected_irr: 8,
    status: 'open',
    investor_count: 150,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
    metadata: {
      sector: 'Real Estate',
      model: 'Rental Yield + Appreciation',
      distribution_frequency: 'Monthly',
      occupancy_rate: 70,
      appreciation_target: 15,
      highlights: [
        'Serviced apartments with Airbnb management',
        '70% occupancy in Q1 2025',
        'Projected resale appreciation: 15%'
      ]
    }
  },
  {
    type: 'real_estate',
    title: 'Nexta Villas Phase 1',
    slug: 'nexta-villas-phase-1',
    location: 'Sharjah Waterfront City, UAE',
    jurisdiction: 'Sharjah',
    description: 'Boutique villa development project targeting high-end clientele. Nexta Villas Phase 1 represents a luxury real estate development opportunity in the growing Sharjah Waterfront City. With expected exit in 4 years and strong pre-sales interest, this project offers investors annual distributions plus significant exit profits upon project completion and villa sales.',
    target_amount: 4500000,
    min_ticket: 25000,
    raised_amount: 1800000,
    holding_period_months: 48,
    expected_roi: 22,
    expected_irr: 12,
    status: 'open',
    investor_count: 72,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    metadata: {
      sector: 'Luxury Real Estate',
      model: 'Development + Exit Profit',
      distribution_frequency: 'Annual',
      phase: 1,
      highlights: [
        'Boutique villa project with high investor interest',
        'Expected exit in 4 years',
        'High-end clientele target group'
      ]
    }
  },

  // Luxury & Asset Co-Ownership
  {
    type: 'asset',
    title: 'Royale+ Yacht SPV 02',
    slug: 'royale-plus-yacht-spv-02',
    location: 'Dubai Harbour, UAE',
    jurisdiction: 'DIFC',
    description: 'Luxury yacht available for charter events and corporate parties at Dubai Harbour. This premium asset is managed by OWNLY Asset Ops and generates revenue through exclusive corporate client contracts and high-end charter bookings. Investors receive quarterly distributions from rental income plus benefit from yacht appreciation over the 36-month holding period.',
    target_amount: 3000000,
    min_ticket: 20000,
    raised_amount: 2100000,
    holding_period_months: 36,
    expected_roi: 40,
    expected_irr: 22,
    status: 'open',
    investor_count: 105,
    images: ['https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800'],
    metadata: {
      sector: 'Luxury Experiences',
      model: 'Rental Income + Asset Appreciation',
      distribution_frequency: 'Quarterly',
      asset_type: 'Yacht',
      managed_by: 'OWNLY Asset Ops',
      highlights: [
        'Yacht available for charter events & parties',
        'Exclusive corporate client contracts',
        'Managed by OWNLY Asset Ops'
      ]
    }
  },
  {
    type: 'asset',
    title: 'Luxora Wheels Club – Lamborghini Huracán',
    slug: 'luxora-wheels-club-lamborghini-huracan',
    location: 'Abu Dhabi, UAE',
    jurisdiction: 'ADGM',
    description: 'Supercar co-ownership opportunity with rental and event revenue. This Lamborghini Huracán generates income through luxury car rental services and event participation, targeting 70%+ utilization. Investors receive monthly distributions from rental income, with asset resale planned after 30 months providing capital appreciation exit opportunity.',
    target_amount: 1800000,
    min_ticket: 10000,
    raised_amount: 1260000,
    holding_period_months: 30,
    expected_roi: 50,
    expected_irr: 28,
    status: 'open',
    investor_count: 126,
    images: ['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800'],
    metadata: {
      sector: 'Luxury Cars',
      model: 'Co-ownership + Rental',
      distribution_frequency: 'Monthly',
      asset_type: 'Lamborghini Huracán',
      utilization_target: 70,
      highlights: [
        'Supercar rental & event participation revenue',
        'Asset resale after 30 months',
        '70%+ utilization target'
      ]
    }
  },

  // Digital & Tech Ventures
  {
    type: 'startup',
    title: 'NextaBizz Marketplaces SPV',
    slug: 'nextabizz-marketplaces-spv',
    location: 'UAE & GCC',
    jurisdiction: 'DIFC',
    description: 'Integrated B2B/B2C marketplace platform with high scalability potential. NextaBizz combines multiple marketplace verticals into a unified platform with Wasil logistics integration. This equity-based investment offers 4–6x exit potential through acquisition or IPO, with annual distributions from platform revenues during the growth phase.',
    target_amount: 1000000,
    min_ticket: 5000,
    raised_amount: 650000,
    holding_period_months: 36,
    expected_roi: 65,
    expected_irr: 35,
    status: 'open',
    investor_count: 130,
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'],
    metadata: {
      sector: 'Tech Startup',
      model: 'Equity + Exit',
      distribution_frequency: 'Annual',
      exit_multiple_target: '4-6x',
      highlights: [
        'Integrated B2B/B2C marketplaces',
        'High scalability with Wasil integration',
        'Equity-based exit potential 4–6x'
      ]
    }
  },
  {
    type: 'startup',
    title: 'TravoPay Mini Fintech SPV',
    slug: 'travopay-mini-fintech-spv',
    location: 'Dubai Internet City, UAE',
    jurisdiction: 'DIFC',
    description: 'Digital wallet and travel booking integration platform targeting 200K users by 2026. TravoPay combines fintech innovation with travel services, creating a unique value proposition in the growing digital payments sector. Equity investment with annual dividends and projected 6–10x valuation growth over 36 months.',
    target_amount: 1500000,
    min_ticket: 10000,
    raised_amount: 825000,
    holding_period_months: 36,
    expected_roi: 80,
    expected_irr: 42,
    status: 'open',
    investor_count: 83,
    images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800'],
    metadata: {
      sector: 'FinTech',
      model: 'Equity + Dividend',
      distribution_frequency: 'Annual',
      user_target: 200000,
      valuation_growth_target: '6-10x',
      highlights: [
        'Digital wallet + travel booking integration',
        'Targeting 200K users by 2026',
        'Projected 6–10x valuation growth'
      ]
    }
  },

  // Rental Yield & Managed Assets
  {
    type: 'asset',
    title: 'Elitezy Rentals – Car Fleet 01',
    slug: 'elitezy-rentals-car-fleet-01',
    location: 'Dubai, UAE',
    jurisdiction: 'DIFC',
    description: 'Fleet of 15 luxury sedans with 70% utilization through corporate partnerships. Elitezy operates a managed car rental fleet targeting business travelers and corporate clients. Monthly revenue share distributions with buyback guarantee at book value after 24 months provides capital preservation and steady income.',
    target_amount: 1000000,
    min_ticket: 5000,
    raised_amount: 700000,
    holding_period_months: 24,
    expected_roi: 35,
    expected_irr: 19,
    status: 'open',
    investor_count: 140,
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'],
    metadata: {
      sector: 'Mobility',
      model: 'Revenue Share',
      distribution_frequency: 'Monthly',
      fleet_size: 15,
      utilization_rate: 70,
      highlights: [
        'Fleet of 15 luxury sedans',
        '70% utilization via partnerships',
        'Buyback at book value after 24 months'
      ]
    }
  },
  {
    type: 'asset',
    title: 'Fixora Storage Units 01',
    slug: 'fixora-storage-units-01',
    location: 'Ajman, UAE',
    jurisdiction: 'Ajman',
    description: '20 storage units leased to SMEs with 100% occupancy rate. Fixora provides secure storage solutions for small and medium enterprises across Ajman. With long-term lease contracts and stable monthly rental income, this investment offers conservative returns with minimal volatility.',
    target_amount: 600000,
    min_ticket: 2500,
    raised_amount: 600000,
    holding_period_months: 36,
    expected_roi: 20,
    expected_irr: 7,
    status: 'funded',
    investor_count: 240,
    images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'],
    metadata: {
      sector: 'Storage & Logistics',
      model: 'Rental Yield',
      distribution_frequency: 'Monthly',
      units_count: 20,
      occupancy_rate: 100,
      highlights: [
        '20 storage units leased to SMEs',
        '100% occupancy rate',
        'Stable monthly income'
      ]
    }
  },

  // Infrastructure & Development
  {
    type: 'real_estate',
    title: 'Fixora Logistics Park',
    slug: 'fixora-logistics-park',
    location: 'Umm Al Quwain, UAE',
    jurisdiction: 'UAQ',
    description: 'Industrial logistics park with warehouse and cold storage facilities. This large-scale infrastructure project features 5-year lease contracts with major logistics operators. Expected 1.6x exit multiple at project completion after 60 months, with annual distributions from lease revenues.',
    target_amount: 8000000,
    min_ticket: 50000,
    raised_amount: 4000000,
    holding_period_months: 60,
    expected_roi: 25,
    expected_irr: 15,
    status: 'open',
    investor_count: 80,
    images: ['https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800'],
    metadata: {
      sector: 'Industrial Infrastructure',
      model: 'Lease + Exit',
      distribution_frequency: 'Annual',
      lease_term_years: 5,
      exit_multiple: '1.6x',
      highlights: [
        'Logistics park with warehouse and cold storage',
        '5-year lease contracts signed',
        'Expected project exit at 1.6x'
      ]
    }
  },

  // Fixed Yield Plans
  {
    type: 'asset',
    title: 'Smart Saver 12M',
    slug: 'smart-saver-12m',
    location: 'UAE',
    jurisdiction: 'DIFC',
    description: 'Fixed yield investment plan with auto-reinvest in diversified multi-asset portfolio. Smart Saver 12M offers stable monthly income with the flexibility to withdraw anytime after 6 months. Portfolio is automatically balanced across real estate, franchise, and asset deals to minimize risk while providing consistent 16% annual returns.',
    target_amount: 500000,
    min_ticket: 1000,
    raised_amount: 425000,
    holding_period_months: 12,
    expected_roi: 16,
    expected_irr: 16,
    status: 'open',
    investor_count: 425,
    images: ['https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800'],
    metadata: {
      sector: 'Multi-Asset Pool',
      model: 'Fixed Yield',
      distribution_frequency: 'Monthly',
      auto_reinvest: true,
      withdrawal_lockup_months: 6,
      highlights: [
        'Auto reinvest in diversified portfolio',
        'Stable monthly income',
        'Withdraw anytime after 6 months'
      ]
    }
  },
  {
    type: 'asset',
    title: 'Elite Growth 24M',
    slug: 'elite-growth-24m',
    location: 'UAE',
    jurisdiction: 'DIFC',
    description: 'Hybrid yield and equity investment plan with balanced mix of real estate and business SPVs. Elite Growth 24M combines stable yield generation with equity growth potential through auto-compounding enabled. This low-risk diversification model targets 26% annual returns through strategic allocation across multiple asset classes.',
    target_amount: 1000000,
    min_ticket: 5000,
    raised_amount: 750000,
    holding_period_months: 24,
    expected_roi: 26,
    expected_irr: 26,
    status: 'open',
    investor_count: 150,
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'],
    metadata: {
      sector: 'Mixed Asset Portfolio',
      model: 'Hybrid Yield + Equity',
      distribution_frequency: 'Quarterly',
      auto_compounding: true,
      risk_level: 'Low',
      highlights: [
        'Balanced mix of real estate & business SPVs',
        'Auto-compounding enabled',
        'Low-risk diversification model'
      ]
    }
  }
];

async function createOwnlyDeals() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    let created = 0;
    let skipped = 0;

    for (const dealData of ownlyDeals) {
      // Check if deal already exists
      const exists = await Deal.findOne({ where: { slug: dealData.slug } });

      if (exists) {
        console.log(`⏭️  Skipped: ${dealData.title} (already exists)`);
        skipped++;
        continue;
      }

      // Create deal first (without SPV reference)
      const deal = await Deal.create(dealData);

      // Create SPV with deal reference
      const spv = await SPV.create({
        deal_id: deal.id,
        spv_name: `${dealData.title} SPV`,
        total_shares: Math.floor(dealData.target_amount / 100),
        issued_shares: Math.floor(dealData.raised_amount / 100),
        share_price: 100,
        status: dealData.status === 'funded' ? 'operating' : 'active'
      });

      // Update deal with SPV reference
      await deal.update({ spv_id: spv.id });

      created++;
      console.log(`✅ Created: [${dealData.type}] ${dealData.title}`);
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created} new deals`);
    console.log(`   Skipped: ${skipped} existing deals`);
    console.log(`   Total in database: ${created + skipped + 15} deals`);

    // Show breakdown by type
    const allDeals = await Deal.findAll();
    const byType = {};
    allDeals.forEach(deal => {
      byType[deal.type] = (byType[deal.type] || 0) + 1;
    });

    console.log(`\n📈 Deals by type:`);
    Object.entries(byType).sort().forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createOwnlyDeals();
