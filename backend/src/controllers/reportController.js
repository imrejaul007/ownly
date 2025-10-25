import sequelize from '../config/database.js';
import { Report, Investment, Deal, Payout, Transaction, SPV } from '../models/index.js';
import { successResponse, errorResponse } from "../utils/response.js";
import { Op } from 'sequelize';

/**
 * Get user's reports
 */
export const getReports = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reportType, status, limit = 20, offset = 0 } = req.query;

    const where = { user_id: userId };

    if (reportType) where.report_type = reportType;
    if (status) where.status = status;

    const reports = await Report.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const total = await Report.count({ where });

    successResponse(res, {
      reports,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get specific report details
 */
export const getReportDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reportId } = req.params;

    const report = await Report.findOne({
      where: {
        id: reportId,
        user_id: userId,
      },
    });

    if (!report) {
      return errorResponse(res, 'Report not found', 404);
    }

    successResponse(res, { report });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate new report
 */
export const generateReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reportType, title, description, periodStart, periodEnd, format, filters } =
      req.body;

    // Create report record
    const report = await Report.create({
      user_id: userId,
      report_type: reportType,
      title: title || `${reportType} Report`,
      description,
      period_start: periodStart || null,
      period_end: periodEnd || null,
      status: 'generating',
      format: format || 'json',
      filters: filters || {},
    });

    // Generate report data asynchronously
    setImmediate(async () => {
      try {
        const data = await generateReportData(userId, reportType, periodStart, periodEnd, filters);

        await report.update({
          status: 'completed',
          data,
          generated_at: new Date(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });
      } catch (error) {
        console.error('Error generating report:', error);
        await report.update({
          status: 'failed',
          metadata: { error: error.message },
        });
      }
    });

    successResponse(res, { report, message: 'Report generation started' }, 202);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete report
 */
export const deleteReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reportId } = req.params;

    const report = await Report.findOne({
      where: {
        id: reportId,
        user_id: userId,
      },
    });

    if (!report) {
      return errorResponse(res, 'Report not found', 404);
    }

    await report.destroy();

    successResponse(res, { message: 'Report deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Download report
 */
export const downloadReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reportId } = req.params;

    const report = await Report.findOne({
      where: {
        id: reportId,
        user_id: userId,
      },
    });

    if (!report) {
      return errorResponse(res, 'Report not found', 404);
    }

    if (report.status !== 'completed') {
      return errorResponse(res, 'Report is not ready for download', 400);
    }

    // In sandbox mode, return data directly
    successResponse(res, {
      report: {
        id: report.id,
        title: report.title,
        type: report.report_type,
        generated_at: report.generated_at,
        format: report.format,
        data: report.data,
      },
      message: 'Report ready for download (sandbox mode)',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get available report templates
 */
export const getTemplates = async (req, res, next) => {
  try {
    const templates = [
      {
        type: 'portfolio_summary',
        name: 'Portfolio Summary',
        description: 'Overview of all investments, current value, and returns',
        parameters: ['periodStart', 'periodEnd'],
      },
      {
        type: 'investment_performance',
        name: 'Investment Performance',
        description: 'Detailed performance analysis by investment',
        parameters: ['periodStart', 'periodEnd', 'dealId'],
      },
      {
        type: 'tax_summary',
        name: 'Tax Summary',
        description: 'Annual tax reporting data (1099-style)',
        parameters: ['year'],
      },
      {
        type: 'transaction_history',
        name: 'Transaction History',
        description: 'All transactions in specified period',
        parameters: ['periodStart', 'periodEnd', 'transactionType'],
      },
      {
        type: 'payout_history',
        name: 'Payout History',
        description: 'All payouts received',
        parameters: ['periodStart', 'periodEnd'],
      },
      {
        type: 'deal_performance',
        name: 'Deal Performance',
        description: 'Performance metrics for specific deals',
        parameters: ['dealId', 'periodStart', 'periodEnd'],
      },
    ];

    successResponse(res, { templates });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to generate report data based on type
 */
async function generateReportData(userId, reportType, periodStart, periodEnd, filters) {
  const startDate = periodStart ? new Date(periodStart) : null;
  const endDate = periodEnd ? new Date(periodEnd) : null;

  switch (reportType) {
    case 'portfolio_summary':
      return await generatePortfolioSummary(userId, startDate, endDate);

    case 'investment_performance':
      return await generateInvestmentPerformance(userId, startDate, endDate, filters);

    case 'tax_summary':
      return await generateTaxSummary(userId, filters?.year);

    case 'transaction_history':
      return await generateTransactionHistory(userId, startDate, endDate, filters);

    case 'payout_history':
      return await generatePayoutHistory(userId, startDate, endDate);

    case 'deal_performance':
      return await generateDealPerformance(userId, startDate, endDate, filters);

    default:
      throw new Error('Unknown report type');
  }
}

async function generatePortfolioSummary(userId, startDate, endDate) {
  const where = { user_id: userId };
  if (startDate || endDate) {
    where.invested_at = {};
    if (startDate) where.invested_at[Op.gte] = startDate;
    if (endDate) where.invested_at[Op.lte] = endDate;
  }

  const investments = await Investment.findAll({
    where,
    include: [
      {
        model: Deal,
        as: 'deal',
        attributes: ['id', 'title', 'type'],
      },
    ],
  });

  const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
  const totalCurrentValue = investments.reduce(
    (sum, inv) => sum + parseFloat(inv.current_value || inv.amount),
    0
  );
  const totalPayouts = investments.reduce(
    (sum, inv) => sum + parseFloat(inv.total_payouts_received || 0),
    0
  );
  const totalReturn = totalCurrentValue + totalPayouts - totalInvested;
  const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

  return {
    summary: {
      totalInvestments: investments.length,
      totalInvested,
      totalCurrentValue,
      totalPayouts,
      totalReturn,
      returnPercentage: returnPercentage.toFixed(2),
    },
    investments: investments.map((inv) => ({
      dealTitle: inv.deal?.title,
      dealType: inv.deal?.type,
      invested: parseFloat(inv.amount),
      currentValue: parseFloat(inv.current_value || inv.amount),
      payoutsReceived: parseFloat(inv.total_payouts_received || 0),
      investedAt: inv.invested_at,
    })),
    generatedAt: new Date(),
  };
}

async function generateInvestmentPerformance(userId, startDate, endDate, filters) {
  const where = { user_id: userId };
  if (filters?.dealId) where.deal_id = filters.dealId;
  if (startDate || endDate) {
    where.invested_at = {};
    if (startDate) where.invested_at[Op.gte] = startDate;
    if (endDate) where.invested_at[Op.lte] = endDate;
  }

  const investments = await Investment.findAll({
    where,
    include: [
      {
        model: Deal,
        as: 'deal',
      },
    ],
  });

  return {
    investments: investments.map((inv) => {
      const invested = parseFloat(inv.amount);
      const currentValue = parseFloat(inv.current_value || inv.amount);
      const payouts = parseFloat(inv.total_payouts_received || 0);
      const totalReturn = currentValue + payouts - invested;
      const returnPercentage = invested > 0 ? (totalReturn / invested) * 100 : 0;

      return {
        investmentId: inv.id,
        deal: {
          title: inv.deal?.title,
          type: inv.deal?.type,
          status: inv.deal?.status,
        },
        invested,
        currentValue,
        payoutsReceived: payouts,
        totalReturn,
        returnPercentage: returnPercentage.toFixed(2),
        investedAt: inv.invested_at,
        sharesIssued: inv.shares_issued,
      };
    }),
    generatedAt: new Date(),
  };
}

async function generateTaxSummary(userId, year) {
  const targetYear = year || new Date().getFullYear();
  const startDate = new Date(`${targetYear}-01-01`);
  const endDate = new Date(`${targetYear}-12-31`);

  const investments = await Investment.findAll({
    where: {
      user_id: userId,
      invested_at: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
    include: [{ model: Deal, as: 'deal' }],
  });

  const transactions = await Transaction.findAll({
    where: {
      user_id: userId,
      created_at: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
  });

  const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
  const totalPayouts = investments.reduce(
    (sum, inv) => sum + parseFloat(inv.total_payouts_received || 0),
    0
  );

  return {
    year: targetYear,
    summary: {
      totalInvested,
      totalPayouts,
      totalTransactions: transactions.length,
    },
    investments: investments.map((inv) => ({
      dealTitle: inv.deal?.title,
      amount: parseFloat(inv.amount),
      date: inv.invested_at,
    })),
    transactions: transactions.map((txn) => ({
      type: txn.type,
      amount: parseFloat(txn.amount),
      date: txn.created_at,
    })),
    generatedAt: new Date(),
    disclaimer: 'This is for informational purposes only. Consult a tax professional.',
  };
}

async function generateTransactionHistory(userId, startDate, endDate, filters) {
  const where = { user_id: userId };

  if (filters?.transactionType) where.type = filters.transactionType;

  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at[Op.gte] = startDate;
    if (endDate) where.created_at[Op.lte] = endDate;
  }

  const transactions = await Transaction.findAll({
    where,
    order: [['created_at', 'DESC']],
  });

  return {
    transactions: transactions.map((txn) => ({
      id: txn.id,
      type: txn.type,
      amount: parseFloat(txn.amount),
      description: txn.description,
      date: txn.created_at,
      referenceType: txn.reference_type,
      referenceId: txn.reference_id,
    })),
    summary: {
      totalTransactions: transactions.length,
      totalCredits: transactions
        .filter((t) => parseFloat(t.amount) > 0)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0),
      totalDebits: transactions
        .filter((t) => parseFloat(t.amount) < 0)
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0),
    },
    generatedAt: new Date(),
  };
}

async function generatePayoutHistory(userId, startDate, endDate) {
  const investments = await Investment.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Deal,
        as: 'deal',
        attributes: ['id', 'title'],
      },
    ],
  });

  return {
    payoutHistory: investments.map((inv) => ({
      dealTitle: inv.deal?.title,
      totalPayoutsReceived: parseFloat(inv.total_payouts_received || 0),
      invested: parseFloat(inv.amount),
    })),
    summary: {
      totalPayouts: investments.reduce(
        (sum, inv) => sum + parseFloat(inv.total_payouts_received || 0),
        0
      ),
    },
    generatedAt: new Date(),
  };
}

async function generateDealPerformance(userId, startDate, endDate, filters) {
  const where = {};
  if (filters?.dealId) where.id = filters.dealId;
  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) where.created_at[Op.gte] = startDate;
    if (endDate) where.created_at[Op.lte] = endDate;
  }

  const deals = await Deal.findAll({
    where,
    include: [
      {
        model: Investment,
        as: 'investments',
        where: { user_id: userId },
      },
    ],
  });

  return {
    deals: deals.map((deal) => {
      const totalInvested = deal.investments.reduce(
        (sum, inv) => sum + parseFloat(inv.amount),
        0
      );
      const totalCurrent = deal.investments.reduce(
        (sum, inv) => sum + parseFloat(inv.current_value || inv.amount),
        0
      );

      return {
        dealId: deal.id,
        dealTitle: deal.title,
        dealType: deal.type,
        status: deal.status,
        totalInvested,
        currentValue: totalCurrent,
        return: totalCurrent - totalInvested,
      };
    }),
    generatedAt: new Date(),
  };
}

export default {
  getReports,
  getReportDetails,
  generateReport,
  deleteReport,
  downloadReport,
  getTemplates,
};
