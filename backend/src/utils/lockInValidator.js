/**
 * Lock-in Period Validation Utilities
 *
 * These functions help validate whether a deal is in its lock-in period,
 * preventing unauthorized trading during restricted phases.
 */

/**
 * Check if a deal is currently in its lock-in period
 * @param {Object} deal - The deal object with lock-in dates
 * @returns {boolean} - True if deal is in lock-in period
 */
export function isInLockInPeriod(deal) {
  if (!deal.lock_in_start_date || !deal.lock_in_end_date) {
    return false;
  }

  const now = new Date();
  const lockInStart = new Date(deal.lock_in_start_date);
  const lockInEnd = new Date(deal.lock_in_end_date);

  return now >= lockInStart && now < lockInEnd;
}

/**
 * Check if a deal status indicates it's in lock-in phase
 * @param {Object} deal - The deal object
 * @returns {boolean} - True if deal status is 'lock-in'
 */
export function hasLockInStatus(deal) {
  return deal.status === 'lock-in';
}

/**
 * Check if trading is allowed for a deal (comprehensive check)
 * @param {Object} deal - The deal object
 * @returns {Object} - { allowed: boolean, reason: string }
 */
export function canTrade(deal) {
  // Check if deal is in lock-in status
  if (hasLockInStatus(deal)) {
    return {
      allowed: false,
      reason: 'Deal is in lock-in period. Trading will be enabled after the lock-in period ends.',
    };
  }

  // Check if deal is within lock-in dates
  if (isInLockInPeriod(deal)) {
    const lockInEnd = new Date(deal.lock_in_end_date);
    return {
      allowed: false,
      reason: `Trading is restricted during lock-in period. Trading will be enabled on ${lockInEnd.toLocaleDateString()}.`,
    };
  }

  // Check if deal is in appropriate status for trading
  const tradableStatuses = ['operational', 'secondary', 'exchange'];
  if (!tradableStatuses.includes(deal.status)) {
    return {
      allowed: false,
      reason: `Trading is only available for operational deals. Current status: ${deal.status}`,
    };
  }

  return {
    allowed: true,
    reason: 'Trading is allowed',
  };
}

/**
 * Calculate lock-in end date based on start date and period
 * @param {Date} startDate - Lock-in start date
 * @param {number} lockInMonths - Lock-in period in months
 * @returns {Date} - Calculated end date
 */
export function calculateLockInEndDate(startDate, lockInMonths) {
  if (!startDate || !lockInMonths) {
    return null;
  }

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + lockInMonths);
  return endDate;
}

/**
 * Get days remaining in lock-in period
 * @param {Object} deal - The deal object
 * @returns {number|null} - Days remaining, or null if not in lock-in
 */
export function getDaysRemainingInLockIn(deal) {
  if (!isInLockInPeriod(deal)) {
    return null;
  }

  const now = new Date();
  const lockInEnd = new Date(deal.lock_in_end_date);
  const diffTime = lockInEnd - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
