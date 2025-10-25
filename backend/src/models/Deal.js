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
    type: DataTypes.ENUM('real_estate', 'franchise', 'startup', 'asset'),
    allowNull: false,
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
  holding_period_months: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
    type: DataTypes.ENUM('draft', 'open', 'funding', 'funded', 'closed', 'failed', 'exited'),
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
