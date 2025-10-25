import { Deal, SPV } from '../models/index.js';
import sequelize from '../config/database.js';

const dealTypes = [
  { type: 'flip', label: 'Real Estate Flip' },
  { type: 'rental', label: 'Rental Property' },
  { type: 'franchise_unit', label: 'Franchise Unit' },
  { type: 'development', label: 'Development Project' }
];

const sampleDeals = [
  // Flip Deals
  {
    type: 'flip',
    title: 'Dubai Marina Luxury Apartment Flip',
    description: 'Premium 2-bedroom apartment in Dubai Marina requiring renovation. Located in a prime location with stunning marina views. The property will undergo complete interior renovation including modern kitchen, bathrooms, flooring, and smart home features. Expected completion in 6 months with strong exit strategy through direct sale or rental.',
    location: 'Dubai Marina, UAE',
    jurisdiction: 'DIFC',
    target_amount: 2500000,
    raised_amount: 1875000,
    min_ticket: 25000,
    expected_roi: 35,
    expected_irr: 42,
    holding_period_months: 6,
    status: 'open',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    investor_count: 75
  },
  {
    type: 'flip',
    title: 'Abu Dhabi Villa Renovation Project',
    description: 'Spacious 4-bedroom villa in Al Raha Gardens requiring complete modernization. Prime location near schools and amenities. Full renovation includes exterior facelift, interior redesign, landscaping, and pool upgrade. Strong market demand in this family-friendly community.',
    location: 'Al Raha Gardens, Abu Dhabi',
    jurisdiction: 'ADGM',
    target_amount: 3500000,
    raised_amount: 875000,
    min_ticket: 50000,
    expected_roi: 28,
    expected_irr: 35,
    holding_period_months: 8,
    status: 'open',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    investor_count: 18
  },

  // Rental Properties
  {
    type: 'rental',
    title: 'Downtown Dubai Studio Portfolio',
    description: 'Portfolio of 5 studio apartments in high-demand downtown location. Currently generating consistent rental income with long-term tenants. Properties are fully furnished and managed by professional property management company. Expected annual yield of 8-10% with potential for capital appreciation.',
    location: 'Downtown Dubai, UAE',
    jurisdiction: 'DIFC',
    target_amount: 5000000,
    raised_amount: 4250000,
    min_ticket: 100000,
    expected_roi: 45,
    expected_irr: 9,
    holding_period_months: 60,
    status: 'open',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
    investor_count: 43
  },
  {
    type: 'rental',
    title: 'Sharjah Residential Complex',
    description: 'Modern residential building with 12 units (2BR and 3BR apartments) in established Sharjah community. High occupancy rate of 95%. Professional property management in place. Stable rental income with indexed annual increases. Ideal for long-term passive income investors.',
    location: 'Al Majaz, Sharjah',
    jurisdiction: 'Sharjah',
    target_amount: 8000000,
    raised_amount: 3200000,
    min_ticket: 75000,
    expected_roi: 52,
    expected_irr: 8.5,
    holding_period_months: 72,
    status: 'open',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    investor_count: 43
  },

  // Franchise Units
  {
    type: 'franchise_unit',
    title: 'Premium Coffee Chain - Dubai Mall',
    description: 'Established international coffee chain franchise opportunity in Dubai Mall - one of the world\'s most visited shopping destinations. Fully operational unit with proven track record. Includes all equipment, trained staff, and ongoing brand support. Average daily footfall of 5000+ customers. Strong brand recognition and loyalty.',
    location: 'Dubai Mall, Dubai',
    jurisdiction: 'DIFC',
    target_amount: 1500000,
    raised_amount: 1125000,
    min_ticket: 50000,
    expected_roi: 32,
    expected_irr: 18,
    holding_period_months: 36,
    status: 'open',
    images: ['https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800'],
    investor_count: 23
  },
  {
    type: 'franchise_unit',
    title: 'Fast Food Franchise - Abu Dhabi Airport',
    description: 'High-traffic fast food franchise at Abu Dhabi International Airport. Prime location with captive audience of international travelers. Operating 24/7 with multiple revenue streams. Proven business model with comprehensive training and support. Existing workforce and management team included.',
    location: 'Abu Dhabi Airport, UAE',
    jurisdiction: 'ADGM',
    target_amount: 2000000,
    raised_amount: 500000,
    min_ticket: 100000,
    expected_roi: 38,
    expected_irr: 22,
    holding_period_months: 48,
    status: 'open',
    images: ['https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800'],
    investor_count: 5
  },

  // Development Projects
  {
    type: 'development',
    title: 'Waterfront Mixed-Use Development',
    description: 'Ambitious mixed-use development project combining residential, retail, and hospitality components. Prime waterfront location with 200m of beach frontage. Development includes 150 luxury apartments, 20 retail units, and 4-star hotel. All permits approved. Experienced developer with strong track record. Phase 1 construction already underway.',
    location: 'Jumeirah Beach, Dubai',
    jurisdiction: 'DIFC',
    target_amount: 50000000,
    raised_amount: 35000000,
    min_ticket: 500000,
    expected_roi: 85,
    expected_irr: 25,
    holding_period_months: 48,
    status: 'open',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
    investor_count: 70
  },
  {
    type: 'development',
    title: 'Smart City Residential Towers',
    description: 'Twin residential towers development in upcoming smart city zone. Total of 400 units with cutting-edge smart home technology and sustainable design. Green building certified. Strong pre-sale interest with 30% of units already committed. Government incentives for smart city developments. Expected handover in 36 months.',
    location: 'Dubai South, UAE',
    jurisdiction: 'DIFC',
    target_amount: 75000000,
    raised_amount: 22500000,
    min_ticket: 250000,
    expected_roi: 95,
    expected_irr: 28,
    holding_period_months: 42,
    status: 'open',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    investor_count: 90
  }
];

async function createSampleDeals() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Check existing deals
    const existingDeals = await Deal.findAll();
    console.log(`\nFound ${existingDeals.length} existing deals`);

    const dealsByType = {};
    existingDeals.forEach(deal => {
      dealsByType[deal.type] = (dealsByType[deal.type] || 0) + 1;
    });

    console.log('\nDeals by type:');
    console.log(JSON.stringify(dealsByType, null, 2));

    // Check which types need deals
    const typesNeeded = dealTypes.filter(dt => !dealsByType[dt.type] || dealsByType[dt.type] < 2);

    if (typesNeeded.length === 0) {
      console.log('\n✅ All deal types have sufficient deals!');
      process.exit(0);
    }

    console.log('\n📝 Creating sample deals for types:', typesNeeded.map(t => t.label).join(', '));

    // Create deals and SPVs
    let created = 0;
    for (const dealData of sampleDeals) {
      // Check if this type needs deals
      if (!typesNeeded.find(t => t.type === dealData.type)) {
        continue;
      }

      // Check if deal already exists by title
      const exists = await Deal.findOne({ where: { title: dealData.title } });
      if (exists) {
        console.log(`⏭️  Skipping "${dealData.title}" - already exists`);
        continue;
      }

      // Create SPV first
      const spv = await SPV.create({
        spv_name: `SPV - ${dealData.title}`,
        total_shares: Math.floor(dealData.target_amount / 100),
        issued_shares: Math.floor(dealData.raised_amount / 100),
        share_price: 100
      });

      // Create deal
      await Deal.create({
        ...dealData,
        spv_id: spv.id
      });

      created++;
      console.log(`✅ Created: [${dealData.type}] ${dealData.title}`);
    }

    console.log(`\n🎉 Successfully created ${created} new deals!`);

    // Show updated stats
    const updatedDeals = await Deal.findAll();
    const updatedTypes = {};
    updatedDeals.forEach(deal => {
      updatedTypes[deal.type] = (updatedTypes[deal.type] || 0) + 1;
    });

    console.log('\n📊 Updated deals by type:');
    console.log(JSON.stringify(updatedTypes, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createSampleDeals();
