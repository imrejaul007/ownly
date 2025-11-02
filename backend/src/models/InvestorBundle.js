import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const InvestorBundle = sequelize.define('InvestorBundle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  trader_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'copy_traders',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  deal_ids: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  min_copy_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 2000.00,
  },
  total_copiers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true, // e.g., 'conservative', 'aggressive', 'balanced'
  },
}, {
  tableName: 'investor_bundles',
  timestamps: true,
  underscored: true,
});

export default InvestorBundle;
