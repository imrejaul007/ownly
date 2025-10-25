import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Helper functions
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max, decimals = 2) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const randomElement = (arr) => arr[randomInt(0, arr.length - 1)];

// Constants
const LOCATIONS = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah'];
const FIRST_NAMES = ['Ahmed', 'Mohammed', 'Fatima', 'Aisha', 'Omar', 'Sara', 'Ali', 'Layla', 'Hassan', 'Mariam', 'Khalid', 'Noor', 'Abdullah', 'Huda', 'Yousef', 'Zainab', 'Salem', 'Reem', 'Rashid', 'Muna'];
const LAST_NAMES = ['Al Mansouri', 'Al Hashimi', 'Al Maktoum', 'Al Nahyan', 'Al Falasi', 'Al Ketbi', 'Al Mazrouei', 'Al Shamsi', 'Al Kaabi', 'Al Suwaidi'];

const START_DATE = new Date('2022-01-01');
const END_DATE = new Date('2024-12-31');

// Deal Categories and Templates
const DEAL_CATEGORIES = {
  FOCO: {
    name: 'FOCO / Franchise',
    roi: [18, 70],
    timeline: [9, 18],
    deals: [
      { title: 'TikTok Café Franchise', desc: 'Popular social media-themed café franchise', roi: [45, 70], min: 50000, max: 200000 },
      { title: 'Smart Gym Chain', desc: '24/7 automated fitness centers', roi: [25, 40], min: 100000, max: 500000 },
      { title: 'Juice Bar Network', desc: 'Health-focused juice and smoothie bars', roi: [20, 35], min: 30000, max: 150000 },
      { title: 'Fast Food Franchise', desc: 'International burger franchise', roi: [22, 38], min: 150000, max: 600000 }
    ]
  },
  REAL_ESTATE: {
    name: 'Real Estate (CrowdProp)',
    roi: [12, 25],
    timeline: [12, 36],
    deals: [
      { title: 'Dubai Marina Apartment Complex', desc: 'Luxury residential development', roi: [15, 22], min: 50000, max: 500000 },
      { title: 'Downtown Dubai Office Tower', desc: 'Grade-A commercial office space', roi: [12, 18], min: 100000, max: 1000000 },
      { title: 'JBR Beachfront Villas', desc: 'Premium beachfront properties', roi: [18, 25], min: 200000, max: 2000000 },
      { title: 'Business Bay Retail Plaza', desc: 'Mixed-use retail and F&B development', roi: [14, 20], min: 75000, max: 750000 }
    ]
  },
  ALTERNATIVE: {
    name: 'Alternative Assets',
    roi: [15, 45],
    timeline: [12, 24],
    deals: [
      { title: 'Luxury Watch Collection', desc: 'Rare timepiece investment portfolio', roi: [25, 45], min: 25000, max: 250000 },
      { title: 'Classic Car Fleet', desc: 'Vintage automobile collection', roi: [20, 40], min: 50000, max: 500000 },
      { title: 'Fine Art Portfolio', desc: 'Contemporary Middle Eastern art', roi: [18, 35], min: 30000, max: 300000 },
      { title: 'Rare Whisky Casks', desc: 'Scottish single malt investment', roi: [22, 38], min: 20000, max: 200000 }
    ]
  },
  TRADE: {
    name: 'Trade & Inventory Pools',
    roi: [8, 18],
    timeline: [4, 8],
    deals: [
      { title: 'Electronics Import Pool', desc: 'Consumer electronics trading', roi: [12, 18], min: 10000, max: 100000 },
      { title: 'Fashion Inventory Fund', desc: 'Seasonal apparel wholesale', roi: [10, 16], min: 15000, max: 150000 },
      { title: 'Automotive Parts Trading', desc: 'Auto spare parts import/export', roi: [8, 14], min: 20000, max: 200000 },
      { title: 'FMCG Distribution Pool', desc: 'Fast-moving consumer goods', roi: [11, 17], min: 25000, max: 250000 }
    ]
  },
  EQUITY: {
    name: 'Equity / HoldCo',
    roi: [20, 50],
    timeline: [24, 60],
    deals: [
      { title: 'Tech Startup Series A', desc: 'AI-powered logistics platform', roi: [30, 50], min: 50000, max: 500000 },
      { title: 'Healthcare Services HoldCo', desc: 'Multi-clinic healthcare group', roi: [22, 35], min: 100000, max: 1000000 },
      { title: 'F&B Restaurant Group', desc: 'Multi-brand restaurant holding', roi: [20, 32], min: 75000, max: 750000 },
      { title: 'E-commerce Platform', desc: 'Regional online marketplace', roi: [28, 48], min: 60000, max: 600000 }
    ]
  }
};

// Generate Deals
function generateDeals() {
  const deals = [];
  let dealIndex = 1;

  Object.keys(DEAL_CATEGORIES).forEach(category => {
    const catData = DEAL_CATEGORIES[category];

    catData.deals.forEach(dealTemplate => {
      const roi = randomFloat(dealTemplate.roi[0], dealTemplate.roi[1], 1);
      const timeline = randomInt(catData.timeline[0], catData.timeline[1]);
      const targetAmount = randomInt(dealTemplate.max * 3, dealTemplate.max * 10);
      const startDate = randomDate(START_DATE, new Date('2024-06-01'));
      const monthsRunning = Math.floor((END_DATE - startDate) / (1000 * 60 * 60 * 24 * 30));

      let status = 'Active';
      let raisedPercent = randomInt(30, 95);

      if (monthsRunning > timeline) {
        status = 'Exited';
        raisedPercent = 100;
      } else if (raisedPercent >= 100) {
        status = 'Closed';
        raisedPercent = 100;
      }

      deals.push({
        dealId: `DEAL-${dealIndex.toString().padStart(3, '0')}`,
        title: dealTemplate.title,
        category: catData.name,
        type: category.toLowerCase(),
        description: dealTemplate.desc,
        minInvestment: dealTemplate.min,
        maxInvestment: dealTemplate.max,
        targetAmount: targetAmount,
        raisedAmount: Math.floor(targetAmount * raisedPercent / 100),
        annualRoi: roi,
        monthlyRoi: parseFloat((roi / 12).toFixed(2)),
        timeline: timeline,
        startDate: startDate.toISOString().split('T')[0],
        status: status,
        spvName: `SPV-${dealIndex.toString().padStart(3, '0')}`,
        investorCount: randomInt(15, 150),
        location: randomElement(LOCATIONS)
      });

      dealIndex++;
    });
  });

  // Add Bundle Deals
  const bundles = [
    { title: 'Balanced Growth Portfolio', types: ['FOCO', 'REAL_ESTATE', 'TRADE'], roi: [15, 22] },
    { title: 'Luxury Investment Mix', types: ['ALTERNATIVE', 'REAL_ESTATE', 'EQUITY'], roi: [18, 28] },
    { title: 'Smart Wealth Bundle', types: ['TRADE', 'FOCO', 'EQUITY'], roi: [16, 24] },
    { title: 'High Yield Package', types: ['FOCO', 'ALTERNATIVE', 'EQUITY'], roi: [22, 35] }
  ];

  bundles.forEach(bundle => {
    const roi = randomFloat(bundle.roi[0], bundle.roi[1], 1);
    const targetAmount = randomInt(500000, 2000000);
    const startDate = randomDate(START_DATE, new Date('2024-06-01'));

    deals.push({
      dealId: `BUNDLE-${dealIndex.toString().padStart(3, '0')}`,
      title: bundle.title,
      category: 'Bundled Portfolio',
      type: 'bundle',
      description: `Diversified portfolio across ${bundle.types.join(', ')}`,
      minInvestment: 50000,
      maxInvestment: 500000,
      targetAmount: targetAmount,
      raisedAmount: Math.floor(targetAmount * randomInt(60, 100) / 100),
      annualRoi: roi,
      monthlyRoi: parseFloat((roi / 12).toFixed(2)),
      timeline: 24,
      startDate: startDate.toISOString().split('T')[0],
      status: randomElement(['Active', 'Active', 'Closed']),
      spvName: `BUNDLE-SPV-${dealIndex.toString().padStart(3, '0')}`,
      investorCount: randomInt(30, 200),
      location: 'Multiple'
    });

    dealIndex++;
  });

  return deals;
}

// Generate Investors
function generateInvestors() {
  const investors = [];

  for (let i = 1; i <= 100; i++) {
    const firstName = randomElement(FIRST_NAMES);
    const lastName = randomElement(LAST_NAMES);
    const type = i <= 20 ? 'HNI' : 'Retail';
    const joinDate = randomDate(START_DATE, new Date('2024-06-01'));
    const totalInvested = type === 'HNI' ? randomInt(500000, 5000000) : randomInt(50000, 500000);
    const roi = randomFloat(12, 35, 2);
    const currentValue = Math.floor(totalInvested * (1 + roi / 100));

    investors.push({
      investorId: `INV-${i.toString().padStart(3, '0')}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(' ', '')}@example.ae`,
      city: randomElement(LOCATIONS),
      type: type,
      kycStatus: i <= 95, // 95% KYC approved
      joinedDate: joinDate.toISOString().split('T')[0],
      totalInvested: totalInvested,
      currentPortfolioValue: currentValue,
      totalRoi: roi,
      reinvestmentRate: randomFloat(20, 60, 1),
      activeDealsCount: randomInt(2, 8)
    });
  }

  return investors;
}

// Generate Investments
function generateInvestments(deals, investors) {
  const investments = [];
  let investmentId = 1;

  investors.forEach(investor => {
    const numInvestments = investor.activeDealsCount;
    const availableDeals = [...deals];
    const selectedDeals = [];

    for (let i = 0; i < numInvestments && availableDeals.length > 0; i++) {
      const deal = availableDeals.splice(randomInt(0, availableDeals.length - 1), 1)[0];
      selectedDeals.push(deal);
    }

    selectedDeals.forEach(deal => {
      const investmentAmount = randomInt(deal.minInvestment, Math.min(deal.maxInvestment, investor.totalInvested / 2));
      const investDate = randomDate(new Date(deal.startDate), new Date('2024-10-01'));
      const monthsHeld = Math.floor((END_DATE - investDate) / (1000 * 60 * 60 * 24 * 30));
      const roi = deal.annualRoi;
      const monthlyEarning = investmentAmount * (deal.monthlyRoi / 100);
      const totalEarnings = Math.floor(monthlyEarning * monthsHeld);
      const payoutsReceived = Math.floor(totalEarnings * randomFloat(0.6, 0.9));
      const unrealizedGains = totalEarnings - payoutsReceived;

      let status = 'Active';
      let exitValue = null;

      if (deal.status === 'Exited' && monthsHeld >= deal.timeline) {
        status = 'Exited';
        exitValue = Math.floor(investmentAmount * (1 + roi / 100));
      }

      investments.push({
        investmentId: `INV-${investmentId.toString().padStart(5, '0')}`,
        dealId: deal.dealId,
        investorId: investor.investorId,
        investmentDate: investDate.toISOString().split('T')[0],
        amountInvested: investmentAmount,
        roi: roi,
        status: status,
        monthsHeld: monthsHeld,
        monthlyEarning: parseFloat(monthlyEarning.toFixed(2)),
        totalEarnings: totalEarnings,
        payoutsReceived: payoutsReceived,
        unrealizedGains: unrealizedGains,
        exitValue: exitValue
      });

      investmentId++;
    });
  });

  return investments;
}

// Generate Transactions (36 months)
function generateTransactions(investments, investors, deals) {
  const transactions = [];
  let transactionId = 1;
  const startMonth = new Date('2022-01-01');

  for (let month = 0; month < 36; month++) {
    const currentMonth = new Date(startMonth);
    currentMonth.setMonth(startMonth.getMonth() + month);

    // Generate payouts
    investments.forEach(investment => {
      const investDate = new Date(investment.investmentDate);
      if (currentMonth >= investDate && investment.status === 'Active') {
        // Monthly payout
        const payoutAmount = investment.monthlyEarning;

        transactions.push({
          transactionId: `TXN-${transactionId.toString().padStart(6, '0')}`,
          type: 'payout',
          amount: parseFloat(payoutAmount.toFixed(2)),
          date: currentMonth.toISOString().split('T')[0],
          dealId: investment.dealId,
          investorId: investment.investorId,
          investmentId: investment.investmentId,
          description: 'Monthly ROI payout'
        });

        transactionId++;

        // Platform fee (2% of payout)
        const feeAmount = payoutAmount * 0.02;
        transactions.push({
          transactionId: `TXN-${transactionId.toString().padStart(6, '0')}`,
          type: 'fee',
          amount: parseFloat(feeAmount.toFixed(2)),
          date: currentMonth.toISOString().split('T')[0],
          dealId: investment.dealId,
          investorId: investment.investorId,
          investmentId: investment.investmentId,
          description: 'Platform management fee'
        });

        transactionId++;

        // Random reinvestment (30% chance)
        if (Math.random() < 0.3) {
          const reinvestAmount = Math.floor(payoutAmount * randomFloat(0.5, 1.0));
          const reinvestDeal = randomElement(deals.filter(d => d.status === 'Active'));

          if (reinvestDeal) {
            transactions.push({
              transactionId: `TXN-${transactionId.toString().padStart(6, '0')}`,
              type: 'reinvestment',
              amount: reinvestAmount,
              date: currentMonth.toISOString().split('T')[0],
              dealId: reinvestDeal.dealId,
              investorId: investment.investorId,
              investmentId: null,
              description: 'Earnings reinvestment'
            });

            transactionId++;
          }
        }
      }
    });

    // Generate exits
    investments.filter(inv => inv.status === 'Exited').forEach(investment => {
      const investDate = new Date(investment.investmentDate);
      const deal = deals.find(d => d.dealId === investment.dealId);

      if (deal && deal.status === 'Exited') {
        const exitMonth = new Date(investDate);
        exitMonth.setMonth(investDate.getMonth() + deal.timeline);

        if (currentMonth.getMonth() === exitMonth.getMonth() && currentMonth.getFullYear() === exitMonth.getFullYear()) {
          transactions.push({
            transactionId: `TXN-${transactionId.toString().padStart(6, '0')}`,
            type: 'exit',
            amount: investment.exitValue,
            date: currentMonth.toISOString().split('T')[0],
            dealId: investment.dealId,
            investorId: investment.investorId,
            investmentId: investment.investmentId,
            description: 'Investment exit payout'
          });

          transactionId++;
        }
      }
    });

    // Add new investments (random)
    if (Math.random() < 0.4) {
      const activeDeals = deals.filter(d => d.status === 'Active');
      const randomInvestor = randomElement(investors);
      const randomDeal = randomElement(activeDeals);

      if (randomDeal) {
        const investAmount = randomInt(randomDeal.minInvestment, randomDeal.maxInvestment);

        transactions.push({
          transactionId: `TXN-${transactionId.toString().padStart(6, '0')}`,
          type: 'investment',
          amount: investAmount,
          date: currentMonth.toISOString().split('T')[0],
          dealId: randomDeal.dealId,
          investorId: randomInvestor.investorId,
          investmentId: null,
          description: 'New investment'
        });

        transactionId++;
      }
    }
  }

  return transactions;
}

// Generate Platform Metrics
function generatePlatformMetrics(transactions, investors, deals) {
  const metrics = [];
  const startMonth = new Date('2022-01-01');

  for (let month = 0; month < 36; month++) {
    const currentMonth = new Date(startMonth);
    currentMonth.setMonth(startMonth.getMonth() + month);

    const monthTransactions = transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate.getMonth() === currentMonth.getMonth() && txDate.getFullYear() === currentMonth.getFullYear();
    });

    const newInvestments = monthTransactions.filter(t => t.type === 'investment').reduce((sum, t) => sum + t.amount, 0);
    const payouts = monthTransactions.filter(t => t.type === 'payout').reduce((sum, t) => sum + t.amount, 0);
    const fees = monthTransactions.filter(t => t.type === 'fee').reduce((sum, t) => sum + t.amount, 0);
    const exits = monthTransactions.filter(t => t.type === 'exit').reduce((sum, t) => sum + t.amount, 0);
    const reinvestments = monthTransactions.filter(t => t.type === 'reinvestment').reduce((sum, t) => sum + t.amount, 0);

    const newInvestorsCount = Math.floor(month === 0 ? 30 : randomInt(5, 15) * (1 + month / 36));
    const totalInvestors = Math.min(investors.length, 30 + Math.floor(newInvestorsCount * month / 2));
    const activeDeals = deals.filter(d => {
      const dealStartDate = new Date(d.startDate);
      return dealStartDate <= currentMonth && (d.status === 'Active' || d.status === 'Closed');
    }).length;

    const totalPortfolioValue = investors.slice(0, totalInvestors).reduce((sum, inv) => sum + inv.currentPortfolioValue, 0);
    const growthPercent = month === 0 ? 0 : randomFloat(2, 8, 2);

    metrics.push({
      month: currentMonth.toISOString().split('T')[0].substring(0, 7),
      newInvestors: newInvestorsCount,
      totalInvestors: totalInvestors,
      activeDeals: activeDeals,
      newInvestmentVolume: Math.floor(newInvestments),
      totalPayouts: Math.floor(payouts),
      platformFees: Math.floor(fees),
      exits: Math.floor(exits),
      reinvestments: Math.floor(reinvestments),
      totalPortfolioValue: Math.floor(totalPortfolioValue),
      platformRevenue: Math.floor(fees),
      platformExpenses: Math.floor(fees * 0.4),
      netProfit: Math.floor(fees * 0.6),
      portfolioGrowth: growthPercent
    });
  }

  return metrics;
}

// Main execution
console.log('🚀 Starting OWNLY 36-Month Simulation Data Generation...\n');

console.log('📋 Step 1: Generating Deals...');
const deals = generateDeals();
console.log(`✅ Generated ${deals.length} deals across all categories\n`);

console.log('👥 Step 2: Generating Investors...');
const investors = generateInvestors();
console.log(`✅ Generated ${investors.length} investors\n`);

console.log('💼 Step 3: Generating Investments...');
const investments = generateInvestments(deals, investors);
console.log(`✅ Generated ${investments.length} investment entries\n`);

console.log('💳 Step 4: Generating Transactions (36 months)...');
const transactions = generateTransactions(investments, investors, deals);
console.log(`✅ Generated ${transactions.length} transactions\n`);

console.log('📊 Step 5: Generating Platform Metrics...');
const platformMetrics = generatePlatformMetrics(transactions, investors, deals);
console.log(`✅ Generated ${platformMetrics.length} months of metrics\n`);

// Compile final dataset
const simulationData = {
  metadata: {
    generatedAt: new Date().toISOString(),
    period: '36 months (2022-01-01 to 2024-12-31)',
    currency: 'AED',
    totalDeals: deals.length,
    totalInvestors: investors.length,
    totalInvestments: investments.length,
    totalTransactions: transactions.length
  },
  deals,
  investors,
  investments,
  transactions,
  platformMetrics
};

// Save to file
const outputPath = './ownly-simulation-data.json';
fs.writeFileSync(outputPath, JSON.stringify(simulationData, null, 2));

console.log('✅ COMPLETE! Simulation data generated successfully\n');
console.log('📁 Output saved to:', outputPath);
console.log('\n📈 Summary Statistics:');
console.log(`   - Total Deals: ${deals.length}`);
console.log(`   - Total Investors: ${investors.length}`);
console.log(`   - Total Investments: ${investments.length}`);
console.log(`   - Total Transactions: ${transactions.length}`);
console.log(`   - Platform Metrics: ${platformMetrics.length} months`);
console.log(`   - Total Investment Volume: AED ${(transactions.filter(t => t.type === 'investment').reduce((sum, t) => sum + t.amount, 0) / 1000000).toFixed(2)}M`);
console.log(`   - Total Platform Revenue: AED ${(transactions.filter(t => t.type === 'fee').reduce((sum, t) => sum + t.amount, 0) / 1000000).toFixed(2)}M`);
console.log('\n🎉 Ready to import into OWNLY platform!\n');
