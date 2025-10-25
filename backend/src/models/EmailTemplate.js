import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EmailTemplate = sequelize.define(
  'EmailTemplate',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Template identifier (e.g., "welcome_email", "investment_confirmation")',
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Human-readable template name',
    },
    category: {
      type: DataTypes.ENUM(
        'transactional',
        'marketing',
        'notification',
        'system',
        'custom'
      ),
      defaultValue: 'transactional',
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Email subject line (supports variables like {{firstName}})',
    },
    // Email content
    html_body: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'HTML version of email body',
    },
    text_body: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Plain text version of email body',
    },
    preview_text: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Preview text shown in email clients',
    },
    // Template variables
    variables: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      comment: 'Array of available variables (e.g., ["firstName", "investmentAmount"])',
    },
    sample_data: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Sample data for testing template',
    },
    // Sender configuration
    from_name: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Sender name (defaults to platform name if null)',
    },
    from_email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
      comment: 'Sender email (defaults to platform email if null)',
    },
    reply_to: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    // Status and metadata
    status: {
      type: DataTypes.ENUM('active', 'draft', 'archived'),
      defaultValue: 'active',
    },
    is_system: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether this is a system template (cannot be deleted)',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    // Usage statistics
    send_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of times this template has been used',
    },
    last_used_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Version control
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: 'email_templates',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['name'],
        unique: true,
      },
      {
        fields: ['category'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default EmailTemplate;
