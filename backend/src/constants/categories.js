/**
 * OWNLY Master Deal Categories (Shariah-Compliant)
 * Complete list of all legal, Shariah-compliant investment categories
 */

export const DEAL_CATEGORIES = {
  // 1️⃣ Real Estate & Property Investments
  REAL_ESTATE: {
    key: 'real_estate',
    label: 'Real Estate & Property',
    icon: 'building',
    description: 'Property investments including residential, commercial, and hospitality',
    shariah_compliant: true,
    subcategories: {
      RESIDENTIAL_APARTMENTS: { key: 'residential_apartments', label: 'Residential Apartments / Villas' },
      COMMERCIAL_BUILDINGS: { key: 'commercial_buildings', label: 'Commercial Buildings / Offices' },
      COWORKING_SPACES: { key: 'coworking_spaces', label: 'Co-working Spaces' },
      HOLIDAY_HOMES: { key: 'holiday_homes', label: 'Holiday Homes / Serviced Apartments' },
      HOTELS_RESORTS: { key: 'hotels_resorts', label: 'Hotels & Resorts' },
      STUDENT_HOUSING: { key: 'student_housing', label: 'Student Housing' },
      WAREHOUSES: { key: 'warehouses', label: 'Warehouses / Logistics Parks' },
      STAFF_ACCOMMODATIONS: { key: 'staff_accommodations', label: 'Staff Accommodations' },
      LAND_DEVELOPMENT: { key: 'land_development', label: 'Land Development Projects' },
      MALL_RETAIL_SPACE: { key: 'mall_retail_space', label: 'Mall & Retail Space Investments' },
    }
  },

  // 2️⃣ Mobility & Transport
  MOBILITY_TRANSPORT: {
    key: 'mobility_transport',
    label: 'Mobility & Transport',
    icon: 'car',
    description: 'Vehicle rental, fleet management, and transport services',
    shariah_compliant: true,
    subcategories: {
      CAR_RENTAL_FLEETS: { key: 'car_rental_fleets', label: 'Car Rental Fleets (Self-drive / Chauffeur)' },
      LIMOUSINE_AIRPORT: { key: 'limousine_airport', label: 'Limousine & Airport Transfer Business' },
      DELIVERY_VEHICLES: { key: 'delivery_vehicles', label: 'Delivery Vehicles / Logistics Fleet' },
      EV_LEASING: { key: 'ev_leasing', label: 'Electric Vehicle Leasing' },
      CAR_SHARING: { key: 'car_sharing', label: 'Car Sharing / Subscription Models' },
      TAXI_RIDESHARE: { key: 'taxi_rideshare', label: 'Taxi Aggregation / Rideshare Partnerships' },
    }
  },

  // 3️⃣ Hospitality & Tourism
  HOSPITALITY_TOURISM: {
    key: 'hospitality_tourism',
    label: 'Hospitality & Tourism',
    icon: 'compass',
    description: 'Travel, tourism, and hospitality businesses',
    shariah_compliant: true,
    subcategories: {
      TRAVEL_AGENCIES: { key: 'travel_agencies', label: 'Travel Agencies' },
      VACATION_HOMES: { key: 'vacation_homes', label: 'Vacation Homes' },
      DESERT_SAFARI: { key: 'desert_safari', label: 'Desert Safari / Tour Operators' },
      YACHT_RENTALS: { key: 'yacht_rentals', label: 'Yacht Rentals (No alcohol)' },
      LUXURY_CAMPING: { key: 'luxury_camping', label: 'Luxury Camp / Glamping Sites' },
      EXPERIENCE_PACKAGES: { key: 'experience_packages', label: 'Experience Packages (Adventure, Cultural)' },
    }
  },

  // 4️⃣ Food & Beverage (Halal-Only)
  FOOD_BEVERAGE: {
    key: 'food_beverage',
    label: 'Food & Beverage',
    icon: 'utensils',
    description: 'Halal-only food and beverage businesses',
    shariah_compliant: true,
    subcategories: {
      CAFES_COFFEE: { key: 'cafes_coffee', label: 'Cafés / Coffee Brands' },
      RESTAURANTS: { key: 'restaurants', label: 'Restaurants (QSR / Fine Dining)' },
      CLOUD_KITCHENS: { key: 'cloud_kitchens', label: 'Cloud Kitchens' },
      FOOD_TRUCKS: { key: 'food_trucks', label: 'Food Trucks' },
      CATERING_SERVICES: { key: 'catering_services', label: 'Catering Services' },
      HALAL_FOOD_BRANDS: { key: 'halal_food_brands', label: 'Organic / Halal Food Brands' },
    }
  },

  // 5️⃣ Health, Beauty & Wellness
  HEALTH_WELLNESS: {
    key: 'health_wellness',
    label: 'Health, Beauty & Wellness',
    icon: 'heart',
    description: 'Healthcare, beauty, and wellness services',
    shariah_compliant: true,
    subcategories: {
      CLINICS: { key: 'clinics', label: 'Clinics (Dental, Aesthetic, GP)' },
      DIAGNOSTIC_CENTERS: { key: 'diagnostic_centers', label: 'Diagnostic Centers' },
      PHARMACIES: { key: 'pharmacies', label: 'Pharmacies' },
      SPAS_SALONS: { key: 'spas_salons', label: 'Spas / Salons' },
      FITNESS_CENTERS: { key: 'fitness_centers', label: 'Fitness Centers / Gyms' },
      WELLNESS_RETREATS: { key: 'wellness_retreats', label: 'Wellness Retreats' },
      NUTRACEUTICAL: { key: 'nutraceutical', label: 'Nutraceutical / Organic Product Lines' },
    }
  },

  // 6️⃣ Retail & Franchises
  RETAIL_FRANCHISES: {
    key: 'retail_franchises',
    label: 'Retail & Franchises',
    icon: 'store',
    description: 'Retail stores and franchise opportunities',
    shariah_compliant: true,
    subcategories: {
      PERFUME_OUD: { key: 'perfume_oud', label: 'Perfume / Oud Stores' },
      CLOTHING_FASHION: { key: 'clothing_fashion', label: 'Clothing & Fashion Boutiques' },
      JEWELRY_WATCHES: { key: 'jewelry_watches', label: 'Jewelry & Watches' },
      FOOTWEAR_ACCESSORIES: { key: 'footwear_accessories', label: 'Footwear & Accessories' },
      GIFT_SHOPS: { key: 'gift_shops', label: 'Gift Shops' },
      CONVENIENCE_STORES: { key: 'convenience_stores', label: 'Convenience Stores' },
      ELECTRONICS_RETAIL: { key: 'electronics_retail', label: 'Electronics Retail' },
      OPTICAL_EYEWEAR: { key: 'optical_eyewear', label: 'Optical / Eyewear Shops' },
      PET_SHOPS: { key: 'pet_shops', label: 'Pet Shops' },
      BOOKSTORES: { key: 'bookstores', label: 'Bookstores' },
    }
  },

  // 7️⃣ Education & Training
  EDUCATION_TRAINING: {
    key: 'education_training',
    label: 'Education & Training',
    icon: 'graduation-cap',
    description: 'Educational institutions and training centers',
    shariah_compliant: true,
    subcategories: {
      COACHING_CENTERS: { key: 'coaching_centers', label: 'Coaching Centers' },
      SKILL_DEVELOPMENT: { key: 'skill_development', label: 'Skill Development Institutes' },
      ONLINE_LEARNING: { key: 'online_learning', label: 'Online Learning Platforms' },
      PRESCHOOL_DAYCARE: { key: 'preschool_daycare', label: 'Preschool & Daycare' },
      LANGUAGE_CENTERS: { key: 'language_centers', label: 'Language Centers' },
      EDTECH_STARTUPS: { key: 'edtech_startups', label: 'EdTech Startups' },
    }
  },

  // 8️⃣ Media, Marketing & Entertainment
  MEDIA_ENTERTAINMENT: {
    key: 'media_entertainment',
    label: 'Media, Marketing & Entertainment',
    icon: 'film',
    description: 'Media production, marketing, and family entertainment',
    shariah_compliant: true,
    subcategories: {
      FILM_WEB_SERIES: { key: 'film_web_series', label: 'Film / Web Series (Non-gambling / Family content)' },
      PODCAST_STUDIOS: { key: 'podcast_studios', label: 'Podcast Studios' },
      INFLUENCER_BRANDS: { key: 'influencer_brands', label: 'Influencer / Creator Brand Deals' },
      ADVERTISING_AGENCIES: { key: 'advertising_agencies', label: 'Advertising Agencies' },
      EVENT_PRODUCTION: { key: 'event_production', label: 'Event Production Houses' },
      DIGITAL_MEDIA: { key: 'digital_media', label: 'Digital Media Startups' },
    }
  },

  // 9️⃣ Technology & Innovation
  TECHNOLOGY_INNOVATION: {
    key: 'technology_innovation',
    label: 'Technology & Innovation',
    icon: 'laptop',
    description: 'Tech startups and innovative solutions',
    shariah_compliant: true,
    subcategories: {
      MOBILE_APPS_SAAS: { key: 'mobile_apps_saas', label: 'Mobile Apps / SaaS Tools' },
      FINTECH_STARTUPS: { key: 'fintech_startups', label: 'Fintech Startups' },
      AI_ANALYTICS: { key: 'ai_analytics', label: 'AI & Analytics Firms' },
      LOGISTICS_TECH: { key: 'logistics_tech', label: 'Logistics Tech' },
      PROPTECH_HEALTHTECH: { key: 'proptech_healthtech', label: 'PropTech / HealthTech / EduTech' },
      CLOUD_KITCHEN_TECH: { key: 'cloud_kitchen_tech', label: 'Cloud Kitchens Tech Systems' },
    }
  },

  // 🔟 Home Services & Lifestyle
  HOME_SERVICES: {
    key: 'home_services',
    label: 'Home Services & Lifestyle',
    icon: 'home',
    description: 'Home maintenance and lifestyle services',
    shariah_compliant: true,
    subcategories: {
      CLEANING_MAINTENANCE: { key: 'cleaning_maintenance', label: 'Cleaning / Maintenance Services' },
      PEST_CONTROL: { key: 'pest_control', label: 'Pest Control' },
      HOME_RENOVATION: { key: 'home_renovation', label: 'Home Renovation / Fitout Firms' },
      APPLIANCE_REPAIRS: { key: 'appliance_repairs', label: 'Appliance Repairs' },
      SMART_HOME: { key: 'smart_home', label: 'Smart Home Solutions' },
    }
  },

  // 11️⃣ Events, Experiences & Entertainment
  EVENTS_EXPERIENCES: {
    key: 'events_experiences',
    label: 'Events, Experiences & Entertainment',
    icon: 'calendar',
    description: 'Event management and experiential entertainment',
    shariah_compliant: true,
    subcategories: {
      CONCERTS_EXHIBITIONS: { key: 'concerts_exhibitions', label: 'Concerts / Exhibitions' },
      SEASONAL_EVENTS: { key: 'seasonal_events', label: 'Seasonal Events (Ramadan / National Day)' },
      CORPORATE_EVENTS: { key: 'corporate_events', label: 'Corporate Events' },
      SPORTS_EVENTS: { key: 'sports_events', label: 'Sports Events (Non-betting)' },
      THEME_PARKS: { key: 'theme_parks', label: 'Theme Parks / Game Zones' },
      WEDDING_PLANNING: { key: 'wedding_planning', label: 'Wedding Planners / Decor' },
    }
  },

  // 12️⃣ Agriculture & Sustainable Projects
  AGRICULTURE_SUSTAINABLE: {
    key: 'agriculture_sustainable',
    label: 'Agriculture & Sustainable Projects',
    icon: 'leaf',
    description: 'Agricultural and sustainability-focused investments',
    shariah_compliant: true,
    subcategories: {
      ORGANIC_FARMING: { key: 'organic_farming', label: 'Organic Farming' },
      HYDROPONICS: { key: 'hydroponics', label: 'Hydroponics / Vertical Farms' },
      DATES_HONEY: { key: 'dates_honey', label: 'Dates & Honey Production' },
      LIVESTOCK_POULTRY: { key: 'livestock_poultry', label: 'Livestock & Poultry (Halal)' },
      RECYCLING_PLANTS: { key: 'recycling_plants', label: 'Recycling Plants' },
      SOLAR_ENERGY: { key: 'solar_energy', label: 'Solar Energy Projects' },
      WATER_DESALINATION: { key: 'water_desalination', label: 'Water Desalination Units' },
    }
  },

  // 13️⃣ E-commerce & Digital Ventures
  ECOMMERCE_DIGITAL: {
    key: 'ecommerce_digital',
    label: 'E-commerce & Digital Ventures',
    icon: 'shopping-cart',
    description: 'Online retail and digital business models',
    shariah_compliant: true,
    subcategories: {
      ONLINE_RETAIL: { key: 'online_retail', label: 'Online Retail Stores' },
      SUBSCRIPTION_BOXES: { key: 'subscription_boxes', label: 'Subscription Boxes' },
      INFLUENCER_LED_BRANDS: { key: 'influencer_led_brands', label: 'Influencer-led Brands' },
      DROPSHIPPING_HALAL: { key: 'dropshipping_halal', label: 'Dropshipping (Halal Products)' },
      B2B_MARKETPLACES: { key: 'b2b_marketplaces', label: 'B2B Marketplaces' },
    }
  },

  // 14️⃣ Logistics & Supply Chain
  LOGISTICS_SUPPLY_CHAIN: {
    key: 'logistics_supply_chain',
    label: 'Logistics & Supply Chain',
    icon: 'truck',
    description: 'Logistics, warehousing, and supply chain management',
    shariah_compliant: true,
    subcategories: {
      COURIER_DELIVERY: { key: 'courier_delivery', label: 'Courier / Delivery Hubs' },
      WAREHOUSE_LEASING: { key: 'warehouse_leasing', label: 'Warehouse Leasing' },
      COLD_STORAGE: { key: 'cold_storage', label: 'Cold Storage Units' },
      FREIGHT_FORWARDING: { key: 'freight_forwarding', label: 'Freight Forwarding' },
      FULFILMENT_CENTERS: { key: 'fulfilment_centers', label: 'E-commerce Fulfilment Centers' },
    }
  },

  // 15️⃣ Manufacturing & Production
  MANUFACTURING_PRODUCTION: {
    key: 'manufacturing_production',
    label: 'Manufacturing & Production',
    icon: 'industry',
    description: 'Manufacturing and production facilities',
    shariah_compliant: true,
    subcategories: {
      PERFUME_COSMETIC_MFG: { key: 'perfume_cosmetic_mfg', label: 'Perfume & Cosmetic Manufacturing' },
      FOOD_PROCESSING: { key: 'food_processing', label: 'Food Processing Units' },
      CLOTHING_TEXTILE: { key: 'clothing_textile', label: 'Clothing / Textile Production' },
      FURNITURE_MFG: { key: 'furniture_mfg', label: 'Furniture Manufacturing' },
      CONSTRUCTION_MATERIALS: { key: 'construction_materials', label: 'Construction Materials' },
      PACKAGING_PRINTING: { key: 'packaging_printing', label: 'Packaging / Printing Units' },
    }
  },

  // 16️⃣ Smart Micro-Investment Baskets
  MICRO_INVESTMENT_BASKETS: {
    key: 'micro_investment_baskets',
    label: 'Smart Micro-Investment Baskets',
    icon: 'briefcase',
    description: 'Diversified investment baskets and SIP plans',
    shariah_compliant: true,
    subcategories: {
      MONTHLY_SIPS: { key: 'monthly_sips', label: 'Monthly SIPs (100 AED minimum)' },
      DIVERSIFIED_BASKETS: { key: 'diversified_baskets', label: 'Diversified Category Baskets (2000 AED min)' },
      FRANCHISE_POOL: { key: 'franchise_pool', label: 'Franchise Growth Pool' },
      REAL_ESTATE_MINI_FUND: { key: 'real_estate_mini_fund', label: 'Real Estate Mini-Fund' },
      MOBILITY_FUND: { key: 'mobility_fund', label: 'Mobility Fund' },
      HEALTH_WELLNESS_FUND: { key: 'health_wellness_fund', label: 'Health & Wellness Fund' },
      RETAIL_EXPANSION_POOL: { key: 'retail_expansion_pool', label: 'Retail Expansion Pool' },
      TECH_STARTUP_BASKET: { key: 'tech_startup_basket', label: 'Tech Startup Basket' },
    }
  },

  // 17️⃣ Secondary Market Deals
  SECONDARY_MARKET: {
    key: 'secondary_market',
    label: 'Secondary Market Deals',
    icon: 'exchange',
    description: 'Resale and trading of existing investments',
    shariah_compliant: true,
    subcategories: {
      SPV_SHARE_RESALE: { key: 'spv_share_resale', label: 'Resale of SPV Shares' },
      PARTIAL_EXIT: { key: 'partial_exit', label: 'Partial Exit Opportunities' },
      PEER_TO_PEER_TRADES: { key: 'peer_to_peer_trades', label: 'Peer-to-Peer Ownership Trades' },
    }
  },

  // 18️⃣ Bundles & Thematic Funds
  BUNDLES_THEMATIC: {
    key: 'bundles_thematic',
    label: 'Bundles & Thematic Funds',
    icon: 'layer-group',
    description: 'Curated investment bundles with specific themes',
    shariah_compliant: true,
    subcategories: {
      WORK_LIFE_BUNDLE: { key: 'work_life_bundle', label: '"Work-Life" Bundle → Co-working + Coffee + Gym' },
      TOURIST_BUNDLE: { key: 'tourist_bundle', label: '"Tourist Bundle" → Hotel + Car Rental + Events' },
      WELLNESS_BUNDLE: { key: 'wellness_bundle', label: '"Wellness Bundle" → Clinic + Spa + Product Line' },
      TECH_GROWTH_BUNDLE: { key: 'tech_growth_bundle', label: '"Tech & Growth" → App + Startup + SaaS' },
      LOCAL_BUSINESS_BUNDLE: { key: 'local_business_bundle', label: '"Local Business" → Small shops & franchises' },
    }
  },

  // 19️⃣ Community & Impact Projects
  COMMUNITY_IMPACT: {
    key: 'community_impact',
    label: 'Community & Impact Projects',
    icon: 'users',
    description: 'Social enterprises and community-focused investments',
    shariah_compliant: true,
    subcategories: {
      MOSQUES_ISLAMIC_CENTERS: { key: 'mosques_islamic_centers', label: 'Mosques / Islamic Centers (Non-profit)' },
      CHARITY_BUSINESSES: { key: 'charity_businesses', label: 'Charity Businesses (Halal)' },
      EDUCATIONAL_NGOS: { key: 'educational_ngos', label: 'Educational NGOs' },
      WOMEN_EMPOWERMENT: { key: 'women_empowerment', label: 'Women Empowerment Programs' },
      SOCIAL_ENTERPRISES: { key: 'social_enterprises', label: 'Social Enterprises' },
    }
  },

  // 20️⃣ Ownly Exchange & Secondary Assets
  OWNLY_EXCHANGE: {
    key: 'ownly_exchange',
    label: 'Ownly Exchange & Secondary Assets',
    icon: 'chart-line',
    description: 'Marketplace for trading certified investment assets',
    shariah_compliant: true,
    subcategories: {
      SPV_TOKENS: { key: 'spv_tokens', label: 'All listed SPV tokens' },
      CERTIFIED_ASSET_TRADES: { key: 'certified_asset_trades', label: 'Ownly-certified asset trades' },
      FUND_RESALES: { key: 'fund_resales', label: 'Fund resales' },
      EXISTING_INVESTMENTS: { key: 'existing_investments', label: 'Marketplace of existing investments' },
    }
  },
};

/**
 * NON-SHARIAH COMPLIANT CATEGORIES (NOT ALLOWED)
 */
export const PROHIBITED_CATEGORIES = [
  'Alcohol production/sales',
  'Betting & gambling',
  'Casinos & gaming',
  'Interest-based lending',
  'Adult entertainment',
  'Pork products',
  'Tobacco',
  'Weapons manufacturing',
];

/**
 * Get all main categories as array
 */
export const getAllCategories = () => {
  return Object.values(DEAL_CATEGORIES).map(cat => ({
    key: cat.key,
    label: cat.label,
    icon: cat.icon,
    description: cat.description,
    shariah_compliant: cat.shariah_compliant,
  }));
};

/**
 * Get all subcategories for a specific category
 */
export const getSubcategories = (categoryKey) => {
  const category = Object.values(DEAL_CATEGORIES).find(cat => cat.key === categoryKey);
  return category ? Object.values(category.subcategories) : [];
};

/**
 * Get category by key
 */
export const getCategoryByKey = (key) => {
  return Object.values(DEAL_CATEGORIES).find(cat => cat.key === key);
};

/**
 * Get subcategory by key within a category
 */
export const getSubcategoryByKey = (categoryKey, subcategoryKey) => {
  const category = getCategoryByKey(categoryKey);
  return category?.subcategories?.[Object.keys(category.subcategories).find(
    k => category.subcategories[k].key === subcategoryKey
  )];
};

/**
 * Validate if category is Shariah-compliant
 */
export const isShariahCompliant = (categoryKey) => {
  const category = getCategoryByKey(categoryKey);
  return category?.shariah_compliant || false;
};

/**
 * Export all category keys as enum
 */
export const CATEGORY_KEYS = Object.values(DEAL_CATEGORIES).map(cat => cat.key);

/**
 * Export all subcategory keys as flat array
 */
export const ALL_SUBCATEGORY_KEYS = Object.values(DEAL_CATEGORIES).flatMap(cat =>
  Object.values(cat.subcategories).map(sub => sub.key)
);
