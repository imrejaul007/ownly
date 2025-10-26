import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BundleDeal = sequelize.define('BundleDeal', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bundle_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'bundles',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    deal_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'deals',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    allocation_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      comment: 'Percentage of bundle investment allocated to this deal',
      validate: {
        min: 0,
        max: 100,
      },
    },
    allocation_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Fixed amount if not percentage-based',
    },
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: 'Weight/importance of this deal in the bundle',
    },
    is_core: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether this is a core holding in the bundle',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  }, {
    tableName: 'bundle_deals',
    underscored: true,
    timestamps: true,
  });

export default BundleDeal;
