import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SIPSubscription = sequelize.define('SIPSubscription', {
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
      onDelete: 'CASCADE',
    },
    plan_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sip_plans',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    monthly_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    duration_months: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    next_debit_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    total_invested: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: 'Total amount invested so far',
    },
    total_installments: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of installments completed',
    },
    current_value: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
      comment: 'Current portfolio value',
    },
    returns_earned: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('active', 'paused', 'completed', 'cancelled'),
      defaultValue: 'active',
    },
    auto_compound: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    payment_method_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'payment_methods',
        key: 'id',
      },
    },
    last_installment_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paused_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancellation_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Allocation history, rebalancing logs, etc.',
    },
  }, {
    tableName: 'sip_subscriptions',
    underscored: true,
    timestamps: true,
  });

export default SIPSubscription;
