import { Sequelize } from 'sequelize';
import db from '../config/database.js';
import { DEAL_CATEGORIES } from '../constants/categories.js';
import Deal from '../models/Deal.js';
import SPV from '../models/SPV.js';

const UAE_LOCATIONS = [
  'Dubai Marina', 'Business Bay', 'Downtown Dubai', 'JLT', 'DIFC',
  'Dubai Silicon Oasis', 'Al Quoz', 'Al Barsha', 'JBR', 'Palm Jumeirah',
  'Dubai Hills', 'Arabian Ranches', 'Motor City', 'Sports City', 'Dubai South',
  'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Um Al Quwain'
];

const DEAL_TYPES = ['real_estate', 'franchise', 'startup', 'asset', 'equity'];

// ROI ranges by category
const ROI_RANGES = {
  real_estate: { min: 8, max: 15 },
  mobility_transport: { min: 12, max: 22 },
  hospitality_tourism: { min: 15, max: 30 },
  food_beverage: { min: 18, max: 35 },
  health_wellness: { min: 12, max: 25 },
  retail_franchises: { min: 15, max: 28 },
  education_training: { min: 10, max: 20 },
  media_entertainment: { min: 20, max: 40 },
  technology_innovation: { min: 25, max: 60 },
  home_services: { min: 15, max: 30 },
  events_experiences: { min: 18, max: 35 },
  agriculture_sustainable: { min: 10, max: 25 },
  ecommerce_digital: { min: 20, max: 45 },
  logistics_supply_chain: { min: 12, max: 22 },
  manufacturing_production: { min: 10, max: 20 },
  micro_investment_baskets: { min: 12, max: 18 },
  secondary_market: { min: 10, max: 25 },
  bundles_thematic: { min: 12, max: 20 },
  community_impact: { min: 5, max: 15 },
  ownly_exchange: { min: 8, max: 20 }
};

// Minimum investments
const MIN_INVESTMENTS = {
  SIP: 100,      // AED for SIP plans
  SPV: 500,      // AED for SPV deals
  BUNDLE: 2000   // AED for bundle deals
};

function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100) + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
}

function generateDealTitle(categoryLabel, subcategoryLabel) {
  const adjectives = ['Premium', 'Modern', 'Luxury', 'Smart', 'Exclusive', 'Elite', 'Prime', 'Professional', 'Top-tier', 'Advanced'];
  const verbs = ['Opportunity', 'Investment', 'Venture', 'Project', 'Initiative', 'Deal', 'Partnership'];

  return `${getRandomFromArray(adjectives)} ${subcategoryLabel} ${getRandomFromArray(verbs)} in ${getRandomFromArray(UAE_LOCATIONS)}`;
}

function generateDescription(categoryLabel, subcategoryLabel, location) {
  return `Invest in a high-potential ${subcategoryLabel.toLowerCase()} business located in ${location}. This Shariah-compliant opportunity offers attractive returns through a well-established business model with proven track record. The investment is structured through an SPV (Special Purpose Vehicle) ensuring transparency and investor protection. All operations comply with UAE regulations and Islamic finance principles.`;
}

function generateHighlights(subcategoryLabel) {
  return [
    `Established ${subcategoryLabel.toLowerCase()} business with proven revenue model`,
    'Fully Shariah-compliant operations and revenue sources',
    'Prime UAE location with high foot traffic and visibility',
    'Professional management team with industry experience',
    'Comprehensive investor reporting and transparency',
    'Exit options available after minimum holding period',
    'Protected through legal SPV structure',
    'All necessary licenses and regulatory approvals in place'
  ];
}

function generateRisks() {
  return [
    'Market competition may affect revenue growth',
    'Economic conditions in UAE may impact business performance',
    'Operational challenges may arise requiring additional capital',
    'Returns are not guaranteed and depend on business performance',
    'Liquidity may be limited during holding period',
    'Regulatory changes may affect business operations'
  ];
}

async function createDealForSubcategory(category, subcategory, index) {
  const location = getRandomFromArray(UAE_LOCATIONS);
  const roi = getRandomInt(ROI_RANGES[category.key].min, ROI_RANGES[category.key].max);
  const dealType = getRandomFromArray(DEAL_TYPES);

  // Determine minimum investment based on deal structure
  let minInvestment;
  if (category.key === 'micro_investment_baskets') {
    minInvestment = MIN_INVESTMENTS.SIP;
  } else if (category.key === 'bundles_thematic') {
    minInvestment = MIN_INVESTMENTS.BUNDLE;
  } else {
    minInvestment = MIN_INVESTMENTS.SPV;
  }

  // Calculate target and pricing
  const targetAmount = getRandomInt(50000, 500000);
  const sharePrice = Math.max(minInvestment, getRandomInt(500, 5000));
  const totalShares = Math.floor(targetAmount / sharePrice);

  const title = generateDealTitle(category.label, subcategory.label);

  const dealData = {
    title: title,
    slug: generateSlug(title),
    description: generateDescription(category.label, subcategory.label, location),
    type: dealType,
    category: category.key,
    subcategory: subcategory.key,

    // Financial details
    target_amount: targetAmount,
    min_ticket: minInvestment,
    share_price: sharePrice,
    total_shares: totalShares,
    available_shares: totalShares,

    // Returns
    expected_roi: roi,
    holding_period_months: getRandomInt(12, 36),
    payout_frequency: getRandomFromArray(['monthly', 'quarterly', 'annually']),

    // Location
    location: location,
    emirate: location.includes('Abu Dhabi') ? 'Abu Dhabi' :
             location.includes('Sharjah') ? 'Sharjah' :
             location.includes('Ajman') ? 'Ajman' :
             location.includes('RAK') || location.includes('Ras Al Khaimah') ? 'Ras Al Khaimah' :
             location.includes('Fujairah') ? 'Fujairah' :
             location.includes('UAQ') || location.includes('Um Al Quwain') ? 'Um Al Quwain' : 'Dubai',

    // Additional details
    highlights: generateHighlights(subcategory.label),
    risks: generateRisks(),

    // Documents (placeholder)
    documents: {
      business_plan: 'Available upon request',
      financial_statements: 'Available upon request',
      legal_documents: 'Available upon request'
    },

    // Status
    status: 'active',
    is_featured: index % 10 === 0, // Every 10th deal is featured
    is_trending: index % 7 === 0,  // Every 7th deal is trending

    // Images (placeholder - using category-based images)
    images: [
      `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800`,
      `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800`,
      `https://images.unsplash.com/photo-1497366216548-37526070297c?w=800`
    ],

    // Timeline
    funding_deadline: new Date(Date.now() + getRandomInt(30, 90) * 24 * 60 * 60 * 1000),

    // Shariah compliance
    shariah_compliant: true,
    shariah_certification: 'Certified by recognized Shariah board',

    // Contact
    contact_email: 'investments@ownly.ae',
    contact_phone: '+971-4-XXX-XXXX'
  };

  try {
    const deal = await Deal.create(dealData);

    // Create SPV for the deal
    await SPV.create({
      deal_id: deal.id,
      legal_name: `${deal.title} SPV LLC`,
      registration_number: `SPV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      incorporation_date: new Date(),
      status: 'forming',
      total_units: totalShares,
      available_units: totalShares,
      unit_price: sharePrice,
      nav_per_unit: sharePrice,
      minimum_investment: minInvestment,
      lock_in_period_months: dealData.holding_period_months,
      management_fee_percentage: 1.5,
      performance_fee_percentage: 10.0,
      asset_details: {
        type: dealType,
        location: location,
        description: dealData.description
      }
    });

    console.log(`✅ Created deal: ${deal.title}`);
    return deal;
  } catch (error) {
    console.error(`❌ Error creating deal for ${subcategory.label}:`, error.message);
    throw error;
  }
}

async function createAllCategoryDeals() {
  try {
    console.log('🚀 Starting to create deals for all categories and subcategories...\n');

    // Test database connection
    await db.authenticate();
    console.log('✅ Database connected successfully\n');

    let totalDealsCreated = 0;
    let dealIndex = 0;

    // Iterate through all categories
    for (const [categoryName, categoryData] of Object.entries(DEAL_CATEGORIES)) {
      console.log(`\n📁 Processing Category: ${categoryData.label}`);
      console.log(`   Subcategories: ${Object.keys(categoryData.subcategories).length}`);

      // Iterate through all subcategories
      for (const [subKey, subcategoryData] of Object.entries(categoryData.subcategories)) {
        console.log(`   📄 Creating deal for: ${subcategoryData.label}...`);

        try {
          await createDealForSubcategory(categoryData, subcategoryData, dealIndex);
          totalDealsCreated++;
          dealIndex++;

          // Small delay to avoid overwhelming the database
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`   ❌ Failed to create deal for ${subcategoryData.label}`);
        }
      }

      console.log(`   ✅ Completed ${categoryData.label} - ${Object.keys(categoryData.subcategories).length} deals`);
    }

    console.log(`\n\n🎉 ===== SUMMARY =====`);
    console.log(`Total Deals Created: ${totalDealsCreated}`);
    console.log(`Total Categories: ${Object.keys(DEAL_CATEGORIES).length}`);
    console.log(`All deals are Shariah-compliant ✓`);
    console.log(`Min Investment: SIP (${MIN_INVESTMENTS.SIP} AED), SPV (${MIN_INVESTMENTS.SPV} AED), Bundles (${MIN_INVESTMENTS.BUNDLE} AED)`);
    console.log(`\n✅ Script completed successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
createAllCategoryDeals();
