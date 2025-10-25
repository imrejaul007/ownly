import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Webhook = sequelize.define(
  'Webhook',
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'User-provided webhook name',
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
      comment: 'Webhook endpoint URL',
    },
    events: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      comment: 'Array of subscribed events (e.g., ["investment.created", "payout.completed"])',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'paused'),
      defaultValue: 'active',
    },
    secret: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Webhook signing secret for verifying payloads',
    },
    // Configuration
    retry_config: {
      type: DataTypes.JSONB,
      defaultValue: {
        max_attempts: 3,
        retry_delay: 60, // seconds
        backoff_multiplier: 2,
      },
      comment: 'Retry configuration for failed deliveries',
    },
    timeout: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      comment: 'Timeout in seconds for webhook requests',
    },
    headers: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Custom headers to send with webhook',
    },
    // Statistics
    total_deliveries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    successful_deliveries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    failed_deliveries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_delivery_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_successful_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_failed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Metadata
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  },
  {
    tableName: 'webhooks',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['events'],
        using: 'GIN',
      },
    ],
  }
);

export default Webhook;
