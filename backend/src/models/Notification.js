import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Notification = sequelize.define(
  'Notification',
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
    },
    type: {
      type: DataTypes.ENUM(
        'investment',
        'payout',
        'deal_update',
        'kyc_status',
        'secondary_market',
        'agent_referral',
        'system',
        'announcement'
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'URL to navigate to when clicked',
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
      defaultValue: 'normal',
    },
    reference_type: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Type of referenced entity (deal, investment, payout, etc.)',
    },
    reference_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID of referenced entity',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional notification data',
    },
  },
  {
    tableName: 'notifications',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['read'] },
      { fields: ['type'] },
      { fields: ['created_at'] },
      { fields: ['user_id', 'read'] },
    ],
  }
);

export default Notification;
