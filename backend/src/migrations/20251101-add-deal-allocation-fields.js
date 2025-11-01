import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export async function up() {
  const queryInterface = sequelize.getQueryInterface();

  console.log('Adding allocation fields to deals table...');

  // Add allocation configuration fields (percentage split)
  await queryInterface.addColumn('deals', 'allocation_direct_sale_pct', {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 60.00,
  });

  await queryInterface.addColumn('deals', 'allocation_bundles_pct', {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 20.00,
  });

  await queryInterface.addColumn('deals', 'allocation_auto_invest_pct', {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 10.00,
  });

  await queryInterface.addColumn('deals', 'allocation_reserve_pct', {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 10.00,
  });

  // Add allocation tracking fields (actual raised amounts)
  await queryInterface.addColumn('deals', 'direct_sale_raised', {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  });

  await queryInterface.addColumn('deals', 'bundles_raised', {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  });

  await queryInterface.addColumn('deals', 'auto_invest_raised', {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  });

  await queryInterface.addColumn('deals', 'reserve_raised', {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
  });

  console.log('✓ Allocation fields added successfully');
}

export async function down() {
  const queryInterface = sequelize.getQueryInterface();

  console.log('Removing allocation fields from deals table...');

  await queryInterface.removeColumn('deals', 'allocation_direct_sale_pct');
  await queryInterface.removeColumn('deals', 'allocation_bundles_pct');
  await queryInterface.removeColumn('deals', 'allocation_auto_invest_pct');
  await queryInterface.removeColumn('deals', 'allocation_reserve_pct');
  await queryInterface.removeColumn('deals', 'direct_sale_raised');
  await queryInterface.removeColumn('deals', 'bundles_raised');
  await queryInterface.removeColumn('deals', 'auto_invest_raised');
  await queryInterface.removeColumn('deals', 'reserve_raised');

  console.log('✓ Allocation fields removed successfully');
}
