import sequelize from '../config/database.js';
import { Asset, SPV, Deal, Transaction } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Property Rent/Expense Record Model (stored in Asset.metadata)
 */

/**
 * Get all properties with their rental/operational data
 */
export const getProperties = async (req, res, next) => {
  try {
    const { spvId, assetType, operationStatus } = req.query;

    const where = {};
    if (spvId) where.spv_id = spvId;
    if (assetType) where.asset_type = assetType;
    if (operationStatus) where.operation_status = operationStatus;

    const properties = await Asset.findAll({
      where,
      include: [
        {
          model: SPV,
          as: 'spv',
          include: [{ model: Deal, as: 'deal' }],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    // Calculate financial summaries
    const propertiesWithSummary = properties.map((property) => {
      const rentRecords = property.metadata?.rent_records || [];
      const expenseRecords = property.metadata?.expense_records || [];

      const totalRentCollected = rentRecords.reduce(
        (sum, record) => sum + parseFloat(record.amount || 0),
        0
      );

      const totalExpenses = expenseRecords.reduce(
        (sum, record) => sum + parseFloat(record.amount || 0),
        0
      );

      const netIncome = totalRentCollected - totalExpenses;

      return {
        ...property.toJSON(),
        summary: {
          totalRentCollected,
          totalExpenses,
          netIncome,
          rentRecordCount: rentRecords.length,
          expenseRecordCount: expenseRecords.length,
        },
      };
    });

    successResponse(res, {
      properties: propertiesWithSummary,
      count: propertiesWithSummary.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get property details with full rent/expense history
 */
export const getPropertyDetails = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const property = await Asset.findByPk(propertyId, {
      include: [
        {
          model: SPV,
          as: 'spv',
          include: [{ model: Deal, as: 'deal' }],
        },
      ],
    });

    if (!property) {
      return errorResponse(res, 'Property not found', 404);
    }

    const rentRecords = property.metadata?.rent_records || [];
    const expenseRecords = property.metadata?.expense_records || [];

    // Calculate financial summary
    const totalRentCollected = rentRecords.reduce(
      (sum, record) => sum + parseFloat(record.amount || 0),
      0
    );

    const totalExpenses = expenseRecords.reduce(
      (sum, record) => sum + parseFloat(record.amount || 0),
      0
    );

    const netIncome = totalRentCollected - totalExpenses;

    // Monthly breakdown
    const monthlyBreakdown = {};

    rentRecords.forEach((record) => {
      const monthKey = record.date.substring(0, 7); // YYYY-MM
      if (!monthlyBreakdown[monthKey]) {
        monthlyBreakdown[monthKey] = { rent: 0, expenses: 0, net: 0 };
      }
      monthlyBreakdown[monthKey].rent += parseFloat(record.amount || 0);
    });

    expenseRecords.forEach((record) => {
      const monthKey = record.date.substring(0, 7); // YYYY-MM
      if (!monthlyBreakdown[monthKey]) {
        monthlyBreakdown[monthKey] = { rent: 0, expenses: 0, net: 0 };
      }
      monthlyBreakdown[monthKey].expenses += parseFloat(record.amount || 0);
    });

    Object.keys(monthlyBreakdown).forEach((month) => {
      monthlyBreakdown[month].net =
        monthlyBreakdown[month].rent - monthlyBreakdown[month].expenses;
    });

    successResponse(res, {
      property: property.toJSON(),
      financials: {
        totalRentCollected,
        totalExpenses,
        netIncome,
        monthlyBreakdown,
      },
      rentRecords,
      expenseRecords,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Record rental income
 */
export const recordRent = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { propertyId } = req.params;
    const { amount, date, tenantName, description, paymentMethod } = req.body;

    const property = await Asset.findByPk(propertyId, { transaction: t });

    if (!property) {
      await t.rollback();
      return errorResponse(res, 'Property not found', 404);
    }

    // Create rent record
    const rentRecord = {
      id: `rent_${Date.now()}`,
      amount: parseFloat(amount),
      date: date || new Date().toISOString().split('T')[0],
      tenantName: tenantName || 'N/A',
      description: description || 'Monthly rent payment',
      paymentMethod: paymentMethod || 'bank_transfer',
      recordedAt: new Date().toISOString(),
      recordedBy: req.user.id,
    };

    // Update property metadata
    const metadata = property.metadata || {};
    const rentRecords = metadata.rent_records || [];
    rentRecords.push(rentRecord);

    await property.update(
      {
        metadata: {
          ...metadata,
          rent_records: rentRecords,
        },
      },
      { transaction: t }
    );

    // Create transaction record
    await Transaction.create(
      {
        user_id: req.user.id,
        type: 'rental_income',
        amount: parseFloat(amount),
        description: `Rent payment received: ${property.name}`,
        reference_type: 'asset',
        reference_id: property.id,
        metadata: { rentRecord },
      },
      { transaction: t }
    );

    await t.commit();

    successResponse(res, { rentRecord, property }, 'Rent recorded successfully', 201);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * Record property expense
 */
export const recordExpense = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { propertyId } = req.params;
    const { amount, date, category, vendor, description, paymentMethod } = req.body;

    const property = await Asset.findByPk(propertyId, { transaction: t });

    if (!property) {
      await t.rollback();
      return errorResponse(res, 'Property not found', 404);
    }

    // Create expense record
    const expenseRecord = {
      id: `expense_${Date.now()}`,
      amount: parseFloat(amount),
      date: date || new Date().toISOString().split('T')[0],
      category: category || 'maintenance',
      vendor: vendor || 'N/A',
      description: description || 'Property expense',
      paymentMethod: paymentMethod || 'bank_transfer',
      recordedAt: new Date().toISOString(),
      recordedBy: req.user.id,
    };

    // Update property metadata
    const metadata = property.metadata || {};
    const expenseRecords = metadata.expense_records || [];
    expenseRecords.push(expenseRecord);

    await property.update(
      {
        metadata: {
          ...metadata,
          expense_records: expenseRecords,
        },
      },
      { transaction: t }
    );

    // Create transaction record
    await Transaction.create(
      {
        user_id: req.user.id,
        type: 'expense',
        amount: -parseFloat(amount),
        description: `Property expense: ${property.name} - ${category}`,
        reference_type: 'asset',
        reference_id: property.id,
        metadata: { expenseRecord },
      },
      { transaction: t }
    );

    await t.commit();

    successResponse(res, { expenseRecord, property }, 'Expense recorded successfully', 201);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * Update property occupancy rate
 */
export const updateOccupancy = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { occupancyRate } = req.body;

    const property = await Asset.findByPk(propertyId);

    if (!property) {
      return errorResponse(res, 'Property not found', 404);
    }

    await property.update({
      occupancy_rate: parseFloat(occupancyRate),
    });

    successResponse(res, { property }, 'Occupancy rate updated');
  } catch (error) {
    next(error);
  }
};

/**
 * Update property valuation
 */
export const updateValuation = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { currentValuation, notes } = req.body;

    const property = await Asset.findByPk(propertyId);

    if (!property) {
      return errorResponse(res, 'Property not found', 404);
    }

    // Store valuation history
    const metadata = property.metadata || {};
    const valuationHistory = metadata.valuation_history || [];

    valuationHistory.push({
      date: new Date().toISOString(),
      valuation: parseFloat(currentValuation),
      notes: notes || '',
      updatedBy: req.user.id,
    });

    await property.update({
      current_valuation: parseFloat(currentValuation),
      metadata: {
        ...metadata,
        valuation_history: valuationHistory,
      },
    });

    successResponse(res, { property }, 'Valuation updated');
  } catch (error) {
    next(error);
  }
};

/**
 * Get property financial reports
 */
export const getPropertyReport = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { startDate, endDate } = req.query;

    const property = await Asset.findByPk(propertyId, {
      include: [
        {
          model: SPV,
          as: 'spv',
          include: [{ model: Deal, as: 'deal' }],
        },
      ],
    });

    if (!property) {
      return errorResponse(res, 'Property not found', 404);
    }

    let rentRecords = property.metadata?.rent_records || [];
    let expenseRecords = property.metadata?.expense_records || [];

    // Filter by date range if provided
    if (startDate) {
      rentRecords = rentRecords.filter((r) => r.date >= startDate);
      expenseRecords = expenseRecords.filter((e) => e.date >= startDate);
    }
    if (endDate) {
      rentRecords = rentRecords.filter((r) => r.date <= endDate);
      expenseRecords = expenseRecords.filter((e) => e.date <= endDate);
    }

    // Calculate totals
    const totalRent = rentRecords.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
    const totalExpenses = expenseRecords.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const netIncome = totalRent - totalExpenses;

    // Group expenses by category
    const expensesByCategory = {};
    expenseRecords.forEach((expense) => {
      const cat = expense.category || 'other';
      if (!expensesByCategory[cat]) {
        expensesByCategory[cat] = 0;
      }
      expensesByCategory[cat] += parseFloat(expense.amount || 0);
    });

    // Calculate ROI
    const acquisitionCost = parseFloat(property.acquisition_cost || 0);
    const roi = acquisitionCost > 0 ? ((netIncome / acquisitionCost) * 100).toFixed(2) : 0;

    successResponse(res, {
      property: {
        id: property.id,
        name: property.name,
        address: property.address,
        assetType: property.asset_type,
      },
      reportPeriod: { startDate, endDate },
      summary: {
        totalRent,
        totalExpenses,
        netIncome,
        roi: parseFloat(roi),
        occupancyRate: parseFloat(property.occupancy_rate || 0),
      },
      rentRecords,
      expenseRecords,
      expensesByCategory,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete rent/expense record
 */
export const deleteRecord = async (req, res, next) => {
  try {
    const { propertyId, recordId } = req.params;
    const { recordType } = req.query; // 'rent' or 'expense'

    const property = await Asset.findByPk(propertyId);

    if (!property) {
      return errorResponse(res, 'Property not found', 404);
    }

    const metadata = property.metadata || {};

    if (recordType === 'rent') {
      const rentRecords = metadata.rent_records || [];
      const filteredRecords = rentRecords.filter((r) => r.id !== recordId);

      await property.update({
        metadata: {
          ...metadata,
          rent_records: filteredRecords,
        },
      });
    } else if (recordType === 'expense') {
      const expenseRecords = metadata.expense_records || [];
      const filteredRecords = expenseRecords.filter((e) => e.id !== recordId);

      await property.update({
        metadata: {
          ...metadata,
          expense_records: filteredRecords,
        },
      });
    } else {
      return errorResponse(res, 'Invalid record type', 400);
    }

    successResponse(res, null, 'Record deleted successfully');
  } catch (error) {
    next(error);
  }
};
