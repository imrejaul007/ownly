import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SecondaryMarketListing = sequelize.define(
  'SecondaryMarketListing',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    investment_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'investments',
        key: 'id',
      },
    },
    seller_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    buyer_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    shares_for_sale: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price_per_share: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0.01,
      },
    },
    total_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0.01,
      },
    },
    status: {
      type: DataTypes.ENUM(
        'active',
        'pending_acceptance',
        'sold',
        'cancelled',
        'expired'
      ),
      defaultValue: 'active',
    },
    offer_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      comment: 'Counter-offer price from buyer',
    },
    listing_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sold_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Additional listing details, negotiation history',
    },
  },
  {
    tableName: 'secondary_market_listings',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['investment_id'] },
      { fields: ['seller_id'] },
      { fields: ['buyer_id'] },
      { fields: ['status'] },
      { fields: ['listing_expires_at'] },
    ],
  }
);

export default SecondaryMarketListing;
