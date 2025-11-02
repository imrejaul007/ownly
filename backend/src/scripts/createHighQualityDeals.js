import sequelize from '../config/database.js';
import { randomUUID } from 'crypto';

// High-quality unique images for different categories
const categoryImages = {
  hospitality_tourism: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', // Luxury hotel
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', // Resort
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', // Hotel lobby
  ],
  mobility_transport: [
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800', // Electric cars
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800', // Bikes
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800', // Transportation
  ],
  construction_materials: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', // Construction
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800', // Building
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800', // Architecture
  ],
  professional_services: [
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', // Office
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', // Business
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', // Workspace
  ],
  fashion_accessories: [
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800', // Fashion store
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800', // Retail
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800', // Boutique
  ],
  beauty_personal_care: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800', // Spa
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800', // Salon
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800', // Beauty
  ],
  sports_fitness: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', // Gym
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800', // Fitness
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', // Yoga studio
  ],
  automotive_services: [
    'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800', // Car service
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800', // Auto repair
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800', // Cars
  ],
  fintech: [
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800', // Fintech
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', // Digital banking
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', // Technology
  ],
};

const highQualityDeals = [
  // Hospitality & Tourism
  {
    title: 'Luxury Beach Resort in Ras Al Khaimah',
    type: 'real_estate',
    category: 'hospitality_tourism',
    location: 'Ras Al Khaimah',
    description: 'Premium beachfront resort development featuring 150 luxury villas and suites, world-class spa facilities, three fine-dining restaurants, and private beach access. Strategic location in the growing tourism hub of Ras Al Khaimah with stunning views of the Arabian Gulf. The resort will cater to high-net-worth individuals and luxury travelers seeking exclusive experiences. Fully Shariah-compliant operations with halal-certified restaurants and family-friendly facilities.',
    target_amount: 45000000,
    min_ticket: 50000,
    expected_roi: 18,
    holding_period_months: 48,
    images: categoryImages.hospitality_tourism,
  },
  {
    title: 'Heritage Hotel & Cultural Center - Old Dubai',
    type: 'real_estate',
    category: 'hospitality_tourism',
    location: 'Dubai',
    description: 'Boutique heritage hotel in the historic Al Fahidi district, combining traditional Emirati architecture with modern luxury amenities. The property includes 45 rooms, a rooftop restaurant with Creek views, art galleries, and cultural exhibition spaces. Perfect for tourists seeking authentic Dubai experiences. Partnership with Dubai Culture & Arts Authority ensures steady footfall and cultural events.',
    target_amount: 28000000,
    min_ticket: 25000,
    expected_roi: 22,
    holding_period_months: 36,
    images: [categoryImages.hospitality_tourism[1], categoryImages.hospitality_tourism[2], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
  },

  // Mobility & Transport
  {
    title: 'Electric Vehicle Charging Network - UAE',
    type: 'startup',
    category: 'mobility_transport',
    location: 'UAE Wide',
    description: 'Comprehensive EV charging infrastructure across major UAE cities including Dubai, Abu Dhabi, and Sharjah. Network of 200+ fast-charging stations at strategic locations including malls, hotels, and highway rest areas. Partnership with DEWA and ADDC for grid connectivity. Subscription-based revenue model targeting the rapidly growing EV market in UAE. Government incentives and green energy initiatives make this a future-proof investment.',
    target_amount: 35000000,
    min_ticket: 10000,
    expected_roi: 28,
    holding_period_months: 36,
    images: categoryImages.mobility_transport,
  },
  {
    title: 'Smart Bike Sharing Platform - Dubai & Abu Dhabi',
    type: 'startup',
    category: 'mobility_transport',
    location: 'Dubai',
    description: 'IoT-enabled bike-sharing service with 5,000 e-bikes across Dubai and Abu Dhabi. Integration with RTA and Abu Dhabi Department of Transport. Mobile app with AI-powered route optimization, smart docking stations, and seamless payment integration. Targeting eco-conscious residents and tourists. Revenue streams include ride fees, corporate partnerships, and advertising.',
    target_amount: 12000000,
    min_ticket: 5000,
    expected_roi: 32,
    holding_period_months: 30,
    images: [categoryImages.mobility_transport[1], 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800', 'https://images.unsplash.com/photo-1475666675596-cca2035b3d79?w=800'],
  },

  // Construction & Materials
  {
    title: 'Sustainable Building Materials Manufacturing',
    type: 'franchise',
    category: 'manufacturing_production',
    location: 'Dubai Industrial City',
    description: 'State-of-the-art facility producing eco-friendly construction materials including recycled concrete, green insulation, and sustainable wood alternatives. Catering to the booming UAE construction sector with focus on green building certifications (LEED, Estidama). Long-term supply contracts with major developers including Emaar, Aldar, and Nakheel. 15,000 sqm production facility with capacity for 50,000 tons annually.',
    target_amount: 22000000,
    min_ticket: 15000,
    expected_roi: 24,
    holding_period_months: 42,
    images: categoryImages.construction_materials,
  },

  // Professional Services
  {
    title: 'AI-Powered Legal Services Platform - DIFC',
    type: 'startup',
    category: 'technology_innovation',
    location: 'DIFC',
    description: 'Revolutionary legal-tech platform offering AI-driven contract analysis, compliance monitoring, and legal research for SMEs and corporates in UAE. Licensed by DIFC Innovation Hub. Platform includes automated document generation, multi-language support (Arabic/English), and integration with Dubai Courts e-filing system. SaaS model with 500+ corporate clients including government entities.',
    target_amount: 8500000,
    min_ticket: 5000,
    expected_roi: 35,
    holding_period_months: 24,
    images: categoryImages.professional_services,
  },
  {
    title: 'Executive Business Center - Downtown Dubai',
    type: 'real_estate',
    category: 'technology_innovation',
    location: 'Downtown Dubai',
    description: 'Premium serviced office space in the heart of Downtown Dubai, offering flexible workspace solutions for startups, SMEs, and multinational corporations. 8,000 sqm of Grade A office space with meeting rooms, virtual office services, and state-of-the-art technology infrastructure. Strategic location near Dubai Mall and Burj Khalifa. High occupancy rates with blue-chip tenants and strong recurring revenue model.',
    target_amount: 42000000,
    min_ticket: 30000,
    expected_roi: 19,
    holding_period_months: 36,
    images: [categoryImages.professional_services[2], 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'],
  },

  // Fashion & Accessories
  {
    title: 'Modest Fashion Brand - Regional Expansion',
    type: 'equity',
    category: 'retail_franchises',
    location: 'Dubai',
    description: 'Fast-growing modest fashion brand with strong presence in UAE, expanding to Saudi Arabia, Qatar, and Kuwait. Omnichannel strategy with 12 retail stores and thriving e-commerce platform. Partnered with regional influencers and celebrities. Product line includes abayas, hijabs, and contemporary modest wear using premium fabrics. Annual revenue AED 15M with 45% YoY growth. Seeking capital for regional expansion and new product lines.',
    target_amount: 18000000,
    min_ticket: 10000,
    expected_roi: 30,
    holding_period_months: 36,
    images: categoryImages.fashion_accessories,
  },

  // Beauty & Personal Care
  {
    title: 'Premium Wellness Spa Chain - Expansion',
    type: 'franchise',
    category: 'health_wellness',
    location: 'Dubai & Abu Dhabi',
    description: 'Award-winning wellness spa chain opening 5 new branches across Dubai and Abu Dhabi. Each facility offers premium spa treatments, hammam services, beauty treatments, and holistic wellness programs. All-female staff option available. Using organic, halal-certified products. Membership model generates 65% recurring revenue. Strategic locations in luxury hotels and premium residential areas. Partnership with health insurance providers for corporate wellness programs.',
    target_amount: 15000000,
    min_ticket: 20000,
    expected_roi: 26,
    holding_period_months: 30,
    images: categoryImages.beauty_personal_care,
  },

  // Sports & Fitness
  {
    title: 'Smart Fitness Studios Network',
    type: 'franchise',
    category: 'health_wellness',
    location: 'Dubai',
    description: '24/7 AI-powered fitness studios with personalized workout programs, biometric tracking, and virtual personal training. 10 locations across Dubai with plans for 20 more. Smart equipment with integrated screens for live and on-demand classes. Flexible membership plans targeting busy professionals. Revenue streams include memberships, personal training, nutritional consulting, and premium features. Technology partnership with leading fitness tech companies.',
    target_amount: 12000000,
    min_ticket: 8000,
    expected_roi: 29,
    holding_period_months: 30,
    images: categoryImages.sports_fitness,
  },
  {
    title: 'Elite Sports Academy - Multi-Sport Facility',
    type: 'real_estate',
    category: 'health_wellness',
    location: 'Dubai Sports City',
    description: 'World-class multi-sport training facility in Dubai Sports City featuring Olympic-standard equipment, international coaching staff, and partnerships with professional sports clubs. Facilities include football pitches, basketball courts, swimming pools, tennis courts, and athletics tracks. Year-round training programs for children and adults. Additional revenue from hosting tournaments, summer camps, and corporate team-building events.',
    target_amount: 38000000,
    min_ticket: 25000,
    expected_roi: 21,
    holding_period_months: 42,
    images: ['https://images.unsplash.com/photo-1461897104016-0b3b00cc81ee?w=800', 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800', categoryImages.sports_fitness[2]],
  },

  // Automotive Services
  {
    title: 'Premium Car Detailing & Protection Centers',
    type: 'franchise',
    category: 'home_services',
    location: 'Dubai & Abu Dhabi',
    description: 'High-end car care franchise specializing in ceramic coating, paint protection film, and detailing services for luxury and exotic vehicles. 6 locations in premium areas including Marina, Downtown, and Abu Dhabi Corniche. Certified technicians, state-of-the-art equipment, and exclusive products. VIP mobile service for high-net-worth clients. Long-term contracts with luxury car dealerships and rental companies. Strong demand from UAE\'s luxury car market.',
    target_amount: 9500000,
    min_ticket: 10000,
    expected_roi: 31,
    holding_period_months: 24,
    images: categoryImages.automotive_services,
  },

  // FinTech
  {
    title: 'Islamic FinTech - Digital Sukuk Platform',
    type: 'startup',
    category: 'technology_innovation',
    location: 'ADGM',
    description: 'Pioneering digital platform for Shariah-compliant sukuk issuance, trading, and management. Leveraging blockchain technology for transparency and efficiency. Licensed by ADGM Financial Services Regulatory Authority. Platform enables SMEs and corporates to access Islamic capital markets with lower costs and faster issuance. Partnership with leading Islamic banks and Shariah scholars. Targeting the $3 trillion global Islamic finance market.',
    target_amount: 25000000,
    min_ticket: 15000,
    expected_roi: 38,
    holding_period_months: 36,
    images: categoryImages.fintech,
  },
  {
    title: 'Digital Payment Gateway - GCC Markets',
    type: 'startup',
    category: 'technology_innovation',
    location: 'Dubai',
    description: 'Next-generation payment processing platform supporting multiple currencies, digital wallets, and buy-now-pay-later options. Fully Shariah-compliant with integrated zakat calculation and charitable giving features. Serving 10,000+ merchants across UAE, Saudi Arabia, and other GCC countries. Advanced fraud detection, instant settlement, and competitive pricing. Integration with major e-commerce platforms and POS systems. Growing at 150% YoY.',
    target_amount: 16000000,
    min_ticket: 10000,
    expected_roi: 40,
    holding_period_months: 30,
    images: [categoryImages.fintech[1], categoryImages.fintech[2], 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=800'],
  },
];

async function createHighQualityDeals() {
  try {
    console.log('Creating high-quality deals with unique images...\n');

    let created = 0;
    let updated = 0;

    for (const deal of highQualityDeals) {
      // Create slug from title
      const slug = deal.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Generate UUID for the deal
      const dealId = randomUUID();

      const query = `
        INSERT INTO deals (
          id, title, slug, type, category, location, description,
          target_amount, min_ticket, expected_roi, holding_period_months,
          images, status, raised_amount, investor_count, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'active', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (slug) DO UPDATE SET
          description = EXCLUDED.description,
          target_amount = EXCLUDED.target_amount,
          expected_roi = EXCLUDED.expected_roi,
          images = EXCLUDED.images,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, title, (xmax = 0) AS inserted
      `;

      const [result] = await sequelize.query(query, {
        bind: [
          dealId,
          deal.title,
          slug,
          deal.type,
          deal.category,
          deal.location,
          deal.description,
          deal.target_amount,
          deal.min_ticket,
          deal.expected_roi,
          deal.holding_period_months,
          deal.images, // Pass as array directly
        ],
      });

      if (result && result.length > 0) {
        if (result[0].inserted) {
          created++;
          console.log(`✓ Created: ${deal.title}`);
        } else {
          updated++;
          console.log(`↻ Updated: ${deal.title}`);
        }
      }
    }

    console.log(`\n✅ Complete!`);
    console.log(`   Created: ${created} deals`);
    console.log(`   Updated: ${updated} deals`);
    console.log(`   Total: ${highQualityDeals.length} deals processed`);

  } catch (error) {
    console.error('Error creating deals:', error);
    throw error;
  }
}

// Run the script
createHighQualityDeals()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

export { createHighQualityDeals };
