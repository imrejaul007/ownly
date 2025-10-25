import { Scenario, SPV, Deal, Investment, Asset, Payout, User } from '../models/index.js';
import { success, error } from '../utils/response.js';
import sequelize from '../config/database.js';

// Preset scenario templates
const SCENARIO_TEMPLATES = {
  perfect_flip: {
    name: 'Perfect Flip (10% in 60 days)',
    description: 'Property sells quickly at 10% above target price',
    parameters: {
      holdingPeriodDays: 60,
      exitMultiplier: 1.10,
      expenseShock: 0,
      marketCondition: 'bull',
    },
    events: [
      { day: 1, type: 'acquisition', description: 'Property acquired' },
      { day: 30, type: 'marketing', description: 'Marketing campaign launched' },
      { day: 45, type: 'offer', description: 'Buyer offer received' },
      { day: 60, type: 'exit', description: 'Property sold, funds distributed' },
    ],
  },
  market_crash: {
    name: 'Market Downturn (-15% valuation)',
    description: 'Market crashes, property value drops 15%',
    parameters: {
      holdingPeriodDays: 365,
      exitMultiplier: 0.85,
      expenseShock: 0.05,
      marketCondition: 'bear',
    },
    events: [
      { day: 1, type: 'acquisition', description: 'Property acquired' },
      { day: 90, type: 'market_shift', description: 'Market conditions deteriorate' },
      { day: 180, type: 'valuation_drop', description: 'Property revalued at -15%' },
      { day: 270, type: 'expense_increase', description: 'Maintenance costs increase' },
      { day: 365, type: 'exit', description: 'Property sold at loss' },
    ],
  },
  franchise_blowout: {
    name: 'Franchise Blowout (150% revenue)',
    description: 'Franchise exceeds revenue targets by 50%',
    parameters: {
      holdingPeriodDays: 730,
      exitMultiplier: 1.50,
      revenueMultiplier: 1.50,
      marketCondition: 'bull',
    },
    events: [
      { day: 1, type: 'opening', description: 'Store opens' },
      { day: 90, type: 'milestone', description: 'First profitable quarter' },
      { day: 180, type: 'expansion', description: 'Added delivery service' },
      { day: 365, type: 'milestone', description: 'Revenue exceeds target by 50%' },
      { day: 730, type: 'exit', description: 'Franchise sold at premium' },
    ],
  },
  delay_expense: {
    name: 'Delayed Exit with Extra Expenses',
    description: 'Exit delayed by 6 months with 10% extra costs',
    parameters: {
      holdingPeriodDays: 540,
      exitMultiplier: 1.05,
      expenseShock: 0.10,
      delayMonths: 6,
      marketCondition: 'neutral',
    },
    events: [
      { day: 1, type: 'acquisition', description: 'Asset acquired' },
      { day: 180, type: 'delay', description: 'Exit delayed due to market conditions' },
      { day: 270, type: 'expense', description: 'Unexpected maintenance required' },
      { day: 360, type: 'expense', description: 'Additional holding costs' },
      { day: 540, type: 'exit', description: 'Asset sold with modest profit' },
    ],
  },
  default: {
    name: 'Investment Default',
    description: 'Investment fails, partial recovery (30%)',
    parameters: {
      holdingPeriodDays: 180,
      exitMultiplier: 0.30,
      expenseShock: 0.20,
      marketCondition: 'crisis',
    },
    events: [
      { day: 1, type: 'acquisition', description: 'Asset acquired' },
      { day: 60, type: 'warning', description: 'Financial difficulties emerge' },
      { day: 90, type: 'crisis', description: 'Unable to meet obligations' },
      { day: 120, type: 'restructuring', description: 'Asset liquidation begins' },
      { day: 180, type: 'exit', description: 'Partial recovery at 30%' },
    ],
  },
};

export const listScenarios = async (req, res, next) => {
  try {
    const { spvId } = req.query;

    const where = {};
    if (spvId) where.spv_id = spvId;

    const scenarios = await Scenario.findAll({
      where,
      include: [
        {
          model: SPV,
          as: 'spv',
          include: ['deal'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return success(res, { scenarios });
  } catch (err) {
    next(err);
  }
};

export const getScenarioTemplates = async (req, res, next) => {
  try {
    const templates = Object.entries(SCENARIO_TEMPLATES).map(([key, template]) => ({
      type: key,
      ...template,
    }));

    return success(res, { templates });
  } catch (err) {
    next(err);
  }
};

export const createScenario = async (req, res, next) => {
  try {
    const { spvId, scenarioType, customParameters } = req.body;

    // Get SPV and validate
    const spv = await SPV.findByPk(spvId, {
      include: ['deal', 'investments'],
    });

    if (!spv) {
      return error(res, 'SPV not found', 404);
    }

    // Get scenario template
    const template = SCENARIO_TEMPLATES[scenarioType];
    if (!template) {
      return error(res, 'Invalid scenario type', 400);
    }

    // Merge custom parameters
    const parameters = {
      ...template.parameters,
      ...(customParameters || {}),
    };

    // Create scenario
    const scenario = await Scenario.create({
      spv_id: spvId,
      scenario_type: scenarioType,
      name: template.name,
      description: template.description,
      parameters,
      events: template.events,
      status: 'draft',
      created_by: req.user.id,
    });

    return success(res, { scenario }, 'Scenario created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const runScenario = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    const scenario = await Scenario.findByPk(id, {
      include: [
        {
          model: SPV,
          as: 'spv',
          include: ['deal', 'investments'],
        },
      ],
      transaction: t,
    });

    if (!scenario) {
      await t.rollback();
      return error(res, 'Scenario not found', 404);
    }

    if (scenario.status === 'running') {
      await t.rollback();
      return error(res, 'Scenario is already running', 400);
    }

    // Mark as running
    await scenario.update(
      {
        status: 'running',
        started_at: new Date(),
      },
      { transaction: t }
    );

    // Calculate scenario results
    const results = await calculateScenarioResults(scenario, t);

    // Update scenario with results
    await scenario.update(
      {
        status: 'completed',
        completed_at: new Date(),
        results,
      },
      { transaction: t }
    );

    await t.commit();

    return success(res, { scenario, results }, 'Scenario executed successfully');
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

export const getScenarioResults = async (req, res, next) => {
  try {
    const { id } = req.params;

    const scenario = await Scenario.findByPk(id, {
      include: [
        {
          model: SPV,
          as: 'spv',
          include: ['deal', 'investments'],
        },
      ],
    });

    if (!scenario) {
      return error(res, 'Scenario not found', 404);
    }

    return success(res, { scenario, results: scenario.results });
  } catch (err) {
    next(err);
  }
};

// Helper function to calculate scenario results
async function calculateScenarioResults(scenario, transaction) {
  const { spv } = scenario;
  const { parameters } = scenario;

  // Get initial investment amount
  const totalInvested = spv.investments.reduce(
    (sum, inv) => sum + parseFloat(inv.amount),
    0
  );

  // Calculate holding period costs
  const holdingPeriodYears = parameters.holdingPeriodDays / 365;
  const managementFeeRate = 0.015; // 1.5% annual
  const managementFees = totalInvested * managementFeeRate * holdingPeriodYears;

  // Calculate expense shock
  const expenseShock = totalInvested * (parameters.expenseShock || 0);

  // Calculate exit value
  const grossExitValue = totalInvested * parameters.exitMultiplier;
  const netExitValue = grossExitValue - managementFees - expenseShock;

  // Calculate returns
  const totalReturn = netExitValue - totalInvested;
  const returnPercentage = (totalReturn / totalInvested) * 100;
  const annualizedReturn = (Math.pow(netExitValue / totalInvested, 1 / holdingPeriodYears) - 1) * 100;

  // Calculate per-investor returns
  const investorReturns = spv.investments.map((inv) => {
    const investmentAmount = parseFloat(inv.amount);
    const ownershipPercentage = investmentAmount / totalInvested;
    const investorNetValue = netExitValue * ownershipPercentage;
    const investorReturn = investorNetValue - investmentAmount;
    const investorReturnPercentage = (investorReturn / investmentAmount) * 100;

    return {
      investor_id: inv.user_id,
      investment_id: inv.id,
      invested: investmentAmount,
      ownership: ownershipPercentage * 100,
      payout: investorNetValue,
      return: investorReturn,
      returnPercentage: investorReturnPercentage,
    };
  });

  // Build P&L statement
  const profitLoss = {
    revenue: {
      exitValue: grossExitValue,
    },
    expenses: {
      managementFees,
      expenseShock,
      total: managementFees + expenseShock,
    },
    netProfit: netExitValue - totalInvested,
  };

  return {
    summary: {
      totalInvested,
      grossExitValue,
      netExitValue,
      totalReturn,
      returnPercentage: returnPercentage.toFixed(2),
      annualizedReturn: annualizedReturn.toFixed(2),
      holdingPeriodDays: parameters.holdingPeriodDays,
      marketCondition: parameters.marketCondition,
    },
    profitLoss,
    investorReturns,
    timeline: scenario.events,
    calculatedAt: new Date(),
  };
}

export const deleteScenario = async (req, res, next) => {
  try {
    const { id } = req.params;

    const scenario = await Scenario.findByPk(id);
    if (!scenario) {
      return error(res, 'Scenario not found', 404);
    }

    await scenario.destroy();

    return success(res, null, 'Scenario deleted successfully');
  } catch (err) {
    next(err);
  }
};
