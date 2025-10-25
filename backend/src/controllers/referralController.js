import { User, Investment, Transaction, Wallet } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import crypto from 'crypto';

/**
 * Generate unique referral code
 */
const generateReferralCode = (userName) => {
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  const namePrefix = userName.substring(0, 3).toUpperCase();
  return `${namePrefix}${randomStr}`;
};

/**
 * Get user's referral dashboard
 */
export const getReferralDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Get or generate referral code
    let referralCode = user.metadata?.referral_code;
    if (!referralCode) {
      referralCode = generateReferralCode(user.full_name || user.email);
      await user.update({
        metadata: {
          ...user.metadata,
          referral_code: referralCode,
        },
      });
    }

    // Get referred users
    const referredUsers = await User.findAll({
      where: { referred_by: userId },
      attributes: ['id', 'full_name', 'email', 'created_at'],
    });

    // Calculate referral stats
    const referralStats = {
      totalReferrals: referredUsers.length,
      activeReferrals: referredUsers.length, // All are considered active in sandbox
      totalEarnings: 0,
      pendingEarnings: 0,
    };

    // Get referral earnings from metadata
    const referralEarnings = user.metadata?.referral_earnings || [];
    referralStats.totalEarnings = referralEarnings.reduce(
      (sum, earning) => sum + parseFloat(earning.amount || 0),
      0
    );

    // Calculate tier based on referrals
    let tier = 'Bronze';
    let nextTier = 'Silver';
    let progressToNextTier = 0;

    if (referralStats.totalReferrals >= 20) {
      tier = 'Platinum';
      nextTier = null;
      progressToNextTier = 100;
    } else if (referralStats.totalReferrals >= 10) {
      tier = 'Gold';
      nextTier = 'Platinum';
      progressToNextTier = ((referralStats.totalReferrals - 10) / 10) * 100;
    } else if (referralStats.totalReferrals >= 5) {
      tier = 'Silver';
      nextTier = 'Gold';
      progressToNextTier = ((referralStats.totalReferrals - 5) / 5) * 100;
    } else {
      tier = 'Bronze';
      nextTier = 'Silver';
      progressToNextTier = (referralStats.totalReferrals / 5) * 100;
    }

    successResponse(res, {
      referralCode,
      referralLink: `${process.env.FRONTEND_URL}/signup?ref=${referralCode}`,
      stats: referralStats,
      tier: {
        current: tier,
        next: nextTier,
        progress: Math.round(progressToNextTier),
      },
      referredUsers,
      recentEarnings: referralEarnings.slice(-10),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get referral leaderboard
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const { period = 'all' } = req.query;

    // Get all users with referrals
    const users = await User.findAll({
      attributes: ['id', 'full_name', 'email', 'metadata', 'created_at'],
    });

    // Calculate referral counts
    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        const referralCount = await User.count({
          where: { referred_by: user.id },
        });

        const referralEarnings = user.metadata?.referral_earnings || [];
        const totalEarnings = referralEarnings.reduce(
          (sum, earning) => sum + parseFloat(earning.amount || 0),
          0
        );

        return {
          userId: user.id,
          name: user.full_name || user.email,
          email: user.email,
          referralCount,
          totalEarnings,
        };
      })
    );

    // Sort by referral count
    const sortedLeaderboard = leaderboardData
      .filter((entry) => entry.referralCount > 0)
      .sort((a, b) => b.referralCount - a.referralCount)
      .slice(0, 50);

    // Add ranks
    const leaderboard = sortedLeaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    successResponse(res, { leaderboard, period });
  } catch (error) {
    next(error);
  }
};

/**
 * Apply referral code (called during signup)
 */
export const applyReferralCode = async (req, res, next) => {
  try {
    const { referralCode, newUserId } = req.body;

    if (!referralCode || !newUserId) {
      return errorResponse(res, 'Referral code and user ID required', 400);
    }

    // Find referrer by referral code
    const referrer = await User.findOne({
      where: sequelize.where(
        sequelize.fn('jsonb_extract_path_text', sequelize.col('metadata'), 'referral_code'),
        referralCode
      ),
    });

    if (!referrer) {
      return errorResponse(res, 'Invalid referral code', 404);
    }

    // Update new user with referrer
    await User.update(
      { referred_by: referrer.id },
      { where: { id: newUserId } }
    );

    // Award signup bonus to referrer
    const signupBonus = 50; // $50 signup bonus
    const referralEarnings = referrer.metadata?.referral_earnings || [];

    referralEarnings.push({
      id: `ref_${Date.now()}`,
      amount: signupBonus,
      type: 'signup_bonus',
      referredUserId: newUserId,
      date: new Date().toISOString(),
    });

    await referrer.update({
      metadata: {
        ...referrer.metadata,
        referral_earnings: referralEarnings,
      },
    });

    // Add to referrer's wallet
    const referrerWallet = await Wallet.findOne({ where: { user_id: referrer.id } });
    if (referrerWallet) {
      await referrerWallet.update({
        balance_dummy: parseFloat(referrerWallet.balance_dummy) + signupBonus,
      });

      // Create transaction
      await Transaction.create({
        user_id: referrer.id,
        type: 'referral_bonus',
        amount: signupBonus,
        description: `Referral signup bonus`,
        status: 'completed',
        metadata: { referredUserId: newUserId, referralCode },
      });
    }

    successResponse(res, {
      message: 'Referral applied successfully',
      bonus: signupBonus,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get available rewards
 */
export const getRewards = async (req, res, next) => {
  try {
    const rewards = [
      {
        id: 'reward_1',
        title: 'Welcome Bonus',
        description: 'Earn $50 for each friend who signs up',
        points: 0,
        value: 50,
        type: 'signup',
        icon: '<',
      },
      {
        id: 'reward_2',
        title: 'Investment Bonus',
        description: 'Earn 1% when your referral makes their first investment',
        points: 0,
        value: 'variable',
        type: 'investment',
        icon: '=°',
      },
      {
        id: 'reward_3',
        title: 'Silver Tier Badge',
        description: 'Unlock at 5 referrals',
        points: 5,
        value: 'badge',
        type: 'tier',
        icon: '>H',
      },
      {
        id: 'reward_4',
        title: 'Gold Tier Badge',
        description: 'Unlock at 10 referrals',
        points: 10,
        value: 'badge',
        type: 'tier',
        icon: '>G',
      },
      {
        id: 'reward_5',
        title: 'Platinum Tier Badge',
        description: 'Unlock at 20 referrals - Premium benefits',
        points: 20,
        value: 'badge',
        type: 'tier',
        icon: '=Ž',
      },
    ];

    successResponse(res, { rewards });
  } catch (error) {
    next(error);
  }
};

/**
 * Get referral activity
 */
export const getReferralActivity = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    const referralEarnings = user.metadata?.referral_earnings || [];

    // Get recent referral signups
    const recentReferrals = await User.findAll({
      where: { referred_by: userId },
      attributes: ['id', 'full_name', 'email', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 20,
    });

    const activity = [
      ...referralEarnings.map((earning) => ({
        id: earning.id,
        type: 'earning',
        amount: earning.amount,
        description: earning.type === 'signup_bonus' ? 'Signup bonus' : 'Investment bonus',
        date: earning.date,
      })),
      ...recentReferrals.map((ref) => ({
        id: ref.id,
        type: 'signup',
        userName: ref.full_name || ref.email,
        description: 'New referral signup',
        date: ref.created_at,
      })),
    ];

    // Sort by date
    activity.sort((a, b) => new Date(b.date) - new Date(a.date));

    successResponse(res, { activity: activity.slice(0, 50) });
  } catch (error) {
    next(error);
  }
};
