import { Asset, SPV, AuditLog } from '../models/index.js';
import { success, error } from '../utils/response.js';
import sequelize from '../config/database.js';

// Create or update asset operations
export const updateAssetOperations = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { assetId } = req.params;
    const {
      monthlyRevenue,
      monthlyExpenses,
      occupancyRate,
      operationStatus,
      currentValuation,
      metadata,
    } = req.body;

    const asset = await Asset.findByPk(assetId, { transaction: t });

    if (!asset) {
      await t.rollback();
      return error(res, 'Asset not found', 404);
    }

    // Store old values for audit
    const oldValues = {
      monthlyRevenue: asset.monthly_revenue,
      monthlyExpenses: asset.monthly_expenses,
      occupancyRate: asset.occupancy_rate,
    };

    // Update asset
    await asset.update(
      {
        ...(monthlyRevenue !== undefined && { monthly_revenue: monthlyRevenue }),
        ...(monthlyExpenses !== undefined && { monthly_expenses: monthlyExpenses }),
        ...(occupancyRate !== undefined && { occupancy_rate: occupancyRate }),
        ...(operationStatus && { operation_status: operationStatus }),
        ...(currentValuation !== undefined && { current_valuation: currentValuation }),
        ...(metadata && { metadata: { ...asset.metadata, ...metadata } }),
      },
      { transaction: t }
    );

    // Update SPV totals
    const spv = await SPV.findByPk(asset.spv_id, { transaction: t });

    if (spv) {
      // Recalculate SPV totals from all assets
      const allAssets = await Asset.findAll({
        where: { spv_id: spv.id },
        transaction: t,
      });

      const totalRevenue = allAssets.reduce(
        (sum, a) => sum + parseFloat(a.monthly_revenue || 0),
        0
      );
      const totalExpenses = allAssets.reduce(
        (sum, a) => sum + parseFloat(a.monthly_expenses || 0),
        0
      );

      await spv.update(
        {
          total_revenue: sequelize.literal(`total_revenue + ${monthlyRevenue || 0}`),
          total_expenses: sequelize.literal(`total_expenses + ${monthlyExpenses || 0}`),
        },
        { transaction: t }
      );
    }

    // Create audit log
    await AuditLog.create(
      {
        actor_id: req.user.id,
        action: 'update_operations',
        entity_type: 'asset',
        entity_id: assetId,
        delta: {
          before: oldValues,
          after: {
            monthlyRevenue,
            monthlyExpenses,
            occupancyRate,
          },
        },
      },
      { transaction: t }
    );

    await t.commit();

    return success(res, { asset }, 'Asset operations updated successfully');
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

// Record revenue entry
export const recordRevenue = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { spvId } = req.params;
    const { amount, description, date, category } = req.body;

    if (!amount || amount <= 0) {
      await t.rollback();
      return error(res, 'Invalid revenue amount', 400);
    }

    const spv = await SPV.findByPk(spvId, { transaction: t });

    if (!spv) {
      await t.rollback();
      return error(res, 'SPV not found', 404);
    }

    // Update SPV revenue and operating balance
    await spv.update(
      {
        total_revenue: parseFloat(spv.total_revenue) + parseFloat(amount),
        operating_balance: parseFloat(spv.operating_balance) + parseFloat(amount),
      },
      { transaction: t }
    );

    // Create audit log
    await AuditLog.create(
      {
        actor_id: req.user.id,
        action: 'record_revenue',
        entity_type: 'spv',
        entity_id: spvId,
        delta: {
          amount,
          description,
          date,
          category: category || 'general',
        },
      },
      { transaction: t }
    );

    await t.commit();

    return success(res, { spv }, 'Revenue recorded successfully');
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

// Record expense entry
export const recordExpense = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { spvId } = req.params;
    const { amount, description, date, category } = req.body;

    if (!amount || amount <= 0) {
      await t.rollback();
      return error(res, 'Invalid expense amount', 400);
    }

    const spv = await SPV.findByPk(spvId, { transaction: t });

    if (!spv) {
      await t.rollback();
      return error(res, 'SPV not found', 404);
    }

    // Check if sufficient balance
    if (parseFloat(spv.operating_balance) < parseFloat(amount)) {
      await t.rollback();
      return error(res, 'Insufficient SPV balance', 400);
    }

    // Update SPV expenses and operating balance
    await spv.update(
      {
        total_expenses: parseFloat(spv.total_expenses) + parseFloat(amount),
        operating_balance: parseFloat(spv.operating_balance) - parseFloat(amount),
      },
      { transaction: t }
    );

    // Create audit log
    await AuditLog.create(
      {
        actor_id: req.user.id,
        action: 'record_expense',
        entity_type: 'spv',
        entity_id: spvId,
        delta: {
          amount,
          description,
          date,
          category: category || 'general',
        },
      },
      { transaction: t }
    );

    await t.commit();

    return success(res, { spv }, 'Expense recorded successfully');
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

// Get SPV financials
export const getSPVFinancials = async (req, res, next) => {
  try {
    const { spvId } = req.params;

    const spv = await SPV.findByPk(spvId, {
      include: ['deal', 'assets', 'investments'],
    });

    if (!spv) {
      return error(res, 'SPV not found', 404);
    }

    // Get revenue/expense logs from audit trail
    const revenueEntries = await AuditLog.findAll({
      where: {
        entity_type: 'spv',
        entity_id: spvId,
        action: 'record_revenue',
      },
      order: [['created_at', 'DESC']],
      limit: 50,
    });

    const expenseEntries = await AuditLog.findAll({
      where: {
        entity_type: 'spv',
        entity_id: spvId,
        action: 'record_expense',
      },
      order: [['created_at', 'DESC']],
      limit: 50,
    });

    // Calculate metrics
    const totalInvested = spv.investments.reduce(
      (sum, inv) => sum + parseFloat(inv.amount),
      0
    );

    const netIncome = parseFloat(spv.total_revenue) - parseFloat(spv.total_expenses);
    const profitMargin = spv.total_revenue > 0 ? (netIncome / spv.total_revenue) * 100 : 0;

    const financials = {
      spv: {
        id: spv.id,
        name: spv.spv_name,
        status: spv.status,
      },
      balances: {
        operatingBalance: parseFloat(spv.operating_balance),
        escrowBalance: parseFloat(spv.escrow_balance),
        totalInvested,
      },
      performance: {
        totalRevenue: parseFloat(spv.total_revenue),
        totalExpenses: parseFloat(spv.total_expenses),
        netIncome,
        profitMargin: profitMargin.toFixed(2),
        totalDistributed: parseFloat(spv.total_distributed),
      },
      recentRevenue: revenueEntries.map((entry) => ({
        amount: entry.delta.amount,
        description: entry.delta.description,
        category: entry.delta.category,
        date: entry.delta.date || entry.created_at,
      })),
      recentExpenses: expenseEntries.map((entry) => ({
        amount: entry.delta.amount,
        description: entry.delta.description,
        category: entry.delta.category,
        date: entry.delta.date || entry.created_at,
      })),
      assets: spv.assets.map((asset) => ({
        id: asset.id,
        name: asset.name,
        type: asset.asset_type,
        monthlyRevenue: parseFloat(asset.monthly_revenue || 0),
        monthlyExpenses: parseFloat(asset.monthly_expenses || 0),
        occupancyRate: asset.occupancy_rate,
        status: asset.operation_status,
      })),
    };

    return success(res, { financials });
  } catch (err) {
    next(err);
  }
};
