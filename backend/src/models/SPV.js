import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SPV = sequelize.define('SPV', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  deal_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'deals',
      key: 'id',
    },
  },
  spv_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  jurisdiction: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  registration_number: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Dummy registration number for sandbox',
  },
  share_structure: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Share classes, voting rights, etc.',
  },
  total_shares: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  issued_shares: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  share_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  spv_documents: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Links to dummy PDF documents',
  },
  virtual_bank_account: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Simulated bank account number',
  },
  escrow_balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    comment: 'Simulated escrow balance before deal closes',
  },
  operating_balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    comment: 'Balance after deal closes, for operations',
  },
  total_revenue: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  total_expenses: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  total_distributed: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  status: {
    type: DataTypes.ENUM('created', 'active', 'operating', 'exited', 'dissolved'),
    defaultValue: 'created',
  },
  inception_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dissolution_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'spvs',
  indexes: [
    { fields: ['deal_id'] },
    { fields: ['spv_name'] },
    { fields: ['status'] },
  ],
});

export default SPV;
