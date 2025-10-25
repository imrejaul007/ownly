import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    authConfig.jwtSecret,
    {
      expiresIn: authConfig.jwtExpiresIn,
    }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, authConfig.jwtSecret);
  } catch (error) {
    return null;
  }
};
