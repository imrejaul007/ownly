import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export async function up() {
  const queryInterface = sequelize.getQueryInterface();

  console.log('Adding auto_reinvest_enabled column to investments table...');

  await queryInterface.addColumn('investments', 'auto_reinvest_enabled', {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether to automatically reinvest payouts instead of crediting to wallet',
  });

  console.log('✓ auto_reinvest_enabled column added successfully');
}

export async function down() {
  const queryInterface = sequelize.getQueryInterface();

  console.log('Removing auto_reinvest_enabled column from investments table...');

  await queryInterface.removeColumn('investments', 'auto_reinvest_enabled');

  console.log('✓ auto_reinvest_enabled column removed successfully');
}
