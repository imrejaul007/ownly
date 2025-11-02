import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Deal = sequelize.define('Deal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM('real_estate', 'franchise', 'startup', 'asset', 'equity', 'basket', 'trade'),
    allowNull: false,
  },
  // Main Category (20 master categories)
  category: {
    type: DataTypes.ENUM(
      'real_estate',
      'mobility_transport',
      'hospitality_tourism',
      'food_beverage',
      'health_wellness',
      'retail_franchises',
      'education_training',
      'media_entertainment',
      'technology_innovation',
      'home_services',
      'events_experiences',
      'agriculture_sustainable',
      'ecommerce_digital',
      'logistics_supply_chain',
      'manufacturing_production',
      'micro_investment_baskets',
      'secondary_market',
      'bundles_thematic',
      'community_impact',
      'ownly_exchange'
    ),
    allowNull: true,
    comment: 'Main Shariah-compliant category',
  },
  // Subcategory (specific business type within category)
  subcategory: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Specific subcategory within main category',
  },
  jurisdiction: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  target_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  min_ticket: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  max_ticket: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  raised_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  investor_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // Allocation Configuration (% split across channels)
  allocation_direct_sale_pct: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 60.00,
    comment: 'Percentage allocated for direct sale (primary market)',
  },
  allocation_bundles_pct: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 20.00,
    comment: 'Percentage allocated for bundles',
  },
  allocation_auto_invest_pct: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 10.00,
    comment: 'Percentage allocated for auto-invest reserve',
  },
  allocation_reserve_pct: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 10.00,
    comment: 'Percentage allocated for platform reserve',
  },
  // Allocation Tracking (actual raised amounts per channel)
  direct_sale_raised: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    comment: 'Amount raised through direct sale',
  },
  bundles_raised: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    comment: 'Amount raised through bundles',
  },
  auto_invest_raised: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    comment: 'Amount raised through auto-invest plans',
  },
  reserve_raised: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    comment: 'Amount allocated to platform reserve',
  },
  holding_period_months: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lock_in_period_months: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Minimum hold period before trading allowed (part of holding period)',
  },
  expected_roi: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Expected ROI in percentage',
  },
  expected_irr: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Expected IRR in percentage',
  },
  fees: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Platform fee, management fee, carry, etc.',
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'funding', 'funded', 'lock-in', 'operational', 'secondary', 'exchange', 'exited', 'failed', 'closed'),
    defaultValue: 'draft',
  },
  open_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  close_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  exit_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  lock_in_start_date: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date when lock-in period started',
  },
  lock_in_end_date: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date when lock-in period ends and trading is allowed',
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  documents: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Additional custom fields based on deal type',
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'deals',
  indexes: [
    { fields: ['type'] },
    { fields: ['status'] },
    { fields: ['slug'] },
  ],
});

export default Deal;
