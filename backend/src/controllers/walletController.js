import { Wallet, Transaction, User } from '../models/index.js';
import { success, error } from '../utils/responseHelpers.js';

/**
 * Get user's wallet balance and details
 * GET /api/wallet/balance
 */
export const getWalletBalance = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const wallet = await Wallet.findOne({
      where: { user_id: userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'role']
      }]
    });

    if (!wallet) {
      return error(res, 'Wallet not found', 404);
    }

    // Calculate available balance (balance minus pending investments)
    const pendingInvestments = await Transaction.sum('amount', {
      where: {
        user_id: userId,
        type: 'investment',
        status: 'pending'
      }
    });

    const availableBalance = parseFloat(wallet.balance_dummy) - (pendingInvestments || 0);

    return success(res, {
      wallet: {
        id: wallet.id,
        currency: wallet.currency,
        totalBalance: parseFloat(wallet.balance_dummy),
        availableBalance: availableBalance,
        pendingAmount: pendingInvestments || 0,
        ledgerEntries: wallet.ledger_entries || [],
        createdAt: wallet.created_at,
        updatedAt: wallet.updated_at
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get wallet transaction history
 * GET /api/wallet/transactions
 */
export const getWalletTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0, type } = req.query;

    const where = { user_id: userId };
    if (type) {
      where.type = type;
    }

    const transactions = await Transaction.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const total = await Transaction.count({ where });

    return success(res, {
      transactions,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + transactions.length) < total
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Add funds to wallet (SANDBOX ONLY - for testing)
 * POST /api/wallet/add-funds
 */
export const addFunds = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { amount, description = 'Funds added' } = req.body;

    if (!amount || amount <= 0) {
      return error(res, 'Invalid amount', 400);
    }

    const wallet = await Wallet.findOne({
      where: { user_id: userId }
    });

    if (!wallet) {
      return error(res, 'Wallet not found', 404);
    }

    // Update balance
    const newBalance = parseFloat(wallet.balance_dummy) + parseFloat(amount);

    // Add ledger entry
    const ledgerEntries = wallet.ledger_entries || [];
    ledgerEntries.push({
      type: 'deposit',
      amount: parseFloat(amount),
      balance: newBalance,
      description,
      timestamp: new Date().toISOString()
    });

    await wallet.update({
      balance_dummy: newBalance,
      ledger_entries: ledgerEntries
    });

    // Create transaction record
    await Transaction.create({
      user_id: userId,
      type: 'deposit',
      amount: parseFloat(amount),
      currency: wallet.currency,
      status: 'completed',
      description,
      metadata: {
        source: 'manual_add',
        previousBalance: parseFloat(wallet.balance_dummy),
        newBalance: newBalance
      }
    });

    return success(res, {
      message: 'Funds added successfully',
      wallet: {
        balance: newBalance,
        currency: wallet.currency
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Withdraw funds from wallet
 * POST /api/wallet/withdraw
 */
export const withdrawFunds = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { amount, bankAccountId, description = 'Withdrawal' } = req.body;

    if (!amount || amount <= 0) {
      return error(res, 'Invalid amount', 400);
    }

    const wallet = await Wallet.findOne({
      where: { user_id: userId }
    });

    if (!wallet) {
      return error(res, 'Wallet not found', 404);
    }

    const currentBalance = parseFloat(wallet.balance_dummy);

    if (currentBalance < amount) {
      return error(res, 'Insufficient balance', 400);
    }

    // Update balance
    const newBalance = currentBalance - parseFloat(amount);

    // Add ledger entry
    const ledgerEntries = wallet.ledger_entries || [];
    ledgerEntries.push({
      type: 'withdrawal',
      amount: -parseFloat(amount),
      balance: newBalance,
      description,
      timestamp: new Date().toISOString()
    });

    await wallet.update({
      balance_dummy: newBalance,
      ledger_entries: ledgerEntries
    });

    // Create transaction record
    const transaction = await Transaction.create({
      user_id: userId,
      type: 'withdrawal',
      amount: parseFloat(amount),
      currency: wallet.currency,
      status: 'pending', // Withdrawals start as pending
      description,
      metadata: {
        bankAccountId,
        previousBalance: currentBalance,
        newBalance: newBalance,
        requestedAt: new Date().toISOString()
      }
    });

    return success(res, {
      message: 'Withdrawal request submitted successfully',
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        status: transaction.status,
        createdAt: transaction.created_at
      },
      wallet: {
        balance: newBalance,
        currency: wallet.currency
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get wallet statistics
 * GET /api/wallet/stats
 */
export const getWalletStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const wallet = await Wallet.findOne({
      where: { user_id: userId }
    });

    if (!wallet) {
      return error(res, 'Wallet not found', 404);
    }

    // Get transaction stats
    const totalDeposits = await Transaction.sum('amount', {
      where: { user_id: userId, type: 'deposit', status: 'completed' }
    }) || 0;

    const totalWithdrawals = await Transaction.sum('amount', {
      where: { user_id: userId, type: 'withdrawal', status: 'completed' }
    }) || 0;

    const totalInvestments = await Transaction.sum('amount', {
      where: { user_id: userId, type: 'investment', status: 'completed' }
    }) || 0;

    const totalPayouts = await Transaction.sum('amount', {
      where: { user_id: userId, type: 'payout', status: 'completed' }
    }) || 0;

    const pendingWithdrawals = await Transaction.sum('amount', {
      where: { user_id: userId, type: 'withdrawal', status: 'pending' }
    }) || 0;

    return success(res, {
      stats: {
        currentBalance: parseFloat(wallet.balance_dummy),
        totalDeposits: parseFloat(totalDeposits),
        totalWithdrawals: parseFloat(totalWithdrawals),
        totalInvestments: parseFloat(totalInvestments),
        totalPayouts: parseFloat(totalPayouts),
        pendingWithdrawals: parseFloat(pendingWithdrawals),
        currency: wallet.currency
      }
    });
  } catch (err) {
    next(err);
  }
};
