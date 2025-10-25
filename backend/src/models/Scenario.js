import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Scenario = sequelize.define('Scenario', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  spv_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'spvs',
      key: 'id',
    },
    comment: 'SPV this scenario is running on (null for preset templates)',
  },
  scenario_type: {
    type: DataTypes.ENUM('perfect_flip', 'market_crash', 'default', 'franchise_blowout', 'delay_expense', 'custom'),
    allowNull: false,
  },
  parameters: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Occupancy, revenue growth, expense shock, etc.',
  },
  events: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Timeline of events to apply',
  },
  status: {
    type: DataTypes.ENUM('draft', 'running', 'completed', 'failed'),
    defaultValue: 'draft',
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  results: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Calculated P&L, investor returns, etc.',
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
  tableName: 'scenarios',
  indexes: [
    { fields: ['spv_id'] },
    { fields: ['scenario_type'] },
    { fields: ['status'] },
  ],
});

export default Scenario;
