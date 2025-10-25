/**
 * Risk Scoring & Badge System for OWNLY Deals
 *
 * Calculates risk scores based on multiple factors:
 * - Deal type
 * - Expected ROI vs industry benchmark
 * - Holding period
 * - Funding status
 * - Location/Jurisdiction
 * - Minimum ticket size
 */

/**
 * Calculate risk score for a deal (0-100, where 100 is highest risk)
 */
export const calculateRiskScore = (deal) => {
  let riskScore = 0;

  // 1. Deal Type Risk (0-20 points)
  const dealTypeRisk = {
    flip: 15,              // Higher risk - quick exit needed
    rental: 8,             // Lower risk - steady income
    franchise_unit: 12,    // Medium risk - business operations
    development: 18,       // High risk - construction delays
  };
  riskScore += dealTypeRisk[deal.type] || 10;

  // 2. ROI Risk (0-25 points)
  const expectedROI = parseFloat(deal.expected_roi || 0);
  if (expectedROI < 8) {
    riskScore += 5; // Low return = higher risk for investors
  } else if (expectedROI >= 8 && expectedROI <= 15) {
    riskScore += 0; // Sweet spot - realistic returns
  } else if (expectedROI > 15 && expectedROI <= 25) {
    riskScore += 10; // High return = higher risk
  } else if (expectedROI > 25) {
    riskScore += 20; // Unrealistic returns = very high risk
  }

  // 3. Holding Period Risk (0-15 points)
  const holdingPeriod = parseInt(deal.holding_period_months || 0);
  if (holdingPeriod < 12) {
    riskScore += 5; // Short term = some risk
  } else if (holdingPeriod >= 12 && holdingPeriod <= 36) {
    riskScore += 0; // Medium term = optimal
  } else if (holdingPeriod > 36) {
    riskScore += 10; // Long term = illiquidity risk
  }

  // 4. Funding Risk (0-15 points)
  const fundingProgress = (parseFloat(deal.raised_amount || 0) / parseFloat(deal.target_amount || 1)) * 100;
  if (fundingProgress < 30) {
    riskScore += 10; // Low funding = higher risk
  } else if (fundingProgress >= 30 && fundingProgress < 70) {
    riskScore += 5; // Partial funding
  } else {
    riskScore += 0; // Well funded
  }

  // 5. Jurisdiction Risk (0-15 points)
  const jurisdictionRisk = {
    'UAE': 0,
    'Dubai': 0,
    'Abu Dhabi': 0,
    'Saudi Arabia': 5,
    'Qatar': 3,
    'Bahrain': 5,
    'Other GCC': 8,
    'International': 12,
  };
  const jurisdiction = deal.jurisdiction || 'Other GCC';
  riskScore += jurisdictionRisk[jurisdiction] || 10;

  // 6. Ticket Size Risk (0-10 points)
  const minTicket = parseFloat(deal.min_ticket || 0);
  if (minTicket > 500000) {
    riskScore += 8; // Very high ticket = concentration risk
  } else if (minTicket > 100000) {
    riskScore += 4; // High ticket
  } else {
    riskScore += 0; // Accessible ticket
  }

  // Cap at 100
  return Math.min(Math.round(riskScore), 100);
};

/**
 * Get risk badge based on score
 */
export const getRiskBadge = (riskScore) => {
  if (riskScore <= 25) {
    return {
      level: 'Low Risk',
      color: 'green',
      description: 'Conservative investment with stable returns',
      icon: '=â',
    };
  } else if (riskScore <= 50) {
    return {
      level: 'Medium Risk',
      color: 'yellow',
      description: 'Balanced risk-return profile',
      icon: '=á',
    };
  } else if (riskScore <= 75) {
    return {
      level: 'High Risk',
      color: 'orange',
      description: 'Aggressive investment with higher volatility',
      icon: '=à',
    };
  } else {
    return {
      level: 'Very High Risk',
      color: 'red',
      description: 'Speculative investment - high reward potential',
      icon: '=4',
    };
  }
};

/**
 * Get additional badges for deal features
 */
export const getFeatureBadges = (deal) => {
  const badges = [];

  // Hot Deal - High Demand
  const fundingProgress = (parseFloat(deal.raised_amount || 0) / parseFloat(deal.target_amount || 1)) * 100;
  if (fundingProgress > 70 && deal.status === 'open') {
    badges.push({
      type: 'hot',
      label: 'Hot Deal',
      color: 'red',
      icon: '=%',
      description: 'High investor interest',
    });
  }

  // New Listing
  const daysSinceListing = Math.floor((new Date() - new Date(deal.created_at)) / (1000 * 60 * 60 * 24));
  if (daysSinceListing <= 7) {
    badges.push({
      type: 'new',
      label: 'New',
      color: 'blue',
      icon: '<•',
      description: 'Recently listed',
    });
  }

  // Premium Location
  const premiumLocations = ['Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'Business Bay'];
  if (premiumLocations.some(loc => deal.location?.includes(loc))) {
    badges.push({
      type: 'premium',
      label: 'Premium Location',
      color: 'purple',
      icon: 'P',
      description: 'Prime real estate area',
    });
  }

  // High ROI
  const expectedROI = parseFloat(deal.expected_roi || 0);
  if (expectedROI >= 20) {
    badges.push({
      type: 'high_roi',
      label: 'High ROI',
      color: 'green',
      icon: '=°',
      description: `${expectedROI}% expected returns`,
    });
  }

  // Limited Availability
  if (fundingProgress > 80 && deal.status === 'open') {
    badges.push({
      type: 'limited',
      label: 'Limited Spots',
      color: 'orange',
      icon: '¡',
      description: 'Almost fully funded',
    });
  }

  // Verified Operator
  if (deal.metadata?.verified_operator) {
    badges.push({
      type: 'verified',
      label: 'Verified',
      color: 'blue',
      icon: '',
      description: 'Verified operator',
    });
  }

  return badges;
};

/**
 * Add risk scoring to deal object
 */
export const enrichDealWithRiskData = (deal) => {
  const riskScore = calculateRiskScore(deal);
  const riskBadge = getRiskBadge(riskScore);
  const featureBadges = getFeatureBadges(deal);

  return {
    ...deal,
    risk_score: riskScore,
    risk_badge: riskBadge,
    feature_badges: featureBadges,
  };
};

/**
 * Batch process deals with risk scoring
 */
export const enrichDealsWithRiskData = (deals) => {
  return deals.map(deal => enrichDealWithRiskData(deal));
};
