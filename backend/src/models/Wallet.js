import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Wallet = sequelize.define('Wallet', {
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
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD',
    allowNull: false,
  },
  balance_dummy: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    allowNull: false,
    comment: 'Dummy/simulated balance - NOT real money',
  },
  ledger_entries: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Array of transaction entries for audit trail',
  },
}, {
  tableName: 'wallets',
  indexes: [
    { fields: ['user_id'] },
  ],
});

export default Wallet;
