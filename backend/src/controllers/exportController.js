import { Investment, Transaction, Deal, SPV, User } from '../models/index.js';
import { success, error } from '../utils/response.js';
import { Op } from 'sequelize';

// Helper to convert to CSV
function convertToCSV(data, headers) {
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      // Escape commas and quotes
      const escaped = ('' + value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

export const exportPortfolio = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.id;

    const investments = await Investment.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Deal,
          as: 'deal',
          attributes: ['title', 'type', 'location'],
        },
        {
          model: SPV,
          as: 'spv',
          attributes: ['spv_name'],
        },
      ],
      order: [['invested_at', 'DESC']],
    });

    // Prepare data for CSV
    const csvData = investments.map((inv) => ({
      deal_title: inv.deal?.title || 'N/A',
      deal_type: inv.deal?.type || 'N/A',
      location: inv.deal?.location || 'N/A',
      spv_name: inv.spv?.spv_name || 'N/A',
      amount: inv.amount,
      shares: inv.shares_issued,
      share_price: inv.share_price,
      invested_at: inv.invested_at,
      status: inv.status,
      current_value: inv.current_value || inv.amount,
      total_payouts: inv.total_payouts_received,
      return_amount: (parseFloat(inv.current_value || inv.amount) + parseFloat(inv.total_payouts_received)) - parseFloat(inv.amount),
      return_percentage: (((parseFloat(inv.current_value || inv.amount) + parseFloat(inv.total_payouts_received)) - parseFloat(inv.amount)) / parseFloat(inv.amount) * 100).toFixed(2),
    }));

    const headers = [
      'deal_title',
      'deal_type',
      'location',
      'spv_name',
      'amount',
      'shares',
      'share_price',
      'invested_at',
      'status',
      'current_value',
      'total_payouts',
      'return_amount',
      'return_percentage',
    ];

    const csv = convertToCSV(csvData, headers);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=portfolio-${userId}-${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

export const exportTransactions = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.id;
    const { startDate, endDate } = req.query;

    const where = { user_id: userId };

    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) where.created_at[Op.gte] = new Date(startDate);
      if (endDate) where.created_at[Op.lte] = new Date(endDate);
    }

    const transactions = await Transaction.findAll({
      where,
      order: [['created_at', 'DESC']],
    });

    const csvData = transactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: t.amount,
      currency: t.currency,
      status: t.status,
      description: t.description || '',
      reference_type: t.reference_type || '',
      reference_id: t.reference_id || '',
      balance_before: t.balance_before || 0,
      balance_after: t.balance_after || 0,
      created_at: t.created_at,
      completed_at: t.completed_at || '',
    }));

    const headers = [
      'id',
      'type',
      'amount',
      'currency',
      'status',
      'description',
      'reference_type',
      'reference_id',
      'balance_before',
      'balance_after',
      'created_at',
      'completed_at',
    ];

    const csv = convertToCSV(csvData, headers);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=transactions-${userId}-${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

export const exportDeals = async (req, res, next) => {
  try {
    const { type, status } = req.query;
    const where = {};

    if (type) where.type = type;
    if (status) where.status = status;

    const deals = await Deal.findAll({
      where,
      include: [
        {
          model: SPV,
          as: 'spv',
          attributes: ['spv_name', 'status', 'total_distributed'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    const csvData = deals.map((d) => ({
      id: d.id,
      title: d.title,
      type: d.type,
      location: d.location || '',
      jurisdiction: d.jurisdiction || '',
      target_amount: d.target_amount,
      raised_amount: d.raised_amount,
      min_ticket: d.min_ticket,
      investor_count: d.investor_count,
      expected_roi: d.expected_roi || 0,
      holding_period: d.holding_period_months || 0,
      status: d.status,
      spv_name: d.spv?.spv_name || '',
      spv_status: d.spv?.status || '',
      total_distributed: d.spv?.total_distributed || 0,
      funding_percentage: ((d.raised_amount / d.target_amount) * 100).toFixed(2),
      open_date: d.open_date || '',
      close_date: d.close_date || '',
      created_at: d.created_at,
    }));

    const headers = [
      'id',
      'title',
      'type',
      'location',
      'jurisdiction',
      'target_amount',
      'raised_amount',
      'funding_percentage',
      'min_ticket',
      'investor_count',
      'expected_roi',
      'holding_period',
      'status',
      'spv_name',
      'spv_status',
      'total_distributed',
      'open_date',
      'close_date',
      'created_at',
    ];

    const csv = convertToCSV(csvData, headers);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=deals-${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

export const exportInvestors = async (req, res, next) => {
  try {
    const investors = await User.findAll({
      where: {
        role: { [Op.in]: ['investor_retail', 'investor_hni', 'investor_institutional'] },
      },
      include: [
        {
          model: Investment,
          as: 'investments',
          attributes: ['amount', 'invested_at'],
        },
        {
          model: Wallet,
          as: 'wallet',
          attributes: ['balance_dummy'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    const csvData = investors.map((u) => {
      const totalInvested = u.investments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
      const investmentCount = u.investments.length;
      const avgInvestment = investmentCount > 0 ? totalInvested / investmentCount : 0;

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || '',
        role: u.role,
        kyc_status: u.kyc_status,
        country: u.country || '',
        city: u.city || '',
        wallet_balance: u.wallet?.balance_dummy || 0,
        total_invested: totalInvested.toFixed(2),
        investment_count: investmentCount,
        avg_investment: avgInvestment.toFixed(2),
        is_active: u.is_active,
        last_login: u.last_login || '',
        created_at: u.created_at,
      };
    });

    const headers = [
      'id',
      'name',
      'email',
      'phone',
      'role',
      'kyc_status',
      'country',
      'city',
      'wallet_balance',
      'total_invested',
      'investment_count',
      'avg_investment',
      'is_active',
      'last_login',
      'created_at',
    ];

    const csv = convertToCSV(csvData, headers);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=investors-${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
