import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Investment = sequelize.define('Investment', {
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
  spv_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'spvs',
      key: 'id',
    },
  },
  deal_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'deals',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  shares_issued: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  share_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'active', 'exited', 'cancelled'),
    defaultValue: 'pending',
  },
  invested_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  confirmed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  exited_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  total_payouts_received: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  current_value: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: 'Calculated current value based on SPV valuation',
  },
  auto_reinvest_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether to automatically reinvest payouts instead of crediting to wallet',
  },
  referral_code: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Agent referral code used during investment',
  },
  bundle_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'bundles',
      key: 'id',
    },
    comment: 'If investment was made through a bundle',
  },
  sip_subscription_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'sip_subscriptions',
      key: 'id',
    },
    comment: 'If investment was made through a SIP subscription',
  },
}, {
  tableName: 'investments',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['spv_id'] },
    { fields: ['bundle_id'] },
    { fields: ['sip_subscription_id'] },
    { fields: ['deal_id'] },
    { fields: ['status'] },
  ],
});

export default Investment;
