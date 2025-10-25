import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  spv_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'spvs',
      key: 'id',
    },
  },
  asset_type: {
    type: DataTypes.ENUM('property', 'franchise_unit', 'business', 'other'),
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Property specs, franchise details, etc.',
  },
  operation_status: {
    type: DataTypes.ENUM('pre_construction', 'under_construction', 'operational', 'closed', 'sold'),
    defaultValue: 'operational',
  },
  acquisition_cost: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  current_valuation: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  occupancy_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Occupancy percentage for properties',
  },
  monthly_revenue: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  monthly_expenses: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
}, {
  tableName: 'assets',
  indexes: [
    { fields: ['spv_id'] },
    { fields: ['asset_type'] },
    { fields: ['operation_status'] },
  ],
});

export default Asset;
