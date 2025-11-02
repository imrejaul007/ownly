import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CopyFollower = sequelize.define('CopyFollower', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  follower_user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  trader_user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  copy_type: {
    type: DataTypes.ENUM('full_profile', 'bundle', 'individual_deal'),
    allowNull: false,
  },
  bundle_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'investor_bundles',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  deal_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'deals',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  copy_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  auto_reinvest: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  stop_loss_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 20.00,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  started_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  stopped_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  total_copied_investments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_profit_loss: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
}, {
  tableName: 'copy_followers',
  timestamps: true,
  underscored: true,
});

export default CopyFollower;
