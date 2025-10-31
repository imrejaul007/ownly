import sequelize from '../config/database.js';

/**
 * Migration: Add lock-in date tracking to deals
 * Date: 2025-11-01
 *
 * Changes:
 * - Add lock_in_start_date to deals table
 * - Add lock_in_end_date to deals table
 */

export async function up() {
  const queryInterface = sequelize.getQueryInterface();
  const transaction = await sequelize.transaction();

  try {
    console.log('Starting migration: Add lock-in date tracking');

    // Add lock_in_start_date
    console.log('Adding lock_in_start_date to deals table...');
    await queryInterface.addColumn(
      'deals',
      'lock_in_start_date',
      {
        type: sequelize.Sequelize.DATE,
        allowNull: true,
        comment: 'Date when lock-in period started',
      },
      { transaction }
    );

    // Add lock_in_end_date
    console.log('Adding lock_in_end_date to deals table...');
    await queryInterface.addColumn(
      'deals',
      'lock_in_end_date',
      {
        type: sequelize.Sequelize.DATE,
        allowNull: true,
        comment: 'Date when lock-in period ends and trading is allowed',
      },
      { transaction }
    );

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
    console.log('Rolling back migration: Remove lock-in date tracking');

    await queryInterface.removeColumn('deals', 'lock_in_end_date', { transaction });
    await queryInterface.removeColumn('deals', 'lock_in_start_date', { transaction });

    await transaction.commit();
    console.log('Rollback completed!');

  } catch (error) {
    await transaction.rollback();
    console.error('Rollback failed:', error);
    throw error;
  }
}
