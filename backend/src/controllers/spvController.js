import { SPV, Deal, Investment, Asset, Payout, User } from '../models/index.js';
import { success, error } from '../utils/response.js';
import { generateSPV } from '../utils/dataGenerator.js';

export const createSPVForDeal = async (req, res, next) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findByPk(dealId);
    if (!deal) {
      return error(res, 'Deal not found', 404);
    }

    // Check if SPV already exists
    const existingSPV = await SPV.findOne({ where: { deal_id: dealId } });
    if (existingSPV) {
      return error(res, 'SPV already exists for this deal', 409);
    }

    // Generate SPV data
    const spvData = generateSPV(dealId, deal);

    const spv = await SPV.create(spvData);

    return success(res, { spv }, 'SPV created successfully', 201);

  } catch (err) {
    next(err);
  }
};

export const getSPV = async (req, res, next) => {
  try {
    const { id } = req.params;

    const spv = await SPV.findByPk(id, {
      include: [
        {
          model: Deal,
          as: 'deal',
        },
        {
          model: Investment,
          as: 'investments',
          include: [
            {
              model: User,
              as: 'investor',
              attributes: ['id', 'name', 'avatar'],
            },
          ],
        },
        {
          model: Asset,
          as: 'assets',
        },
        {
          model: Payout,
          as: 'payouts',
          order: [['payout_date', 'DESC']],
        },
      ],
    });

    if (!spv) {
      return error(res, 'SPV not found', 404);
    }

    return success(res, { spv });

  } catch (err) {
    next(err);
  }
};

export const getSPVCapTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const spv = await SPV.findByPk(id, {
      include: [
        {
          model: Investment,
          as: 'investments',
          include: [
            {
              model: User,
              as: 'investor',
              attributes: ['id', 'name', 'email', 'avatar'],
            },
          ],
        },
      ],
    });

    if (!spv) {
      return error(res, 'SPV not found', 404);
    }

    // Build cap table
    const capTable = spv.investments.map(inv => ({
      investor: inv.investor,
      shares: inv.shares_issued,
      amount: inv.amount,
      percentage: ((inv.shares_issued / spv.total_shares) * 100).toFixed(2),
      investedAt: inv.invested_at,
    }));

    // Sort by shares descending
    capTable.sort((a, b) => b.shares - a.shares);

    return success(res, {
      spv: {
        id: spv.id,
        spv_name: spv.spv_name,
        total_shares: spv.total_shares,
        issued_shares: spv.issued_shares,
        available_shares: spv.total_shares - spv.issued_shares,
      },
      capTable,
      summary: {
        totalInvestors: capTable.length,
        totalRaised: capTable.reduce((sum, item) => sum + parseFloat(item.amount), 0),
        percentageAllocated: ((spv.issued_shares / spv.total_shares) * 100).toFixed(2),
      },
    });

  } catch (err) {
    next(err);
  }
};

export const updateSPV = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const spv = await SPV.findByPk(id);
    if (!spv) {
      return error(res, 'SPV not found', 404);
    }

    await spv.update(updates);

    return success(res, { spv }, 'SPV updated successfully');

  } catch (err) {
    next(err);
  }
};
