import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PayoutSchedule = sequelize.define(
  'PayoutSchedule',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    spv_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'spvs',
        key: 'id',
      },
    },
    schedule_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'e.g., "Monthly Dividend", "Quarterly Distribution"',
    },
    frequency: {
      type: DataTypes.ENUM('monthly', 'quarterly', 'semi_annual', 'annual', 'one_time'),
      allowNull: false,
      defaultValue: 'quarterly',
    },
    amount_per_period: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: 'Fixed amount to distribute per period',
    },
    percentage_of_revenue: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
      comment: 'Alternative: % of revenue to distribute',
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Null means ongoing',
    },
    next_payout_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    last_payout_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'paused', 'completed', 'cancelled'),
      defaultValue: 'active',
    },
    auto_distribute: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'If true, automatically distribute when generated',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional schedule configuration',
    },
  },
  {
    tableName: 'payout_schedules',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['spv_id'] },
      { fields: ['status'] },
      { fields: ['next_payout_date'] },
      { fields: ['frequency'] },
    ],
  }
);

export default PayoutSchedule;
