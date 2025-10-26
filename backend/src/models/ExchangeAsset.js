import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ExchangeAsset = sequelize.define('ExchangeAsset', {
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
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Trading symbol (e.g., WHF-DXB, FIT-SHJ)',
  },
  market_category: {
    type: DataTypes.ENUM('franchise', 'property', 'luxury', 'inventory', 'equity'),
    allowNull: false,
  },
  total_units: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Total tokenized units',
  },
  unit_price_initial: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Initial price per unit',
  },
  current_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Current market price',
  },
  available_units: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Units available for trading',
  },
  market_cap: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
    comment: 'Total market value',
  },
  daily_volume: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  price_change_24h: {
    type: DataTypes.DECIMAL(10, 4),
    defaultValue: 0,
    comment: 'Percentage change in 24h',
  },
  week_high: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  week_low: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  all_time_high: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  all_time_low: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  trading_phase: {
    type: DataTypes.ENUM('primary', 'secondary', 'paused', 'closed'),
    defaultValue: 'primary',
  },
  listing_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  demand_index: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 50.00,
    comment: 'Market demand score 0-100',
  },
  sentiment_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 50.00,
    comment: 'AI sentiment analysis 0-100',
  },
  roi_to_date: {
    type: DataTypes.DECIMAL(10, 4),
    defaultValue: 0,
    comment: 'Total ROI % since listing',
  },
  last_price_update: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'News, announcements, updates',
  },
}, {
  tableName: 'exchange_assets',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['symbol'] },
    { fields: ['market_category'] },
    { fields: ['trading_phase'] },
    { fields: ['current_price'] },
    { fields: ['daily_volume'] },
  ],
});

export default ExchangeAsset;
