import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SPV = sequelize.define('SPV', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  deal_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'deals',
      key: 'id',
    },
  },
  spv_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  spv_code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    comment: 'Auto-generated format: SPV-YYYY-XXXX',
  },
  jurisdiction: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  registration_number: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Dummy registration number for sandbox',
  },
  share_structure: {
    type: DataTypes.JSONB,
    defaultValue: {},
    comment: 'Share classes, voting rights, etc.',
  },
  allocation_plan: {
    type: DataTypes.JSONB,
    defaultValue: {
      direct_sale: 60,
      bundle_plans: 20,
      auto_invest: 15,
      company_reserve: 5,
    },
    comment: 'Share allocation across channels (percentages must total 100)',
  },
  total_shares: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  issued_shares: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  share_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  spv_documents: {
    type: DataTypes.JSONB,
    defaultValue: [],
    comment: 'Links to dummy PDF documents',
  },
  virtual_bank_account: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Simulated bank account number',
  },
  escrow_balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    comment: 'Simulated escrow balance before deal closes',
  },
  operating_balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    comment: 'Balance after deal closes, for operations',
  },
  total_revenue: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  total_expenses: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  total_distributed: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  },
  status: {
    type: DataTypes.ENUM('created', 'active', 'operating', 'exited', 'dissolved'),
    defaultValue: 'created',
  },
  inception_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dissolution_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'spvs',
  indexes: [
    { fields: ['deal_id'] },
    { fields: ['spv_name'] },
    { fields: ['status'] },
    { fields: ['spv_code'] },
  ],
  hooks: {
    beforeCreate: async (spv) => {
      // Auto-generate SPV code in format: SPV-YYYY-XXXX
      if (!spv.spv_code) {
        const year = new Date().getFullYear();

        // Find the latest SPV code for this year
        const latestSPV = await SPV.findOne({
          where: {
            spv_code: {
              [sequelize.Sequelize.Op.like]: `SPV-${year}-%`
            }
          },
          order: [['created_at', 'DESC']]
        });

        let sequence = 1;
        if (latestSPV && latestSPV.spv_code) {
          // Extract the sequence number and increment
          const match = latestSPV.spv_code.match(/SPV-\d{4}-(\d{4})/);
          if (match) {
            sequence = parseInt(match[1]) + 1;
          }
        }

        // Format: SPV-2025-0001
        spv.spv_code = `SPV-${year}-${String(sequence).padStart(4, '0')}`;
      }
    }
  }
});

export default SPV;
