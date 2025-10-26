import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Bundle = sequelize.define('Bundle', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    bundle_type: {
      type: DataTypes.ENUM(
        'category_based',    // e.g., Retail Mix, Luxury Basket
        'roi_based',         // e.g., Stable, Balanced, Aggressive
        'thematic',          // e.g., Winter Tourism, Ramadan
        'community',         // Community co-investment
        'custom'             // User-created custom baskets
      ),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM(
        'retail_mix',
        'luxury_basket',
        'property_pool',
        'growthtech_basket',
        'creator_bundle',
        'stable_basket',
        'balanced_basket',
        'aggressive_basket',
        'seasonal',
        'custom'
      ),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    min_investment: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    target_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    raised_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    investor_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    expected_roi_min: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: 'Minimum expected ROI percentage',
    },
    expected_roi_max: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: 'Maximum expected ROI percentage',
    },
    holding_period_months: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'open', 'funding', 'funded', 'active', 'closed'),
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
    images: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [],
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      comment: 'Key features/benefits of this bundle',
    },
    risk_level: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
    },
    diversification_score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Score 0-100 indicating portfolio diversification',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional bundle metadata, allocations, etc.',
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
    tableName: 'bundles',
    underscored: true,
    timestamps: true,
  });

export default Bundle;
