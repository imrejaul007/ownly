import sequelize from '../config/database.js';
import '../models/index.js';
import logger from '../config/logger.js';

const setupDatabase = async () => {
  try {
    logger.info('Starting database setup...');

    await sequelize.authenticate();
    logger.info('Database connection established.');

    await sequelize.sync({ alter: process.env.DB_ALTER === 'true' });
    
    logger.info('Database setup complete!');
    process.exit(0);
  } catch (error) {
    logger.error('Database setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();
