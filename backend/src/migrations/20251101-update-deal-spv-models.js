import sequelize from '../config/database.js';

/**
 * Migration: Update Deal and SPV models for complete ecosystem support
 * Date: 2025-11-01
 *
 * Changes:
 * 1. Deal Model:
 *    - Add new deal types: equity, basket, trade
 *    - Add lock_in_period_months field
 *    - Update status enum with full lifecycle stages
 *
 * 2. SPV Model:
 *    - Add spv_code field with auto-generation
 *    - Add allocation_plan JSONB field
 */

export async function up() {
  const queryInterface = sequelize.getQueryInterface();
  const transaction = await sequelize.transaction();

  try {
    console.log('Starting migration: Update Deal and SPV models');

    // ============================================
    // DEAL MODEL UPDATES
    // ============================================

    // 1. Add lock_in_period_months to deals table
    console.log('Adding lock_in_period_months to deals table...');
    await queryInterface.addColumn(
      'deals',
      'lock_in_period_months',
      {
        type: sequelize.Sequelize.INTEGER,
        allowNull: true,
        comment: 'Minimum hold period before trading allowed (part of holding period)',
      },
      { transaction }
    );

    // 2. Update type enum to include new deal types
    console.log('Updating deal type enum...');
    await sequelize.query(
      `ALTER TYPE "enum_deals_type" ADD VALUE IF NOT EXISTS 'equity';`,
      { transaction }
    );
    await sequelize.query(
      `ALTER TYPE "enum_deals_type" ADD VALUE IF NOT EXISTS 'basket';`,
      { transaction }
    );
    await sequelize.query(
      `ALTER TYPE "enum_deals_type" ADD VALUE IF NOT EXISTS 'trade';`,
      { transaction }
    );

    // 3. Update status enum to include full lifecycle
    console.log('Updating deal status enum...');
    await sequelize.query(
      `ALTER TYPE "enum_deals_status" ADD VALUE IF NOT EXISTS 'lock-in';`,
      { transaction }
    );
    await sequelize.query(
      `ALTER TYPE "enum_deals_status" ADD VALUE IF NOT EXISTS 'operational';`,
      { transaction }
    );
    await sequelize.query(
      `ALTER TYPE "enum_deals_status" ADD VALUE IF NOT EXISTS 'secondary';`,
      { transaction }
    );
    await sequelize.query(
      `ALTER TYPE "enum_deals_status" ADD VALUE IF NOT EXISTS 'exchange';`,
      { transaction }
    );

    // ============================================
    // SPV MODEL UPDATES
    // ============================================

    // 4. Add spv_code to spvs table
    console.log('Adding spv_code to spvs table...');
    await queryInterface.addColumn(
      'spvs',
      'spv_code',
      {
        type: sequelize.Sequelize.STRING,
        unique: true,
        allowNull: true, // Will be populated by hook for new records
        comment: 'Auto-generated format: SPV-YYYY-XXXX',
      },
      { transaction }
    );

    // 5. Add allocation_plan to spvs table
    console.log('Adding allocation_plan to spvs table...');
    await queryInterface.addColumn(
      'spvs',
      'allocation_plan',
      {
        type: sequelize.Sequelize.JSONB,
        defaultValue: {
          direct_sale: 60,
          bundle_plans: 20,
          auto_invest: 15,
          company_reserve: 5,
        },
        comment: 'Share allocation across channels (percentages must total 100)',
      },
      { transaction }
    );

    // 6. Generate SPV codes for existing records
    console.log('Generating SPV codes for existing records...');
    const spvs = await sequelize.query(
      'SELECT id, created_at FROM spvs WHERE spv_code IS NULL ORDER BY created_at ASC',
      { type: sequelize.QueryTypes.SELECT, transaction }
    );

    let yearSequence = {};
    for (const spv of spvs) {
      const year = new Date(spv.created_at).getFullYear();

      if (!yearSequence[year]) {
        yearSequence[year] = 1;
      }

      const spvCode = `SPV-${year}-${String(yearSequence[year]).padStart(4, '0')}`;

      await sequelize.query(
        'UPDATE spvs SET spv_code = :spvCode WHERE id = :id',
        {
          replacements: { spvCode, id: spv.id },
          type: sequelize.QueryTypes.UPDATE,
          transaction,
        }
      );

      yearSequence[year]++;
    }

    // 7. Make spv_code NOT NULL after populating
    console.log('Setting spv_code to NOT NULL...');
    await sequelize.query(
      'ALTER TABLE spvs ALTER COLUMN spv_code SET NOT NULL;',
      { transaction }
    );

    // 8. Add indexes for performance
    console.log('Adding indexes...');
    await queryInterface.addIndex('spvs', ['spv_code'], {
      name: 'spvs_spv_code_idx',
      transaction,
    });

    await transaction.commit();
    console.log('Migration completed successfully!');

  } catch (error) {
    await transaction.rollback();
    console.error('Migration failed:', error);
    throw error;
  }
}

export async function down() {
  const queryInterface = sequelize.getQueryInterface();
  const transaction = await sequelize.transaction();

  try {
    console.log('Rolling back migration: Update Deal and SPV models');

    // Remove SPV columns
    await queryInterface.removeColumn('spvs', 'allocation_plan', { transaction });
    await queryInterface.removeColumn('spvs', 'spv_code', { transaction });

    // Remove Deal column
    await queryInterface.removeColumn('deals', 'lock_in_period_months', { transaction });

    // Note: PostgreSQL doesn't support removing enum values easily
    // You would need to recreate the enum types to remove values
    console.log('Note: Enum values cannot be easily removed. Manual cleanup may be required.');

    await transaction.commit();
    console.log('Rollback completed!');

  } catch (error) {
    await transaction.rollback();
    console.error('Rollback failed:', error);
    throw error;
  }
}
