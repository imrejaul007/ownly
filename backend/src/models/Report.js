import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Report = sequelize.define(
  'Report',
  {
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
      comment: 'User who requested the report',
    },
    report_type: {
      type: DataTypes.ENUM(
        'portfolio_summary',
        'investment_performance',
        'tax_summary',
        'transaction_history',
        'payout_history',
        'deal_performance',
        'custom'
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    period_start: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Start date for report period',
    },
    period_end: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'End date for report period',
    },
    status: {
      type: DataTypes.ENUM('pending', 'generating', 'completed', 'failed'),
      defaultValue: 'pending',
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Generated report data',
    },
    format: {
      type: DataTypes.ENUM('json', 'pdf', 'csv', 'html'),
      defaultValue: 'json',
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Path to generated file (if applicable)',
    },
    generated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When report should be deleted',
    },
    filters: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Filters applied to generate report',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  },
  {
    tableName: 'reports',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['report_type'] },
      { fields: ['status'] },
      { fields: ['created_at'] },
      { fields: ['expires_at'] },
    ],
  }
);

export default Report;
