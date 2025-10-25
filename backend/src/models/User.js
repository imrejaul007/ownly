import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';
import authConfig from '../config/auth.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM(...Object.values(authConfig.roles)),
    allowNull: false,
    defaultValue: authConfig.roles.INVESTOR_RETAIL,
  },
  kyc_status: {
    type: DataTypes.ENUM(...Object.values(authConfig.kycStatus)),
    defaultValue: authConfig.kycStatus.PENDING,
  },
  kyc_documents: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  preferences: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  is_dummy: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'All sandbox users are dummy by default',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['role'] },
    { fields: ['kyc_status'] },
  ],
});

// Hash password before creating user
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, authConfig.bcryptRounds);
  }
});

// Hash password before updating if password changed
User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, authConfig.bcryptRounds);
  }
});

// Instance method to compare password
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Don't return password in JSON
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

export default User;
