'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Investment, PortfolioSummary } from '@/types';
import { investmentAPI, exportAPI } from '@/lib/api';
import { formatPercentage, formatDate, getDealTypeLabel } from '@/lib/utils';
import { usePreferences } from '@/context/PreferencesContext';
import axios from 'axios';

interface MonthlyPayout {
  month: string;
  totalAmount: number;
  withdrawn: number;
  reinvested: number;
  roiPercent: number;
  transactions: any[];
}

export default function PortfolioPage() {
  const { formatCurrency } = usePreferences();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [monthlyPayouts, setMonthlyPayouts] = useState<MonthlyPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    fetchPortfolio();
    fetchTransactions();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await investmentAPI.myInvestments();
      setInvestments(response.data.data.investments);
      setSummary(response.data.data.summary);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/investments/my-transactions?type=payout`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMonthlyPayouts(response.data.data.monthlyPayouts || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-75"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-150"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
              My Portfolio
            </h1>
            <p className="text-purple-300">
              Track your investments and returns
            </p>
          </div>
        <div className="flex space-x-3">
            <button
              onClick={() => exportAPI.portfolio()}
              className="btn-secondary text-sm"
            >
              📥 Export Portfolio
            </button>
            <button
              onClick={() => exportAPI.transactions()}
              className="btn-secondary text-sm"
            >
              📥 Export Transactions
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard
              title="Total Invested"
              value={formatCurrency(summary.totalInvested)}
              color="blue"
            />
            <SummaryCard
              title="Current Value"
              value={formatCurrency(summary.totalCurrentValue)}
              color="green"
            />
            <SummaryCard
              title="Total Payouts"
              value={formatCurrency(summary.totalPayoutsReceived)}
              color="purple"
            />
            <SummaryCard
              title="Total Return"
              value={formatPercentage(parseFloat(summary.returnPercentage))}
              subtitle={formatCurrency(summary.totalReturn)}
              color={parseFloat(summary.returnPercentage) >= 0 ? 'green' : 'red'}
            />
          </div>
        )}

        {/* Investments Table */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden hover:scale-105 transition-all">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">My Investments</h2>
          </div>

          {investments.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-purple-300 mb-4">You haven't made any investments yet.</p>
              <Link href="/" className="btn-primary inline-block">
                Browse Deals
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Deal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Invested
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Monthly Earning
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Total Earnings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Current Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      ROI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {investments.map((investment) => (
                    <tr key={investment.id} className="hover:bg-white/5 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-white">
                              {investment.deal?.title}
                            </div>
                            <div className="text-sm text-purple-300">
                              {investment.deal ? getDealTypeLabel(investment.deal.type) : 'N/A'} • {investment.earnings?.monthsHeld || 0} months
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold text-white">
                          {formatCurrency(investment.amount)}
                        </div>
                        <div className="text-xs text-purple-300">
                          {formatDate(investment.invested_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {formatCurrency(investment.earnings?.monthlyExpectedEarning || 0)}
                        </div>
                        <div className="text-xs text-purple-300">
                          Expected
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-400">
                          {formatCurrency(investment.earnings?.totalEarnings || 0)}
                        </div>
                        <div className="text-xs text-purple-300">
                          Payouts: {formatCurrency(investment.earnings?.totalPayoutsReceived || 0)}
                        </div>
                        <div className="text-xs text-purple-300">
                          Unrealized: {formatCurrency(investment.earnings?.unrealizedGain || 0)}
                        </div>
                        {investment.earnings?.exitEarnings && (
                          <div className="text-xs text-purple-400">
                            Exit: {formatCurrency(investment.earnings.exitEarnings)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-white">
                        {formatCurrency(investment.current_value || investment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold">
                          <span className={parseFloat(investment.earnings?.actualRoi?.toString() || '0') >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {formatPercentage(investment.earnings?.actualRoi || 0)}
                          </span>
                        </div>
                        <div className="text-xs text-purple-300">
                          vs {formatPercentage(investment.earnings?.expectedRoi || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge badge-${investment.status === 'active' ? 'green' : 'gray'} capitalize`}>
                          {investment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/deals/${investment.deal_id}`}
                          className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                        >
                          View Deal
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Monthly Earnings History */}
        {monthlyPayouts.length > 0 && (
          <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden hover:scale-105 transition-all">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Monthly Earnings History</h2>
              <button
                onClick={() => setShowTransactions(!showTransactions)}
                className="btn-secondary text-sm"
              >
                {showTransactions ? 'Hide Details' : 'Show Details'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Total Earned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Withdrawn
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Reinvested
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      ROI %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Transactions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {monthlyPayouts.slice(0, showTransactions ? monthlyPayouts.length : 12).map((payout) => (
                    <tr key={payout.month} className="hover:bg-white/5 transition-all">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                        {new Date(payout.month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-400">
                          {formatCurrency(payout.totalAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {formatCurrency(payout.withdrawn)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-400">
                          {formatCurrency(payout.reinvested)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">
                          {formatPercentage(payout.roiPercent)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300">
                        {payout.transactions.length} payment{payout.transactions.length > 1 ? 's' : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {monthlyPayouts.length > 12 && !showTransactions && (
              <div className="p-4 text-center border-t border-white/10">
                <button
                  onClick={() => setShowTransactions(true)}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Show all {monthlyPayouts.length} months
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string;
  subtitle?: string;
  color: string;
}) {
  const colorClasses: { [key: string]: string } = {
    blue: 'shadow-blue-500/20',
    green: 'shadow-green-500/20',
    purple: 'shadow-purple-500/20',
    red: 'shadow-red-500/20',
  };

  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-2xl ${colorClasses[color]} hover:scale-105 transition-all`}>
      <div className="text-sm text-purple-300 mb-1">{title}</div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {subtitle && <div className="text-sm text-purple-200">{subtitle}</div>}
    </div>
  );
}
