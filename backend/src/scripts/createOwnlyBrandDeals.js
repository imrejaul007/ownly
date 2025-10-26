import { Deal, SPV, Investment, User, Wallet, Transaction } from '../models/index.js';
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

async function createOwnlyBrandDeals() {
  try {
    console.log('Starting OWNLY brand deals creation...');

    // Find Fatima
    const fatima = await User.findOne({ where: { email: 'fatima.alhashimi@example.ae' } });
    if (!fatima) {
      console.error('Fatima not found');
      return;
    }

    // Get Fatima's wallet
    let wallet = await Wallet.findOne({ where: { user_id: fatima.id } });

    const dealsData = [
      // ===== FOCO FRANCHISES =====

      // 1. Luxury Perfume
      {
        title: 'Al Mutalib Franchise Store',
        description: `Premium luxury perfume franchise with exclusive Arabian and international brands.

Store Features:
• Prime mall location with high footfall
• Curated selection of luxury fragrances
• Personalized consultation services
• Gift packaging and customization
• VIP loyalty program

Business Model:
• High-margin luxury products
• Corporate gifting partnerships
• Seasonal collections and launches
• Expert fragrance consultants
• Strong brand recognition

Financial Performance:
• Average ticket: AED 800-2,500
• 150-200 daily customers
• Repeat customer rate: 45%
• Corporate bulk orders
• Online integration

OWNLY Advantage:
• Proven store format
• Supplier relationships
• Marketing support
• Inventory management system`,
        type: 'franchise',
        category: 'retail',
        location: 'Dubai Mall / Mall of Emirates',
        jurisdiction: 'Dubai',
        min_ticket: 350000,
        max_ticket: 400000,
        target_amount: 400000,
        expected_roi: 60,
        expected_irr: 55,
        holding_period_months: 10,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'],
        investment_amount: 375000,
        subcategory: 'luxury_retail'
      },

      // 2. Arabian Perfume
      {
        title: 'Aroma Souq Franchise Store',
        description: `Traditional Arabian perfume store with modern retail experience.

Product Range:
• Oud and Bakhoor collections
• Traditional attars
• Custom blending services
• Gift sets and samplers
• Premium packaging

Market Position:
• Growing Arabian perfume demand
• Tourist and local clientele
• Cultural heritage appeal
• Unique product offerings
• Expert perfumers on staff

Revenue Streams:
• Retail sales
• Custom blending (premium pricing)
• Corporate gifts
• Wedding packages
• Online orders

Investment Highlights:
• Strong margins (65%+)
• Low inventory waste
• Repeat customer base
• Proven OWNLY format`,
        type: 'franchise',
        category: 'retail',
        location: 'Gold Souk / Traditional Markets',
        jurisdiction: 'Dubai',
        min_ticket: 350000,
        max_ticket: 400000,
        target_amount: 400000,
        expected_roi: 52,
        expected_irr: 48,
        holding_period_months: 12,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800'],
        investment_amount: 360000,
        subcategory: 'arabian_retail'
      },

      // 3. Clone Perfume
      {
        title: 'RedHine Franchise Store',
        description: `Affordable luxury - high-quality perfume alternatives at accessible prices.

Business Concept:
• Inspired-by fragrances
• 70-80% lower prices than originals
• Quality assurance testing
• Modern store design
• Young demographic focus

Competitive Advantages:
• Value proposition
• No compromise on quality
• Trending scent selection
• Social media marketing
• Influencer partnerships

Operations:
• Fast inventory turnover
• Multiple price points
• Bundle deals and offers
• Subscription boxes
• Gift card programs

Growth Potential:
• Expanding middle-class market
• Cost-conscious shoppers
• High repeat purchase rate
• Franchise scalability`,
        type: 'franchise',
        category: 'retail',
        location: 'Community Malls',
        jurisdiction: 'Dubai',
        min_ticket: 300000,
        max_ticket: 350000,
        target_amount: 350000,
        expected_roi: 47,
        expected_irr: 44,
        holding_period_months: 11,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800'],
        investment_amount: 320000,
        subcategory: 'value_retail'
      },

      // 4. Couple Viral Perfume
      {
        title: 'Whiff Theory Store',
        description: `Viral sensation perfume brand targeting couples and social media generation.

Brand Story:
• TikTok and Instagram viral products
• Couple matching fragrances
• Signature scent development
• Unboxing experience focus
• Influencer collaborations

Marketing Power:
• 500K+ social media followers
• User-generated content
• Trending product launches
• Community engagement
• Celebrity endorsements

Store Experience:
• Instagram-worthy interior
• Photo booth areas
• Scent testing stations
• Personalization services
• Gift wrapping theater

Revenue Model:
• Premium pricing on viral products
• Limited edition drops
• Pre-order campaigns
• Merchandise line
• Online + retail synergy`,
        type: 'franchise',
        category: 'retail',
        location: 'City Walk / La Mer',
        jurisdiction: 'Dubai',
        min_ticket: 350000,
        max_ticket: 350000,
        target_amount: 350000,
        expected_roi: 57,
        expected_irr: 53,
        holding_period_months: 10,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1587556930796-30be3a1f3c05?w=800'],
        investment_amount: 350000,
        subcategory: 'lifestyle_retail'
      },

      // 5. Salon & Spa
      {
        title: 'Glowzy Studio',
        description: `Premium salon and spa franchise with membership-based revenue model.

Services Offered:
• Hair styling and treatments
• Skincare and facials
• Manicure and pedicure
• Massage therapy
• Bridal packages

Business Model:
• Monthly memberships
• Package deals
• Walk-in services
• Product retail
• Corporate partnerships

Facility:
• 8-10 service stations
• Private treatment rooms
• Retail product area
• Relaxation lounge
• Modern interiors

Financial Structure:
• 60% service revenue
• 25% membership income
• 15% product sales
• High customer lifetime value
• Strong retention rates`,
        type: 'franchise',
        category: 'wellness',
        location: 'JLT / Business Bay',
        jurisdiction: 'Dubai',
        min_ticket: 350000,
        max_ticket: 350000,
        target_amount: 350000,
        expected_roi: 52,
        expected_irr: 48,
        holding_period_months: 10,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800'],
        investment_amount: 350000,
        subcategory: 'beauty_wellness'
      },

      // 6. Gym & Fitness
      {
        title: 'FitEarn Gym',
        description: `Innovative gym concept where members can earn rewards for consistency and referrals.

Unique Model:
• Earn points for attendance
• Referral bonus program
• Cashback on renewals
• Gamified fitness challenges
• Community leaderboards

Facilities:
• 3,000-5,000 sq ft space
• Modern equipment
• Group class studios
• Personal training zones
• Locker and shower facilities

Revenue Streams:
• Monthly memberships (AED 200-400)
• Personal training sessions
• Nutrition consulting
• Merchandise sales
• Corporate packages

Growth Drivers:
• Viral reward system
• Strong word-of-mouth
• Social media engagement
• Community building
• Technology integration`,
        type: 'franchise',
        category: 'fitness',
        location: 'Residential Communities',
        jurisdiction: 'Dubai',
        min_ticket: 400000,
        max_ticket: 400000,
        target_amount: 400000,
        expected_roi: 60,
        expected_irr: 55,
        holding_period_months: 11,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800'],
        investment_amount: 400000,
        subcategory: 'fitness_center'
      },

      // 7. TikTok Product Store
      {
        title: 'Shopazy Local',
        description: `Physical store for viral TikTok products - see it online, buy it offline today.

Store Concept:
• Curated viral products
• Weekly product rotations
• Social media integration
• Try-before-buy experience
• Content creation zones

Product Categories:
• Home gadgets
• Beauty tools
• Kitchen innovations
• Tech accessories
• Trending toys

Business Advantages:
• Pre-validated demand
• High margins (100%+)
• Fast inventory turnover
• Young, engaged audience
• Impulse purchase behavior

Marketing:
• TikTok creator partnerships
• Instagram reels
• In-store content creation
• User demonstrations
• Viral product drops`,
        type: 'franchise',
        category: 'retail',
        location: 'Dubai Hills Mall',
        jurisdiction: 'Dubai',
        min_ticket: 300000,
        max_ticket: 300000,
        target_amount: 300000,
        expected_roi: 67,
        expected_irr: 62,
        holding_period_months: 9,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800'],
        investment_amount: 300000,
        subcategory: 'trend_retail'
      },

      // 8. Pet Services
      {
        title: 'Petzy Outlet',
        description: `Complete pet care solution - grooming, daycare, retail, and veterinary services.

Services:
• Professional grooming
• Pet daycare and boarding
• Training classes
• Veterinary clinic
• Pet products retail

Market Opportunity:
• Growing pet ownership in UAE
• Premium service demand
• Limited competition
• Recurring revenue model
• Emotional spending category

Facility:
• 2,000 sq ft space
• Separate grooming stations
• Daycare play areas
• Retail section
• Consultation rooms

Revenue Mix:
• 40% grooming services
• 30% daycare/boarding
• 20% retail products
• 10% training/vet services`,
        type: 'franchise',
        category: 'services',
        location: 'Arabian Ranches / Springs',
        jurisdiction: 'Dubai',
        min_ticket: 350000,
        max_ticket: 350000,
        target_amount: 350000,
        expected_roi: 57,
        expected_irr: 53,
        holding_period_months: 10,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'],
        investment_amount: 350000,
        subcategory: 'pet_services'
      },

      // 9-16... Adding more franchise deals
      {
        title: 'Publistan PR & Podcast Studio',
        description: `Modern PR agency with podcast recording facilities for brands and influencers.

Services Offered:
• PR and media relations
• Podcast production
• Content creation
• Brand strategy
• Influencer management

Studio Features:
• Professional recording booths
• Video podcast capability
• Editing suites
• Green screen setup
• Streaming equipment

Target Clients:
• Startups and SMEs
• Personal brands
• Influencers and creators
• Corporate communications
• Government entities

Revenue Model:
• Monthly retainer clients
• Per-episode production
• Studio rental
• Equipment rental
• Training workshops`,
        type: 'franchise',
        category: 'media',
        location: 'Dubai Media City',
        jurisdiction: 'Dubai',
        min_ticket: 300000,
        max_ticket: 300000,
        target_amount: 300000,
        expected_roi: 47,
        expected_irr: 44,
        holding_period_months: 10,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800'],
        investment_amount: 300000,
        subcategory: 'media_production'
      },

      {
        title: 'Fixora Home Services Unit',
        description: `On-demand home maintenance and repair services platform with franchise model.

Services:
• Plumbing and electrical
• AC maintenance
• Painting and handyman
• Deep cleaning
• Furniture assembly

Business Model:
• App-based bookings
• Subscription packages
• On-demand services
• Corporate partnerships
• Real estate tie-ups

Operations:
• 8-10 technicians per unit
• Branded vehicles
• Inventory management
• Quality assurance
• Customer support

Revenue Streams:
• Service fees (60%)
• Subscriptions (25%)
• Emergency callouts (15%)
• High repeat rate
• Corporate contracts`,
        type: 'franchise',
        category: 'services',
        location: 'Dubai (Territory-based)',
        jurisdiction: 'Dubai',
        min_ticket: 300000,
        max_ticket: 300000,
        target_amount: 300000,
        expected_roi: 57,
        expected_irr: 53,
        holding_period_months: 9,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800'],
        investment_amount: 300000,
        subcategory: 'home_services'
      },

      // ===== REAL ESTATE (CROWDPROP) =====

      {
        title: '50-Office Coworking Space - Business Bay',
        description: `Premium coworking space investment with fractional ownership model.

Property Details:
• 15,000 sq ft fitted space
• 50 private offices (various sizes)
• Meeting rooms and conference halls
• Breakout areas and lounges
• High-speed internet and tech infrastructure

Investment Structure:
• Fractional ownership via SPV
• Minimum AED 50K investment
• Professional management
• Monthly rental distributions
• 3-year lease agreements

Financial Projections:
• Average desk rate: AED 1,500-2,500/month
• 85% target occupancy
• Operating margin: 40%
• Monthly distributions
• Property appreciation potential

Market Drivers:
• Remote work trend
• Startup ecosystem growth
• Flexible workspace demand
• Corporate downsizing`,
        type: 'real_estate',
        category: 'commercial_property',
        location: 'Business Bay, Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 50000,
        max_ticket: 2000000,
        target_amount: 10000000,
        expected_roi: 14,
        expected_irr: 13,
        holding_period_months: 13,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
        investment_amount: 150000,
        subcategory: 'coworking'
      },

      {
        title: '10 Commercial Shop Units - Retail Investment',
        description: `Portfolio of 10 street-level retail shops in high-traffic locations.

Property Portfolio:
• Mix of 500-800 sq ft units
• Ground floor retail spaces
• High street locations
• Fitted and ready
• Long-term tenants

Tenant Mix:
• F&B outlets
• Convenience stores
• Service businesses
• Pharmacies
• Telecom shops

Investment Approach:
• Individual unit purchase (AED 700K)
• Or pooled investment (min AED 50K)
• Professional property management
• Quarterly distributions
• 5-year lease terms

Returns:
• Rental yield: 9-12% annually
• Tenant improvements covered
• Service charge on tenant
• Annual rent escalations
• Exit through resale or refinance`,
        type: 'real_estate',
        category: 'commercial_property',
        location: 'Various prime locations, Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 50000,
        max_ticket: 700000,
        target_amount: 7000000,
        expected_roi: 10,
        expected_irr: 9,
        holding_period_months: 13,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800'],
        investment_amount: 120000,
        subcategory: 'retail_shops'
      },

      {
        title: 'Airbnb-Ready 1BR Apartments Portfolio',
        description: `Fully managed holiday home investment with guaranteed returns.

Property Details:
• 1-bedroom apartments (500-650 sq ft)
• Fully furnished to Airbnb standards
• Prime holiday locations
• Smart home features
• Professional photography

Management Services:
• OWNLY holiday home management
• Guest communication
• Cleaning and maintenance
• Dynamic pricing
• 24/7 support

Investment Options:
• Full unit ownership (AED 1M)
• Fractional ownership (min AED 50K)
• 3-year management contract
• Monthly net income distributions
• Performance guarantees

Projected Returns:
• Average occupancy: 70%
• Nightly rate: AED 300-500
• Annual gross: AED 100-140K
• Net yield: 10-14% after fees
• Capital appreciation potential`,
        type: 'real_estate',
        category: 'residential_property',
        location: 'JBR / Dubai Marina',
        jurisdiction: 'Dubai',
        min_ticket: 50000,
        max_ticket: 1000000,
        target_amount: 5000000,
        expected_roi: 12,
        expected_irr: 11,
        holding_period_months: 13,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
        investment_amount: 100000,
        subcategory: 'holiday_homes'
      },

      // ===== ALTERNATIVE ASSETS =====

      {
        title: 'Luxury Car Fleet - G-Wagon, Urus, Rolls Royce',
        description: `Premium luxury car rental fleet investment with professional management.

Fleet Details:
• Mercedes G-Wagon 2023
• Lamborghini Urus 2023
• Rolls Royce Ghost 2022
• Full insurance and maintenance
• GPS tracking and security

Business Model:
• Daily rental: AED 2,000-4,000
• Weekly and monthly packages
• Corporate rentals
• Event and wedding bookings
• Chauffeur services available

Investment Structure:
• Purchase individual vehicle or pool
• Professional fleet management
• Maintenance and insurance included
• Revenue share: 70% investor, 30% management
• 3-year holding period

Financial Projections:
• Average utilization: 60-70%
• Monthly gross revenue per vehicle: AED 40-80K
• Net yield: 15-25% annually
• Residual value after 3 years: 60-70%
• Depreciation tax benefits`,
        type: 'asset',
        category: 'luxury_vehicle',
        location: 'Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 200000,
        max_ticket: 1000000,
        target_amount: 3000000,
        expected_roi: 20,
        expected_irr: 18,
        holding_period_months: 36,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800'],
        investment_amount: 500000,
        subcategory: 'luxury_fleet'
      },

      {
        title: 'Marina-Based Yacht Rental - Co-Ownership',
        description: `Fractional yacht ownership with charter income and personal use rights.

Yacht Specifications:
• 50-60 foot luxury yacht
• 3 cabins, 2 bathrooms
• Entertainment systems
• Water sports equipment
• Professional crew available

Usage Rights:
• 4 weeks personal use per year
• Charter income when not in use
• Maintenance and docking included
• Insurance covered
• Management by OWNLY Marine

Investment Details:
• Minimum investment: AED 500K
• Fractional ownership structure
• Charter revenue: AED 5K-10K per day
• Target occupancy: 40-50%
• Personal use priority booking

Returns:
• Net rental yield: 10-20%
• Depreciation: ~10% annually
• Maintenance: ~15% of revenue
• Exit via resale or buyback
• Lifestyle asset with income`,
        type: 'asset',
        category: 'marine',
        location: 'Dubai Marina',
        jurisdiction: 'Dubai',
        min_ticket: 500000,
        max_ticket: 2000000,
        target_amount: 5000000,
        expected_roi: 15,
        expected_irr: 13,
        holding_period_months: 48,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800'],
        investment_amount: 600000,
        subcategory: 'yacht'
      },

      // Continuing with more alternative assets...
      {
        title: 'Shipping Containers - Logistics Lease Pool',
        description: `Container investment leased to logistics companies with stable returns.

Asset Details:
• 20ft and 40ft containers
• New and refurbished units
• Leased to DHL, Aramex, etc.
• 3-5 year lease agreements
• GPS tracking enabled

Investment Model:
• Purchase containers (AED 25K-100K each)
• Lease to logistics companies
• Quarterly rental payments
• Maintenance by lessee
• Buyback option after term

Revenue:
• Monthly rental: AED 300-800 per container
• Annual yield: 12-18%
• Low maintenance
• Stable, credit-worthy lessees
• Inflation-linked increases

Risk Mitigation:
• Multiple lessees
• Container tracking
• Insurance coverage
• Buyback guarantee
• High demand in UAE logistics hub`,
        type: 'asset',
        category: 'logistics',
        location: 'Jebel Ali / DWC',
        jurisdiction: 'Dubai',
        min_ticket: 25000,
        max_ticket: 500000,
        target_amount: 2000000,
        expected_roi: 15,
        expected_irr: 14,
        holding_period_months: 42,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800'],
        investment_amount: 100000,
        subcategory: 'containers'
      },

      {
        title: 'Glamping Pods - Desert & Fujairah Experience',
        description: `Eco-luxury glamping pods for Airbnb rental in scenic UAE locations.

Pod Features:
• Climate-controlled luxury tents
• King-size bed and furnishings
• Private bathroom facilities
• Deck with seating area
• Solar power backup

Locations:
• Desert camps (Al Aweer, Al Qudra)
• Mountain locations (Fujairah)
• Beach access properties
• Wadi areas
• Star-gazing optimal sites

Investment:
• AED 75K-150K per pod
• Fully managed by OWNLY Glamping
• Seasonal pricing optimization
• Marketing and bookings included
• Quarterly net distributions

Financial Model:
• Nightly rate: AED 800-1,500
• Occupancy: 40-60% (seasonal)
• Annual gross: AED 120-270K
• Net yield: 15-22% after management
• Low maintenance costs`,
        type: 'asset',
        category: 'hospitality',
        location: 'Desert & Fujairah',
        jurisdiction: 'UAE',
        min_ticket: 75000,
        max_ticket: 150000,
        target_amount: 1500000,
        expected_roi: 18,
        expected_irr: 17,
        holding_period_months: 24,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'],
        investment_amount: 120000,
        subcategory: 'glamping'
      },

      {
        title: 'Mobile Campers - Rentable Travel Vans',
        description: `Fully equipped camper vans for adventure travel rentals across UAE.

Vehicle Specs:
• Mercedes Sprinter or similar
• Full camper conversion
• Sleeping for 2-4 people
• Kitchen and dining area
• Solar panels and batteries
• Shower and toilet

Target Market:
• Weekend adventurers
• International tourists
• Corporate team building
• Photography expeditions
• Festival attendees

Management:
• Professional cleaning
• Maintenance scheduling
• Insurance and registration
• 24/7 roadside assistance
• Marketing through travel platforms

Returns:
• Daily rate: AED 500-900
• Monthly bookings: 15-20 days
• Annual revenue: AED 120-180K
• Net yield: 18-25%
• Resale value after 2 years: 60%`,
        type: 'asset',
        category: 'vehicle',
        location: 'Dubai',
        jurisdiction: 'Dubai',
        min_ticket: 150000,
        max_ticket: 300000,
        target_amount: 1500000,
        expected_roi: 21,
        expected_irr: 19,
        holding_period_months: 24,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=800'],
        investment_amount: 200000,
        subcategory: 'camper_rental'
      },

      // ===== TRADE & INVENTORY =====

      {
        title: 'Perfume Batch Pool - Inventory Investment',
        description: `Invest in perfume inventory batches with quick turnover and high margins.

Investment Model:
• Purchase finished goods inventory
• OWNLY distributes through retail network
• 6-8 month inventory cycle
• Transparent profit sharing
• Minimum AED 5K investment

Product Lines:
• Al Mutalib luxury range
• Aroma Souq traditional
• RedHine value line
• Whiff Theory viral products
• Seasonal and limited editions

Returns:
• Gross margin: 200-300%
• OWNLY operations fee: 40%
• Net investor return: 35-60% per cycle
• Quarterly distributions
• Reinvestment options

Risk Mitigation:
• Established retail network
• Proven products
• OWNLY brand trust
• Inventory insurance
• Market diversification`,
        type: 'asset',
        category: 'inventory',
        location: 'OWNLY Distribution',
        jurisdiction: 'Dubai',
        min_ticket: 5000,
        max_ticket: 50000,
        target_amount: 500000,
        expected_roi: 47,
        expected_irr: 55,
        holding_period_months: 7,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'],
        investment_amount: 25000,
        subcategory: 'perfume_inventory'
      },

      {
        title: 'TikTok Product Launch - Viral Drops',
        description: `High-risk, high-reward investment in viral TikTok product launches.

Strategy:
• Identify trending products
• Bulk purchase from suppliers
• Quick market entry
• Sell through Shopazy stores + online
• 4-6 week turnover

Product Examples:
• Trending gadgets
• Beauty innovations
• Kitchen tools
• Tech accessories
• Lifestyle products

Investment Process:
• Product selection by OWNLY team
• Minimum AED 10K per drop
• 500-1000 unit orders
• Pre-vetted suppliers
• Marketing campaign included

Returns:
• Target margins: 100-200%
• Net investor return: 50-80% per drop
• 4-6 month cycles
• Option for multiple drops
• Early exit if product takes off

Risks:
• Trend timing critical
• Inventory risk
• Competition
• Quality issues
• Platform algorithm changes`,
        type: 'asset',
        category: 'inventory',
        location: 'OWNLY E-Commerce',
        jurisdiction: 'Dubai',
        min_ticket: 10000,
        max_ticket: 100000,
        target_amount: 300000,
        expected_roi: 65,
        expected_irr: 80,
        holding_period_months: 5,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800'],
        investment_amount: 30000,
        subcategory: 'viral_products'
      },

      {
        title: 'Import/Export Batches - FMCG & Electronics',
        description: `B2B trade finance for importing goods to UAE market with pre-arranged buyers.

Trade Structure:
• Import orders from verified buyers
• Investors fund inventory purchase
• 90-day trade cycle
• Letters of credit
• Professional logistics

Product Categories:
• FMCG goods
• Oud and incense
• Consumer electronics
• Home appliances
• Fashion accessories

Investment Details:
• Minimum: AED 50K
• Maximum: AED 250K per batch
• Trade finance structure
• Buyer commitment secured
• Insurance coverage

Returns:
• Target margin: 20-35%
• Payment within 90 days
• 4-6 month total cycle
• Multiple cycles per year
• Quarterly opportunities

Risk Management:
• Verified buyers only
• Payment guarantees
• Insurance
• OWNLY trade desk
• Market expertise`,
        type: 'asset',
        category: 'trade',
        location: 'UAE Import/Export',
        jurisdiction: 'Dubai',
        min_ticket: 50000,
        max_ticket: 250000,
        target_amount: 2000000,
        expected_roi: 27,
        expected_irr: 32,
        holding_period_months: 5,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800'],
        investment_amount: 100000,
        subcategory: 'trade_finance'
      },

      // ===== EQUITY / HOLDCO =====

      {
        title: 'Rabtul Tech IP - SaaS Platform Equity',
        description: `Equity investment in OWNLY's proprietary investment platform technology.

Company Overview:
• Investment management SaaS
• White-label platform for fund managers
• Dashboard and reporting tools
• Compliance and KYC automation
• Mobile app and web platform

Technology Stack:
• React/Next.js frontend
• Node.js backend
• PostgreSQL database
• AWS infrastructure
• RESTful APIs

Business Model:
• SaaS subscription (AED 10K-50K/month)
• Transaction fees (0.5-1%)
• White-label licensing
• API access fees
• Professional services

Market Opportunity:
• Growing investment platforms in MENA
• Regulatory technology demand
• Fintech adoption
• B2B2C model
• Regional expansion potential

Investment Terms:
• Equity stake (not specified %)
• Minimum: AED 250K
• 3-5 year horizon
• Exit via trade sale or IPO
• Target multiple: 4-10x`,
        type: 'startup',
        category: 'fintech',
        location: 'DIFC, Dubai',
        jurisdiction: 'DIFC',
        min_ticket: 250000,
        max_ticket: 2000000,
        target_amount: 5000000,
        expected_roi: 300,
        expected_irr: 80,
        holding_period_months: 48,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'],
        investment_amount: 500000,
        subcategory: 'saas_equity'
      },

      {
        title: 'Brand Equity Pool - FitEarn, Shopazy, Petzy',
        description: `Equity investment in OWNLY's portfolio of operating franchise brands.

Portfolio Brands:
• FitEarn - Gym franchise (6 locations)
• Shopazy - TikTok retail (4 locations)
• Petzy - Pet services (5 locations)
• Glowzy - Salon & spa (3 locations)
• Combined AED 25M annual revenue

Investment Structure:
• Equity in brand holding company
• Minimum AED 300K
• Pro-rata earnings rights
• Board observer rights for large investors
• Exit rights negotiable

Value Drivers:
• Franchise expansion (50+ locations planned)
• Brand licensing
• Product lines
• Technology integration
• Regional expansion

Financial Performance:
• Combined EBITDA: AED 8M (32% margin)
• Growth rate: 40% YoY
• Franchise pipeline: 25 units
• Strong unit economics
• Proven operating model

Exit Scenarios:
• Strategic acquisition
• PE buyout
• Management buyout
• IPO (long-term)
• Secondary sale`,
        type: 'startup',
        category: 'multi_brand',
        location: 'Dubai',
        jurisdiction: 'DIFC',
        min_ticket: 300000,
        max_ticket: 3000000,
        target_amount: 10000000,
        expected_roi: 250,
        expected_irr: 65,
        holding_period_months: 42,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800'],
        investment_amount: 750000,
        subcategory: 'brand_equity'
      },

      {
        title: 'RTMN HoldCo Equity - ReZ + Wasil Ecosystem',
        description: `Equity investment in OWNLY's parent holding company with full ecosystem exposure.

Ecosystem Overview:
• ReZ - Real estate investment platform
• Wasil - Business directory and marketplace
• OWNLY - Alternative investments
• Rabtul Tech - Technology platform
• 15+ operating brands

Investment Highlights:
• Diversified revenue streams
• Technology + operations
• Franchise + real estate + fintech
• Strong management team
• Proven track record

Financial Overview:
• Combined revenue: AED 100M+ (projected)
• EBITDA margin: 25-30%
• Growth rate: 50-60% YoY
• Cash flow positive
• Expansion capital raise

Use of Funds:
• Technology development (30%)
• Brand expansion (40%)
• Geographic expansion (20%)
• Working capital (10%)

Investment Terms:
• Minimum: AED 500K
• Preferred equity structure
• Liquidation preference
• Board representation (large investors)
• 3-6 year horizon
• Exit: Strategic sale or IPO`,
        type: 'startup',
        category: 'holdco',
        location: 'Dubai',
        jurisdiction: 'DIFC',
        min_ticket: 500000,
        max_ticket: 5000000,
        target_amount: 20000000,
        expected_roi: 400,
        expected_irr: 75,
        holding_period_months: 54,
        status: 'open',
        images: ['https://images.unsplash.com/photo-1554224311-beee2ece8e49?w=800'],
        investment_amount: 1000000,
        subcategory: 'holdco_equity'
      },
    ];

    console.log(`Creating ${dealsData.length} OWNLY brand deals...`);

    let successCount = 0;
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
          invested_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
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
          available_balance: parseFloat(wallet.available_balance || 0) - investment_amount,
          invested_balance: parseFloat(wallet.invested_balance || 0) + investment_amount,
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

        await t.commit();
        successCount++;

      } catch (error) {
        await t.rollback();
        console.error(`✗ Error creating deal ${dealData.title}:`, error.message);
      }
    }

    console.log(`\n✅ OWNLY brand deals creation completed!`);
    console.log(`Successfully created ${successCount} out of ${dealsData.length} deals\n`);

    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

createOwnlyBrandDeals();
