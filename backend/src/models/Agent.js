import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Agent = sequelize.define('Agent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Unique referral code for this agent',
  },
  referral_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_investment_referred: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  commissions_earned: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  commissions_paid: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  commission_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 2.00,
    comment: 'Commission rate in percentage',
  },
  tier: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
    defaultValue: 'bronze',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'agents',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['code'] },
    { fields: ['status'] },
  ],
});

export default Agent;
