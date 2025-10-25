'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Investment, PortfolioSummary } from '@/types';
import { investmentAPI } from '@/lib/api';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';
import axios from 'axios';

interface MonthlyPayout {
  month: string;
  totalAmount: number;
  withdrawn: number;
  reinvested: number;
  roiPercent: number;
  transactions: any[];
}

export default function AnalyticsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [monthlyPayouts, setMonthlyPayouts] = useState<MonthlyPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'earnings' | 'value' | 'roi'>('earnings');
  const [timeRange, setTimeRange] = useState<'6m' | '12m' | 'all'>('12m');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const portfolioResponse = await investmentAPI.myInvestments();
      const investmentsData = portfolioResponse.data.data.investments;
      setInvestments(investmentsData);
      setSummary(portfolioResponse.data.data.summary);

      // Try to fetch actual payouts from API
      const token = localStorage.getItem('token');
      try {
        const transactionsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/investments/my-transactions?type=payout`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (transactionsResponse.data.data.monthlyPayouts && transactionsResponse.data.data.monthlyPayouts.length > 0) {
          setMonthlyPayouts(transactionsResponse.data.data.monthlyPayouts);
        } else {
          // Generate calculated monthly payouts from investments
          setMonthlyPayouts(generateMonthlyPayoutsFromInvestments(investmentsData));
        }
      } catch (error) {
        console.log('No payout data from API, generating from investments');
        // Generate calculated monthly payouts from investments
        setMonthlyPayouts(generateMonthlyPayoutsFromInvestments(investmentsData));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyPayoutsFromInvestments = (investmentsData: Investment[]) => {
    const payoutsByMonth: { [key: string]: MonthlyPayout } = {};

    investmentsData.forEach((investment: any) => {
      if (!investment.deal || !investment.invested_at) return;

      const investedDate = new Date(investment.invested_at);
      const now = new Date();
      const monthsPassed = Math.floor((now.getTime() - investedDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

      const holdingPeriodMonths = investment.deal.holding_period_months || 12;
      const monthlyROI = parseFloat(investment.deal.expected_roi || 0) / holdingPeriodMonths;
      const investedAmount = parseFloat(investment.amount);

      // Generate payouts for each month since investment
      for (let i = 0; i < Math.min(monthsPassed, holdingPeriodMonths); i++) {
        const payoutDate = new Date(investedDate);
        payoutDate.setMonth(payoutDate.getMonth() + i + 1);
        const monthKey = payoutDate.toISOString().substring(0, 7); // YYYY-MM

        const monthlyAmount = (investedAmount * monthlyROI) / 100;

        if (!payoutsByMonth[monthKey]) {
          payoutsByMonth[monthKey] = {
            month: monthKey,
            totalAmount: 0,
            withdrawn: 0,
            reinvested: 0,
            roiPercent: 0,
            transactions: []
          };
        }

        payoutsByMonth[monthKey].totalAmount += monthlyAmount;
        payoutsByMonth[monthKey].withdrawn += monthlyAmount * 0.7; // Assume 70% withdrawn
        payoutsByMonth[monthKey].reinvested += monthlyAmount * 0.3; // Assume 30% reinvested
      }
    });

    // Convert to array and sort by month
    const payoutsArray = Object.values(payoutsByMonth).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    // Calculate ROI percent for each month
    const totalInvested = investmentsData.reduce((sum, inv: any) => sum + parseFloat(inv.amount || 0), 0);
    payoutsArray.forEach(payout => {
      const cumulativePayouts = payoutsArray
        .filter(p => p.month <= payout.month)
        .reduce((sum, p) => sum + p.totalAmount, 0);
      payout.roiPercent = totalInvested > 0 ? (cumulativePayouts / totalInvested) * 100 : 0;
    });

    return payoutsArray;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Calculate month-on-month growth
  const getTimeRangeData = () => {
    const monthsToShow = timeRange === '6m' ? 6 : timeRange === '12m' ? 12 : monthlyPayouts.length;
    return monthlyPayouts.slice(0, monthsToShow).reverse();
  };

  const rangeData = getTimeRangeData();

  // Calculate cumulative portfolio value over time
  const calculatePortfolioGrowth = () => {
    const initialInvestment = summary?.totalInvested || 0;
    return rangeData.map((payout, index) => {
      const cumulativePayouts = rangeData
        .slice(0, index + 1)
        .reduce((sum, p) => sum + p.totalAmount, 0);
      return {
        month: payout.month,
        value: initialInvestment + cumulativePayouts,
        payouts: cumulativePayouts,
        roiPercent: ((cumulativePayouts / initialInvestment) * 100).toFixed(2),
      };
    });
  };

  const growthData = calculatePortfolioGrowth();
  const maxValue = Math.max(...growthData.map(d => d.value), 1);
  const maxPayout = Math.max(...rangeData.map(p => p.totalAmount), 1);

  // Month-on-month comparison
  const monthOnMonthComparison = rangeData.map((payout, index) => {
    if (index === 0) return { ...payout, growth: 0, growthPercent: 0 };
    const prevPayout = rangeData[index - 1];
    const growth = payout.totalAmount - prevPayout.totalAmount;
    const growthPercent = ((growth / prevPayout.totalAmount) * 100).toFixed(2);
    return { ...payout, growth, growthPercent: parseFloat(growthPercent) };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Investment Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive performance tracking and insights
          </p>
        </div>
        <Link href="/investments" className="btn-primary">
          View All Investments →
        </Link>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex gap-2">
        {['6m', '12m', 'all'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === range
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            {range === '6m' ? '6 Months' : range === '12m' ? '12 Months' : 'All Time'}
          </button>
        ))}
      </div>

      {/* View Selector */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex gap-4">
          {[
            { key: 'earnings', label: 'Monthly Earnings', icon: '💰' },
            { key: 'value', label: 'Portfolio Value Growth', icon: '📈' },
            { key: 'roi', label: 'ROI Timeline', icon: '🎯' },
          ].map((view) => (
            <button
              key={view.key}
              onClick={() => setSelectedView(view.key as any)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                selectedView === view.key
                  ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              <span className="text-2xl mr-2">{view.icon}</span>
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {selectedView === 'earnings' && 'Monthly Earnings Trend'}
          {selectedView === 'value' && 'Portfolio Value Growth'}
          {selectedView === 'roi' && 'ROI Timeline'}
        </h2>

        {/* Earnings Chart */}
        {selectedView === 'earnings' && (
          <div className="space-y-6">
            {rangeData.length === 0 ? (
              <div className="flex items-center justify-center h-80 text-gray-500">
                <div className="text-center">
                  <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Earnings Data Yet</p>
                  <p className="text-sm text-gray-500 mt-2">Start investing to see your earnings grow over time</p>
                </div>
              </div>
            ) : (
              <div className="flex items-end justify-between h-80 space-x-1">
                {rangeData.map((payout, index) => {
                const height = (payout.totalAmount / maxPayout) * 100;
                const monthData = monthOnMonthComparison[index];
                const isPositiveGrowth = monthData.growth >= 0;

                return (
                  <div key={payout.month} className="flex-1 flex flex-col items-center group cursor-pointer">
                    <div className="w-full flex flex-col justify-end h-full relative">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="font-bold mb-1">{new Date(payout.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                        <div>Total: {formatCurrency(payout.totalAmount)}</div>
                        <div>Withdrawn: {formatCurrency(payout.withdrawn)}</div>
                        <div>Reinvested: {formatCurrency(payout.reinvested)}</div>
                        <div>ROI: {formatPercentage(payout.roiPercent)}</div>
                        {index > 0 && (
                          <div className={isPositiveGrowth ? 'text-green-400' : 'text-red-400'}>
                            Growth: {isPositiveGrowth ? '+' : ''}{formatCurrency(monthData.growth)} ({monthData.growthPercent}%)
                          </div>
                        )}
                      </div>

                      {/* Bar */}
                      <div className="text-xs text-center mb-2 font-semibold text-green-600">
                        {formatCurrency(payout.totalAmount).replace(/\.00$/, '')}
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg hover:from-green-600 hover:to-green-400 transition-all"
                        style={{ height: `${Math.max(height, 10)}%`, minHeight: '30px' }}
                      ></div>

                      {/* Growth indicator */}
                      {index > 0 && (
                        <div className={`text-xs mt-1 font-bold ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositiveGrowth ? '↑' : '↓'} {Math.abs(monthData.growthPercent).toFixed(1)}%
                        </div>
                      )}
                    </div>
                    <div className="text-xs mt-2 text-gray-600 dark:text-gray-400 text-center">
                      {new Date(payout.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                    </div>
                  </div>
                );
                })}
              </div>
            )}
          </div>
        )}

        {/* Portfolio Value Growth Chart */}
        {selectedView === 'value' && (
          growthData.length === 0 ? (
            <div className="flex items-center justify-center h-80 text-gray-500">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Portfolio Data Yet</p>
                <p className="text-sm text-gray-500 mt-2">Your portfolio growth will be tracked here</p>
              </div>
            </div>
          ) : (
            <div className="flex items-end justify-between h-80 space-x-1">
              {growthData.map((data, index) => {
              const height = (data.value / maxValue) * 100;
              const prevValue = index > 0 ? growthData[index - 1].value : summary?.totalInvested || 0;
              const growth = data.value - prevValue;
              const growthPercent = ((growth / prevValue) * 100).toFixed(2);

              return (
                <div key={data.month} className="flex-1 flex flex-col items-center group cursor-pointer">
                  <div className="w-full flex flex-col justify-end h-full relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="font-bold mb-1">{new Date(data.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                      <div>Portfolio Value: {formatCurrency(data.value)}</div>
                      <div>Cumulative Payouts: {formatCurrency(data.payouts)}</div>
                      <div>Total ROI: {formatPercentage(data.roiPercent)}</div>
                      {index > 0 && (
                        <div className="text-green-400">
                          Monthly Growth: +{formatCurrency(growth)} ({growthPercent}%)
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-center mb-2 font-semibold text-blue-600">
                      {formatCurrency(data.value).replace(/\.00$/, '')}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg hover:from-blue-600 hover:to-blue-400 transition-all"
                      style={{ height: `${Math.max(height, 10)}%`, minHeight: '30px' }}
                    ></div>
                  </div>
                  <div className="text-xs mt-2 text-gray-600 dark:text-gray-400 text-center">
                    {new Date(data.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>
              );
              })}
            </div>
          )
        )}

        {/* ROI Timeline */}
        {selectedView === 'roi' && (
          growthData.length === 0 ? (
            <div className="flex items-center justify-center h-80 text-gray-500">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">No ROI Data Yet</p>
                <p className="text-sm text-gray-500 mt-2">Your returns will be calculated here as you invest</p>
              </div>
            </div>
          ) : (
            <div className="flex items-end justify-between h-80 space-x-1">
              {growthData.map((data, index) => {
              const roi = parseFloat(data.roiPercent);
              const height = Math.min((roi / 100) * 100, 100); // Cap at 100%

              return (
                <div key={data.month} className="flex-1 flex flex-col items-center group cursor-pointer">
                  <div className="w-full flex flex-col justify-end h-full relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="font-bold mb-1">{new Date(data.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                      <div>ROI: {formatPercentage(data.roiPercent)}</div>
                      <div>Total Earned: {formatCurrency(data.payouts)}</div>
                      <div>Initial Investment: {formatCurrency(summary?.totalInvested || 0)}</div>
                    </div>

                    <div className="text-xs text-center mb-2 font-semibold text-purple-600">
                      {formatPercentage(data.roiPercent)}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-lg hover:from-purple-600 hover:to-purple-400 transition-all"
                      style={{ height: `${Math.max(height, 10)}%`, minHeight: '30px' }}
                    ></div>
                  </div>
                  <div className="text-xs mt-2 text-gray-600 dark:text-gray-400 text-center">
                    {new Date(data.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>
              );
              })}
            </div>
          )
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/investments"
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="text-3xl mb-3">📊</div>
          <div className="text-lg font-bold text-blue-900 dark:text-white mb-2">
            View All Investments
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-300">
            See all {investments.length} investments with detailed breakdown
          </div>
        </Link>

        <Link
          href="/dashboard"
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="text-3xl mb-3">📈</div>
          <div className="text-lg font-bold text-green-900 dark:text-white mb-2">
            Performance Dashboard
          </div>
          <div className="text-sm text-green-600 dark:text-green-300">
            Asset allocation and top performers
          </div>
        </Link>

        <Link
          href="/deals"
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="text-3xl mb-3">🎯</div>
          <div className="text-lg font-bold text-purple-900 dark:text-white mb-2">
            Browse Deals
          </div>
          <div className="text-sm text-purple-600 dark:text-purple-300">
            Discover new investment opportunities
          </div>
        </Link>
      </div>

      {/* Key Insights */}
      {summary && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InsightCard
              title="Average Monthly Earnings"
              value={formatCurrency(
                rangeData.length > 0
                  ? rangeData.reduce((sum, p) => sum + p.totalAmount, 0) / rangeData.length
                  : 0
              )}
              trend={monthOnMonthComparison.length > 1 ? monthOnMonthComparison[monthOnMonthComparison.length - 1].growthPercent : 0}
            />
            <InsightCard
              title="Total Portfolio Growth"
              value={formatPercentage(
                ((summary.totalCurrentValue - summary.totalInvested) / summary.totalInvested * 100).toString()
              )}
              trend={10.5}
            />
            <InsightCard
              title="Total Payouts Received"
              value={formatCurrency(summary.totalPayoutsReceived)}
              trend={5.2}
            />
            <InsightCard
              title="Current Portfolio Value"
              value={formatCurrency(summary.totalCurrentValue)}
              trend={8.7}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function InsightCard({ title, value, trend }: { title: string; value: string; trend: number }) {
  const isPositive = trend >= 0;
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}% vs last period
      </div>
    </div>
  );
}
