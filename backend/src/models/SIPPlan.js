import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SIPPlan = sequelize.define('SIPPlan', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'e.g., Ownly SmartSaver, Ownly Growth+',
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    plan_type: {
      type: DataTypes.ENUM('balanced', 'aggressive', 'conservative', 'luxury', 'custom'),
      allowNull: false,
    },
    monthly_amount_min: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      comment: 'Minimum monthly investment amount',
    },
    monthly_amount_max: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Maximum monthly investment amount',
    },
    duration_months_min: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Minimum commitment duration in months',
    },
    duration_months_max: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Maximum duration in months',
    },
    expected_roi_min: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    expected_roi_max: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    bundle_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'bundles',
        key: 'id',
      },
      comment: 'Associated bundle for automatic allocation',
    },
    auto_rebalance: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether to auto-rebalance quarterly',
    },
    auto_compound: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether to auto-compound returns',
    },
    risk_level: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'paused', 'closed'),
      defaultValue: 'active',
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    allocation_strategy: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Strategy for allocating monthly contributions across deals',
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [],
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  }, {
    tableName: 'sip_plans',
    underscored: true,
    timestamps: true,
  });

export default SIPPlan;
