import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserPreference = sequelize.define(
  'UserPreference',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    // Notification Preferences
    email_notifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    push_notifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notification_frequency: {
      type: DataTypes.ENUM('realtime', 'daily_digest', 'weekly_digest', 'off'),
      defaultValue: 'realtime',
    },
    notify_investments: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notify_payouts: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notify_deal_updates: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notify_announcements: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notify_secondary_market: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Display Preferences
    theme: {
      type: DataTypes.ENUM('light', 'dark', 'auto'),
      defaultValue: 'auto',
    },
    language: {
      type: DataTypes.STRING(10),
      defaultValue: 'en',
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
    },
    timezone: {
      type: DataTypes.STRING(50),
      defaultValue: 'America/New_York',
    },
    // Privacy Preferences
    profile_visibility: {
      type: DataTypes.ENUM('public', 'investors_only', 'private'),
      defaultValue: 'investors_only',
    },
    show_investment_activity: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    allow_messages: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Security Preferences
    two_factor_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    session_timeout: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
      comment: 'Session timeout in minutes',
    },
    // Dashboard Preferences
    default_dashboard_view: {
      type: DataTypes.STRING(50),
      defaultValue: 'overview',
    },
    dashboard_widgets: {
      type: DataTypes.JSONB,
      defaultValue: {
        portfolio_summary: true,
        recent_activity: true,
        upcoming_payouts: true,
        notifications: true,
      },
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  },
  {
    tableName: 'user_preferences',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'], unique: true },
    ],
  }
);

export default UserPreference;
