import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CopyTrader = sequelize.define('CopyTrader', {
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
    onDelete: 'CASCADE',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  specialty: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  min_copy_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 1000.00,
  },
  commission_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 5.00, // 5% commission on profits
  },
  total_copiers_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  total_return: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  monthly_return: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  win_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
  },
  risk_level: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
}, {
  tableName: 'copy_traders',
  timestamps: true,
  underscored: true,
});

export default CopyTrader;
