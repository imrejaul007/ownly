import { Deal, SPV, Investment, Transaction, Wallet, User } from '../models/index.js';
import sequelize from '../config/database.js';

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function createAdditionalDeals() {
  const t = await sequelize.transaction();

  try {
    console.log('🚀 Creating 30+ additional diverse deals...\n');

    // Get Fatima's user account
    const fatima = await User.findOne({ where: { email: 'fatima.alhashimi@example.ae' } });
    if (!fatima) {
      throw new Error('User Fatima not found');
    }

    const additionalDeals = [
      // ==================== REAL ESTATE - 10 deals ====================
      {
        title: 'Business Bay Office Tower - 15th Floor Units',
        type: 'real_estate',
        location: 'Business Bay, Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 180000,
        max_ticket: 250000,
        target_amount: 3500000,
        expected_roi: 11.5,
        expected_irr: 10.8,
        holding_period_months: 36,
        status: 'open',
        description: 'Premium office spaces in Grade A tower with flexible layouts, modern amenities, metro connectivity, and high-profile tenants. Ideal for corporate rental income.',
        images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
        investment_amount: 200000,
        subcategory: 'commercial_office'
      },
      {
        title: 'Palm Jumeirah Beachfront Villa Pool',
        type: 'real_estate',
        location: 'Palm Jumeirah, Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 500000,
        max_ticket: 750000,
        target_amount: 8000000,
        expected_roi: 9.8,
        expected_irr: 9.2,
        holding_period_months: 48,
        status: 'open',
        description: 'Luxury beachfront villa with private pool, direct beach access, premium finishes, and strong vacation rental potential in Dubai\'s most exclusive location.',
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
        investment_amount: 600000,
        subcategory: 'luxury_residential'
      },
      {
        title: 'JLT Serviced Apartments Complex',
        type: 'real_estate',
        location: 'Jumeirah Lake Towers, Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 100000,
        max_ticket: 150000,
        target_amount: 2000000,
        expected_roi: 13.2,
        expected_irr: 12.5,
        holding_period_months: 24,
        status: 'open',
        description: 'Fully furnished serviced apartments with hotel-style amenities, professional management, and strong corporate rental demand in prime JLT location.',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
        investment_amount: 120000,
        subcategory: 'serviced_apartments'
      },
      {
        title: 'Dubai Hills Mall Retail Units',
        type: 'real_estate',
        location: 'Dubai Hills Estate',
        jurisdiction: 'Dubai',
        min_ticket: 250000,
        max_ticket: 350000,
        target_amount: 4000000,
        expected_roi: 10.5,
        expected_irr: 9.9,
        holding_period_months: 30,
        status: 'open',
        description: 'Ground floor retail units in upscale Dubai Hills Mall with high foot traffic, premium tenant mix, and established rental yields.',
        images: ['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800'],
        investment_amount: 280000,
        subcategory: 'retail_space'
      },
      {
        title: 'Motor City Townhouse Community',
        type: 'real_estate',
        location: 'Motor City, Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 75000,
        max_ticket: 120000,
        target_amount: 1500000,
        expected_roi: 12.8,
        expected_irr: 12.1,
        holding_period_months: 24,
        status: 'open',
        description: 'Family-oriented townhouse units with gardens, community amenities, schools nearby, and strong long-term rental demand from expat families.',
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
        investment_amount: 95000,
        subcategory: 'townhouse'
      },
      {
        title: 'Downtown Dubai Parking Bay Investment',
        type: 'real_estate',
        location: 'Downtown Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 45000,
        max_ticket: 60000,
        target_amount: 750000,
        expected_roi: 8.5,
        expected_irr: 8.0,
        holding_period_months: 60,
        status: 'open',
        description: 'Prime parking bays in Downtown Dubai with guaranteed rental income, minimal maintenance, and strong capital appreciation potential.',
        images: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800'],
        investment_amount: 50000,
        subcategory: 'parking'
      },
      {
        title: 'Arabian Ranches Golf Villa Estate',
        type: 'real_estate',
        location: 'Arabian Ranches, Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 300000,
        max_ticket: 450000,
        target_amount: 5000000,
        expected_roi: 10.2,
        expected_irr: 9.7,
        holding_period_months: 36,
        status: 'open',
        description: 'Luxury golf course villas with exclusive community, championship golf course access, family-friendly amenities, and premium rental yields.',
        images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
        investment_amount: 350000,
        subcategory: 'golf_villa'
      },
      {
        title: 'Healthcare Clinic Spaces - DIP',
        type: 'real_estate',
        location: 'Dubai Investment Park',
        jurisdiction: 'Dubai',
        min_ticket: 150000,
        max_ticket: 200000,
        target_amount: 2500000,
        expected_roi: 11.8,
        expected_irr: 11.2,
        holding_period_months: 36,
        status: 'open',
        description: 'Purpose-built medical clinic spaces with healthcare zone approvals, growing demand, and stable rental income from medical practitioners.',
        images: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800'],
        investment_amount: 170000,
        subcategory: 'medical'
      },
      {
        title: 'Warehouse Complex - Jebel Ali Free Zone',
        type: 'real_estate',
        location: 'Jebel Ali, Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 200000,
        max_ticket: 300000,
        target_amount: 3500000,
        expected_roi: 9.5,
        expected_irr: 9.0,
        holding_period_months: 48,
        status: 'open',
        description: 'Industrial warehouse units in free zone with logistics advantages, high ceiling heights, and long-term corporate lease agreements.',
        images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'],
        investment_amount: 240000,
        subcategory: 'industrial'
      },
      {
        title: 'Knowledge Park Educational Building',
        type: 'real_estate',
        location: 'Dubai Knowledge Park',
        jurisdiction: 'Dubai',
        min_ticket: 180000,
        max_ticket: 250000,
        target_amount: 3000000,
        expected_roi: 10.8,
        expected_irr: 10.2,
        holding_period_months: 36,
        status: 'open',
        description: 'Educational facility with classrooms, training centers, and strong demand from academic institutions and corporate training providers.',
        images: ['https://images.unsplash.com/photo-1562774053-701939374585?w=800'],
        investment_amount: 210000,
        subcategory: 'educational'
      },

      // ==================== FRANCHISES - 8 deals ====================
      {
        title: 'Burger King - Dubai Festival City',
        type: 'franchise',
        location: 'Festival City, Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 400000,
        max_ticket: 500000,
        target_amount: 800000,
        expected_roi: 32,
        expected_irr: 29,
        holding_period_months: 12,
        status: 'open',
        description: 'Established Burger King franchise in high-traffic mall location with proven sales track record, brand recognition, and operational support.',
        images: ['https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800'],
        investment_amount: 450000,
        subcategory: 'quick_service_restaurant'
      },
      {
        title: 'The Coffee Club - JBR Walk',
        type: 'franchise',
        location: 'Jumeirah Beach Residence',
        jurisdiction: 'Dubai',
        min_ticket: 350000,
        max_ticket: 450000,
        target_amount: 700000,
        expected_roi: 38,
        expected_irr: 35,
        holding_period_months: 10,
        status: 'open',
        description: 'Premium café franchise with beachfront location, strong breakfast and brunch demand, and high-margin food and beverage sales.',
        images: ['https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800'],
        investment_amount: 380000,
        subcategory: 'cafe'
      },
      {
        title: 'Anytime Fitness - Dubai Marina',
        type: 'franchise',
        location: 'Dubai Marina',
        jurisdiction: 'Dubai',
        min_ticket: 300000,
        max_ticket: 400000,
        target_amount: 600000,
        expected_roi: 42,
        expected_irr: 38,
        holding_period_months: 12,
        status: 'open',
        description: '24/7 fitness franchise in high-density residential area with strong membership base, recurring revenue model, and minimal staffing requirements.',
        images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'],
        investment_amount: 340000,
        subcategory: 'fitness'
      },
      {
        title: 'Papa Johns - International City',
        type: 'franchise',
        location: 'International City, Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 280000,
        max_ticket: 350000,
        target_amount: 550000,
        expected_roi: 36,
        expected_irr: 33,
        holding_period_months: 10,
        status: 'open',
        description: 'Pizza delivery franchise in high-density residential area with strong online ordering, delivery focus, and established customer base.',
        images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'],
        investment_amount: 310000,
        subcategory: 'pizza'
      },
      {
        title: 'Talabat Kitchen Cloud Kitchen Hub',
        type: 'franchise',
        location: 'Al Quoz, Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 200000,
        max_ticket: 280000,
        target_amount: 450000,
        expected_roi: 55,
        expected_irr: 50,
        holding_period_months: 8,
        status: 'open',
        description: 'Cloud kitchen franchise with multiple virtual brands, delivery-only model, lower overhead, and high-margin online food business.',
        images: ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800'],
        investment_amount: 230000,
        subcategory: 'cloud_kitchen'
      },
      {
        title: 'Supercuts Hair Salon - Dubai Mall',
        type: 'franchise',
        location: 'Dubai Mall',
        jurisdiction: 'Dubai',
        min_ticket: 250000,
        max_ticket: 320000,
        target_amount: 500000,
        expected_roi: 44,
        expected_irr: 40,
        holding_period_months: 10,
        status: 'open',
        description: 'Hair salon franchise in world\'s busiest mall with high foot traffic, walk-in customers, and premium pricing power.',
        images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'],
        investment_amount: 280000,
        subcategory: 'salon'
      },
      {
        title: 'Cold Stone Creamery - City Walk',
        type: 'franchise',
        location: 'City Walk, Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 320000,
        max_ticket: 400000,
        target_amount: 650000,
        expected_roi: 40,
        expected_irr: 37,
        holding_period_months: 10,
        status: 'open',
        description: 'Premium ice cream franchise in lifestyle destination with strong brand, experiential service, and high-margin products.',
        images: ['https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800'],
        investment_amount: 350000,
        subcategory: 'dessert'
      },
      {
        title: 'Pinkberry Frozen Yogurt - Mall of Emirates',
        type: 'franchise',
        location: 'Mall of Emirates',
        jurisdiction: 'Dubai',
        min_ticket: 280000,
        max_ticket: 350000,
        target_amount: 550000,
        expected_roi: 38,
        expected_irr: 35,
        holding_period_months: 10,
        status: 'open',
        description: 'Healthy frozen dessert franchise with premium mall location, health-conscious customer base, and strong repeat business.',
        images: ['https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=800'],
        investment_amount: 310000,
        subcategory: 'frozen_dessert'
      },

      // ==================== STARTUPS - 6 deals ====================
      {
        title: 'FoodFlow - Restaurant Supply Chain SaaS',
        type: 'startup',
        location: 'Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 50000,
        max_ticket: 100000,
        target_amount: 800000,
        expected_roi: 220,
        expected_irr: 200,
        holding_period_months: 36,
        status: 'open',
        description: 'B2B SaaS platform connecting restaurants with suppliers, inventory management, automated ordering, and strong traction with 150+ restaurants.',
        images: ['https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800'],
        investment_amount: 70000,
        subcategory: 'foodtech'
      },
      {
        title: 'PropTech Dubai - Real Estate Management Platform',
        type: 'startup',
        location: 'Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 60000,
        max_ticket: 120000,
        target_amount: 1000000,
        expected_roi: 180,
        expected_irr: 165,
        holding_period_months: 36,
        status: 'open',
        description: 'All-in-one property management software for landlords, agents, and tenants with digital payments, maintenance tracking, and document management.',
        images: ['https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800'],
        investment_amount: 85000,
        subcategory: 'proptech'
      },
      {
        title: 'CareerGulf - Regional Job Marketplace',
        type: 'startup',
        location: 'Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 40000,
        max_ticket: 80000,
        target_amount: 600000,
        expected_roi: 190,
        expected_irr: 175,
        holding_period_months: 30,
        status: 'open',
        description: 'AI-powered job matching platform for Middle East with 50K+ active users, employer dashboard, and revenue from premium job postings.',
        images: ['https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800'],
        investment_amount: 55000,
        subcategory: 'hrtech'
      },
      {
        title: 'GreenMile - EV Charging Network',
        type: 'startup',
        location: 'UAE',
        jurisdiction: 'Dubai',
        min_ticket: 100000,
        max_ticket: 200000,
        target_amount: 2000000,
        expected_roi: 150,
        expected_irr: 140,
        holding_period_months: 48,
        status: 'open',
        description: 'Electric vehicle charging infrastructure with app-based payment, 30+ locations operational, and government support for sustainable transport.',
        images: ['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800'],
        investment_amount: 140000,
        subcategory: 'greentech'
      },
      {
        title: 'BeautyBox - Salon Booking App',
        type: 'startup',
        location: 'Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 35000,
        max_ticket: 70000,
        target_amount: 500000,
        expected_roi: 210,
        expected_irr: 195,
        holding_period_months: 30,
        status: 'open',
        description: 'On-demand beauty services marketplace connecting customers with salons and freelance beauty professionals, 200+ providers on platform.',
        images: ['https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800'],
        investment_amount: 48000,
        subcategory: 'beautytech'
      },
      {
        title: 'PetPal - Pet Care Marketplace',
        type: 'startup',
        location: 'Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 30000,
        max_ticket: 60000,
        target_amount: 400000,
        expected_roi: 170,
        expected_irr: 160,
        holding_period_months: 30,
        status: 'open',
        description: 'Pet services platform for grooming, vet visits, pet sitting, and supplies with subscription model and 5K+ active pet owners.',
        images: ['https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800'],
        investment_amount: 42000,
        subcategory: 'pettech'
      },

      // ==================== LUXURY ASSETS - 6 deals ====================
      {
        title: 'Ferrari F8 Tributo Rental Fleet',
        type: 'asset',
        location: 'Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 200000,
        max_ticket: 300000,
        target_amount: 1500000,
        expected_roi: 24,
        expected_irr: 22,
        holding_period_months: 18,
        status: 'open',
        description: 'Ferrari F8 Tributo for luxury car rental with strong demand from tourists, wedding events, and corporate bookings. Professional fleet management included.',
        images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800'],
        investment_amount: 240000,
        subcategory: 'luxury_car'
      },
      {
        title: 'Rolex Watch Collection Investment',
        type: 'asset',
        location: 'Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 80000,
        max_ticket: 150000,
        target_amount: 800000,
        expected_roi: 18,
        expected_irr: 16,
        holding_period_months: 24,
        status: 'open',
        description: 'Curated collection of Rolex Submariner and GMT-Master II models with proven appreciation, authentication certificates, and secure storage.',
        images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800'],
        investment_amount: 110000,
        subcategory: 'watches'
      },
      {
        title: 'Private Jet Fractional Ownership',
        type: 'asset',
        location: 'Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 500000,
        max_ticket: 1000000,
        target_amount: 8000000,
        expected_roi: 12,
        expected_irr: 11,
        holding_period_months: 36,
        status: 'open',
        description: 'Fractional ownership in Gulfstream G650 with charter revenue, professional management, and access to private aviation network.',
        images: ['https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800'],
        investment_amount: 680000,
        subcategory: 'aviation'
      },
      {
        title: 'Luxury Yacht Sunseeker 75',
        type: 'asset',
        location: 'Dubai Marina',
        jurisdiction: 'Dubai',
        min_ticket: 400000,
        max_ticket: 600000,
        target_amount: 3500000,
        expected_roi: 16,
        expected_irr: 14,
        holding_period_months: 24,
        status: 'open',
        description: '75-foot Sunseeker yacht for charter and events with professional crew, marina berth, and strong booking demand from corporate and private clients.',
        images: ['https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800'],
        investment_amount: 480000,
        subcategory: 'yacht'
      },
      {
        title: 'Art Collection - Contemporary Middle Eastern Artists',
        type: 'asset',
        location: 'Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 60000,
        max_ticket: 120000,
        target_amount: 600000,
        expected_roi: 25,
        expected_irr: 22,
        holding_period_months: 36,
        status: 'open',
        description: 'Curated collection of contemporary art from emerging Middle Eastern artists with gallery representation, authentication, and appreciation potential.',
        images: ['https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800'],
        investment_amount: 85000,
        subcategory: 'art'
      },
      {
        title: 'Vintage Wine Cellar Portfolio',
        type: 'asset',
        location: 'Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 50000,
        max_ticket: 100000,
        target_amount: 400000,
        expected_roi: 20,
        expected_irr: 18,
        holding_period_months: 48,
        status: 'open',
        description: 'Investment-grade vintage wines from Bordeaux and Burgundy with professional storage, provenance documentation, and strong appreciation history.',
        images: ['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800'],
        investment_amount: 70000,
        subcategory: 'wine'
      }
    ];

    let successCount = 0;
    let totalInvested = 0;

    for (const dealData of additionalDeals) {
      const { investment_amount, subcategory, ...dealFields } = dealData;

      // Generate slug
      dealFields.slug = generateSlug(dealFields.title);

      // Create the deal
      const deal = await Deal.create(dealFields, { transaction: t });

      // Create SPV for the deal
      const spv = await SPV.create({
        deal_id: deal.id,
        spv_name: `${deal.title} SPV`,
        jurisdiction: deal.jurisdiction,
        registration_number: `SPV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        legal_structure: 'Limited Liability Company',
        status: 'active',
        total_shares: 10000,
        shares_issued: Math.floor((investment_amount / deal.min_ticket) * 1000),
        share_price: 100,
        incorporation_date: new Date(),
        registration_documents: [],
      }, { transaction: t });

      // Calculate shares for investment
      const sharesIssued = Math.floor(investment_amount / spv.share_price);

      // Create investment record for Fatima
      const investment = await Investment.create({
        user_id: fatima.id,
        deal_id: deal.id,
        spv_id: spv.id,
        amount: investment_amount,
        shares_issued: sharesIssued,
        share_price: spv.share_price,
        status: 'active',
        invested_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      }, { transaction: t });

      // Create transaction record
      await Transaction.create({
        user_id: fatima.id,
        type: 'investment',
        amount: -investment_amount,
        currency: 'AED',
        status: 'completed',
        description: `Investment in ${deal.title}`,
        reference_id: investment.id,
        reference_type: 'Investment',
        metadata: {
          deal_id: deal.id,
          deal_title: deal.title,
          shares: sharesIssued,
          share_price: spv.share_price
        },
      }, { transaction: t });

      // Update wallet
      const wallet = await Wallet.findOne({ where: { user_id: fatima.id } });
      await wallet.update({
        available_balance: parseFloat(wallet.available_balance || 0) - investment_amount,
        invested_balance: parseFloat(wallet.invested_balance || 0) + investment_amount,
      }, { transaction: t });

      totalInvested += investment_amount;
      successCount++;
      console.log(`✅ Created ${successCount}: ${deal.title} (${deal.type}) - AED ${investment_amount.toLocaleString()}`);
    }

    await t.commit();

    console.log('\n' + '='.repeat(80));
    console.log('✅ ADDITIONAL DEALS CREATION COMPLETED');
    console.log('='.repeat(80));
    console.log(`Total Deals Created: ${successCount}`);
    console.log(`Total Investment Amount: AED ${totalInvested.toLocaleString()}`);
    console.log('\nBreakdown by Category:');
    console.log('  Real Estate: 10 deals');
    console.log('  Franchises: 8 deals');
    console.log('  Startups: 6 deals');
    console.log('  Luxury Assets: 6 deals');
    console.log('\n' + '='.repeat(80) + '\n');

    process.exit(0);
  } catch (error) {
    await t.rollback();
    console.error('❌ Error creating additional deals:', error);
    process.exit(1);
  }
}

createAdditionalDeals();
