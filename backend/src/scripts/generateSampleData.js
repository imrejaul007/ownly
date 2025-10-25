/**
 * Sample Data Generator for OWNLY Platform
 * Generates realistic investor data with 36-month transaction history
 */

// Sample investor names and cities
const investorNames = [
  { name: 'Ahmed Al-Mansoori', email: 'ahmed.almansoori@example.ae', city: 'Dubai', tier: 'Platinum' },
  { name: 'Fatima Al-Hashimi', email: 'fatima.alhashimi@example.ae', city: 'Abu Dhabi', tier: 'Gold' },
  { name: 'Mohammed Al-Maktoum', email: 'mohammed.almaktoum@example.ae', city: 'Dubai', tier: 'Platinum' },
  { name: 'Sara Al-Nuaimi', email: 'sara.alnuaimi@example.ae', city: 'Sharjah', tier: 'Silver' },
  { name: 'Abdullah Al-Zarooni', email: 'abdullah.alzarooni@example.ae', city: 'Dubai', tier: 'Gold' },
  { name: 'Mariam Al-Khaja', email: 'mariam.alkhaja@example.ae', city: 'Dubai', tier: 'Bronze' },
  { name: 'Khalid Al-Suwaidi', email: 'khalid.alsuwaidi@example.ae', city: 'Abu Dhabi', tier: 'Platinum' },
  { name: 'Aisha Al-Mazrouei', email: 'aisha.almazrouei@example.ae', city: 'Dubai', tier: 'Gold' },
  { name: 'Omar Al-Shamsi', email: 'omar.alshamsi@example.ae', city: 'Ajman', tier: 'Silver' },
  { name: 'Layla Al-Bloushi', email: 'layla.albloushi@example.ae', city: 'Dubai', tier: 'Gold' },
  { name: 'Rashid Al-Mansoori', email: 'rashid.almansoori@example.ae', city: 'Dubai', tier: 'Platinum' },
  { name: 'Noura Al-Ketbi', email: 'noura.alketbi@example.ae', city: 'Abu Dhabi', tier: 'Silver' },
  { name: 'Sultan Al-Marzouqi', email: 'sultan.almarzouqi@example.ae', city: 'Dubai', tier: 'Bronze' },
  { name: 'Hessa Al-Dhaheri', email: 'hessa.aldhaheri@example.ae', city: 'Al Ain', tier: 'Silver' },
  { name: 'Saeed Al-Qasimi', email: 'saeed.alqasimi@example.ae', city: 'Sharjah', tier: 'Gold' },
  { name: 'Shamma Al-Mazrouei', email: 'shamma.almazrouei@example.ae', city: 'Dubai', tier: 'Bronze' },
  { name: 'Hamdan Al-Nahyan', email: 'hamdan.alnahyan@example.ae', city: 'Abu Dhabi', tier: 'Platinum' },
  { name: 'Moza Al-Maktoum', email: 'moza.almaktoum@example.ae', city: 'Dubai', tier: 'Gold' },
  { name: 'Ali Al-Shamsi', email: 'ali.alshamsi@example.ae', city: 'Fujairah', tier: 'Silver' },
  { name: 'Latifa Al-Kaabi', email: 'latifa.alkaabi@example.ae', city: 'Dubai', tier: 'Bronze' },
];

// Tier to capital mapping
const tierCapital = {
  'Platinum': [300000, 500000, 750000, 1000000],
  'Gold': [150000, 200000, 300000, 400000],
  'Silver': [50000, 75000, 100000, 150000],
  'Bronze': [20000, 30000, 40000, 50000],
};

// Brand IDs from seed data
const brandIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// Brand details for reference
const brands = {
  1: { name: 'Whiff Theory', category: 'Franchise', location: 'Dubai Mall', monthly_roi: 5.0, min_invest: 20000 },
  2: { name: 'Aroma Souq', category: 'Franchise', location: 'Mall of the Emirates', monthly_roi: 5.0, min_invest: 40000 },
  3: { name: 'RedHine', category: 'Franchise', location: 'Deira City Centre', monthly_roi: 5.5, min_invest: 10000 },
  4: { name: 'Al Mutalib', category: 'Franchise', location: 'Marina Walk', monthly_roi: 5.2, min_invest: 50000 },
  5: { name: 'Marina Loft', category: 'Real Estate', location: 'Dubai Marina', monthly_roi: 4.0, min_invest: 500 },
  6: { name: 'Creek Bay Villas', category: 'Real Estate', location: 'Dubai Creek Harbour', monthly_roi: 4.2, min_invest: 1000 },
  7: { name: 'Royale Yachts', category: 'Asset', location: 'Palm Jumeirah Marina', monthly_roi: 6.0, min_invest: 100000 },
  8: { name: 'Elite Wheels', category: 'Asset', location: 'Al Quoz', monthly_roi: 6.0, min_invest: 100000 },
  9: { name: 'Tattvix', category: 'Startup', location: 'DIFC', monthly_roi: 3.5, min_invest: 25000 },
  10: { name: 'Wasil Souq', category: 'Startup', location: 'Dubai Internet City', monthly_roi: 3.0, min_invest: 10000 },
  11: { name: 'Publistan', category: 'Startup', location: 'Jumeirah Lakes Towers', monthly_roi: 3.8, min_invest: 15000 },
  12: { name: 'Raskah', category: 'Startup', location: 'Bangalore, India', monthly_roi: 3.5, min_invest: 10000 },
  13: { name: 'Palm Luxe', category: 'Rental', location: 'JBR', monthly_roi: 4.5, min_invest: 500 },
  14: { name: 'Glowzy Spa', category: 'Franchise', location: 'Dubai Hills', monthly_roi: 4.8, min_invest: 25000 },
  15: { name: 'TravoPay Kiosk', category: 'Franchise', location: 'DXB Airport', monthly_roi: 4.0, min_invest: 20000 },
};

// Utility: Random number in range
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utility: Random float
function randomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

// Utility: Random element from array
function randomElement(arr) {
  return arr[randomInRange(0, arr.length - 1)];
}

// Utility: Format date as YYYY-MM
function formatMonth(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`;
}

// Generate 36 months of data starting from Jan 2023
function generateMonthlyData(initialInvestment, baseRoiPct, hasExit = false) {
  const monthlyData = [];
  let portfolioValue = initialInvestment;
  const startYear = 2023;
  const startMonth = 1;

  for (let i = 0; i < 36; i++) {
    const month = ((startMonth + i - 1) % 12) + 1;
    const year = startYear + Math.floor((startMonth + i - 1) / 12);

    // Add some variance to ROI (±15%)
    const roiVariance = randomFloat(0.85, 1.15);
    const roiPercent = baseRoiPct * roiVariance;
    const earned = portfolioValue * (roiPercent / 100);

    // 40% reinvested, 60% withdrawn
    const reinvested = earned * 0.4;
    const withdrawn = earned * 0.6;

    portfolioValue += reinvested;

    monthlyData.push({
      month: formatMonth(year, month),
      roi_percent: parseFloat(roiPercent.toFixed(2)),
      earned: parseFloat(earned.toFixed(2)),
      reinvested: parseFloat(reinvested.toFixed(2)),
      withdrawn: parseFloat(withdrawn.toFixed(2)),
      portfolio_value: parseFloat(portfolioValue.toFixed(2)),
    });

    // If exit event, stop at month 30-35
    if (hasExit && i >= 29 && i < 35 && Math.random() < 0.3) {
      break;
    }
  }

  return monthlyData;
}

// Generate portfolio for an investor
function generatePortfolio(tier, initialCapital, isShowcase = false) {
  const portfolio = [];
  let remainingCapital = initialCapital;

  // Determine number of investments based on tier
  let portfolioSize;
  if (isShowcase) {
    // Showcase investor gets investments across ALL categories
    portfolioSize = 8; // More investments to show diversity
  } else {
    portfolioSize = {
      'Platinum': randomInRange(4, 7),
      'Gold': randomInRange(3, 5),
      'Silver': randomInRange(2, 4),
      'Bronze': randomInRange(1, 3),
    }[tier];
  }

  // For showcase, ensure we get one from each category
  let availableBrands;
  if (isShowcase) {
    // Pick one from each category + a few more
    const franchises = [1, 2, 3, 4, 14, 15]; // 6 franchises
    const realEstate = [5, 6]; // 2 real estate
    const assets = [7, 8]; // 2 assets
    const startups = [9, 10, 11, 12]; // 4 startups
    const rental = [13]; // 1 rental

    availableBrands = [
      randomElement(franchises), // At least 1 franchise
      randomElement(realEstate), // 1 real estate
      randomElement(assets), // 1 asset
      randomElement(startups), // 1 startup
      rental[0], // 1 rental
      // Add 3 more random ones
      randomElement(franchises),
      randomElement(startups),
      randomElement(franchises),
    ];
  } else {
    // Regular portfolio - shuffle brand IDs
    availableBrands = [...brandIds].sort(() => Math.random() - 0.5);
  }

  for (let i = 0; i < Math.min(portfolioSize, availableBrands.length); i++) {
    const brandId = availableBrands[i];
    const brand = brands[brandId];

    if (!brand) continue;

    // Calculate investment amount
    const minInvest = brand.min_invest;
    const maxInvest = Math.min(remainingCapital * 0.4, minInvest * 5);

    if (maxInvest < minInvest) break;

    // Round to nearest 1000
    const investmentAmount = Math.round(randomInRange(minInvest, maxInvest) / 1000) * 1000;

    if (investmentAmount > remainingCapital) break;

    remainingCapital -= investmentAmount;

    // Exit event chances
    let hasExit;
    if (isShowcase) {
      // For showcase, ensure some exits (40% chance, so ~3 out of 8)
      hasExit = Math.random() < 0.4;
    } else {
      hasExit = Math.random() < 0.2;
    }

    // Generate monthly data
    const monthlyData = generateMonthlyData(
      investmentAmount,
      brand.monthly_roi,
      hasExit
    );

    // Calculate exit if applicable
    let exitEvent = null;
    if (hasExit) {
      const lastMonth = monthlyData[monthlyData.length - 1];
      const exitMultiplier = randomFloat(1.3, 2.0, 2);
      exitEvent = {
        month: lastMonth.month,
        exit_value: parseFloat((investmentAmount * exitMultiplier).toFixed(2)),
        exit_multiplier: exitMultiplier,
      };
    }

    portfolio.push({
      brand_id: brandId,
      brand: brand.name,
      category: brand.category,
      location: brand.location,
      initial_investment: investmentAmount,
      monthly_roi_base_pct: brand.monthly_roi,
      monthly_data: monthlyData,
      ...(exitEvent && { exit_event: exitEvent }),
    });
  }

  return portfolio;
}

// Generate all investors
function generateInvestors() {
  const investors = [];

  investorNames.forEach((investorInfo, index) => {
    const tier = investorInfo.tier;
    const initialCapital = randomElement(tierCapital[tier]);

    // Generate join date (spread across 2023)
    const joinMonth = randomInRange(1, 6);
    const joinDay = randomInRange(1, 28);
    const joinedDate = `2023-${String(joinMonth).padStart(2, '0')}-${String(joinDay).padStart(2, '0')}`;

    // First investor (Ahmed) is the showcase with diverse portfolio
    const isShowcase = index === 0;
    const portfolio = generatePortfolio(tier, initialCapital, isShowcase);

    investors.push({
      investor_id: `INV${String(index + 1).padStart(3, '0')}`,
      name: investorInfo.name,
      email: investorInfo.email,
      tier: tier,
      city: investorInfo.city,
      joined: joinedDate,
      initial_capital: initialCapital,
      portfolio: portfolio,
    });
  });

  return investors;
}

// Calculate platform totals
function calculatePlatformTotals(investors) {
  let totalInvested = 0;
  let totalRoiDistributed = 0;
  let totalReinvested = 0;
  let totalExits = 0;

  investors.forEach(investor => {
    investor.portfolio.forEach(item => {
      totalInvested += item.initial_investment;

      item.monthly_data.forEach(month => {
        totalRoiDistributed += month.earned;
        totalReinvested += month.reinvested;
      });

      if (item.exit_event) {
        totalExits += item.exit_event.exit_value;
      }
    });
  });

  return {
    total_invested: parseFloat(totalInvested.toFixed(2)),
    total_roi_distributed: parseFloat(totalRoiDistributed.toFixed(2)),
    total_reinvested: parseFloat(totalReinvested.toFixed(2)),
    total_exits: parseFloat(totalExits.toFixed(2)),
  };
}

// Main generator
function generateCompleteDataset() {
  console.log('🔄 Generating sample OWNLY dataset...\n');

  const investors = generateInvestors();
  const platformTotals = calculatePlatformTotals(investors);

  // Summary
  console.log('📊 Generated Data Summary:');
  console.log(`   Investors: ${investors.length}`);
  console.log(`   Total Invested: ${platformTotals.total_invested.toLocaleString()} AED`);
  console.log(`   Total ROI Distributed: ${platformTotals.total_roi_distributed.toLocaleString()} AED`);
  console.log(`   Total Reinvested: ${platformTotals.total_reinvested.toLocaleString()} AED`);
  console.log(`   Total Exits: ${platformTotals.total_exits.toLocaleString()} AED`);

  let totalInvestments = 0;
  let totalMonths = 0;
  let exitCount = 0;

  investors.forEach(inv => {
    totalInvestments += inv.portfolio.length;
    inv.portfolio.forEach(p => {
      totalMonths += p.monthly_data.length;
      if (p.exit_event) exitCount++;
    });
  });

  console.log(`\n   Total Investments: ${totalInvestments}`);
  console.log(`   Total Monthly Records: ${totalMonths}`);
  console.log(`   Exit Events: ${exitCount}\n`);

  return {
    investors,
    platform_totals: platformTotals,
  };
}

// Export for ES modules
export { generateCompleteDataset };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const data = generateCompleteDataset();
  console.log('✅ Sample data generated successfully!\n');
  console.log('💡 Use this data to update seed-data.json or import directly.\n');
}
