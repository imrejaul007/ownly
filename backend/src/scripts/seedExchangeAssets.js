import sequelize from '../config/database.js';
import Deal from '../models/Deal.js';
import ExchangeAsset from '../models/ExchangeAsset.js';
import MarketData from '../models/MarketData.js';

/**
 * Convert existing deals into tradable exchange assets
 *
 * Symbol Format:
 * - Franchise: WHF-DXB (Whiff Theory Dubai)
 * - Property: APT-MRN (Apartment Marina)
 * - Luxury: YCH-001 (Yacht 001)
 */

const symbolMap = {
  // Franchise deals
  'whiff theory': 'WHF',
  'aroma souq': 'ARO',
  'glowzy': 'GLZ',
  'fitearn': 'FIT',
  'petzy': 'PET',

  // Property deals
  'apartment': 'APT',
  'villa': 'VIL',
  'office': 'OFF',
  'shop': 'SHP',
  'warehouse': 'WRH',

  // Luxury deals
  'yacht': 'YCH',
  'car': 'CAR',
  'pod': 'POD',

  // Inventory deals
  'perfume': 'PRF',
  'batch': 'BTH',
};

const locationCodes = {
  'dubai': 'DXB',
  'abu dhabi': 'AUH',
  'sharjah': 'SHJ',
  'ajman': 'AJM',
  'ras al khaimah': 'RAK',
  'fujairah': 'FUJ',
};

function generateSymbol(deal) {
  const titleLower = deal.title.toLowerCase();
  const locationLower = (deal.location || '').toLowerCase();

  // Find matching symbol prefix
  let prefix = 'AST'; // Default
  for (const [key, value] of Object.entries(symbolMap)) {
    if (titleLower.includes(key)) {
      prefix = value;
      break;
    }
  }

  // Find location code
  let suffix = 'UAE';
  for (const [key, value] of Object.entries(locationCodes)) {
    if (locationLower.includes(key)) {
      suffix = value;
      break;
    }
  }

  return `${prefix}-${suffix}`;
}

function determineMarketCategory(dealType) {
  const categoryMap = {
    'foco_franchise': 'franchise',
    'fofo_franchise': 'franchise',
    'commercial_real_estate': 'property',
    'residential_real_estate': 'property',
    'luxury_asset': 'luxury',
    'inventory_deal': 'inventory',
    'private_equity': 'equity',
  };

  return categoryMap[dealType] || 'property';
}

async function seedExchangeAssets() {
  try {
    console.log('\n🚀 Starting Exchange Asset Seeding...\n');

    // Get all published deals
    const deals = await Deal.findAll({
      where: {
        status: { [sequelize.Sequelize.Op.in]: ['open', 'funding', 'funded'] }
      }
    });

    console.log(`📊 Found ${deals.length} deals to convert to exchange assets\n`);

    let created = 0;
    let skipped = 0;

    for (const deal of deals) {
      try {
        const symbol = generateSymbol(deal);

        // Check if already exists
        const existing = await ExchangeAsset.findOne({ where: { symbol } });
        if (existing) {
          console.log(`⏭️  Skipping ${symbol} - already exists`);
          skipped++;
          continue;
        }

        // Calculate tokenization
        const targetAmount = parseFloat(deal.target_amount || 0);
        const minTicket = parseFloat(deal.min_ticket || 1000);
        const unitPrice = minTicket; // Each unit = min ticket size
        const totalUnits = Math.floor(targetAmount / unitPrice);
        const raisedAmount = parseFloat(deal.raised_amount || 0);
        const soldUnits = Math.floor(raisedAmount / unitPrice);
        const availableUnits = totalUnits - soldUnits;

        // Determine trading phase
        let tradingPhase = 'primary';
        if (deal.status === 'funded') {
          tradingPhase = 'secondary';
        }

        // Create exchange asset
        const asset = await ExchangeAsset.create({
          deal_id: deal.id,
          symbol,
          market_category: determineMarketCategory(deal.type),
          total_units: totalUnits,
          unit_price_initial: unitPrice,
          current_price: unitPrice,
          available_units: availableUnits,
          market_cap: targetAmount,
          daily_volume: 0,
          price_change_24h: 0,
          trading_phase: tradingPhase,
          listing_date: deal.created_at || new Date(),
          demand_index: 50,
          sentiment_score: 55,
          roi_to_date: 0,
          week_high: unitPrice * 1.05,
          week_low: unitPrice * 0.95,
          all_time_high: unitPrice,
          all_time_low: unitPrice,
          metadata: {
            news: [
              {
                date: new Date(),
                title: `${deal.title} Listed on OWNLY Exchange`,
                content: `Now trading on the OWNLY Exchange under symbol ${symbol}`,
                sentiment: 'positive'
              }
            ]
          }
        });

        // Create initial market data (last 30 days)
        const marketDataPoints = [];
        for (let i = 30; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);

          // Slight price variation for history
          const priceVariation = 1 + (Math.random() - 0.5) * 0.02; // ±1%
          const historicalPrice = unitPrice * priceVariation;

          marketDataPoints.push({
            asset_id: asset.id,
            timestamp: date,
            open_price: historicalPrice,
            high_price: historicalPrice * 1.01,
            low_price: historicalPrice * 0.99,
            close_price: historicalPrice,
            volume: Math.random() * 10000,
            trade_count: Math.floor(Math.random() * 20),
            interval: '1d'
          });
        }

        await MarketData.bulkCreate(marketDataPoints);

        console.log(`✅ Created ${symbol} - ${deal.title}`);
        console.log(`   Category: ${asset.market_category} | Units: ${totalUnits} | Price: AED ${unitPrice}`);
        created++;

      } catch (error) {
        console.error(`❌ Error processing ${deal.title}:`, error.message);
      }
    }

    console.log(`\n📈 Exchange Seeding Complete!`);
    console.log(`   ✅ Created: ${created} assets`);
    console.log(`   ⏭️  Skipped: ${skipped} existing assets`);
    console.log(`   📊 Total: ${created + skipped} assets on exchange\n`);

    // Show market summary
    const marketSummary = await ExchangeAsset.findAll({
      attributes: [
        'market_category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('market_cap')), 'total_market_cap'],
      ],
      group: ['market_category'],
    });

    console.log('📊 Market Summary:');
    marketSummary.forEach(market => {
      console.log(`   ${market.market_category}: ${market.get('count')} assets, AED ${parseFloat(market.get('total_market_cap')).toLocaleString()} market cap`);
    });

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedExchangeAssets()
    .then(() => {
      console.log('\n✨ Done!\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Fatal error:', error);
      process.exit(1);
    });
}

export default seedExchangeAssets;
