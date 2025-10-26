import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Trade = sequelize.define('Trade', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  asset_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'exchange_assets',
      key: 'id',
    },
  },
  buy_order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id',
    },
  },
  sell_order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id',
    },
  },
  buyer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  seller_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Execution price per unit',
  },
  total_amount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  buyer_fee: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  seller_fee: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  trade_type: {
    type: DataTypes.ENUM('matched', 'market_maker', 'primary_sale'),
    defaultValue: 'matched',
  },
  executed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  settlement_status: {
    type: DataTypes.ENUM('pending', 'settled', 'failed'),
    defaultValue: 'pending',
  },
  settled_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'trades',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['buyer_id'] },
    { fields: ['seller_id'] },
    { fields: ['executed_at'] },
    { fields: ['asset_id', 'executed_at'] },
  ],
});

export default Trade;
