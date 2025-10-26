import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Portfolio = sequelize.define('Portfolio', {
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
  asset_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'exchange_assets',
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  average_buy_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Weighted average purchase price',
  },
  total_invested: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  current_value: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  unrealized_gain: {
    type: DataTypes.DECIMAL(18, 2),
    defaultValue: 0,
  },
  unrealized_gain_percent: {
    type: DataTypes.DECIMAL(10, 4),
    defaultValue: 0,
  },
  realized_gain: {
    type: DataTypes.DECIMAL(18, 2),
    defaultValue: 0,
    comment: 'From completed sells',
  },
  roi_received: {
    type: DataTypes.DECIMAL(18, 2),
    defaultValue: 0,
    comment: 'Total ROI payouts received',
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'portfolios',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['asset_id'] },
    { fields: ['user_id', 'asset_id'], unique: true },
  ],
});

export default Portfolio;
