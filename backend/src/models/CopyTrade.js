import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CopyTrade = sequelize.define('CopyTrade', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  copy_follower_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'copy_followers',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  original_investment_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'investments',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  follower_investment_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'investments',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  copy_proportion: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false, // What % of follower's allocated capital
  },
  original_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false, // Trader's investment amount
  },
  copied_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false, // Follower's copied amount
  },
  status: {
    type: DataTypes.ENUM('active', 'exited', 'failed'),
    defaultValue: 'active',
  },
}, {
  tableName: 'copy_trades',
  timestamps: true,
  underscored: true,
});

export default CopyTrade;
