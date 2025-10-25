import faker from 'faker';
import { v4 as uuidv4 } from 'uuid';

// Set seed for reproducible data
faker.seed(123);

export const generateUser = (role = 'investor_retail', overrides = {}) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName).toLowerCase();

  return {
    id: uuidv4(),
    name: `${firstName} ${lastName}`,
    email,
    phone: faker.phone.phoneNumber('+971-5########'),
    password: 'password123', // Will be hashed by model hook
    role,
    kyc_status: faker.random.arrayElement(['pending', 'approved', 'under_review']),
    avatar: faker.image.avatar(),
    country: faker.random.arrayElement(['UAE', 'India', 'USA', 'UK', 'Saudi Arabia']),
    city: faker.address.city(),
    preferences: {
      currency: 'USD',
      notifications: true,
      newsletter: faker.datatype.boolean(),
    },
    is_dummy: true,
    is_active: true,
    ...overrides,
  };
};

export const generateDeal = (creatorId = null, overrides = {}) => {
  const dealTypes = ['real_estate', 'franchise', 'startup', 'asset'];
  const type = overrides.type || faker.random.arrayElement(dealTypes);

  const titles = {
    real_estate: [
      'Luxury Villa in Palm Jumeirah',
      'Commercial Tower in DIFC',
      'Residential Complex in JBR',
      'Beachfront Apartment in Marina',
      'Studio Apartments in Business Bay',
    ],
    franchise: [
      'Cafe Coffee Day - Dubai Mall',
      'Subway - Abu Dhabi Airport',
      'McDonald\'s - Sheikh Zayed Road',
      'Starbucks - Marina Walk',
      'KFC - Ibn Battuta Mall',
    ],
    startup: [
      'FinTech Payment Gateway',
      'E-Commerce Fashion Platform',
      'Healthcare AI Diagnostics',
      'Food Delivery App - MENA',
      'PropTech Real Estate Platform',
    ],
    asset: [
      'Commercial Vehicle Fleet',
      'Solar Energy Farm',
      'Warehouse Logistics Hub',
      'Data Center Infrastructure',
      'Agricultural Land Development',
    ],
  };

  const title = faker.random.arrayElement(titles[type]);
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + faker.datatype.number({ min: 1000, max: 9999 });
  const targetAmount = faker.random.arrayElement([500000, 1000000, 2500000, 5000000, 10000000]);
  const minTicket = targetAmount * 0.01; // 1% of target

  return {
    id: uuidv4(),
    title,
    slug,
    type,
    jurisdiction: faker.random.arrayElement(['DIFC', 'ADGM', 'IFZA', 'DMCC', 'Cayman Islands']),
    location: faker.random.arrayElement(['Dubai', 'Abu Dhabi', 'Sharjah', 'Riyadh', 'Mumbai']),
    description: faker.lorem.paragraphs(3),
    target_amount: targetAmount,
    min_ticket: minTicket,
    max_ticket: targetAmount * 0.20,
    raised_amount: 0,
    investor_count: 0,
    holding_period_months: faker.random.arrayElement([12, 24, 36, 48, 60]),
    expected_roi: faker.datatype.float({ min: 8, max: 25, precision: 0.1 }),
    expected_irr: faker.datatype.float({ min: 10, max: 30, precision: 0.1 }),
    fees: {
      platform_fee: 2.0,
      management_fee: 1.5,
      carry: 20.0,
    },
    status: faker.random.arrayElement(['open', 'funding', 'funded']),
    open_date: faker.date.past(0.5),
    close_date: faker.date.future(0.3),
    images: [
      faker.image.business(800, 600),
      faker.image.business(800, 600),
      faker.image.business(800, 600),
    ],
    documents: [
      { name: 'Investment Memorandum', url: '/dummy/docs/im.pdf', type: 'pdf' },
      { name: 'SPV Formation Docs', url: '/dummy/docs/spv.pdf', type: 'pdf' },
    ],
    metadata: generateDealMetadata(type),
    created_by: creatorId,
    ...overrides,
  };
};

const generateDealMetadata = (type) => {
  switch (type) {
    case 'real_estate':
      return {
        bedrooms: faker.random.arrayElement([1, 2, 3, 4, 5]),
        bathrooms: faker.random.arrayElement([1, 2, 3, 4]),
        area_sqft: faker.datatype.number({ min: 500, max: 5000 }),
        furnished: faker.datatype.boolean(),
        amenities: ['Swimming Pool', 'Gym', 'Parking', 'Security'],
      };
    case 'franchise':
      return {
        brand: faker.company.companyName(),
        franchiseFee: faker.datatype.number({ min: 50000, max: 200000 }),
        royaltyRate: faker.datatype.float({ min: 3, max: 8, precision: 0.1 }),
        territory: faker.address.city(),
      };
    case 'startup':
      return {
        sector: faker.random.arrayElement(['FinTech', 'HealthTech', 'EdTech', 'PropTech']),
        stage: faker.random.arrayElement(['Seed', 'Series A', 'Series B']),
        teamSize: faker.datatype.number({ min: 5, max: 50 }),
      };
    default:
      return {};
  }
};

export const generateSPV = (dealId, deal, overrides = {}) => {
  const spvName = `SPV-${deal.title.substring(0, 20).toUpperCase().replace(/[^A-Z0-9]/g, '')}-${faker.datatype.number({ min: 100, max: 999 })}`;
  const totalShares = 1000000; // 1 million shares
  const sharePrice = deal.target_amount / totalShares;

  return {
    id: uuidv4(),
    deal_id: dealId,
    spv_name: spvName,
    jurisdiction: deal.jurisdiction,
    registration_number: `REG-${faker.datatype.number({ min: 100000, max: 999999 })}`,
    share_structure: {
      shareClasses: ['Common'],
      votingRights: 'One share, one vote',
    },
    total_shares: totalShares,
    issued_shares: 0,
    share_price: sharePrice,
    spv_documents: [
      { name: 'Certificate of Incorporation', url: '/dummy/docs/spv-cert.pdf' },
      { name: 'Operating Agreement', url: '/dummy/docs/spv-agreement.pdf' },
      { name: 'Subscription Agreement', url: '/dummy/docs/subscription.pdf' },
    ],
    virtual_bank_account: `AE${faker.datatype.number({ min: 1000000000000000, max: 9999999999999999 })}`,
    escrow_balance: 0,
    operating_balance: 0,
    total_revenue: 0,
    total_expenses: 0,
    total_distributed: 0,
    status: 'created',
    inception_date: new Date(),
    ...overrides,
  };
};

export const generateInvestment = (userId, spvId, dealId, spv, overrides = {}) => {
  const amount = faker.random.arrayElement([5000, 10000, 25000, 50000, 100000, 250000]);
  const sharesIssued = Math.floor(amount / spv.share_price);

  return {
    id: uuidv4(),
    user_id: userId,
    spv_id: spvId,
    deal_id: dealId,
    amount,
    shares_issued: sharesIssued,
    share_price: spv.share_price,
    status: faker.random.arrayElement(['confirmed', 'active']),
    invested_at: faker.date.past(0.5),
    confirmed_at: faker.date.past(0.4),
    total_payouts_received: 0,
    current_value: amount * faker.datatype.float({ min: 0.95, max: 1.15, precision: 0.01 }),
    ...overrides,
  };
};

export const generateAgent = (userId, overrides = {}) => {
  const code = faker.random.alphaNumeric(8).toUpperCase();

  return {
    id: uuidv4(),
    user_id: userId,
    code,
    referral_count: faker.datatype.number({ min: 0, max: 50 }),
    total_investment_referred: faker.datatype.number({ min: 0, max: 500000 }),
    commissions_earned: faker.datatype.number({ min: 0, max: 25000 }),
    commissions_paid: faker.datatype.number({ min: 0, max: 20000 }),
    commission_rate: 2.0,
    tier: faker.random.arrayElement(['bronze', 'silver', 'gold', 'platinum']),
    status: 'active',
    ...overrides,
  };
};

export const generateWallet = (userId, overrides = {}) => {
  return {
    id: uuidv4(),
    user_id: userId,
    currency: 'USD',
    balance_dummy: faker.datatype.number({ min: 10000, max: 1000000 }),
    ledger_entries: [],
    ...overrides,
  };
};

export const generateAsset = (spvId, type = 'property', overrides = {}) => {
  const assetTypes = {
    property: {
      name: `${faker.address.streetName()} Property`,
      address: faker.address.streetAddress(),
      city: faker.address.city(),
      country: faker.random.arrayElement(['UAE', 'Saudi Arabia', 'India']),
      metadata: {
        type: faker.random.arrayElement(['Apartment', 'Villa', 'Townhouse']),
        bedrooms: faker.random.arrayElement([1, 2, 3, 4]),
        sqft: faker.datatype.number({ min: 500, max: 3000 }),
      },
    },
    franchise_unit: {
      name: `${faker.company.companyName()} Store`,
      address: faker.address.streetAddress(),
      city: faker.address.city(),
      country: 'UAE',
      metadata: {
        brand: faker.company.companyName(),
        storeSize: faker.datatype.number({ min: 500, max: 2000 }),
        seatingCapacity: faker.datatype.number({ min: 20, max: 100 }),
      },
    },
  };

  const assetData = assetTypes[type] || assetTypes.property;

  return {
    id: uuidv4(),
    spv_id: spvId,
    asset_type: type,
    ...assetData,
    images: [faker.image.business(), faker.image.business()],
    operation_status: 'operational',
    acquisition_cost: faker.datatype.number({ min: 500000, max: 5000000 }),
    current_valuation: faker.datatype.number({ min: 500000, max: 6000000 }),
    occupancy_rate: faker.datatype.float({ min: 70, max: 100, precision: 0.1 }),
    monthly_revenue: faker.datatype.number({ min: 10000, max: 100000 }),
    monthly_expenses: faker.datatype.number({ min: 5000, max: 50000 }),
    ...overrides,
  };
};

export const cities = {
  UAE: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'],
  India: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina'],
};

export const dealCategories = {
  real_estate: ['Residential', 'Commercial', 'Mixed-Use', 'Hospitality'],
  franchise: ['Food & Beverage', 'Retail', 'Services', 'Health & Wellness'],
  startup: ['FinTech', 'HealthTech', 'EdTech', 'PropTech', 'E-Commerce'],
  asset: ['Infrastructure', 'Energy', 'Logistics', 'Agriculture'],
};
