import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PaymentMethod = sequelize.define(
  'PaymentMethod',
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
      type: DataTypes.ENUM('card', 'bank_account', 'ach', 'wire'),
      allowNull: false,
      defaultValue: 'card',
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'stripe',
      comment: 'Payment provider (stripe, plaid, etc.)',
    },
    provider_payment_method_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Payment method ID from provider (e.g., Stripe payment method ID)',
    },
    provider_customer_id: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Customer ID from provider (e.g., Stripe customer ID)',
    },
    // Card details (masked for security)
    card_brand: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Card brand (visa, mastercard, amex, etc.)',
    },
    card_last4: {
      type: DataTypes.STRING(4),
      allowNull: true,
      comment: 'Last 4 digits of card',
    },
    card_exp_month: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    card_exp_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Bank account details (masked)
    bank_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_account_last4: {
      type: DataTypes.STRING(4),
      allowNull: true,
      comment: 'Last 4 digits of bank account',
    },
    bank_account_type: {
      type: DataTypes.ENUM('checking', 'savings'),
      allowNull: true,
    },
    // General fields
    nickname: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User-provided nickname for payment method',
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether this is the default payment method',
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether payment method has been verified',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'expired', 'failed_verification'),
      defaultValue: 'active',
    },
    billing_address: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Billing address details',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional metadata',
    },
    last_used_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'payment_methods',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['provider_payment_method_id'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['is_default'],
      },
    ],
  }
);

export default PaymentMethod;
