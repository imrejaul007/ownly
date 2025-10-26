'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Investment, PortfolioSummary } from '@/types';
import { investmentAPI, exportAPI } from '@/lib/api';
import { formatCurrency, formatPercentage, formatDate, getDealTypeLabel } from '@/lib/utils';
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Portfolio
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">My Investments</h2>
        </div>

        {investments.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 mb-4">You haven't made any investments yet.</p>
            <Link href="/" className="btn-primary inline-block">
              Browse Deals
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Earning
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                {investments.map((investment) => (
                  <tr key={investment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {investment.deal?.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {investment.deal ? getDealTypeLabel(investment.deal.type) : 'N/A'} • {investment.earnings?.monthsHeld || 0} months
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(investment.amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(investment.invested_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(investment.earnings?.monthlyExpectedEarning || 0)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Expected
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(investment.earnings?.totalEarnings || 0)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Payouts: {formatCurrency(investment.earnings?.totalPayoutsReceived || 0)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Unrealized: {formatCurrency(investment.earnings?.unrealizedGain || 0)}
                      </div>
                      {investment.earnings?.exitEarnings && (
                        <div className="text-xs text-purple-600">
                          Exit: {formatCurrency(investment.earnings.exitEarnings)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">
                      {formatCurrency(investment.current_value || investment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold">
                        <span className={parseFloat(investment.earnings?.actualRoi?.toString() || '0') >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatPercentage(investment.earnings?.actualRoi || 0)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
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
                        className="text-primary-600 hover:text-primary-900 font-medium"
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
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Monthly Earnings History</h2>
            <button
              onClick={() => setShowTransactions(!showTransactions)}
              className="btn-secondary text-sm"
            >
              {showTransactions ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Earned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Withdrawn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reinvested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROI %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transactions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                {monthlyPayouts.slice(0, showTransactions ? monthlyPayouts.length : 12).map((payout) => (
                  <tr key={payout.month} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {new Date(payout.month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(payout.totalAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatCurrency(payout.withdrawn)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        {formatCurrency(payout.reinvested)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatPercentage(payout.roiPercent)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payout.transactions.length} payment{payout.transactions.length > 1 ? 's' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {monthlyPayouts.length > 12 && !showTransactions && (
            <div className="p-4 text-center border-t border-gray-200">
              <button
                onClick={() => setShowTransactions(true)}
                className="text-primary-600 hover:text-primary-900 font-medium"
              >
                Show all {monthlyPayouts.length} months
              </button>
            </div>
          )}
        </div>
      )}
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
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      {subtitle && <div className="text-sm text-gray-600">{subtitle}</div>}
    </div>
  );
}
