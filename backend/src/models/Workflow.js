import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Workflow = sequelize.define(
  'Workflow',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    trigger_type: {
      type: DataTypes.ENUM(
        'event',
        'schedule',
        'manual',
        'webhook',
        'condition'
      ),
      allowNull: false,
      comment: 'What triggers this workflow',
    },
    trigger_config: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'Configuration for trigger (e.g., event name, cron schedule)',
    },
    // Workflow definition
    steps: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      comment: 'Array of workflow steps with actions and conditions',
    },
    /**
     * Example steps structure:
     * [
     *   {
     *     id: 'step1',
     *     type: 'action',
     *     action: 'send_email',
     *     config: { template_id: 'xyz', to: '{{user.email}}' }
     *   },
     *   {
     *     id: 'step2',
     *     type: 'condition',
     *     condition: 'investment.amount > 10000',
     *     if_true: 'step3',
     *     if_false: 'step4'
     *   },
     *   {
     *     id: 'step3',
     *     type: 'action',
     *     action: 'send_webhook',
     *     config: { url: 'https://example.com/webhook' }
     *   }
     * ]
     */
    // Status and configuration
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'draft'),
      defaultValue: 'draft',
    },
    is_system: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether this is a system workflow (cannot be deleted)',
    },
    // Execution settings
    timeout_seconds: {
      type: DataTypes.INTEGER,
      defaultValue: 300,
      comment: 'Maximum execution time in seconds',
    },
    max_retries: {
      type: DataTypes.INTEGER,
      defaultValue: 3,
      comment: 'Maximum retry attempts for failed steps',
    },
    retry_delay_seconds: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
      comment: 'Delay between retries in seconds',
    },
    // Variables and context
    variables: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Workflow-level variables available to all steps',
    },
    // Statistics
    execution_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    successful_executions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    failed_executions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_executed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_success_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_failure_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Metadata
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: 'workflows',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['status'],
      },
      {
        fields: ['trigger_type'],
      },
      {
        fields: ['tags'],
        using: 'GIN',
      },
    ],
  }
);

export default Workflow;
