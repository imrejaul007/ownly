'use client';

import { useState, useEffect } from 'react';
import { walletAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

interface WalletData {
  id: string;
  currency: string;
  totalBalance: number;
  availableBalance: number;
  pendingAmount: number;
  ledgerEntries: any[];
  createdAt: string;
  updatedAt: string;
}

interface WalletStats {
  currentBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvestments: number;
  totalPayouts: number;
  pendingWithdrawals: number;
  currency: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  created_at: string;
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [balanceRes, statsRes, transactionsRes] = await Promise.all([
        walletAPI.getBalance(),
        walletAPI.getStats(),
        walletAPI.getTransactions({ limit: 50 })
      ]);

      setWallet(balanceRes.data.data.wallet);
      setStats(statsRes.data.data.stats);
      setTransactions(transactionsRes.data.data.transactions);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async () => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      setProcessing(true);
      await walletAPI.addFunds({
        amount: parseFloat(addAmount),
        description: 'Sandbox funds added'
      });

      alert(`✅ Successfully added ${formatCurrency(parseFloat(addAmount))} to your wallet!`);
      setShowAddFunds(false);
      setAddAmount('');
      fetchWalletData();
    } catch (error: any) {
      alert(`❌ ${error.response?.data?.message || 'Failed to add funds'}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (wallet && parseFloat(withdrawAmount) > wallet.availableBalance) {
      alert('Insufficient balance');
      return;
    }

    try {
      setProcessing(true);
      await walletAPI.withdraw({
        amount: parseFloat(withdrawAmount),
        description: 'Withdrawal request'
      });

      alert(`✅ Withdrawal request submitted for ${formatCurrency(parseFloat(withdrawAmount))}!\n\nYour funds will be processed shortly.`);
      setShowWithdraw(false);
      setWithdrawAmount('');
      fetchWalletData();
    } catch (error: any) {
      alert(`❌ ${error.response?.data?.message || 'Withdrawal failed'}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          My Wallet
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your funds and track transactions
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-600 dark:text-green-300">Available Balance</span>
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {wallet ? formatCurrency(wallet.availableBalance) : '$0'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {wallet?.currency || 'USD'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600 dark:text-blue-300">Total Balance</span>
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {wallet ? formatCurrency(wallet.totalBalance) : '$0'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Includes pending
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-yellow-600 dark:text-yellow-300">Pending Amount</span>
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {wallet ? formatCurrency(wallet.pendingAmount) : '$0'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            In progress
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setShowAddFunds(true)}
          className="btn-primary"
        >
          💰 Add Funds (Sandbox)
        </button>
        <button
          onClick={() => setShowWithdraw(true)}
          className="btn-secondary"
        >
          💸 Withdraw Funds
        </button>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Wallet Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Deposits</div>
              <div className="text-xl font-bold text-green-600">
                {formatCurrency(stats.totalDeposits)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Withdrawals</div>
              <div className="text-xl font-bold text-red-600">
                {formatCurrency(stats.totalWithdrawals)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Investments</div>
              <div className="text-xl font-bold text-blue-600">
                {formatCurrency(stats.totalInvestments)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Payouts Received</div>
              <div className="text-xl font-bold text-purple-600">
                {formatCurrency(stats.totalPayouts)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Pending Withdrawals</div>
              <div className="text-xl font-bold text-orange-600">
                {formatCurrency(stats.pendingWithdrawals)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Recent Transactions</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge badge-${
                        transaction.type === 'deposit' ? 'green' :
                        transaction.type === 'withdrawal' ? 'red' :
                        transaction.type === 'investment' ? 'blue' :
                        transaction.type === 'payout' ? 'purple' : 'gray'
                      } capitalize`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {transaction.description || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      <span className={
                        transaction.type === 'deposit' || transaction.type === 'payout' ? 'text-green-600' :
                        transaction.type === 'withdrawal' || transaction.type === 'investment' ? 'text-red-600' :
                        'text-gray-900'
                      }>
                        {transaction.type === 'deposit' || transaction.type === 'payout' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge badge-${
                        transaction.status === 'completed' ? 'green' :
                        transaction.status === 'pending' ? 'yellow' :
                        transaction.status === 'failed' ? 'red' : 'gray'
                      } capitalize`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Add Funds (Sandbox)</h3>
            <p className="text-sm text-gray-600 mb-4">
              This is a sandbox environment. You can add virtual funds for testing.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Amount to Add
              </label>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddFunds(false)}
                className="btn-secondary flex-1"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleAddFunds}
                className="btn-primary flex-1"
                disabled={processing || !addAmount || parseFloat(addAmount) <= 0}
              >
                {processing ? 'Processing...' : 'Add Funds'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Withdraw Funds</h3>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available Balance:</span>
                <span className="text-lg font-bold text-green-600">
                  {wallet ? formatCurrency(wallet.availableBalance) : '$0'}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Withdrawal Amount
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              {withdrawAmount && wallet && parseFloat(withdrawAmount) > wallet.availableBalance && (
                <p className="text-red-600 text-sm mt-1">Insufficient balance</p>
              )}
            </div>

            {withdrawAmount && wallet && parseFloat(withdrawAmount) <= wallet.availableBalance && (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Remaining balance after withdrawal:
                </div>
                <div className="text-lg font-bold">
                  {formatCurrency(wallet.availableBalance - parseFloat(withdrawAmount))}
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setShowWithdraw(false)}
                className="btn-secondary flex-1"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="btn-primary flex-1"
                disabled={processing || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || (wallet && parseFloat(withdrawAmount) > wallet.availableBalance)}
              >
                {processing ? 'Processing...' : 'Confirm Withdrawal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
