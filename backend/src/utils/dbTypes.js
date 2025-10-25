import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const dialect = sequelize.getDialect();

/**
 * Cross-database type helpers
 * SQLite doesn't support ARRAY, ENUM, or JSONB
 */

export const ArrayType = (baseType) => {
  if (dialect === 'sqlite') {
    // Store as JSON string in SQLite
    return DataTypes.TEXT;
  }
  // Use native array in PostgreSQL
  return DataTypes.ARRAY(baseType);
};

export const JsonType = () => {
  if (dialect === 'sqlite') {
    // SQLite uses TEXT for JSON
    return DataTypes.TEXT;
  }
  // PostgreSQL uses JSONB
  return DataTypes.JSONB;
};

export const EnumType = (values) => {
  if (dialect === 'sqlite') {
    // SQLite doesn't have ENUM, use STRING with validation
    return DataTypes.STRING;
  }
  // PostgreSQL has native ENUM
  return DataTypes.ENUM(...values);
};

/**
 * Getters and setters for array fields in SQLite
 */
export const arrayGetterSetter = {
  get() {
    const rawValue = this.getDataValue(arguments[0]);
    if (!rawValue) return [];
    if (dialect === 'sqlite') {
      try {
        return JSON.parse(rawValue);
      } catch {
        return [];
      }
    }
    return rawValue;
  },
  set(value) {
    if (dialect === 'sqlite') {
      this.setDataValue(arguments[0], JSON.stringify(value || []));
    } else {
      this.setDataValue(arguments[0], value || []);
    }
  },
};

/**
 * Getters and setters for JSON fields in SQLite
 */
export const jsonGetterSetter = {
  get() {
    const rawValue = this.getDataValue(arguments[0]);
    if (!rawValue) return {};
    if (dialect === 'sqlite') {
      try {
        return JSON.parse(rawValue);
      } catch {
        return {};
      }
    }
    return rawValue;
  },
  set(value) {
    if (dialect === 'sqlite') {
      this.setDataValue(arguments[0], JSON.stringify(value || {}));
    } else {
      this.setDataValue(arguments[0], value || {});
    }
  },
};
