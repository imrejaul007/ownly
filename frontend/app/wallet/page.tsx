'use client';

import { useState, useEffect } from 'react';
import { walletAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { usePreferences } from '@/context/PreferencesContext';
import {
  Wallet, TrendingUp, TrendingDown, Clock, DollarSign,
  ArrowUpRight, ArrowDownRight, Plus, Minus, X, Check,
  History, CreditCard, Zap, Shield, Activity, Download,
  Upload, ChevronRight, AlertCircle, CheckCircle2, XCircle, ArrowRight
} from 'lucide-react';

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
  reference_id?: string;
  deal_title?: string;
  deal_id?: string;
  from?: string;
  to?: string;
  metadata?: any;
}

export default function WalletPage() {
  const { formatCurrency } = usePreferences();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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
      return;
    }

    try {
      setProcessing(true);
      await walletAPI.addFunds({
        amount: parseFloat(addAmount),
        description: 'Sandbox funds added'
      });

      setShowAddFunds(false);
      setAddAmount('');
      fetchWalletData();
    } catch (error: any) {
      console.error('Add funds error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      return;
    }

    if (wallet && parseFloat(withdrawAmount) > wallet.availableBalance) {
      return;
    }

    try {
      setProcessing(true);
      await walletAPI.withdraw({
        amount: parseFloat(withdrawAmount),
        description: 'Withdrawal request'
      });

      setShowWithdraw(false);
      setWithdrawAmount('');
      fetchWalletData();
    } catch (error: any) {
      console.error('Withdrawal error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="w-5 h-5 text-green-400" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-5 h-5 text-red-400" />;
      case 'investment':
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'payout':
        return <DollarSign className="w-5 h-5 text-purple-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const quickAddAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
                My Wallet
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your funds and track all transactions
              </p>
            </div>
          </div>
        </div>

        {/* Balance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Available Balance */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 hover:shadow-2xl hover:shadow-green-500/20 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-green-300 font-medium">Available Balance</div>
                  <div className="text-xs text-green-400/60">{wallet?.currency || 'AED'}</div>
                </div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {wallet ? formatCurrency(wallet.availableBalance) : formatCurrency(0)}
            </div>
            <div className="text-sm text-green-300/80">
              Ready to invest or withdraw
            </div>
          </div>

          {/* Total Balance */}
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-blue-300 font-medium">Total Balance</div>
                  <div className="text-xs text-blue-400/60">Including pending</div>
                </div>
              </div>
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {wallet ? formatCurrency(wallet.totalBalance) : formatCurrency(0)}
            </div>
            <div className="text-sm text-blue-300/80">
              All funds in your wallet
            </div>
          </div>

          {/* Pending Amount */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-yellow-300 font-medium">Pending Amount</div>
                  <div className="text-xs text-yellow-400/60">Processing</div>
                </div>
              </div>
              <Activity className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {wallet ? formatCurrency(wallet.pendingAmount) : formatCurrency(0)}
            </div>
            <div className="text-sm text-yellow-300/80">
              Funds being processed
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setShowAddFunds(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl p-6 font-semibold transition-all hover:shadow-lg hover:shadow-green-500/50 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white">Add Funds</div>
                <div className="text-sm text-green-100">Deposit to your wallet</div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => setShowWithdraw(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl p-6 font-semibold transition-all hover:shadow-lg hover:shadow-purple-500/50 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Minus className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white">Withdraw Funds</div>
                <div className="text-sm text-purple-100">Transfer to your bank</div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Wallet Statistics */}
        {stats && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Wallet Statistics</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Download className="w-4 h-4 text-green-400" />
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Deposits</div>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(stats.totalDeposits)}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="w-4 h-4 text-red-400" />
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Withdrawals</div>
                </div>
                <div className="text-2xl font-bold text-red-400">
                  {formatCurrency(stats.totalWithdrawals)}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Investments</div>
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {formatCurrency(stats.totalInvestments)}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-purple-400" />
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Payouts</div>
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {formatCurrency(stats.totalPayouts)}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Pending</div>
                </div>
                <div className="text-2xl font-bold text-orange-400">
                  {formatCurrency(stats.pendingWithdrawals)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Transaction History</h2>
                <p className="text-sm text-gray-400">All your wallet activities</p>
              </div>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg font-medium">No transactions yet</p>
              <p className="text-gray-500 text-sm mt-2">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  onClick={() => setSelectedTransaction(transaction)}
                  className="p-4 lg:p-6 hover:bg-white/5 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Icon and Details */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        transaction.type === 'deposit' ? 'bg-green-500/20 border border-green-500/30' :
                        transaction.type === 'withdrawal' ? 'bg-red-500/20 border border-red-500/30' :
                        transaction.type === 'investment' ? 'bg-blue-500/20 border border-blue-500/30' :
                        transaction.type === 'payout' ? 'bg-purple-500/20 border border-purple-500/30' :
                        'bg-gray-500/20 border border-gray-500/30'
                      }`}>
                        {getTransactionIcon(transaction.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                            transaction.type === 'deposit' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                            transaction.type === 'withdrawal' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                            transaction.type === 'investment' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                            transaction.type === 'payout' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                            'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                          }`}>
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(transaction.status)}
                            <span className={`text-xs font-medium ${
                              transaction.status === 'completed' ? 'text-green-400' :
                              transaction.status === 'pending' ? 'text-yellow-400' :
                              transaction.status === 'failed' ? 'text-red-400' :
                              'text-gray-400'
                            }`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="text-white font-medium mb-1 truncate">
                          {transaction.description || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(transaction.created_at)}
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <div className={`text-xl font-bold ${
                        transaction.type === 'deposit' || transaction.type === 'payout' ? 'text-green-400' :
                        transaction.type === 'withdrawal' || transaction.type === 'investment' ? 'text-red-400' :
                        'text-white'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'payout' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Add Funds</h3>
                  <p className="text-sm text-gray-400">Sandbox Environment</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddFunds(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-300">
                <div className="font-semibold mb-1">Sandbox Mode</div>
                <div className="text-yellow-400/80">You can add virtual funds for testing purposes.</div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Amount to Add
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-white text-lg font-semibold placeholder-gray-500"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {quickAddAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setAddAmount(amount.toString())}
                    className="px-4 py-2 bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/30 rounded-lg text-sm font-medium text-gray-300 hover:text-green-300 transition-all"
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddFunds(false)}
                className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-white transition-all"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleAddFunds}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-semibold text-white transition-all hover:shadow-lg hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={processing || !addAmount || parseFloat(addAmount) <= 0}
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Add {addAmount ? formatCurrency(parseFloat(addAmount)) : 'Funds'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Minus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Withdraw Funds</h3>
                  <p className="text-sm text-gray-400">Transfer to your bank</p>
                </div>
              </div>
              <button
                onClick={() => setShowWithdraw(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Available Balance:</span>
                <span className="text-xl font-bold text-green-400">
                  {wallet ? formatCurrency(wallet.availableBalance) : formatCurrency(0)}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Withdrawal Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-white text-lg font-semibold placeholder-gray-500"
                />
              </div>

              {withdrawAmount && wallet && parseFloat(withdrawAmount) > wallet.availableBalance && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                  <XCircle className="w-4 h-4" />
                  Insufficient balance
                </div>
              )}
            </div>

            {withdrawAmount && wallet && parseFloat(withdrawAmount) <= wallet.availableBalance && parseFloat(withdrawAmount) > 0 && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-6">
                <div className="text-sm text-gray-400 mb-1">Remaining balance after withdrawal:</div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(wallet.availableBalance - parseFloat(withdrawAmount))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdraw(false)}
                className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-white transition-all"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={!!(processing || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || (wallet && parseFloat(withdrawAmount) > wallet.availableBalance))}
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Withdraw {withdrawAmount ? formatCurrency(parseFloat(withdrawAmount)) : 'Funds'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  selectedTransaction.type === 'deposit' ? 'bg-green-500/20 border border-green-500/30' :
                  selectedTransaction.type === 'withdrawal' ? 'bg-red-500/20 border border-red-500/30' :
                  selectedTransaction.type === 'investment' ? 'bg-blue-500/20 border border-blue-500/30' :
                  selectedTransaction.type === 'payout' ? 'bg-purple-500/20 border border-purple-500/30' :
                  'bg-gray-500/20 border border-gray-500/30'
                }`}>
                  {getTransactionIcon(selectedTransaction.type)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white capitalize">
                    {selectedTransaction.type} Details
                  </h3>
                  <p className="text-sm text-gray-400">Transaction Information</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Transaction Amount */}
            <div className={`mb-6 p-6 rounded-2xl border-2 ${
              selectedTransaction.type === 'deposit' || selectedTransaction.type === 'payout'
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="text-sm text-gray-400 mb-2">Transaction Amount</div>
              <div className={`text-4xl font-bold ${
                selectedTransaction.type === 'deposit' || selectedTransaction.type === 'payout'
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}>
                {selectedTransaction.type === 'deposit' || selectedTransaction.type === 'payout' ? '+' : '-'}
                {formatCurrency(selectedTransaction.amount)}
              </div>
            </div>

            {/* Transaction Details Grid */}
            <div className="space-y-4 mb-6">
              {/* Transaction ID */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Transaction ID</div>
                    <div className="text-sm font-mono text-white break-all">{selectedTransaction.id}</div>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedTransaction.id)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-all flex items-center gap-1"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Status and Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Status</div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedTransaction.status)}
                    <span className={`text-sm font-semibold capitalize ${
                      selectedTransaction.status === 'completed' ? 'text-green-400' :
                      selectedTransaction.status === 'pending' ? 'text-yellow-400' :
                      selectedTransaction.status === 'failed' ? 'text-red-400' :
                      'text-gray-400'
                    }`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Type</div>
                  <div className="flex items-center gap-2">
                    {getTransactionIcon(selectedTransaction.type)}
                    <span className={`text-sm font-semibold capitalize ${
                      selectedTransaction.type === 'deposit' ? 'text-green-400' :
                      selectedTransaction.type === 'withdrawal' ? 'text-red-400' :
                      selectedTransaction.type === 'investment' ? 'text-blue-400' :
                      selectedTransaction.type === 'payout' ? 'text-purple-400' :
                      'text-gray-400'
                    }`}>
                      {selectedTransaction.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Date & Time</div>
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{formatDate(selectedTransaction.created_at)}</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Description</div>
                <div className="text-sm text-white font-medium">
                  {selectedTransaction.description || 'No description available'}
                </div>
              </div>

              {/* Reference ID */}
              {selectedTransaction.reference_id && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Reference ID</div>
                  <div className="text-sm font-mono text-white">{selectedTransaction.reference_id}</div>
                </div>
              )}

              {/* Deal Information */}
              {selectedTransaction.deal_title && (
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="text-xs text-blue-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    Related Deal
                  </div>
                  <div className="text-sm text-white font-semibold mb-1">
                    {selectedTransaction.deal_title}
                  </div>
                  {selectedTransaction.deal_id && (
                    <div className="text-xs text-gray-400 font-mono">
                      Deal ID: {selectedTransaction.deal_id}
                    </div>
                  )}
                </div>
              )}

              {/* Transaction Flow */}
              {(selectedTransaction.from || selectedTransaction.to) && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Transaction Flow</div>
                  <div className="flex items-center gap-3">
                    {selectedTransaction.from && (
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">From</div>
                        <div className="text-sm text-white font-medium">{selectedTransaction.from}</div>
                      </div>
                    )}
                    {selectedTransaction.from && selectedTransaction.to && (
                      <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    {selectedTransaction.to && (
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">To</div>
                        <div className="text-sm text-white font-medium">{selectedTransaction.to}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Metadata */}
              {selectedTransaction.metadata && Object.keys(selectedTransaction.metadata).length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">Additional Information</div>
                  <div className="space-y-2">
                    {Object.entries(selectedTransaction.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <span className="text-xs text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="text-sm text-white font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedTransaction(null)}
                className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold text-white transition-all"
              >
                Close
              </button>
              {selectedTransaction.deal_id && (
                <button
                  onClick={() => {
                    window.location.href = `/deals/${selectedTransaction.deal_id}`;
                  }}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
                >
                  View Deal
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
