import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Document = sequelize.define(
  'Document',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    deal_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'deals',
        key: 'id',
      },
    },
    spv_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'spvs',
        key: 'id',
      },
    },
    uploaded_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    document_type: {
      type: DataTypes.ENUM(
        'pitch_deck',
        'financial_statement',
        'legal_agreement',
        'operating_agreement',
        'subscription_agreement',
        'ppm',
        'tax_document',
        'report',
        'other'
      ),
      allowNull: false,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'File size in bytes',
    },
    mime_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    storage_path: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Path or URL to stored file',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    version: {
      type: DataTypes.STRING,
      defaultValue: '1.0',
    },
    visibility: {
      type: DataTypes.ENUM('public', 'investors_only', 'admin_only'),
      defaultValue: 'investors_only',
    },
    download_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional document metadata',
    },
  },
  {
    tableName: 'documents',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['deal_id'] },
      { fields: ['spv_id'] },
      { fields: ['uploaded_by'] },
      { fields: ['document_type'] },
      { fields: ['visibility'] },
    ],
  }
);

export default Document;
