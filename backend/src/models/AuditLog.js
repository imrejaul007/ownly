import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  actor_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: 'User who performed the action',
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Action performed: create, update, delete, login, etc.',
  },
  entity_type: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Type of entity affected: deal, spv, investment, etc.',
  },
  entity_id: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'ID of entity affected',
  },
  delta: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Changes made (before/after values)',
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'audit_logs',
  indexes: [
    { fields: ['actor_id'] },
    { fields: ['action'] },
    { fields: ['entity_type', 'entity_id'] },
    { fields: ['created_at'] },
  ],
});

export default AuditLog;
