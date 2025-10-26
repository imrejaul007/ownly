import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const MarketData = sequelize.define('MarketData', {
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
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  open_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  high_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  low_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  close_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  volume: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  trade_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  interval: {
    type: DataTypes.ENUM('1m', '5m', '15m', '1h', '4h', '1d', '1w'),
    defaultValue: '1d',
  },
}, {
  tableName: 'market_data',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['asset_id'] },
    { fields: ['timestamp'] },
    { fields: ['interval'] },
    { fields: ['asset_id', 'timestamp', 'interval'] },
  ],
});

export default MarketData;
