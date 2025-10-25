import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Announcement = sequelize.define(
  'Announcement',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    deal_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'deals',
        key: 'id',
      },
    },
    spv_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'spvs',
        key: 'id',
      },
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM(
        'deal_update',
        'financial_report',
        'milestone',
        'payout_announcement',
        'general',
        'urgent'
      ),
      allowNull: false,
      defaultValue: 'general',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    summary: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Brief summary for preview',
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    audience: {
      type: DataTypes.ENUM('all', 'investors_only', 'specific_deal', 'specific_spv'),
      defaultValue: 'all',
    },
    priority: {
      type: DataTypes.ENUM('low', 'normal', 'high'),
      defaultValue: 'normal',
    },
    send_notification: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Create notifications for users',
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional announcement data, attachments, etc.',
    },
  },
  {
    tableName: 'announcements',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['deal_id'] },
      { fields: ['spv_id'] },
      { fields: ['created_by'] },
      { fields: ['type'] },
      { fields: ['published'] },
      { fields: ['published_at'] },
    ],
  }
);

export default Announcement;
