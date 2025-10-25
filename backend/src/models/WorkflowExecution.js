import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const WorkflowExecution = sequelize.define(
  'WorkflowExecution',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    workflow_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'workflows',
        key: 'id',
      },
    },
    trigger_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'User who triggered the workflow (if applicable)',
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'running',
        'completed',
        'failed',
        'cancelled',
        'timeout'
      ),
      defaultValue: 'pending',
    },
    // Execution context
    trigger_data: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Data that triggered the workflow',
    },
    context: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Runtime context and variables',
    },
    // Step tracking
    current_step_id: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'ID of currently executing step',
    },
    completed_steps: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      comment: 'Array of completed step IDs',
    },
    step_results: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Results from each step execution',
    },
    /**
     * Example step_results structure:
     * {
     *   step1: {
     *     status: 'success',
     *     output: { ... },
     *     duration_ms: 150,
     *     executed_at: '2024-...'
     *   },
     *   step2: {
     *     status: 'failed',
     *     error: 'Connection timeout',
     *     duration_ms: 5000,
     *     executed_at: '2024-...'
     *   }
     * }
     */
    // Error tracking
    error_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    error_step_id: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Step ID where error occurred',
    },
    error_details: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    // Retry tracking
    retry_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_retry: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    original_execution_id: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Original execution ID if this is a retry',
    },
    // Performance metrics
    duration_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Total execution time in milliseconds',
    },
    steps_executed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    steps_failed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    // Output
    output: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Final workflow output',
    },
    logs: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Execution logs',
    },
    /**
     * Example logs structure:
     * [
     *   { timestamp: '2024-...', level: 'info', message: 'Starting workflow' },
     *   { timestamp: '2024-...', level: 'debug', message: 'Executing step1', step_id: 'step1' },
     *   { timestamp: '2024-...', level: 'error', message: 'Step failed', step_id: 'step2', error: '...' }
     * ]
     */
    // Timestamps
    started_at: {
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
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'workflow_executions',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['workflow_id'],
      },
      {
        fields: ['trigger_user_id'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['created_at'],
      },
      {
        fields: ['is_retry'],
      },
    ],
  }
);

export default WorkflowExecution;
