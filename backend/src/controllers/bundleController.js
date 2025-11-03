import { Bundle, BundleDeal, Deal, Investment, SPV, User } from '../models/index.js';
import { success, error, paginate } from '../utils/response.js';
import { Op } from 'sequelize';

// List all bundles with filtering
export const listBundles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      bundle_type,
      category,
      risk_level,
      status,
      minInvestment,
      maxInvestment,
      search,
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Filters
    if (bundle_type) where.bundle_type = bundle_type;
    if (category) where.category = category;
    if (risk_level) where.risk_level = risk_level;
    if (status) where.status = status;
    if (minInvestment) where.min_investment = { [Op.gte]: minInvestment };
    if (maxInvestment) {
      where.min_investment = where.min_investment
        ? { ...where.min_investment, [Op.lte]: maxInvestment }
        : { [Op.lte]: maxInvestment };
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Bundle.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return paginate(res, rows, page, limit, count, 'Bundles retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// Get single bundle with full details
export const getBundle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bundle = await Bundle.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Deal,
          as: 'deals',
          through: {
            model: BundleDeal,
            attributes: ['allocation_percentage', 'allocation_amount', 'weight', 'is_core'],
          },
          include: [
            {
              model: SPV,
              as: 'spv',
              attributes: ['id', 'spv_name', 'status'],
            },
          ],
        },
        {
          model: Investment,
          as: 'investments',
          attributes: ['id', 'amount', 'user_id', 'invested_at', 'status'],
        },
      ],
    });

    if (!bundle) {
      return error(res, 'Bundle not found', 404);
    }

    return success(res, bundle, 'Bundle retrieved successfully');
  } catch (err) {
    next(err);
  }
};

// Create new bundle
export const createBundle = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      description,
      bundle_type,
      category,
      min_investment,
      target_amount,
      expected_roi_min,
      expected_roi_max,
      holding_period_months,
      risk_level,
      diversification_score,
      features,
      images,
      deals, // Array of { deal_id, allocation_percentage, weight, is_core }
    } = req.body;

    // Create bundle
    const bundle = await Bundle.create({
      name,
      slug,
      description,
      bundle_type,
      category,
      min_investment,
      target_amount,
      expected_roi_min,
      expected_roi_max,
      holding_period_months,
      risk_level,
      diversification_score,
      features,
      images,
      created_by: req.user.id,
      status: 'draft',
    });

    // Add deals to bundle if provided
    if (deals && deals.length > 0) {
      const bundleDeals = deals.map(deal => ({
        bundle_id: bundle.id,
        deal_id: deal.deal_id,
        allocation_percentage: deal.allocation_percentage,
        allocation_amount: deal.allocation_amount,
        weight: deal.weight || 1,
        is_core: deal.is_core || false,
      }));

      await BundleDeal.bulkCreate(bundleDeals);
    }

    // Fetch bundle with relationships
    const createdBundle = await Bundle.findByPk(bundle.id, {
      include: [
        {
          model: Deal,
          as: 'deals',
          through: {
            attributes: ['allocation_percentage', 'allocation_amount', 'weight', 'is_core'],
          },
        },
      ],
    });

    return success(res, createdBundle, 'Bundle created successfully', 201);
  } catch (err) {
    next(err);
  }
};

// Update bundle
export const updateBundle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const bundle = await Bundle.findByPk(id);
    if (!bundle) {
      return error(res, 'Bundle not found', 404);
    }

    await bundle.update(updates);

    return success(res, bundle, 'Bundle updated successfully');
  } catch (err) {
    next(err);
  }
};

// Publish bundle
export const publishBundle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bundle = await Bundle.findByPk(id, {
      include: [
        {
          model: Deal,
          as: 'deals',
        },
      ],
    });

    if (!bundle) {
      return error(res, 'Bundle not found', 404);
    }

    // Validate bundle has deals
    if (!bundle.deals || bundle.deals.length === 0) {
      return error(res, 'Cannot publish bundle without deals', 400);
    }

    await bundle.update({ status: 'open' });

    return success(res, bundle, 'Bundle published successfully');
  } catch (err) {
    next(err);
  }
};

// Close bundle
export const closeBundle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bundle = await Bundle.findByPk(id);
    if (!bundle) {
      return error(res, 'Bundle not found', 404);
    }

    await bundle.update({ status: 'closed' });

    return success(res, bundle, 'Bundle closed successfully');
  } catch (err) {
    next(err);
  }
};

// Invest in bundle
export const investInBundle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const userId = req.user.id;

    const bundle = await Bundle.findByPk(id, {
      include: [
        {
          model: Deal,
          as: 'deals',
          through: {
            attributes: ['allocation_percentage', 'allocation_amount'],
          },
          include: [
            {
              model: SPV,
              as: 'spv',
            },
          ],
        },
      ],
    });

    if (!bundle) {
      return error(res, 'Bundle not found', 404);
    }

    if (bundle.status !== 'open') {
      return error(res, 'Bundle is not open for investment', 400);
    }

    if (amount < bundle.min_investment) {
      return error(res, `Minimum investment is ${bundle.min_investment}`, 400);
    }

    // Create investments for each deal based on allocation
    const investments = [];

    for (const deal of bundle.deals) {
      const allocation = deal.BundleDeal.allocation_percentage / 100;
      const dealAmount = amount * allocation;

      if (dealAmount > 0) {
        // Create SPV for deal if it doesn't have one
        let spvId = deal.spv ? deal.spv.id : null;

        if (!spvId) {
          // Calculate total shares based on target amount and share price
          const dealSharePrice = deal.share_price || 1;
          const totalShares = Math.floor(parseFloat(deal.target_amount || 0) / dealSharePrice);

          // Generate SPV code manually
          const year = new Date().getFullYear();
          const latestSPV = await SPV.findOne({
            where: {
              spv_code: {
                [Op.like]: `SPV-${year}-%`
              }
            },
            order: [['created_at', 'DESC']]
          });

          let sequence = 1;
          if (latestSPV && latestSPV.spv_code) {
            const match = latestSPV.spv_code.match(/SPV-\d{4}-(\d{4})/);
            if (match) {
              sequence = parseInt(match[1]) + 1;
            }
          }

          const spvCode = `SPV-${year}-${String(sequence).padStart(4, '0')}`;

          const newSpv = await SPV.create({
            deal_id: deal.id,
            spv_name: `${deal.title} SPV`,
            spv_code: spvCode,
            total_shares: totalShares,
            share_price: dealSharePrice,
            status: 'created',
            escrow_balance: 0,
            operating_balance: 0,
          });
          spvId = newSpv.id;
        }

        const sharePrice = deal.share_price || 1;
        const sharesIssued = Math.floor(dealAmount / sharePrice);

        const investment = await Investment.create({
          user_id: userId,
          deal_id: deal.id,
          spv_id: spvId,
          bundle_id: bundle.id,
          amount: dealAmount,
          shares_issued: sharesIssued,
          share_price: sharePrice,
          status: 'pending',
        });

        investments.push(investment);
      }
    }

    // Update bundle raised amount
    await bundle.update({
      raised_amount: parseFloat(bundle.raised_amount) + parseFloat(amount),
    });

    return success(
      res,
      {
        bundle,
        investments,
        total_amount: amount,
      },
      'Investment in bundle created successfully',
      201
    );
  } catch (err) {
    next(err);
  }
};

// Get bundles by category
export const getBundlesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const bundles = await Bundle.findAll({
      where: {
        category,
        status: 'open',
      },
      include: [
        {
          model: Deal,
          as: 'deals',
          through: {
            attributes: ['allocation_percentage'],
          },
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return success(res, bundles, `${category} bundles retrieved successfully`);
  } catch (err) {
    next(err);
  }
};
