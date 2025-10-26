import { Deal, SPV, Investment, User, Wallet, Transaction } from '../models/index.js';
import sequelize from '../config/database.js';

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/-+/g, '-')            // Replace multiple hyphens with single hyphen
    .trim();
}

async function createComprehensiveDeals() {
  try {
    console.log('Starting comprehensive deals creation...');

    // Find Fatima
    const fatima = await User.findOne({ where: { email: 'fatima.alhashimi@example.ae' } });
    if (!fatima) {
      console.error('Fatima not found');
      return;
    }

    // Get or create Fatima's wallet
    let wallet = await Wallet.findOne({ where: { user_id: fatima.id } });
    if (!wallet) {
      wallet = await Wallet.create({
        user_id: fatima.id,
        available_balance: 500000,
        invested_balance: 0,
        pending_balance: 0,
      });
    } else {
      // Add more balance
      await wallet.update({ available_balance: parseFloat(wallet.available_balance) + 500000 });
    }

    const dealsData = [
      // ===== REAL ESTATE DEALS =====

      // 1. Residential Real Estate - Apartment
      {
        title: 'Marina View Apartment - JBR',
        description: `Prime 2-bedroom apartment in Jumeirah Beach Residence with stunning marina views.

Key Features:
• Fully furnished luxury unit
• Pool and gym access
• Prime location near beaches
• High rental demand area
• Professional property management

Investment Highlights:
• Stable rental income from long-term tenant
• Appreciation potential in premium location
• Well-maintained building with amenities
• Strong Dubai real estate fundamentals`,
        type: 'real_estate',
        category: 'residential_property',
        location: 'Jumeirah Beach Residence, Dubai',
        jurisdiction: 'UAE',
        min_ticket: 15000,
        max_ticket: 150000,
        target_amount: 450000,
        expected_roi: 12,
        expected_irr: 10,
        holding_period_months: 24,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
        investment_amount: 25000,
        subcategory: 'apartment'
      },

      // 2. Commercial Real Estate - Office Space
      {
        title: 'Business Bay Office Tower - Floor 12',
        description: `Grade-A office space in Business Bay with multinational tenant on 5-year lease.

Property Details:
• 3,500 sq ft premium office space
• Floor 12 with skyline views
• Existing tenant: Tech company
• 5-year lease agreement signed
• Annual rent escalation: 5%

Investment Benefits:
• Corporate tenant with strong credit
• Long-term lease security
• Prime business district location
• Consistent cash flow generation`,
        type: 'real_estate',
        category: 'commercial_property',
        location: 'Business Bay, Dubai',
        jurisdiction: 'UAE',
        min_ticket: 20000,
        max_ticket: 200000,
        target_amount: 850000,
        expected_roi: 14,
        expected_irr: 12,
        holding_period_months: 36,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
        investment_amount: 35000,
        subcategory: 'office'
      },

      // 3. Rental Yield Real Estate - Villa
      {
        title: 'Arabian Ranches Villa - Premium Rental',
        description: `Luxury 4-bedroom villa in Arabian Ranches with consistent rental history.

Villa Specifications:
• 4 bedrooms, 5 bathrooms
• Private pool and garden
• 3,800 sq ft built-up area
• Gated community with security
• Close to schools and retail

Rental Performance:
• Current tenant on 2-year contract
• Rental yield: 8% annually
• Low vacancy rates in community
• Strong expat family demand
• Professional maintenance included`,
        type: 'real_estate',
        category: 'rental_yield',
        location: 'Arabian Ranches, Dubai',
        jurisdiction: 'UAE',
        min_ticket: 25000,
        max_ticket: 250000,
        target_amount: 1200000,
        expected_roi: 11,
        expected_irr: 9,
        holding_period_months: 30,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
        investment_amount: 40000,
        subcategory: 'villa'
      },

      // ===== FRANCHISE DEALS =====

      // 4. F&B Franchise - Cafe
      {
        title: 'Cup & Crave Café - Mall of Emirates Outlet',
        description: `Premium coffee and desserts franchise in high-traffic mall location.

Franchise Details:
• Established brand with 15 UAE outlets
• Mall of Emirates - Level 2 food court
• Proven business model
• Comprehensive training included
• Marketing support from franchisor

Financial Projections:
• Monthly revenue: AED 180,000
• Net profit margin: 22%
• Daily footfall: 300+ customers
• Peak hours: Lunch and evening
• Repeat customer rate: 60%`,
        type: 'franchise',
        category: 'fnb',
        location: 'Mall of Emirates, Dubai',
        jurisdiction: 'UAE',
        min_ticket: 10000,
        max_ticket: 100000,
        target_amount: 450000,
        expected_roi: 24,
        expected_irr: 20,
        holding_period_months: 36,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800'],
        investment_amount: 18000,
        subcategory: 'cafe'
      },

      // 5. Retail Franchise - Fitness Store
      {
        title: 'FitZone Sports Retail - Dubai Hills Mall',
        description: `Sports equipment and fitness apparel retail franchise in growing community mall.

Store Overview:
• 1,200 sq ft retail space
• Exclusive fitness equipment brands
• Activewear and accessories
• Online integration for orders
• Experienced store management

Growth Potential:
• Health-conscious community
• Growing fitness market in UAE
• E-commerce expansion planned
• Corporate sales opportunities
• Membership programs for regulars`,
        type: 'franchise',
        category: 'retail',
        location: 'Dubai Hills Mall, Dubai',
        jurisdiction: 'UAE',
        min_ticket: 8000,
        max_ticket: 80000,
        target_amount: 280000,
        expected_roi: 20,
        expected_irr: 17,
        holding_period_months: 30,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'],
        investment_amount: 15000,
        subcategory: 'sports_retail'
      },

      // 6. Service Franchise - Kids Education Center
      {
        title: 'BrightMinds Learning Center - Al Barsha',
        description: `Children's education and enrichment franchise focusing on STEM and creative arts.

Center Features:
• 2,500 sq ft facility with 4 classrooms
• STEM programs for ages 4-12
• Art, music, and robotics classes
• Weekend and after-school programs
• Qualified teaching staff

Market Opportunity:
• High-income residential area
• Strong demand for quality education
• Limited competition nearby
• Parent community engagement
• Summer camp programs`,
        type: 'franchise',
        category: 'service',
        location: 'Al Barsha, Dubai',
        jurisdiction: 'UAE',
        min_ticket: 12000,
        max_ticket: 120000,
        target_amount: 380000,
        expected_roi: 22,
        expected_irr: 19,
        holding_period_months: 42,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800'],
        investment_amount: 20000,
        subcategory: 'education'
      },

      // ===== STARTUP/TECH VENTURES =====

      // 7. FinTech Startup
      {
        title: 'PayFlow - Digital Payments Platform',
        description: `B2B payment automation platform for SMEs across MENA region.

Product Overview:
• Automated invoicing and collections
• Multi-currency support
• Integration with major banks
• AI-powered cash flow forecasting
• Mobile and web platforms

Traction & Metrics:
• 450+ active business clients
• AED 85M monthly transaction volume
• 40% MoM growth
• Partnerships with 12 banks
• Series A funding round

Investment Terms:
• Pre-money valuation: AED 25M
• Equity: 0.5% per AED 125K invested
• Exit strategy: Strategic acquisition or IPO
• Timeline: 48-60 months`,
        type: 'startup',
        category: 'fintech',
        location: 'Dubai Internet City, Dubai',
        jurisdiction: 'UAE',
        min_ticket: 25000,
        max_ticket: 250000,
        target_amount: 5000000,
        expected_roi: 180,
        expected_irr: 45,
        holding_period_months: 48,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800'],
        investment_amount: 50000,
        subcategory: 'fintech'
      },

      // 8. E-Commerce Tech Venture
      {
        title: 'QuickCart - Hyperlocal Grocery Delivery',
        description: `15-minute grocery delivery service expanding across UAE cities.

Business Model:
• Dark stores in residential areas
• 15-minute delivery guarantee
• AI-powered inventory management
• Strategic partnerships with suppliers
• Subscription and one-time orders

Current Operations:
• 8 dark stores operational
• 25,000+ active users
• 12,000 orders per week
• Average order value: AED 120
• Customer retention: 65%

Expansion Plan:
• 20 additional dark stores planned
• Abu Dhabi and Sharjah launch
• Corporate partnerships
• Series B raise in 18 months`,
        type: 'startup',
        category: 'ecommerce',
        location: 'Dubai Silicon Oasis, Dubai',
        jurisdiction: 'UAE',
        min_ticket: 20000,
        max_ticket: 200000,
        target_amount: 3500000,
        expected_roi: 220,
        expected_irr: 52,
        holding_period_months: 42,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=800'],
        investment_amount: 35000,
        subcategory: 'marketplace'
      },

      // 9. SaaS Startup
      {
        title: 'CloudHR - HR Management Platform',
        description: `Cloud-based HR and payroll management solution for GCC businesses.

Platform Features:
• End-to-end HR management
• Payroll automation with WPS integration
• Leave and attendance tracking
• Performance management system
• Employee self-service portal

Market Position:
• 180+ corporate clients
• 35,000+ employees on platform
• ARR: AED 4.2M
• Churn rate: < 5%
• NPS Score: 68

Growth Strategy:
• Saudi Arabia market entry
• HR analytics module launch
• Enterprise tier development
• Strategic partnerships with banks
• Potential acquisition target`,
        type: 'startup',
        category: 'saas',
        location: 'Dubai Media City, Dubai',
        jurisdiction: 'UAE',
        min_ticket: 15000,
        max_ticket: 150000,
        target_amount: 2800000,
        expected_roi: 150,
        expected_irr: 38,
        holding_period_months: 54,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800'],
        investment_amount: 30000,
        subcategory: 'software'
      },

      // ===== LUXURY ASSETS =====

      // 10. Luxury Vehicle - Supercar
      {
        title: 'Porsche 911 GT3 RS (2023) - Limited Edition',
        description: `Rare limited edition Porsche 911 GT3 RS in perfect condition with appreciation potential.

Vehicle Specifications:
• 2023 Porsche 911 GT3 RS
• 4.0L Flat-6 Engine
• 525 HP, 7-Speed PDK
• Only 1,800 km on odometer
• Full Porsche warranty remaining

Investment Rationale:
• Limited production run
• High demand, low supply
• Historical appreciation: 15-25%
• Pristine condition maintained
• Track-focused collector's car

Exit Strategy:
• 18-24 month hold period
• Private collector sale
• Auction house option
• Strong secondary market
• Tax-efficient in UAE`,
        type: 'asset',
        category: 'luxury_vehicle',
        location: 'Dubai',
        jurisdiction: 'UAE',
        min_ticket: 50000,
        max_ticket: 500000,
        target_amount: 1200000,
        expected_roi: 28,
        expected_irr: 22,
        holding_period_months: 24,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800'],
        investment_amount: 75000,
        subcategory: 'supercar'
      },

      // 11. Luxury Watches
      {
        title: 'Rolex Daytona "Panda" - Investment Grade',
        description: `Investment-grade Rolex Cosmograph Daytona with strong appreciation history.

Watch Details:
• Rolex Cosmograph Daytona 116500LN
• Stainless steel with white dial
• "Panda" configuration
• Box and papers included
• Purchased from authorized dealer 2022

Investment Case:
• Consistent 20-30% annual appreciation
• High demand, retail unavailable
• Pristine unworn condition
• Complete documentation
• Rolex warranty active

Market Analysis:
• Retail price: AED 55,000
• Secondary market: AED 120,000+
• Historical data shows steady growth
• Collector favorite model
• Liquidity in global market`,
        type: 'asset',
        category: 'luxury_watch',
        location: 'Dubai',
        jurisdiction: 'UAE',
        min_ticket: 15000,
        max_ticket: 120000,
        target_amount: 145000,
        expected_roi: 35,
        expected_irr: 28,
        holding_period_months: 18,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800'],
        investment_amount: 22000,
        subcategory: 'timepiece'
      },

      // 12. Art & Collectibles
      {
        title: 'Contemporary UAE Artist Collection',
        description: `Portfolio of works by emerging UAE contemporary artists with gallery representation.

Collection Details:
• 5 pieces from 3 UAE artists
• Mixed media and oil paintings
• Gallery exhibition history
• Authentication certificates
• Professional appraisal included

Artists Featured:
• Rashid Al Mansouri - 2 pieces
• Hind Al Zaabi - 2 pieces
• Mohammed Al Fahim - 1 piece
• All gallery-represented
• Growing international recognition

Investment Thesis:
• UAE art market growth 40% YoY
• Artist recognition increasing
• Gallery representation secured
• Upcoming international exhibitions
• Cultural significance and value`,
        type: 'asset',
        category: 'art_collectibles',
        location: 'Alserkal Avenue, Dubai',
        jurisdiction: 'UAE',
        min_ticket: 10000,
        max_ticket: 100000,
        target_amount: 280000,
        expected_roi: 42,
        expected_irr: 32,
        holding_period_months: 30,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800'],
        investment_amount: 18000,
        subcategory: 'fine_art'
      },

      // ===== ADDITIONAL REAL ESTATE DEALS =====

      // 13. Hotel/Hospitality Property
      {
        title: 'Rixos Hotel Tower - Abu Dhabi',
        description: `5-star hotel property investment with established brand and operations.

Property Details:
• 200-room luxury hotel tower
• Rixos brand management
• Full F&B operations
• Conference and event facilities
• Beach access and amenities

Financial Performance:
• 78% average occupancy rate
• Strong corporate and leisure mix
• Recurring conference bookings
• Seasonal rate optimization
• Professional management team

Investment Benefits:
• Stable hospitality sector returns
• Abu Dhabi tourism growth
• Diversified revenue streams
• Experienced operator partnership`,
        type: 'real_estate',
        category: 'commercial_property',
        location: 'Corniche Road, Abu Dhabi',
        jurisdiction: 'Abu Dhabi',
        min_ticket: 50000,
        max_ticket: 500000,
        target_amount: 8500000,
        expected_roi: 16,
        expected_irr: 14,
        holding_period_months: 48,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
        investment_amount: 60000,
        subcategory: 'hospitality'
      },

      // 14. Student Housing
      {
        title: 'University City Student Residences',
        description: `Purpose-built student accommodation near major universities in Sharjah.

Facility Features:
• 120 studio and shared apartments
• Study lounges and common areas
• High-speed internet included
• 24/7 security and management
• Close to universities and metro

Market Position:
• Growing student population
• Limited quality housing supply
• Pre-leased for academic year
• Parent-paid annual contracts
• Low vacancy risk

Investment Highlights:
• Stable long-term leases
• Inflation-linked rent increases
• Government education focus
• Affordable entry point for RE`,
        type: 'real_estate',
        category: 'residential_property',
        location: 'University City, Sharjah',
        jurisdiction: 'Sharjah',
        min_ticket: 15000,
        max_ticket: 100000,
        target_amount: 3200000,
        expected_roi: 13,
        expected_irr: 11,
        holding_period_months: 36,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
        investment_amount: 28000,
        subcategory: 'student_housing'
      },

      // 15. Warehouse/Logistics
      {
        title: 'DWC Logistics Park - Unit 4A',
        description: `Modern warehouse facility in Dubai World Central with long-term tenant.

Facility Specifications:
• 15,000 sq ft climate-controlled
• 8-meter ceiling height
• Loading docks and ramps
• Office and admin areas
• 24/7 access and security

Tenant Profile:
• International logistics company
• 5-year lease with renewal option
• Strong credit rating
• Monthly escalation clause
• Maintenance responsibility on tenant

Location Advantages:
• Near Al Maktoum Airport
• Excellent highway connectivity
• Growing logistics hub
• E-commerce fulfillment demand`,
        type: 'real_estate',
        category: 'commercial_property',
        location: 'Dubai World Central, Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 20000,
        max_ticket: 200000,
        target_amount: 2800000,
        expected_roi: 10,
        expected_irr: 9,
        holding_period_months: 60,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'],
        investment_amount: 32000,
        subcategory: 'warehouse'
      },

      // ===== ADDITIONAL FRANCHISE DEALS =====

      // 16. Fitness/Gym Franchise
      {
        title: 'Fitness First - Al Barsha Branch',
        description: `Established gym franchise in high-density residential area with strong membership base.

Gym Features:
• 12,000 sq ft facility
• Modern equipment (Technogym)
• Group fitness studios
• Personal training services
• Premium changing facilities

Membership Base:
• 850+ active members
• 65% renewal rate
• Corporate partnerships
• Family packages popular
• Strong retention programs

Business Model:
• Monthly membership revenue
• PT and class add-ons
• Retail and supplements
• Low staff turnover
• Proven franchise system

Growth Potential:
• Expanding corporate deals
• New class offerings
• Nutrition consultation services`,
        type: 'franchise',
        category: 'fitness',
        location: 'Mall of the Emirates Area, Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 20000,
        max_ticket: 150000,
        target_amount: 850000,
        expected_roi: 26,
        expected_irr: 22,
        holding_period_months: 42,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'],
        investment_amount: 30000,
        subcategory: 'gym'
      },

      // 17. Fast Food Chain
      {
        title: 'Subway - Dubai Marina Metro Station',
        description: `High-traffic Subway franchise at metro station with excellent footfall.

Location Benefits:
• Metro station ground floor
• 15,000+ daily commuters
• Office tower access
• Tourist area proximity
• Limited competition nearby

Operational Excellence:
• Established brand recognition
• Standardized operations
• Supply chain efficiency
• Staff training programs
• Quality control systems

Performance Metrics:
• 400+ daily transactions
• Peak breakfast and lunch
• Strong delivery orders
• Healthy eating trend
• Low food waste

Franchise Support:
• Marketing from corporate
• Menu innovation
• Technology integration
• Ongoing training`,
        type: 'franchise',
        category: 'fnb',
        location: 'Dubai Marina Metro, Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 12000,
        max_ticket: 80000,
        target_amount: 420000,
        expected_roi: 28,
        expected_irr: 24,
        holding_period_months: 36,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'],
        investment_amount: 22000,
        subcategory: 'fast_food'
      },

      // ===== ADDITIONAL STARTUP DEALS =====

      // 18. HealthTech
      {
        title: 'MediConnect - Telemedicine Platform',
        description: `AI-powered telemedicine platform connecting patients with licensed UAE doctors.

Platform Features:
• Video consultation system
• Digital prescription service
• Medical record management
• Insurance integration
• Multi-language support (Arabic, English, Urdu)

Market Opportunity:
• 10M+ UAE residents
• Growing digital health adoption
• Post-pandemic behavior shift
• Elderly care demand
• Chronic disease management

Traction & Metrics:
• 25,000+ registered users
• 500+ consultations/month
• 120+ licensed doctors
• 8 insurance partnerships
• 4.8/5 app store rating

Monetization:
• Per-consultation fees
• Subscription plans
• Insurance partnerships
• Corporate wellness programs`,
        type: 'startup',
        category: 'healthtech',
        location: 'Dubai Healthcare City, Dubai',
        jurisdiction: 'DHCC',
        min_ticket: 25000,
        max_ticket: 200000,
        target_amount: 3500000,
        expected_roi: 200,
        expected_irr: 85,
        holding_period_months: 42,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'],
        investment_amount: 45000,
        subcategory: 'healthtech'
      },

      // 19. EdTech
      {
        title: 'ArabLearn - Arabic Language Learning App',
        description: `Gamified Arabic learning platform for expats and international students.

Product Overview:
• Interactive lessons and exercises
• Speech recognition technology
• Cultural context integration
• Progress tracking and badges
• Live tutor sessions

Target Market:
• 8M+ expats in UAE
• International students in region
• Corporate training programs
• Government integration initiatives
• Heritage speakers reconnecting

Competitive Advantage:
• Focus on Gulf Arabic dialect
• Cultural and business context
• Affordable pricing
• Mobile-first design
• AI-powered personalization

Business Model:
• Freemium with premium tiers
• Corporate packages
• School partnerships
• Government contracts`,
        type: 'startup',
        category: 'edtech',
        location: 'Dubai Internet City, Dubai',
        jurisdiction: 'DIFC',
        min_ticket: 15000,
        max_ticket: 100000,
        target_amount: 1800000,
        expected_roi: 160,
        expected_irr: 72,
        holding_period_months: 36,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800'],
        investment_amount: 28000,
        subcategory: 'edtech'
      },

      // ===== ADDITIONAL LUXURY ASSET DEALS =====

      // 20. Vintage/Classic Car
      {
        title: 'Mercedes-Benz 300SL Gullwing (1955)',
        description: `Iconic 1955 Mercedes-Benz 300SL Gullwing in exceptional condition.

Vehicle Details:
• 1955 production year
• Matching numbers
• Restored to concours standard
• Only 1,400 units produced
• Complete documentation

Condition & Provenance:
• Body-off restoration completed 2021
• Original silver metallic paint
• Red leather interior
• Engine rebuilt by specialists
• Full service history

Investment Rationale:
• Automotive icon status
• Limited production numbers
• Strong historical appreciation
• Active collector market
• Museum-quality presentation

Exit Strategy:
• Auction at major house (RM Sotheby's, Bonhams)
• Private collector sale
• 5-10% annual appreciation historical
• Strong demand in Middle East`,
        type: 'asset',
        category: 'luxury_vehicle',
        location: 'Dubai',
        jurisdiction: 'UAE',
        min_ticket: 100000,
        max_ticket: 500000,
        target_amount: 3200000,
        expected_roi: 22,
        expected_irr: 18,
        holding_period_months: 30,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'],
        investment_amount: 120000,
        subcategory: 'classic_car'
      },
    ];

    console.log(`Creating ${dealsData.length} deals...`);

    for (const dealData of dealsData) {
      const t = await sequelize.transaction();

      try {
        // Extract investment amount
        const { investment_amount, ...dealFields } = dealData;

        // Generate slug from title
        dealFields.slug = generateSlug(dealFields.title);

        // Create Deal
        const deal = await Deal.create(dealFields, { transaction: t });
        console.log(`✓ Created deal: ${deal.title}`);

        // Create SPV for the deal
        const spv = await SPV.create({
          deal_id: deal.id,
          spv_name: `${deal.title.substring(0, 30)} SPV`,
          total_shares: Math.floor(dealFields.target_amount / 100),
          issued_shares: 0,
          share_price: 100,
          currency: 'AED',
        }, { transaction: t });
        console.log(`  ✓ Created SPV for deal`);

        // Create investment for Fatima
        const sharesIssued = Math.floor(investment_amount / spv.share_price);

        const investment = await Investment.create({
          user_id: fatima.id,
          deal_id: deal.id,
          spv_id: spv.id,
          amount: investment_amount,
          shares_issued: sharesIssued,
          share_price: spv.share_price,
          status: 'active',
          invested_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date in last 90 days
        }, { transaction: t });

        // Update deal raised amount
        await deal.update({
          raised_amount: parseFloat(deal.raised_amount || 0) + investment_amount,
          investor_count: (deal.investor_count || 0) + 1,
        }, { transaction: t });

        // Update SPV issued shares
        await spv.update({
          issued_shares: spv.issued_shares + sharesIssued,
        }, { transaction: t });

        // Update wallet
        await wallet.update({
          available_balance: parseFloat(wallet.available_balance) - investment_amount,
          invested_balance: parseFloat(wallet.invested_balance) + investment_amount,
        }, { transaction: t });

        // Create transaction record
        await Transaction.create({
          user_id: fatima.id,
          type: 'investment',
          amount: investment_amount,
          status: 'completed',
          description: `Investment in ${deal.title}`,
          reference_id: investment.id,
          deal_title: deal.title,
          deal_id: deal.id,
        }, { transaction: t });

        console.log(`  ✓ Created investment for Fatima: AED ${investment_amount.toLocaleString()}`);

        await t.commit();

      } catch (error) {
        await t.rollback();
        console.error(`✗ Error creating deal ${dealData.title}:`, error.message);
      }
    }

    console.log('\n✅ Comprehensive deals creation completed!');
    console.log(`\nFatima's Portfolio Summary:`);
    console.log(`- Real Estate: 3 deals (Residential, Commercial, Rental)`);
    console.log(`- Franchise: 3 deals (F&B, Retail, Service)`);
    console.log(`- Startups: 3 deals (FinTech, E-Commerce, SaaS)`);
    console.log(`- Luxury Assets: 3 deals (Supercar, Watch, Art)`);
    console.log(`\nTotal: 12 diverse investments across all categories`);

  } catch (error) {
    console.error('Error in comprehensive deals creation:', error);
  } finally {
    await sequelize.close();
  }
}

createComprehensiveDeals();
