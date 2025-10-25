import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const WebhookDelivery = sequelize.define(
  'WebhookDelivery',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    webhook_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'webhooks',
        key: 'id',
      },
    },
    event_type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Type of event (e.g., "investment.created", "payout.completed")',
    },
    event_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'ID of the event/entity that triggered the webhook',
    },
    payload: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'Complete webhook payload sent',
    },
    status: {
      type: DataTypes.ENUM('pending', 'sent', 'failed', 'retrying'),
      defaultValue: 'pending',
    },
    attempt_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of delivery attempts',
    },
    max_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
    },
    // Request details
    request_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    request_method: {
      type: DataTypes.STRING,
      defaultValue: 'POST',
    },
    request_headers: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    // Response details
    response_status_code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    response_body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    response_headers: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    response_time_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Response time in milliseconds',
    },
    // Error details
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    error_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Timestamps
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    failed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    next_retry_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Scheduled time for next retry attempt',
    },
  },
  {
    tableName: 'webhook_deliveries',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['webhook_id'],
      },
      {
        fields: ['event_type'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['created_at'],
      },
      {
        fields: ['next_retry_at'],
      },
    ],
  }
);

export default WebhookDelivery;
