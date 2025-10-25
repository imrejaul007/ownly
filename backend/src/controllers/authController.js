import { User, Wallet } from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import { success, error } from '../utils/response.js';
import authConfig from '../config/auth.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return error(res, 'User already exists with this email', 409);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || authConfig.roles.INVESTOR_RETAIL,
      kyc_status: authConfig.kycStatus.PENDING,
    });

    // Create wallet for user
    await Wallet.create({
      user_id: user.id,
      currency: 'USD',
      balance_dummy: 100000, // Give new users 100k dummy balance
    });

    // Generate token
    const token = generateToken(user);

    return success(res, {
      user: user.toJSON(),
      token,
    }, 'User created successfully', 201);

  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return error(res, 'Invalid credentials', 401);
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return error(res, 'Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.is_active) {
      return error(res, 'Account is inactive', 403);
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate token
    const token = generateToken(user);

    return success(res, {
      user: user.toJSON(),
      token,
    }, 'Login successful');

  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: ['wallet', 'agentProfile'],
    });

    return success(res, { user });

  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, city, country, preferences } = req.body;

    await req.user.update({
      ...(name && { name }),
      ...(phone && { phone }),
      ...(city && { city }),
      ...(country && { country }),
      ...(preferences && { preferences }),
    });

    return success(res, { user: req.user }, 'Profile updated successfully');

  } catch (err) {
    next(err);
  }
};

export const impersonate = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Only admins can impersonate
    if (req.user.role !== authConfig.roles.ADMIN) {
      return error(res, 'Only admins can impersonate users', 403);
    }

    const targetUser = await User.findByPk(userId);
    if (!targetUser) {
      return error(res, 'User not found', 404);
    }

    const token = generateToken(targetUser);

    return success(res, {
      user: targetUser.toJSON(),
      token,
    }, 'Impersonation successful');

  } catch (err) {
    next(err);
  }
};
