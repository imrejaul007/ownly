import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EmailLog = sequelize.define(
  'EmailLog',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email_template_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'email_templates',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'Recipient user ID if applicable',
    },
    // Recipient details
    to_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    to_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cc: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    bcc: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    // Sender details
    from_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    from_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reply_to: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Email content
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    html_body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    text_body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Provider details
    provider: {
      type: DataTypes.STRING,
      defaultValue: 'sendgrid',
      comment: 'Email service provider (sendgrid, mailgun, ses, etc.)',
    },
    provider_message_id: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Message ID from email provider',
    },
    // Status
    status: {
      type: DataTypes.ENUM(
        'pending',
        'queued',
        'sent',
        'delivered',
        'opened',
        'clicked',
        'bounced',
        'failed',
        'spam'
      ),
      defaultValue: 'pending',
    },
    // Tracking
    opened_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    clicked_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    opened_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    clicked_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Error details
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bounce_type: {
      type: DataTypes.ENUM('soft', 'hard'),
      allowNull: true,
    },
    bounce_reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Metadata
    template_data: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Variables used in template rendering',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      comment: 'Tags for categorizing emails',
    },
    // Timestamps
    queued_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    failed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'email_logs',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['email_template_id'],
      },
      {
        fields: ['user_id'],
      },
      {
        fields: ['to_email'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['provider_message_id'],
      },
      {
        fields: ['created_at'],
      },
      {
        fields: ['tags'],
        using: 'GIN',
      },
    ],
  }
);

export default EmailLog;
