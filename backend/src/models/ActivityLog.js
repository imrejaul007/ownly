import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ActivityLog = sequelize.define(
  'ActivityLog',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'User who performed the action, null for system actions',
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Action performed (e.g., created_deal, made_investment)',
    },
    action_category: {
      type: DataTypes.ENUM(
        'authentication',
        'investment',
        'deal',
        'payout',
        'document',
        'announcement',
        'secondary_market',
        'user_management',
        'system',
        'other'
      ),
      allowNull: false,
      defaultValue: 'other',
    },
    entity_type: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Type of entity affected (deal, investment, etc.)',
    },
    entity_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID of entity affected',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: 'IP address of request',
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Browser/client user agent',
    },
    changes: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Before/after values for updates',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional context about the action',
    },
    severity: {
      type: DataTypes.ENUM('info', 'warning', 'error', 'critical'),
      defaultValue: 'info',
    },
  },
  {
    tableName: 'activity_logs',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['action'] },
      { fields: ['action_category'] },
      { fields: ['entity_type'] },
      { fields: ['entity_id'] },
      { fields: ['created_at'] },
      { fields: ['severity'] },
    ],
  }
);

export default ActivityLog;
