import sequelize from '../config/database.js';
import { randomUUID } from 'crypto';

// Comprehensive category images - 6 unique images per category
const categoryImages = {
  real_estate: [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
  ],
  mobility_transport: [
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800',
    'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=800',
    'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800',
  ],
  hospitality_tourism: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
  ],
  food_beverage: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800',
    'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800',
    'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800',
  ],
  health_wellness: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
  ],
  retail_franchises: [
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800',
    'https://images.unsplash.com/photo-1555529669-2269763671c0?w=800',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800',
    'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
  ],
  education_training: [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
  ],
  media_entertainment: [
    'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
    'https://images.unsplash.com/photo-1574267432644-f02b5c2e3f4e?w=800',
    'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800',
    'https://images.unsplash.com/photo-1505455184862-554165e5f6ba?w=800',
  ],
  technology_innovation: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800',
  ],
  home_services: [
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
    'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800',
    'https://images.unsplash.com/photo-1615875474908-f403035092c0?w=800',
    'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800',
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800',
  ],
  events_experiences: [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  ],
  agriculture_sustainable: [
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800',
    'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=800',
    'https://images.unsplash.com/photo-1625246775161-16f323c25eab?w=800',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800',
  ],
  ecommerce_digital: [
    'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800',
    'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800',
  ],
  logistics_supply_chain: [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=800',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800',
    'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800',
    'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=800',
    'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800',
  ],
  manufacturing_production: [
    'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800',
    'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800',
    'https://images.unsplash.com/photo-1558403194-611308249627?w=800',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
  ],
  micro_investment_baskets: [
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800',
  ],
  secondary_market: [
    'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800',
    'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=800',
    'https://images.unsplash.com/photo-1554224311-beee4c27c58d?w=800',
    'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800',
    'https://images.unsplash.com/photo-1559526324-c1f275fbfa32?w=800',
    'https://images.unsplash.com/photo-1640158615573-cd28feb1bf4e?w=800',
  ],
  bundles_thematic: [
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
    'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800',
    'https://images.unsplash.com/photo-1611068813580-c0b7f1b0c4c1?w=800',
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800',
    'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
  ],
  community_impact: [
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
  ],
  ownly_exchange: [
    'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800',
  ],
};

// Comprehensive deals - minimum 2 per category with different ROI
const comprehensiveDeals = [
  // Real Estate (2 deals)
  {
    title: 'Premium Marina Residences - Dubai Marina',
    type: 'real_estate',
    category: 'real_estate',
    location: 'Dubai Marina',
    description: 'Exclusive waterfront residential development in the heart of Dubai Marina featuring 180 luxury apartments with breathtaking views of the Arabian Gulf. The project includes 2, 3, and 4-bedroom units with premium finishes, smart home technology, and world-class amenities including infinity pools, fitness centers, spa facilities, and concierge services. Strategic location provides easy access to The Walk, JBR Beach, and Marina Mall. Expected completion in 24 months with strong rental yields projected at 7-8% annually. This Shariah-compliant investment offers both capital appreciation potential and steady rental income in one of Dubai\'s most sought-after neighborhoods.',
    target_amount: 75000000,
    min_ticket: 50000,
    expected_roi: 22,
    holding_period_months: 36,
    images: [categoryImages.real_estate[0], categoryImages.real_estate[1], categoryImages.real_estate[2]],
  },
  {
    title: 'Commercial Office Tower - Business Bay',
    type: 'real_estate',
    category: 'real_estate',
    location: 'Business Bay',
    description: 'Grade A commercial office building in the rapidly developing Business Bay district, Dubai\'s new business hub. The 25-story tower offers 300,000 sq ft of premium office space with floor-to-ceiling windows, state-of-the-art building management systems, and LEED Gold certification. Strategic location near Dubai Canal with excellent connectivity to Sheikh Zayed Road and metro station. Pre-leased to multinational corporations with 10-year lease agreements ensuring stable cash flow. The building features retail spaces on ground level, ample parking, and modern facilities catering to forward-thinking businesses. This investment provides lower risk through established tenants while offering steady returns and capital appreciation potential.',
    target_amount: 95000000,
    min_ticket: 75000,
    expected_roi: 16,
    holding_period_months: 48,
    images: [categoryImages.real_estate[3], categoryImages.real_estate[4], categoryImages.real_estate[5]],
  },

  // Mobility & Transport (2 deals)
  {
    title: 'Smart Parking Solutions Network - UAE Cities',
    type: 'startup',
    category: 'mobility_transport',
    location: 'UAE Wide',
    description: 'Revolutionary IoT-based smart parking management system deployed across Dubai, Abu Dhabi, and Sharjah addressing the critical urban parking challenge. The platform utilizes AI-powered sensors, mobile app integration, and automated payment systems to optimize parking availability and reduce traffic congestion. Network includes 10,000+ smart parking spaces across malls, commercial districts, and residential areas with partnerships with RTA and municipal authorities. The technology provides real-time availability updates, reservation capabilities, and dynamic pricing algorithms. Revenue streams include parking fees, premium features for frequent users, and data analytics services for urban planning. With UAE\'s push toward smart cities and growing vehicle population, this investment taps into a massive market opportunity with recurring revenue model and high scalability potential.',
    target_amount: 18000000,
    min_ticket: 10000,
    expected_roi: 34,
    holding_period_months: 30,
    images: [categoryImages.mobility_transport[0], categoryImages.mobility_transport[1], categoryImages.mobility_transport[2]],
  },
  {
    title: 'Last-Mile Delivery Fleet - Electric Vehicles',
    type: 'franchise',
    category: 'mobility_transport',
    location: 'Dubai',
    description: 'Eco-friendly last-mile delivery service utilizing a fleet of 200 electric vehicles and e-bikes serving e-commerce companies, restaurants, and retail businesses across Dubai. The operation leverages advanced route optimization algorithms, real-time tracking, and carbon-neutral delivery solutions appealing to environmentally conscious businesses and consumers. Partnership with major e-commerce platforms and food delivery apps ensures steady demand. The fleet management system maximizes efficiency while minimizing operational costs. With UAE government incentives for green transportation and the booming e-commerce sector, this investment offers stable recurring revenue with strong growth potential. The business model includes flexible pricing tiers and premium same-day delivery services generating multiple revenue streams.',
    target_amount: 12500000,
    min_ticket: 8000,
    expected_roi: 27,
    holding_period_months: 36,
    images: [categoryImages.mobility_transport[3], categoryImages.mobility_transport[4], categoryImages.mobility_transport[5]],
  },

  // Hospitality & Tourism (2 deals)
  {
    title: 'Desert Safari Experience Park - Al Ain',
    type: 'real_estate',
    category: 'hospitality_tourism',
    location: 'Al Ain',
    description: 'Unique desert adventure and cultural tourism destination spread across 150 acres in Al Ain offering authentic Emirati experiences. The park features traditional Bedouin camps, camel racing facilities, falcon shows, dune bashing experiences, and luxury glamping accommodations. Additional attractions include a heritage village showcasing traditional crafts, Arabic cuisine restaurants, and sunset viewing platforms. The project targets both domestic tourists and international visitors seeking authentic UAE desert experiences. Partnership with tourism boards and travel agencies ensures steady visitor flow. With UAE\'s focus on domestic tourism development and Al Ain\'s UNESCO World Heritage status, this investment capitalizes on growing cultural tourism demand. Revenue streams include entrance fees, accommodation bookings, food and beverage sales, and exclusive event hosting.',
    target_amount: 42000000,
    min_ticket: 30000,
    expected_roi: 25,
    holding_period_months: 42,
    images: [categoryImages.hospitality_tourism[0], categoryImages.hospitality_tourism[1], categoryImages.hospitality_tourism[2]],
  },
  {
    title: 'Wellness Retreat Resort - Fujairah Mountains',
    type: 'real_estate',
    category: 'hospitality_tourism',
    location: 'Fujairah',
    description: 'Exclusive mountain wellness retreat in the scenic Hajar Mountains of Fujairah combining luxury accommodation with holistic health programs. The resort features 60 private villas, world-class spa facilities, yoga and meditation pavilions, organic farm-to-table restaurant, and nature trails. Programs include detox retreats, stress management workshops, fitness bootcamps, and traditional healing therapies all delivered by certified international wellness practitioners. The property caters to high-net-worth individuals and corporate wellness programs seeking peaceful escapes from urban life. Fujairah\'s emerging tourism infrastructure and stunning natural beauty position this resort uniquely in the regional wellness tourism market. Shariah-compliant operations with separate facilities for families ensure broad appeal across demographics.',
    target_amount: 38000000,
    min_ticket: 25000,
    expected_roi: 20,
    holding_period_months: 48,
    images: [categoryImages.hospitality_tourism[3], categoryImages.hospitality_tourism[4], categoryImages.hospitality_tourism[5]],
  },

  // Food & Beverage (2 deals)
  {
    title: 'Gourmet Cloud Kitchen Network - Dubai',
    type: 'franchise',
    category: 'food_beverage',
    location: 'Dubai',
    description: 'Multi-brand cloud kitchen operation running 12 virtual restaurant brands from 3 strategic locations across Dubai. The facility leverages shared kitchen infrastructure to operate diverse cuisine concepts including Arabic, Asian fusion, healthy bowls, and premium burgers all optimized for delivery platforms. Advanced kitchen management systems, bulk purchasing power, and centralized operations create significant cost efficiencies while maintaining quality standards. Partnership with all major delivery platforms (Deliveroo, Talabat, Careem) ensures maximum market reach. The business model allows rapid testing and scaling of new food concepts without traditional restaurant overhead. With UAE\'s food delivery market growing at 20% annually and changing consumer preferences toward convenience, this investment captures high-margin revenue streams with minimal real estate costs.',
    target_amount: 8500000,
    min_ticket: 5000,
    expected_roi: 42,
    holding_period_months: 24,
    images: [categoryImages.food_beverage[0], categoryImages.food_beverage[1], categoryImages.food_beverage[2]],
  },
  {
    title: 'Premium Halal Organic Cafe Chain - Expansion',
    type: 'franchise',
    category: 'food_beverage',
    location: 'UAE Wide',
    description: 'Fast-growing cafe chain specializing in premium halal-certified organic food and beverages with 8 existing locations expanding to 15 new locations across UAE. The concept fills the gap between fast food and fine dining with focus on healthy, ethically sourced ingredients and contemporary ambiance appealing to health-conscious millennials and families. Menu includes organic coffee, fresh juices, salads, sandwiches, and baked goods all prepared in-house daily. Strong brand identity, Instagram-worthy interiors, and loyalty program drive repeat customers. Locations strategically selected in high-footfall areas including malls, business districts, and universities. The franchise model generates revenue through dine-in, takeaway, catering services, and branded merchandise. Current locations achieve average monthly revenue of AED 180K with 35% profit margins demonstrating proven business model ready for scaling.',
    target_amount: 15000000,
    min_ticket: 10000,
    expected_roi: 28,
    holding_period_months: 36,
    images: [categoryImages.food_beverage[3], categoryImages.food_beverage[4], categoryImages.food_beverage[5]],
  },

  // Health & Wellness (2 deals)
  {
    title: 'AI-Powered Telemedicine Platform - GCC',
    type: 'startup',
    category: 'health_wellness',
    location: 'Dubai Healthcare City',
    description: 'Innovative telemedicine platform connecting patients with licensed doctors across GCC countries through video consultations, AI-powered symptom checkers, and electronic prescriptions. The platform offers 24/7 access to general practitioners, specialists, and mental health professionals with multi-language support including Arabic and English. Integration with major insurance providers, pharmacies, and diagnostic centers creates seamless healthcare journey. The AI triage system reduces unnecessary emergency visits while improving access to healthcare especially for remote areas and mobility-impaired patients. Licensed by Dubai Health Authority and partnerships with leading hospitals ensure medical credibility. Subscription model targets both B2C users and B2B corporate wellness programs. With GCC governments pushing digital health transformation and pandemic-accelerated telemedicine adoption, this investment addresses massive underserved market with scalable technology platform.',
    target_amount: 14000000,
    min_ticket: 8000,
    expected_roi: 45,
    holding_period_months: 30,
    images: [categoryImages.health_wellness[0], categoryImages.health_wellness[1], categoryImages.health_wellness[2]],
  },
  {
    title: 'Specialized Physiotherapy Centers Network',
    type: 'franchise',
    category: 'health_wellness',
    location: 'Dubai & Abu Dhabi',
    description: 'Premium physiotherapy and rehabilitation centers specializing in sports injuries, post-surgery recovery, and chronic pain management with 10 locations across Dubai and Abu Dhabi. Each center features state-of-the-art equipment, certified international physiotherapists, and evidence-based treatment protocols. Services include manual therapy, exercise rehabilitation, hydrotherapy, and advanced modalities like cryotherapy and shockwave therapy. The centers cater to athletes, corporate professionals with desk injuries, elderly patients, and post-surgical rehabilitation. Partnerships with orthopedic surgeons, sports clubs, and insurance companies drive steady patient referrals. Corporate wellness contracts provide recurring B2B revenue streams. With UAE\'s active lifestyle promotion and aging expat population, demand for quality physiotherapy services continues growing. Average treatment packages range from AED 1,500 to AED 8,000 with high patient retention rates.',
    target_amount: 11000000,
    min_ticket: 10000,
    expected_roi: 31,
    holding_period_months: 36,
    images: [categoryImages.health_wellness[3], categoryImages.health_wellness[4], categoryImages.health_wellness[5]],
  },

  // Retail Franchises (2 deals)
  {
    title: 'Tech Accessories Retail Chain - Mall Expansion',
    type: 'franchise',
    category: 'retail_franchises',
    location: 'UAE Malls',
    description: 'Trendy retail franchise specializing in mobile accessories, smart gadgets, and tech lifestyle products expanding from 12 to 25 locations in premium malls across UAE. The stores offer curated selection of phone cases, wireless chargers, smart watches, portable speakers, and tech gifts with emphasis on quality and design. Omnichannel strategy integrates physical stores with e-commerce platform and social media marketing targeting tech-savvy millennials and Gen Z consumers. Exclusive distribution agreements with international brands provide competitive advantages. Prime mall locations ensure high footfall while rotating seasonal collections and limited edition products drive repeat purchases. The franchise model includes comprehensive training, marketing support, and inventory management systems. With UAE\'s high smartphone penetration and appetite for latest tech, this investment captures growing accessories market with strong unit economics and brand loyalty.',
    target_amount: 9800000,
    min_ticket: 8000,
    expected_roi: 36,
    holding_period_months: 30,
    images: [categoryImages.retail_franchises[0], categoryImages.retail_franchises[1], categoryImages.retail_franchises[2]],
  },
  {
    title: 'Sustainable Fashion Retail - Regional Expansion',
    type: 'equity',
    category: 'retail_franchises',
    location: 'UAE & GCC',
    description: 'Eco-conscious fashion brand offering sustainable and ethically produced clothing expanding from UAE flagship stores to GCC markets. The brand combines contemporary designs with environmental responsibility using organic fabrics, recycled materials, and transparent supply chains. Product range includes casual wear, modest fashion, activewear, and accessories all manufactured in certified sustainable facilities. Strong social media presence and influencer partnerships drive brand awareness among environmentally conscious consumers. The retail strategy includes concept stores in premium locations, pop-up shops in lifestyle destinations, and robust e-commerce platform. Membership program encourages sustainable consumption through clothing recycling incentives. With global shift toward sustainable fashion and regional consumers increasingly seeking ethical brands, this investment positions in fast-growing conscious consumer segment. Current annual revenue AED 8M with 50% YoY growth demonstrates market validation.',
    target_amount: 12000000,
    min_ticket: 10000,
    expected_roi: 29,
    holding_period_months: 36,
    images: [categoryImages.retail_franchises[3], categoryImages.retail_franchises[4], categoryImages.retail_franchises[5]],
  },

  // Education & Training (2 deals)
  {
    title: 'STEM Learning Centers for Children - Franchise',
    type: 'franchise',
    category: 'education_training',
    location: 'UAE Wide',
    description: 'Innovative STEM education franchise offering coding, robotics, and science programs for children aged 6-16 with plans for 20 centers across UAE. The curriculum combines hands-on learning with project-based education teaching programming languages, electronic circuits, 3D design, and problem-solving skills. State-of-the-art learning spaces feature robotics kits, 3D printers, computers, and science labs creating engaging educational environments. Programs include after-school classes, weekend workshops, holiday camps, and birthday parties. Certified instructors trained in child pedagogy deliver age-appropriate content aligned with UAE\'s national AI and innovation strategies. With government emphasis on STEM education and parents seeking quality extracurricular learning for children, this franchise addresses growing market demand. Strong unit economics with average center generating AED 150K monthly revenue and corporate partnerships providing additional B2B opportunities.',
    target_amount: 13500000,
    min_ticket: 12000,
    expected_roi: 38,
    holding_period_months: 36,
    images: [categoryImages.education_training[0], categoryImages.education_training[1], categoryImages.education_training[2]],
  },
  {
    title: 'Professional Skills Training Academy - ADGM',
    type: 'real_estate',
    category: 'education_training',
    location: 'ADGM',
    description: 'Premium training academy offering professional development courses and certification programs in ADGM financial district targeting finance, legal, and business professionals. Course offerings include CFA preparation, investment banking certifications, compliance training, leadership development, and digital transformation workshops. Partnership with international certification bodies and leading universities provides accredited credentials. The 4,000 sqm facility features modern classrooms, simulation labs, and collaborative spaces. Delivery model includes in-person intensive programs, weekend courses, and blended learning options. Corporate training contracts with financial institutions, law firms, and consulting companies generate recurring revenue streams. With ADGM\'s growing status as regional financial hub and mandatory continuous professional development requirements, this academy serves critical professional education needs. Average course fees range from AED 8,000 to AED 45,000 with high enrollment rates.',
    target_amount: 16000000,
    min_ticket: 15000,
    expected_roi: 24,
    holding_period_months: 42,
    images: [categoryImages.education_training[3], categoryImages.education_training[4], categoryImages.education_training[5]],
  },

  // Media & Entertainment (2 deals)
  {
    title: 'Digital Content Production Studio - Media City',
    type: 'startup',
    category: 'media_entertainment',
    location: 'Dubai Media City',
    description: 'Full-service digital content production studio creating high-quality video content for brands, influencers, and media companies across Middle East region. The studio offers end-to-end production services including concept development, filming, editing, animation, and post-production. State-of-the-art facilities include green screen studios, professional lighting and camera equipment, audio recording booths, and editing suites. Specialized teams create content for social media platforms, corporate communications, advertising campaigns, and streaming platforms. The business model includes project-based production, monthly retainer clients, and studio rental services. Strategic location in Dubai Media City provides access to regional media industry and creative talent pool. With explosive growth in digital content consumption and brands increasing video marketing budgets, this studio meets surging demand for professional content creation. Current client portfolio includes major regional brands achieving 40% profit margins.',
    target_amount: 8000000,
    min_ticket: 6000,
    expected_roi: 48,
    holding_period_months: 24,
    images: [categoryImages.media_entertainment[0], categoryImages.media_entertainment[1], categoryImages.media_entertainment[2]],
  },
  {
    title: 'Gaming Arena & eSports Center - Expansion',
    type: 'franchise',
    category: 'media_entertainment',
    location: 'Dubai & Abu Dhabi',
    description: 'Next-generation gaming centers and eSports facilities expanding from 2 to 8 locations across UAE offering premium gaming experiences and competitive eSports tournaments. Each center features high-performance gaming PCs, console gaming areas, VR zones, and dedicated eSports arenas with streaming capabilities. The facilities host regular tournaments, gaming leagues, birthday parties, and corporate team-building events. Membership programs, hourly gaming rates, and F&B sales create multiple revenue streams. Partnership with gaming publishers and eSports organizations brings exclusive events and content. The business targets the massive young demographic in UAE with passion for gaming. With regional eSports industry growing at 25% annually and UAE government supporting digital entertainment, this investment captures booming gaming culture. Average facility generates AED 180K monthly revenue with strong community engagement and brand loyalty.',
    target_amount: 14000000,
    min_ticket: 10000,
    expected_roi: 33,
    holding_period_months: 36,
    images: [categoryImages.media_entertainment[3], categoryImages.media_entertainment[4], categoryImages.media_entertainment[5]],
  },

  // Technology & Innovation (2 deals)
  {
    title: 'Blockchain Supply Chain Platform - DMCC',
    type: 'startup',
    category: 'technology_innovation',
    location: 'DMCC',
    description: 'Enterprise blockchain platform revolutionizing supply chain transparency and traceability for commodities trading particularly in precious metals and diamonds. The platform enables end-to-end tracking from source to consumer ensuring authenticity, ethical sourcing, and regulatory compliance. Smart contracts automate documentation, payments, and quality certifications reducing fraud and operational inefficiencies. Licensed by DMCC with pilots running with major trading companies in precious metals sector. The solution addresses critical pain points including counterfeit products, ethical sourcing verification, and complex multi-party transactions. SaaS business model with transaction-based fees provides scalable revenue. With UAE positioning as global trading hub and increasing demand for supply chain transparency, this platform serves massive B2B market. Technology built on Hyperledger Fabric ensures enterprise-grade security and scalability. Current partnerships with 15 trading companies validating product-market fit.',
    target_amount: 11000000,
    min_ticket: 8000,
    expected_roi: 52,
    holding_period_months: 30,
    images: [categoryImages.technology_innovation[0], categoryImages.technology_innovation[1], categoryImages.technology_innovation[2]],
  },
  {
    title: 'Cybersecurity Solutions Provider - DIFC',
    type: 'startup',
    category: 'technology_innovation',
    location: 'DIFC',
    description: 'Specialized cybersecurity firm offering managed security services, penetration testing, and security consulting to financial institutions and enterprises in UAE and GCC. Services include 24/7 Security Operations Center (SOC), threat intelligence, incident response, compliance auditing, and security awareness training. The company employs certified security professionals with expertise in financial services security requirements. Proprietary AI-powered threat detection platform enhances traditional security tools. Regulatory partnerships with UAE Cyber Security Council and compliance with PCI DSS, ISO 27001, and local data protection laws establish market credibility. With escalating cyber threats and mandatory cybersecurity regulations for financial sector, demand for professional security services growing exponentially. Recurring revenue model through managed service contracts provides predictable cash flows. Current client base includes 25 financial institutions with 95% retention rate demonstrating strong value proposition.',
    target_amount: 9500000,
    min_ticket: 8000,
    expected_roi: 41,
    holding_period_months: 36,
    images: [categoryImages.technology_innovation[3], categoryImages.technology_innovation[4], categoryImages.technology_innovation[5]],
  },

  // Home Services (2 deals)
  {
    title: 'On-Demand Home Maintenance Platform',
    type: 'startup',
    category: 'home_services',
    location: 'Dubai',
    description: 'Digital platform connecting homeowners with verified professionals for home maintenance, repair, and improvement services across Dubai. The app offers instant booking for plumbing, electrical work, AC maintenance, painting, deep cleaning, and handyman services. All service providers undergo background checks, skills verification, and quality audits ensuring reliable service delivery. The platform manages scheduling, payments, warranties, and customer reviews creating transparent marketplace. Dynamic pricing, surge capacity during peak periods, and subscription plans for regular maintenance optimize revenue. With Dubai\'s large renter population, busy expatriate lifestyle, and fragmented home services market, this platform addresses critical convenience need. Technology includes real-time tracking, automated quality checks, and customer support chatbot. Current network includes 500+ verified professionals completing 2,000+ jobs monthly with 4.7-star average rating. Plans for regional expansion to Abu Dhabi and other emirates.',
    target_amount: 7500000,
    min_ticket: 5000,
    expected_roi: 44,
    holding_period_months: 30,
    images: [categoryImages.home_services[0], categoryImages.home_services[1], categoryImages.home_services[2]],
  },
  {
    title: 'Smart Home Installation & Integration Services',
    type: 'franchise',
    category: 'home_services',
    location: 'UAE Wide',
    description: 'Specialized smart home installation service providing turnkey home automation solutions including smart lighting, climate control, security systems, entertainment systems, and voice-activated controls. The company serves both residential villa projects and retrofit installations for existing homes. Partnerships with leading smart home technology brands including Google, Amazon, and regional providers ensure competitive pricing and technical support. Certified technicians provide professional installation, integration, and ongoing maintenance services. The business model includes one-time installation fees, annual maintenance contracts, and premium monitoring services. With UAE\'s luxury real estate market embracing smart home technology and government smart city initiatives, demand for professional installation services growing rapidly. Target market includes high-end villas, luxury apartments, and boutique hotel projects. Average project value ranges from AED 35,000 to AED 200,000 with strong referral-based growth.',
    target_amount: 6800000,
    min_ticket: 6000,
    expected_roi: 35,
    holding_period_months: 36,
    images: [categoryImages.home_services[3], categoryImages.home_services[4], categoryImages.home_services[5]],
  },

  // Events & Experiences (2 deals)
  {
    title: 'Luxury Yacht Charter & Events Company',
    type: 'franchise',
    category: 'events_experiences',
    location: 'Dubai Marina',
    description: 'Premium yacht charter service operating fleet of 12 luxury yachts offering private cruises, corporate events, weddings, and special occasions around Dubai coastline. The fleet ranges from intimate 40-foot yachts to grand 120-foot vessels accommodating 10 to 150 guests. Services include professional crew, gourmet catering, entertainment packages, photography, and customized event planning. Marina berths secured at prime locations including Dubai Marina, Palm Jumeirah, and Dubai Harbour. The business caters to high-net-worth individuals, luxury tourists, and corporate clients seeking exclusive experiences. Additional revenue streams include sunset cruises, fishing trips, and new year celebrations. With Dubai\'s position as luxury tourism destination and growing demand for experiential luxury, this business captures affluent market segment. Strong online presence, partnerships with luxury hotels and concierge services drive bookings. Average charter fees range from AED 3,000 to AED 50,000 per event with healthy profit margins.',
    target_amount: 22000000,
    min_ticket: 20000,
    expected_roi: 26,
    holding_period_months: 42,
    images: [categoryImages.events_experiences[0], categoryImages.events_experiences[1], categoryImages.events_experiences[2]],
  },
  {
    title: 'Immersive Experience Entertainment Venue',
    type: 'real_estate',
    category: 'events_experiences',
    location: 'Dubai',
    description: 'Cutting-edge immersive entertainment venue combining virtual reality, augmented reality, and interactive installations creating unforgettable experiences for visitors. The 10,000 sqm facility features multiple themed zones including VR adventure games, AR escape rooms, interactive art installations, and multi-sensory experiences. Content regularly updated ensures repeat visits while group packages cater to families, tourists, corporate events, and birthday parties. The venue combines technology with storytelling creating Instagram-worthy moments driving social media marketing. Food and beverage areas, merchandise shop, and private event spaces provide additional revenue. Located in high-tourist area ensuring strong footfall. With experiential entertainment trending globally and Dubai positioning as entertainment capital, this venue meets growing demand for novel experiences beyond traditional attractions. Target audience includes residents, tourists, and corporate groups. Premium pricing strategy positions venue as must-visit destination.',
    target_amount: 28000000,
    min_ticket: 25000,
    expected_roi: 23,
    holding_period_months: 48,
    images: [categoryImages.events_experiences[3], categoryImages.events_experiences[4], categoryImages.events_experiences[5]],
  },

  // Agriculture & Sustainable (2 deals)
  {
    title: 'Vertical Farm - Urban Agriculture Solution',
    type: 'startup',
    category: 'agriculture_sustainable',
    location: 'Dubai Industrial City',
    description: 'Innovative vertical farming facility using hydroponics and controlled environment agriculture to produce fresh leafy greens, herbs, and vegetables year-round in Dubai\'s desert climate. The 5,000 sqm facility produces equivalent of 50 acres of traditional farmland using 95% less water and zero pesticides. Advanced LED growing systems, climate control, and automated harvesting ensure consistent quality and yield. Products supplied to premium supermarkets, hotels, restaurants, and direct-to-consumer through subscription boxes. The business addresses UAE\'s food security priorities and growing demand for locally produced organic vegetables. Shariah-compliant operations with transparent supply chain appeal to conscious consumers. With UAE importing 80% of food and government initiatives supporting local agriculture technology, this investment aligns with national food security strategy. Current production capacity 5 tons monthly with expansion plans to scale 5x over 36 months.',
    target_amount: 16500000,
    min_ticket: 12000,
    expected_roi: 32,
    holding_period_months: 36,
    images: [categoryImages.agriculture_sustainable[0], categoryImages.agriculture_sustainable[1], categoryImages.agriculture_sustainable[2]],
  },
  {
    title: 'Organic Waste Management & Composting',
    type: 'startup',
    category: 'agriculture_sustainable',
    location: 'Dubai',
    description: 'Comprehensive organic waste collection and composting service targeting restaurants, hotels, supermarkets, and residential communities across Dubai converting food waste into premium organic compost. The operation collects organic waste using specialized vehicles, processes material in aerobic composting facility, and sells finished compost to landscaping companies, farms, and garden centers. The business model generates revenue from waste collection fees and compost sales creating circular economy. With Dubai producing 3,000 tons of food waste daily and landfill disposal costs rising, this service provides economic and environmental solution. Partnership with municipalities and alignment with UAE\'s sustainability goals provides business advantages. The facility processes 50 tons daily with plans to scale to 200 tons capturing larger market share. Corporate ESG initiatives and zero-waste commitments by major organizations drive demand for professional organic waste solutions.',
    target_amount: 11000000,
    min_ticket: 8000,
    expected_roi: 28,
    holding_period_months: 42,
    images: [categoryImages.agriculture_sustainable[3], categoryImages.agriculture_sustainable[4], categoryImages.agriculture_sustainable[5]],
  },

  // E-commerce & Digital (2 deals)
  {
    title: 'Niche E-commerce Platform - Local Artisans',
    type: 'startup',
    category: 'ecommerce_digital',
    location: 'Dubai',
    description: 'Curated e-commerce marketplace connecting local Emirati and regional artisans with consumers seeking authentic handmade products, traditional crafts, and cultural goods. The platform features jewelry, home decor, traditional clothing, Arabic calligraphy art, and heritage crafts all created by verified local artisans. Value proposition includes storytelling about artisans, authentication of handmade products, and support for local creative economy. Revenue model combines transaction commissions, featured listings, and marketing services for artisans. The platform provides artisans with digital storefront, logistics support, payment processing, and customer service. With cultural renaissance in UAE and consumers seeking unique products beyond mass-produced goods, this marketplace captures growing conscious consumerism trend. Marketing strategy leverages social media, influencer partnerships, and participation in cultural events. Current merchant base includes 200+ artisans with monthly GMV of AED 800K growing at 35% monthly.',
    target_amount: 4500000,
    min_ticket: 5000,
    expected_roi: 65,
    holding_period_months: 24,
    images: [categoryImages.ecommerce_digital[0], categoryImages.ecommerce_digital[1], categoryImages.ecommerce_digital[2]],
  },
  {
    title: 'Cross-Border E-commerce Logistics Hub',
    type: 'startup',
    category: 'ecommerce_digital',
    location: 'Jebel Ali Free Zone',
    description: 'Specialized fulfillment and logistics service enabling GCC e-commerce businesses to efficiently manage cross-border trade particularly between UAE and Saudi Arabia. The 8,000 sqm fulfillment center provides warehousing, inventory management, order processing, customs clearance, and last-mile delivery coordination. Technology platform integrates with major e-commerce platforms and marketplaces providing real-time inventory visibility and order tracking. Strategic location in Jebel Ali Free Zone offers customs advantages and proximity to major ports and airports. The service targets growing segment of regional e-commerce sellers facing logistics complexity. With GCC e-commerce market projected to reach $50 billion by 2025 and cross-border trade growing rapidly, this infrastructure service meets critical market need. Revenue model includes storage fees, fulfillment fees per order, and value-added services. Current clients include 45 e-commerce businesses processing 15,000 orders monthly.',
    target_amount: 13000000,
    min_ticket: 10000,
    expected_roi: 37,
    holding_period_months: 36,
    images: [categoryImages.ecommerce_digital[3], categoryImages.ecommerce_digital[4], categoryImages.ecommerce_digital[5]],
  },

  // Logistics & Supply Chain (2 deals)
  {
    title: 'Cold Chain Logistics - Pharma & Food',
    type: 'franchise',
    category: 'logistics_supply_chain',
    location: 'Dubai',
    description: 'Specialized temperature-controlled logistics service providing storage and distribution for pharmaceuticals, vaccines, fresh food, and perishable goods across UAE. The operation includes 12,000 sqm climate-controlled warehouse with multiple temperature zones (-25°C to +25°C), fleet of 50 refrigerated vehicles, and real-time temperature monitoring systems ensuring product integrity. The company serves pharmaceutical distributors, food importers, healthcare providers, and restaurants. Compliance with GDP (Good Distribution Practice) and HACCP standards ensures pharmaceutical and food safety. With UAE serving as regional distribution hub for pharmaceuticals and growing fresh food imports, demand for professional cold chain services increasing. The business provides mission-critical infrastructure with high barriers to entry and strong customer retention. Revenue model includes storage fees, transportation charges, and value-added services like repackaging and quality testing.',
    target_amount: 19000000,
    min_ticket: 15000,
    expected_roi: 29,
    holding_period_months: 42,
    images: [categoryImages.logistics_supply_chain[0], categoryImages.logistics_supply_chain[1], categoryImages.logistics_supply_chain[2]],
  },
  {
    title: 'Freight Forwarding & Trade Finance Platform',
    type: 'startup',
    category: 'logistics_supply_chain',
    location: 'Jebel Ali',
    description: 'Digital freight forwarding platform simplifying international shipping and trade finance for SME importers and exporters in UAE. The platform provides instant freight quotes, online booking, shipment tracking, customs documentation, and integrated trade finance solutions all through single interface. Technology eliminates traditional inefficiencies in freight forwarding industry providing transparency and cost savings. Network of carrier partnerships enables competitive rates for sea, air, and land freight. Embedded trade finance products including letters of credit and invoice financing solve cash flow challenges for SMEs. The business targets underserved SME segment traditionally dealing with complex traditional freight forwarders. With UAE\'s position as global trade hub and digitalization of logistics industry, this platform addresses massive market opportunity. Current monthly volume includes 500+ shipments worth AED 25M in goods value with strong month-over-month growth.',
    target_amount: 10500000,
    min_ticket: 8000,
    expected_roi: 43,
    holding_period_months: 30,
    images: [categoryImages.logistics_supply_chain[3], categoryImages.logistics_supply_chain[4], categoryImages.logistics_supply_chain[5]],
  },

  // Manufacturing & Production (2 deals)
  {
    title: '3D Printing Manufacturing Hub - Aerospace Parts',
    type: 'startup',
    category: 'manufacturing_production',
    location: 'Dubai Industrial City',
    description: 'Advanced manufacturing facility specializing in 3D printed aerospace and aviation components serving regional airlines, MRO facilities, and aircraft manufacturers. The facility houses industrial-grade metal and polymer 3D printers producing certified aviation parts including brackets, ducts, interior components, and tooling. Technology reduces lead times from months to days while minimizing material waste. Certifications include AS9100 aerospace quality management ensuring parts meet stringent aviation standards. Partnership with major regional airlines and MRO providers ensures steady demand. With global aerospace 3D printing market growing at 24% CAGR and UAE positioning as aviation hub, this facility provides strategic manufacturing capabilities. The business model includes custom part production, design services, and rapid prototyping. Current client portfolio includes 8 aviation companies with strong pipeline of projects. Technology also applicable to medical devices and automotive sectors providing diversification opportunities.',
    target_amount: 17500000,
    min_ticket: 15000,
    expected_roi: 34,
    holding_period_months: 42,
    images: [categoryImages.manufacturing_production[0], categoryImages.manufacturing_production[1], categoryImages.manufacturing_production[2]],
  },
  {
    title: 'Halal Cosmetics Manufacturing Facility',
    type: 'franchise',
    category: 'manufacturing_production',
    location: 'Sharjah',
    description: 'Modern cosmetics manufacturing facility producing premium halal-certified skincare and beauty products for regional and international markets. The 6,000 sqm facility includes formulation labs, production lines, quality control labs, and packaging areas all meeting international GMP standards. Product portfolio includes skincare, cosmetics, and personal care items free from animal-derived ingredients and alcohol. Halal certification from recognized authorities opens access to Muslim-majority markets globally. The company operates both contract manufacturing for established brands and own house brands sold through retail and e-commerce. With global halal cosmetics market projected to reach $52 billion by 2025 and growing consumer awareness, this facility captures significant market opportunity. Strategic location in Sharjah provides cost advantages while proximity to Dubai ensures access to logistics infrastructure. Current production capacity 500,000 units monthly with capabilities to scale 3x.',
    target_amount: 14500000,
    min_ticket: 12000,
    expected_roi: 27,
    holding_period_months: 36,
    images: [categoryImages.manufacturing_production[3], categoryImages.manufacturing_production[4], categoryImages.manufacturing_production[5]],
  },

  // Micro Investment Baskets (2 deals)
  {
    title: 'UAE Real Estate Diversified Basket',
    type: 'equity',
    category: 'micro_investment_baskets',
    location: 'UAE Wide',
    description: 'Carefully curated investment basket providing diversified exposure to UAE real estate sector through fractional ownership of 15 premium properties across Dubai, Abu Dhabi, and Sharjah. The portfolio includes residential apartments in prime locations, commercial office spaces, retail units, and warehouses ensuring diversification across property types and emirates. Each property professionally managed with rental income distributed quarterly to investors. The basket structure allows investors to access real estate market with low minimum investment while benefiting from professional property selection and management. Portfolio weighted toward income-generating stabilized assets with some allocation to development projects for capital appreciation. With UAE real estate market recovering strongly and rental yields attractive, this basket provides passive real estate income exposure. Transparent reporting, regular property valuations, and easy exit mechanism through secondary market make this accessible real estate investment vehicle for retail investors.',
    target_amount: 50000000,
    min_ticket: 3000,
    expected_roi: 19,
    holding_period_months: 36,
    images: [categoryImages.micro_investment_baskets[0], categoryImages.micro_investment_baskets[1], categoryImages.micro_investment_baskets[2]],
  },
  {
    title: 'F&B Growth Basket - Regional Expansion',
    type: 'equity',
    category: 'micro_investment_baskets',
    location: 'GCC',
    description: 'Thematic investment basket providing exposure to 8 high-growth food and beverage concepts expanding across GCC markets. The basket includes cloud kitchens, cafe chains, specialty restaurants, and food tech startups all with proven business models in UAE and clear regional expansion plans. Portfolio selection criteria emphasize strong unit economics, scalable concepts, experienced management teams, and differentiated value propositions. Each business contributes 10-15% to basket ensuring diversification while maintaining growth orientation. The structure provides retail investors access to pre-IPO F&B businesses typically available only to institutional investors. With GCC food service market growing at 7% annually and young demographics driving dining culture evolution, this basket captures sector growth trends. Professional investment committee monitors portfolio companies and provides strategic support. Investors benefit from potential equity appreciation as businesses scale regionally with exit opportunities through acquisitions or IPOs.',
    target_amount: 25000000,
    min_ticket: 5000,
    expected_roi: 35,
    holding_period_months: 42,
    images: [categoryImages.micro_investment_baskets[3], categoryImages.micro_investment_baskets[4], categoryImages.micro_investment_baskets[5]],
  },

  // Secondary Market (2 deals)
  {
    title: 'Premium Office Space - Business Bay (Secondary)',
    type: 'real_estate',
    category: 'secondary_market',
    location: 'Business Bay',
    description: 'Rare opportunity to acquire existing investment position in fully tenanted Grade A office building in Business Bay at 15% discount to current market value. The 8-floor building features 85,000 sq ft of premium office space with 98% occupancy rate and blue-chip tenants on long-term leases. Original investor seeking liquidity for capital reallocation creating attractive entry point for new investors. The property generates stable monthly rental income with remaining lease terms averaging 6 years providing cash flow visibility. Recent property valuation confirms strong fundamentals with rental rates below current market allowing for rental uplifts upon renewals. This secondary market opportunity provides immediate income generation without development risk and capital appreciation potential as Business Bay establishes as prime business district. Property management company handles all operations ensuring passive investment experience. Seller urgency creates pricing advantage for buyers seeking stable real estate income exposure.',
    target_amount: 68000000,
    min_ticket: 50000,
    expected_roi: 24,
    holding_period_months: 48,
    images: [categoryImages.secondary_market[0], categoryImages.secondary_market[1], categoryImages.secondary_market[2]],
  },
  {
    title: 'Established Restaurant Chain Stakes (Secondary)',
    type: 'equity',
    category: 'secondary_market',
    location: 'Dubai',
    description: 'Secondary market opportunity to acquire equity stakes in profitable restaurant chain from early investor exiting after 4 years. The restaurant operates 8 successful locations across Dubai serving contemporary Asian fusion cuisine with strong brand recognition and loyal customer base. Current annual revenue AED 22M with EBITDA margins of 18% demonstrating operational excellence. Management team staying onboard ensuring business continuity. Original investor achieved initial business validation and profitability goals now seeking portfolio rebalancing. The secondary purchase provides new investors entry at attractive valuation below comparable restaurant industry multiples. Immediate cash flow from established operations reduces risk versus startup investments. The chain has clear expansion runway with 5 new locations planned over next 2 years. This investment combines stability of mature business with growth potential of expansion phase while avoiding early-stage operational risks. Legal due diligence completed confirming clean corporate structure.',
    target_amount: 12000000,
    min_ticket: 15000,
    expected_roi: 31,
    holding_period_months: 36,
    images: [categoryImages.secondary_market[3], categoryImages.secondary_market[4], categoryImages.secondary_market[5]],
  },

  // Bundles & Thematic (2 deals)
  {
    title: 'Smart City Innovation Bundle',
    type: 'equity',
    category: 'bundles_thematic',
    location: 'UAE',
    description: 'Thematic investment bundle focused on smart city technologies aligned with UAE\'s digital transformation vision. The bundle includes equity positions in 6 technology companies spanning IoT infrastructure, smart transportation, renewable energy solutions, smart building technology, government digital services, and urban analytics. Each company selected based on proven technology, government partnerships, and revenue traction in UAE smart city initiatives. Portfolio construction provides balanced exposure across infrastructure layer, platform layer, and application layer of smart city ecosystem. With UAE investing billions in smart city development and positioning as global smart city leader, this bundle provides diversified exposure to long-term transformation trend. Companies benefit from government support, large addressable market, and favorable regulatory environment. Bundle structure allows retail investors access to curated smart city investment theme with professional portfolio management. Regular rebalancing ensures portfolio remains aligned with smart city evolution.',
    target_amount: 35000000,
    min_ticket: 8000,
    expected_roi: 42,
    holding_period_months: 48,
    images: [categoryImages.bundles_thematic[0], categoryImages.bundles_thematic[1], categoryImages.bundles_thematic[2]],
  },
  {
    title: 'Women-Led Businesses Bundle',
    type: 'equity',
    category: 'bundles_thematic',
    location: 'UAE',
    description: 'Impact-focused investment bundle supporting 10 high-potential businesses led by women entrepreneurs across diverse sectors including retail, education, health services, technology, and consumer products. Each business demonstrates strong fundamentals including revenue traction, scalable business models, and experienced founding teams. The bundle promotes gender diversity in entrepreneurship while delivering financial returns. Portfolio companies selected through rigorous due diligence assessing business viability, market opportunity, and growth potential alongside leadership quality. Beyond capital, bundle structure provides portfolio companies access to mentorship network, business development support, and collaborative opportunities. With UAE actively promoting women entrepreneurship and female-led businesses showing strong performance metrics, this bundle aligns impact objectives with commercial returns. Investors participate in meaningful social impact while accessing diversified portfolio of growth-stage businesses. Transparent impact reporting alongside financial performance creates comprehensive investment narrative.',
    target_amount: 18000000,
    min_ticket: 5000,
    expected_roi: 33,
    holding_period_months: 36,
    images: [categoryImages.bundles_thematic[3], categoryImages.bundles_thematic[4], categoryImages.bundles_thematic[5]],
  },

  // Community Impact (2 deals)
  {
    title: 'Affordable Housing Project - RAK',
    type: 'real_estate',
    category: 'community_impact',
    location: 'Ras Al Khaimah',
    description: 'Community-focused affordable housing development in Ras Al Khaimah providing quality homes for middle-income families including UAE nationals and long-term residents. The project includes 400 residential units ranging from 1 to 3 bedrooms with family-friendly amenities including playgrounds, community centers, schools, and healthcare facilities. Developed in partnership with RAK government under affordable housing initiative ensuring regulatory support and demand guarantee. Rental and sale pricing structured to serve target demographic while maintaining project viability. The development addresses critical housing affordability challenge as UAE cost of living increases. Community design emphasizes social cohesion with shared spaces, cultural facilities, and sustainable building practices. Investment generates both financial returns and tangible social impact improving quality of life for hundreds of families. Government backing provides downside protection while strong housing demand ensures project success. Shariah-compliant structure with transparent community impact metrics reported regularly to investors.',
    target_amount: 85000000,
    min_ticket: 25000,
    expected_roi: 17,
    holding_period_months: 54,
    images: [categoryImages.community_impact[0], categoryImages.community_impact[1], categoryImages.community_impact[2]],
  },
  {
    title: 'Youth Skills Development Center',
    type: 'equity',
    category: 'community_impact',
    location: 'Sharjah',
    description: 'Social enterprise establishing vocational training center providing practical skills education to young adults from low-income backgrounds in Sharjah. The center offers subsidized training programs in hospitality, retail, customer service, basic IT, and entrepreneurship skills preparing youth for employment opportunities. Partnership with private sector employers ensures curriculum relevance and job placement support. The hybrid revenue model combines course fees, corporate training contracts, and government grants ensuring financial sustainability while maintaining social mission. Facility includes modern classrooms, computer labs, practical training kitchens, and career counseling services. Impact metrics track employment outcomes, income improvements, and community development. The investment provides both modest financial returns and measurable social impact addressing youth unemployment and skills gaps. With UAE emphasis on Emiratization and inclusive growth, this center receives government support and corporate partnerships. Success model designed for replication across emirates scaling positive impact.',
    target_amount: 6500000,
    min_ticket: 5000,
    expected_roi: 12,
    holding_period_months: 48,
    images: [categoryImages.community_impact[3], categoryImages.community_impact[4], categoryImages.community_impact[5]],
  },

  // OWNLY Exchange (2 deals)
  {
    title: 'Digital Securities Trading Platform',
    type: 'startup',
    category: 'ownly_exchange',
    location: 'ADGM',
    description: 'Regulated digital securities exchange platform enabling trading of tokenized assets including real estate, private equity, and structured products in UAE. The platform leverages blockchain technology to provide transparent, efficient, and secure trading infrastructure for alternative investments. Licensed by ADGM Financial Services Regulatory Authority ensuring compliance with securities regulations. The exchange provides primary issuance services, secondary market liquidity, custody solutions, and investor verification all integrated into seamless platform. Technology reduces settlement time from days to minutes while maintaining regulatory compliance. Target users include institutional investors, family offices, and high-net-worth individuals seeking access to alternative assets with improved liquidity. With traditional securities moving toward tokenization and growing demand for alternative investment access, this platform positions at convergence of finance and technology. Business model includes transaction fees, listing fees, and technology licensing. Strategic partnerships with regional financial institutions and asset managers provide deal pipeline and market credibility.',
    target_amount: 22000000,
    min_ticket: 20000,
    expected_roi: 38,
    holding_period_months: 42,
    images: [categoryImages.ownly_exchange[0], categoryImages.ownly_exchange[1], categoryImages.ownly_exchange[2]],
  },
  {
    title: 'Alternative Investment Marketplace Infrastructure',
    type: 'startup',
    category: 'ownly_exchange',
    location: 'DIFC',
    description: 'B2B marketplace infrastructure enabling financial institutions to offer alternative investments including private debt, venture capital, and real estate opportunities to their retail and wealth clients. The white-label platform integrates with banks and wealth management firms providing technology, deal sourcing, due diligence, and operational infrastructure. Solution democratizes access to alternative investments typically available only to ultra-high-net-worth individuals. Technology handles complex workflows including investor accreditation, deal distribution, fund administration, and reporting while financial institutions maintain client relationships. Revenue model based on platform licensing fees and transaction-based revenue share. With wealth management industry seeking product differentiation and clients demanding alternative asset access, this infrastructure serves critical market need. Current partnerships with 3 regional banks in pilot phase with pipeline of 8 additional financial institutions. Regulatory approval from DIFC ensures compliance with wealth management regulations. Scalable technology can serve entire regional financial services industry.',
    target_amount: 15000000,
    min_ticket: 15000,
    expected_roi: 45,
    holding_period_months: 36,
    images: [categoryImages.ownly_exchange[3], categoryImages.ownly_exchange[4], categoryImages.ownly_exchange[5]],
  },
];

async function createComprehensiveDeals() {
  try {
    console.log('Creating comprehensive deals for all categories...\n');

    let created = 0;
    let updated = 0;
    const categoryCount = {};

    for (const deal of comprehensiveDeals) {
      // Track deals per category
      categoryCount[deal.category] = (categoryCount[deal.category] || 0) + 1;

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
          deal.images,
        ],
      });

      if (result && result.length > 0) {
        if (result[0].inserted) {
          created++;
          console.log(`✓ Created: ${deal.title} [${deal.category}]`);
        } else {
          updated++;
          console.log(`↻ Updated: ${deal.title} [${deal.category}]`);
        }
      }
    }

    console.log(`\n✅ Complete!`);
    console.log(`   Created: ${created} deals`);
    console.log(`   Updated: ${updated} deals`);
    console.log(`   Total: ${comprehensiveDeals.length} deals processed\n`);

    console.log('📊 Deals per category:');
    Object.keys(categoryCount).sort().forEach(cat => {
      console.log(`   ${cat}: ${categoryCount[cat]} deals`);
    });

  } catch (error) {
    console.error('Error creating deals:', error);
    throw error;
  }
}

// Run the script
createComprehensiveDeals()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

export { createComprehensiveDeals };
