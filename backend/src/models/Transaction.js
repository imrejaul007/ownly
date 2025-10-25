import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM(
      'deposit',
      'withdrawal',
      'investment',
      'payout',
      'commission',
      'refund',
      'fee',
      'transfer'
    ),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
    defaultValue: 'pending',
  },
  reference_type: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Type of related entity: investment, payout, deal, etc.',
  },
  reference_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID of related entity',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  balance_before: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  balance_after: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'transactions',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['type'] },
    { fields: ['status'] },
    { fields: ['reference_type', 'reference_id'] },
  ],
});

export default Transaction;
