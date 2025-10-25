import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Payout = sequelize.define('Payout', {
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
  payout_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  period_start: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  period_end: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  total_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  payout_type: {
    type: DataTypes.ENUM('rental', 'dividend', 'profit_share', 'exit', 'interest'),
    allowNull: false,
  },
  payout_items: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of {investor_id, amount, shares} objects',
  },
  distributed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  distributed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
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
  tableName: 'payouts',
  indexes: [
    { fields: ['spv_id'] },
    { fields: ['payout_date'] },
    { fields: ['distributed'] },
  ],
});

export default Payout;
