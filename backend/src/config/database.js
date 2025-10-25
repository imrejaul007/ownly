import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const dbDialect = process.env.DB_DIALECT || 'sqlite';

// Configure based on dialect
let sequelizeConfig;

if (dbDialect === 'sqlite') {
  // SQLite configuration (development/testing)
  const dbPath = path.join(__dirname, '../../ownly-sandbox.db');
  sequelizeConfig = {
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  };
  console.log(`🗄️  Using SQLite database: ${dbPath}`);
} else {
  // PostgreSQL configuration (production)
  sequelizeConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  };
  console.log(`🗄️  Using PostgreSQL database: ${process.env.DB_NAME}`);
}

const sequelize = dbDialect === 'sqlite'
  ? new Sequelize(sequelizeConfig)
  : new Sequelize(
      process.env.DB_NAME || 'ownly_sandbox',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      sequelizeConfig
    );

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    return false;
  }
};

export const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Database sync failed:', error.message);
    throw error;
  }
};

export default sequelize;
