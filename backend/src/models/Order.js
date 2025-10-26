import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
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
  order_type: {
    type: DataTypes.ENUM('market', 'limit', 'stop_loss', 'stop_limit'),
    allowNull: false,
  },
  side: {
    type: DataTypes.ENUM('buy', 'sell'),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Price per unit',
  },
  total_amount: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false,
  },
  filled_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  remaining_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'partial', 'filled', 'cancelled', 'expired'),
    defaultValue: 'pending',
  },
  time_in_force: {
    type: DataTypes.ENUM('GTC', 'IOC', 'FOK', 'DAY'),
    defaultValue: 'GTC',
    comment: 'Good Till Cancelled, Immediate or Cancel, Fill or Kill, Day',
  },
  stop_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  executed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  cancelled_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  expiry_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  fees: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['asset_id'] },
    { fields: ['status'] },
    { fields: ['side'] },
    { fields: ['created_at'] },
    { fields: ['asset_id', 'status', 'side'] },
  ],
});

export default Order;
