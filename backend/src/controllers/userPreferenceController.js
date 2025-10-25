import { UserPreference, User } from '../models/index.js';
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Get user preferences
 */
export const getPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let preferences = await UserPreference.findOne({
      where: { user_id: userId },
    });

    // Create default preferences if not exists
    if (!preferences) {
      preferences = await UserPreference.create({ user_id: userId });
    }

    successResponse(res, { preferences });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user preferences
 */
export const updatePreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    let preferences = await UserPreference.findOne({
      where: { user_id: userId },
    });

    if (!preferences) {
      // Create if doesn't exist
      preferences = await UserPreference.create({
        user_id: userId,
        ...updates,
      });
    } else {
      await preferences.update(updates);
    }

    successResponse(res, { preferences });
  } catch (error) {
    next(error);
  }
};

/**
 * Update notification preferences
 */
export const updateNotificationPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      email_notifications,
      push_notifications,
      notification_frequency,
      notify_investments,
      notify_payouts,
      notify_deal_updates,
      notify_announcements,
      notify_secondary_market,
    } = req.body;

    let preferences = await UserPreference.findOne({
      where: { user_id: userId },
    });

    if (!preferences) {
      preferences = await UserPreference.create({ user_id: userId });
    }

    await preferences.update({
      email_notifications,
      push_notifications,
      notification_frequency,
      notify_investments,
      notify_payouts,
      notify_deal_updates,
      notify_announcements,
      notify_secondary_market,
    });

    successResponse(res, { preferences });
  } catch (error) {
    next(error);
  }
};

/**
 * Update display preferences
 */
export const updateDisplayPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { theme, language, currency, timezone } = req.body;

    let preferences = await UserPreference.findOne({
      where: { user_id: userId },
    });

    if (!preferences) {
      preferences = await UserPreference.create({ user_id: userId });
    }

    await preferences.update({
      theme,
      language,
      currency,
      timezone,
    });

    successResponse(res, { preferences });
  } catch (error) {
    next(error);
  }
};

/**
 * Update privacy preferences
 */
export const updatePrivacyPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { profile_visibility, show_investment_activity, allow_messages } = req.body;

    let preferences = await UserPreference.findOne({
      where: { user_id: userId },
    });

    if (!preferences) {
      preferences = await UserPreference.create({ user_id: userId });
    }

    await preferences.update({
      profile_visibility,
      show_investment_activity,
      allow_messages,
    });

    successResponse(res, { preferences });
  } catch (error) {
    next(error);
  }
};

/**
 * Update security preferences
 */
export const updateSecurityPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { two_factor_enabled, session_timeout } = req.body;

    let preferences = await UserPreference.findOne({
      where: { user_id: userId },
    });

    if (!preferences) {
      preferences = await UserPreference.create({ user_id: userId });
    }

    await preferences.update({
      two_factor_enabled,
      session_timeout,
    });

    successResponse(res, { preferences });
  } catch (error) {
    next(error);
  }
};

/**
 * Update dashboard preferences
 */
export const updateDashboardPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { default_dashboard_view, dashboard_widgets } = req.body;

    let preferences = await UserPreference.findOne({
      where: { user_id: userId },
    });

    if (!preferences) {
      preferences = await UserPreference.create({ user_id: userId });
    }

    await preferences.update({
      default_dashboard_view,
      dashboard_widgets,
    });

    successResponse(res, { preferences });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset preferences to defaults
 */
export const resetToDefaults = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let preferences = await UserPreference.findOne({
      where: { user_id: userId },
    });

    if (preferences) {
      await preferences.destroy();
    }

    // Create new with defaults
    preferences = await UserPreference.create({ user_id: userId });

    successResponse(res, { preferences, message: 'Preferences reset to defaults' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get default preferences (for reference)
 */
export const getDefaults = async (req, res, next) => {
  try {
    const defaults = {
      email_notifications: true,
      push_notifications: true,
      notification_frequency: 'realtime',
      notify_investments: true,
      notify_payouts: true,
      notify_deal_updates: true,
      notify_announcements: true,
      notify_secondary_market: true,
      theme: 'auto',
      language: 'en',
      currency: 'USD',
      timezone: 'America/New_York',
      profile_visibility: 'investors_only',
      show_investment_activity: false,
      allow_messages: true,
      two_factor_enabled: false,
      session_timeout: 30,
      default_dashboard_view: 'overview',
      dashboard_widgets: {
        portfolio_summary: true,
        recent_activity: true,
        upcoming_payouts: true,
        notifications: true,
      },
    };

    successResponse(res, { defaults });
  } catch (error) {
    next(error);
  }
};

export default {
  getPreferences,
  updatePreferences,
  updateNotificationPreferences,
  updateDisplayPreferences,
  updatePrivacyPreferences,
  updateSecurityPreferences,
  updateDashboardPreferences,
  resetToDefaults,
  getDefaults,
};
