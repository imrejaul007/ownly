'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Investment, PortfolioSummary } from '@/types';
import { investmentAPI } from '@/lib/api';
import { formatCurrency, formatPercentage, getDealTypeLabel } from '@/lib/utils';
import axios from 'axios';

interface MonthlyPayout {
  month: string;
  totalAmount: number;
  withdrawn: number;
  reinvested: number;
  roiPercent: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  amount?: number;
  date: string;
  status?: string;
}

export default function DashboardPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [monthlyPayouts, setMonthlyPayouts] = useState<MonthlyPayout[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch portfolio
      const portfolioResponse = await investmentAPI.myInvestments();
      setInvestments(portfolioResponse.data.data.investments);
      setSummary(portfolioResponse.data.data.summary);

      // Fetch transactions
      const token = localStorage.getItem('token');
      const transactionsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/investments/my-transactions?type=payout`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMonthlyPayouts(transactionsResponse.data.data.monthlyPayouts || []);

      // Generate recent activities from investments and transactions
      const activities: Activity[] = [];

      // Add recent investments
      const recentInvestments = [...portfolioResponse.data.data.investments]
        .sort((a, b) => new Date(b.invested_at).getTime() - new Date(a.invested_at).getTime())
        .slice(0, 5);

      recentInvestments.forEach(inv => {
        activities.push({
          id: `inv-${inv.id}`,
          type: 'investment',
          description: `Invested in ${inv.deal?.title}`,
          amount: parseFloat(inv.amount.toString()),
          date: inv.invested_at,
          status: inv.status,
        });
      });

      // Add recent payouts from monthly data
      if (monthlyPayouts.length > 0) {
        monthlyPayouts.slice(0, 3).forEach((payout, idx) => {
          activities.push({
            id: `payout-${idx}`,
            type: 'payout',
            description: `Monthly payout received`,
            amount: payout.totalAmount,
            date: `${payout.month}-15`,
            status: 'completed',
          });
        });
      }

      // Sort by date
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivities(activities.slice(0, 8));

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Calculate asset allocation
  const assetAllocation = investments.reduce((acc, inv) => {
    const type = inv.deal?.type || 'unknown';
    const amount = parseFloat(inv.amount.toString());
    acc[type] = (acc[type] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const totalInvested = Object.values(assetAllocation).reduce((a, b) => a + b, 0);

  // Get top performers
  const topPerformers = [...investments]
    .sort((a, b) => parseFloat(b.earnings?.actualRoi || '0') - parseFloat(a.earnings?.actualRoi || '0'))
    .slice(0, 3);

  // Calculate growth over time (last 6 months)
  const recentPayouts = monthlyPayouts.slice(0, 6).reverse();
  const maxPayout = Math.max(...recentPayouts.map(p => p.totalAmount), 1);

  // Calculate average monthly earnings
  const avgMonthlyEarning = monthlyPayouts.length > 0
    ? monthlyPayouts.reduce((sum, p) => sum + p.totalAmount, 0) / monthlyPayouts.length
    : 0;

  // Calculate last month's payout
  const lastMonthPayout = monthlyPayouts.length > 0 ? monthlyPayouts[0].totalAmount : 0;

  // Calculate payout growth percentage
  const payoutGrowth = monthlyPayouts.length >= 2
    ? ((monthlyPayouts[0].totalAmount - monthlyPayouts[1].totalAmount) / monthlyPayouts[1].totalAmount) * 100
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Performance Summary */}
      {summary && (
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Investment Performance</h1>
              <p className="text-green-100">Track your growth, earnings, and opportunities</p>
            </div>
            <div className="text-6xl">📈</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Portfolio Value */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-green-100 text-sm mb-2">Total Portfolio Value</div>
              <div className="text-4xl font-bold mb-2">{formatCurrency(summary.totalCurrentValue)}</div>
              <div className="flex items-center text-sm">
                <span className="text-green-200">
                  ↗ {formatCurrency(summary.totalCurrentValue - summary.totalInvested)} gain
                </span>
              </div>
            </div>

            {/* Monthly Earnings */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-green-100 text-sm mb-2">Last Month Earning</div>
              <div className="text-4xl font-bold mb-2">{formatCurrency(lastMonthPayout)}</div>
              <div className="flex items-center text-sm">
                {payoutGrowth >= 0 ? (
                  <span className="text-green-200">↗ {payoutGrowth.toFixed(1)}% vs prev month</span>
                ) : (
                  <span className="text-red-200">↘ {Math.abs(payoutGrowth).toFixed(1)}% vs prev month</span>
                )}
              </div>
            </div>

            {/* Overall ROI */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-green-100 text-sm mb-2">Overall ROI</div>
              <div className="text-4xl font-bold mb-2">{formatPercentage(summary.returnPercentage)}</div>
              <div className="flex items-center text-sm">
                <span className="text-green-200">{formatCurrency(summary.totalReturn)} total return</span>
              </div>
            </div>

            {/* Avg Monthly Income */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-green-100 text-sm mb-2">Avg Monthly Income</div>
              <div className="text-4xl font-bold mb-2">{formatCurrency(avgMonthlyEarning)}</div>
              <div className="flex items-center text-sm">
                <span className="text-green-200">Across {monthlyPayouts.length} months</span>
              </div>
            </div>
          </div>

          {/* Performance Indicator */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-7 h-7 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-lg">
                    {parseFloat(summary.returnPercentage) > 20 ? 'Excellent Performance! 🎉' : parseFloat(summary.returnPercentage) > 10 ? 'Good Performance! 👍' : 'Growing Steadily 🌱'}
                  </div>
                  <div className="text-sm text-green-100">
                    {parseFloat(summary.returnPercentage) > 20
                      ? 'Your portfolio is outperforming market averages'
                      : parseFloat(summary.returnPercentage) > 10
                      ? 'You\'re earning solid returns on your investments'
                      : 'Your investments are building value over time'}
                  </div>
                </div>
              </div>
              <Link href="/investments">
                <button className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition font-semibold">
                  View Details →
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Reinvestment Opportunities */}
      {summary && summary.totalPayoutsReceived > 500 && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Reinvest Your Earnings!</h2>
                  <p className="text-purple-100">You've earned {formatCurrency(summary.totalPayoutsReceived)} in payouts</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">{formatCurrency(summary.totalPayoutsReceived * 0.3)}</div>
                  <div className="text-sm text-purple-100">Suggested reinvestment (30%)</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">+{(parseFloat(summary.returnPercentage) * 0.3).toFixed(1)}%</div>
                  <div className="text-sm text-purple-100">Additional annual ROI potential</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">{formatCurrency(summary.totalPayoutsReceived * 0.3 * (parseFloat(summary.returnPercentage) / 100))}</div>
                  <div className="text-sm text-purple-100">Extra annual income if reinvested</div>
                </div>
              </div>
            </div>
            <div className="ml-8 flex flex-col gap-3">
              <Link href="/deals">
                <button className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition font-bold whitespace-nowrap">
                  Browse Deals →
                </button>
              </Link>
              <Link href="/bundles">
                <button className="px-8 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-400 transition font-bold whitespace-nowrap">
                  Smart Bundles →
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/investments">
            <MetricCard
              title="Portfolio Value"
              value={formatCurrency(summary.totalCurrentValue)}
              subtitle={`+${formatCurrency(summary.totalCurrentValue - summary.totalInvested)} gain`}
              color="blue"
              clickable
            />
          </Link>
          <Link href="/investments">
            <MetricCard
              title="Total Invested"
              value={formatCurrency(summary.totalInvested)}
              subtitle={`${investments.length} active investments`}
              color="purple"
              clickable
            />
          </Link>
          <Link href="/analytics">
            <MetricCard
              title="Total Earnings"
              value={formatCurrency(summary.totalReturn)}
              subtitle={`${formatPercentage(summary.returnPercentage)} ROI`}
              color="green"
              clickable
            />
          </Link>
          <Link href="/analytics">
            <MetricCard
              title="Payouts Received"
              value={formatCurrency(summary.totalPayoutsReceived)}
              subtitle={`${monthlyPayouts.length} months`}
              color="orange"
              clickable
            />
          </Link>
        </div>
      )}

      {/* Portfolio Growth Timeline */}
      {summary && monthlyPayouts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Portfolio Growth Over Time</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your cumulative returns & portfolio value</p>
            </div>
          </div>

          {/* Growth Chart */}
          <div className="relative h-80">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-20 flex flex-col justify-between text-xs text-gray-500">
              <span>{formatCurrency(summary.totalCurrentValue)}</span>
              <span>{formatCurrency(summary.totalCurrentValue * 0.75)}</span>
              <span>{formatCurrency(summary.totalCurrentValue * 0.5)}</span>
              <span>{formatCurrency(summary.totalCurrentValue * 0.25)}</span>
              <span>AED 0</span>
            </div>

            {/* Chart area */}
            <div className="ml-24 h-full flex items-end space-x-1">
              {monthlyPayouts.slice(0, 12).reverse().map((payout, index) => {
                // Simulate cumulative growth
                const cumulativeValue = summary.totalInvested + (summary.totalReturn * (index + 1) / monthlyPayouts.length);
                const height = (cumulativeValue / summary.totalCurrentValue) * 100;
                const earnings = monthlyPayouts.slice(index).reduce((sum, p) => sum + p.totalAmount, 0);

                return (
                  <div key={payout.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded-lg p-3 mb-2 absolute -top-20 z-10 whitespace-nowrap">
                      <div className="font-bold">{new Date(payout.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                      <div className="text-green-300">Value: {formatCurrency(cumulativeValue)}</div>
                      <div className="text-blue-300">Earned: {formatCurrency(payout.totalAmount)}</div>
                    </div>

                    {/* Bar with gradient showing invested vs returns */}
                    <div className="w-full relative" style={{ height: `${height}%` }}>
                      {/* Invested portion */}
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-blue-400 to-blue-500"
                        style={{ height: `${(summary.totalInvested / cumulativeValue) * 100}%` }}
                      ></div>
                      {/* Returns portion */}
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-green-400 to-green-500 opacity-80"
                        style={{
                          height: `${((cumulativeValue - summary.totalInvested) / cumulativeValue) * 100}%`,
                          bottom: `${(summary.totalInvested / cumulativeValue) * 100}%`
                        }}
                      ></div>
                    </div>

                    {/* Month label */}
                    <div className="text-xs mt-2 text-gray-600 dark:text-gray-400 text-center">
                      {new Date(payout.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex justify-center gap-8">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-t from-blue-400 to-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Principal Invested</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gradient-to-t from-green-400 to-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Returns Earned</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Asset Allocation Chart with Donut */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Asset Allocation</h2>

          {/* Donut Chart */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              {/* SVG Donut */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {Object.entries(assetAllocation).reduce((acc, [type, amount], index, array) => {
                  const percentage = (amount / totalInvested) * 100;
                  const previousPercentages = array.slice(0, index).reduce((sum, [, amt]) => sum + ((amt as number / totalInvested) * 100), 0);
                  const circumference = 2 * Math.PI * 35;
                  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((previousPercentages / 100) * circumference);

                  const colors: Record<string, string> = {
                    real_estate: '#3B82F6',
                    franchise: '#10B981',
                    startup: '#F59E0B',
                    asset: '#8B5CF6',
                  };

                  acc.push(
                    <circle
                      key={type}
                      cx="50"
                      cy="50"
                      r="35"
                      fill="none"
                      stroke={colors[type] || '#6B7280'}
                      strokeWidth="12"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 hover:stroke-opacity-80"
                    />
                  );
                  return acc;
                }, [] as JSX.Element[])}
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{investments.length}</div>
                <div className="text-xs text-gray-500">Assets</div>
              </div>
            </div>
          </div>

          {/* Legend with bars */}
          <div className="space-y-3">
            {Object.entries(assetAllocation).map(([type, amount]) => {
              const percentage = (amount / totalInvested) * 100;
              return (
                <div key={type}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {getDealTypeLabel(type)}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full ${getColorForType(type)} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Earnings Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Passive Income</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your earnings over the last 6 months</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(avgMonthlyEarning)}</div>
              <div className="text-xs text-gray-500">Avg per month</div>
            </div>
          </div>

          <div className="flex items-end justify-between h-64 space-x-2">
            {recentPayouts.map((payout, index) => {
              const height = (payout.totalAmount / maxPayout) * 100;
              const isLatest = index === recentPayouts.length - 1;
              return (
                <div key={payout.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col justify-end h-full">
                    <div className="text-xs text-center mb-2 font-semibold text-green-600">
                      {formatCurrency(payout.totalAmount, 'USD').replace('.00', '')}
                    </div>
                    <div
                      className={`w-full rounded-t-lg ${
                        isLatest
                          ? 'bg-gradient-to-t from-green-600 to-green-400 animate-pulse'
                          : 'bg-gradient-to-t from-green-500 to-green-300'
                      }`}
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <div className="text-xs mt-2 text-gray-600 dark:text-gray-400 text-center">
                    {new Date(payout.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                    {isLatest && <div className="text-green-600 font-bold">Latest</div>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(Math.min(...recentPayouts.map(p => p.totalAmount)))}</div>
              <div className="text-xs text-gray-500">Lowest month</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{formatCurrency(Math.max(...recentPayouts.map(p => p.totalAmount)))}</div>
              <div className="text-xs text-gray-500">Highest month</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{formatCurrency(avgMonthlyEarning)}</div>
              <div className="text-xs text-gray-500">Average</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Performing Investments</h2>
          <Link href="/portfolio" className="text-primary-600 hover:text-primary-900 text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topPerformers.map((investment, index) => (
            <Link href={`/investments/${investment.id}`} key={investment.id}>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-2xl font-bold ${
                    index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-400' : 'text-orange-400'
                  }`}>
                    #{index + 1}
                  </span>
                  <span className="badge bg-blue-100 text-blue-800 text-xs">
                    {investment.deal ? getDealTypeLabel(investment.deal.type) : 'N/A'}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                  {investment.deal?.title}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Invested:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(investment.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Current Value:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(investment.current_value || investment.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">ROI:</span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatPercentage(investment.earnings?.actualRoi || 0)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500">
                      Total Earnings: {formatCurrency(investment.earnings?.totalEarnings || 0)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full text-sm text-primary-600 hover:text-primary-800 font-semibold">
                    View Details →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Earnings Breakdown & Investment Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Earnings Breakdown Pie Chart */}
        {summary && monthlyPayouts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Earnings Breakdown</h2>

            <div className="grid grid-cols-2 gap-6">
              {/* Radial Progress for Total Returns */}
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - parseFloat(summary.returnPercentage) / 100)}`}
                      className="text-green-500 transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-green-600">{formatPercentage(summary.returnPercentage)}</div>
                    <div className="text-xs text-gray-500">ROI</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Returns</div>
                  <div className="text-lg font-bold text-green-600">{formatCurrency(summary.totalReturn)}</div>
                </div>
              </div>

              {/* Radial Progress for Payouts */}
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - (summary.totalPayoutsReceived / summary.totalReturn))}`}
                      className="text-blue-500 transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {((summary.totalPayoutsReceived / summary.totalReturn) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">Paid Out</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Payouts Received</div>
                  <div className="text-lg font-bold text-blue-600">{formatCurrency(summary.totalPayoutsReceived)}</div>
                </div>
              </div>
            </div>

            {/* Stacked Bar for Portfolio Composition */}
            <div className="mt-8">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Portfolio Composition</div>
              <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex">
                <div
                  className="bg-blue-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
                  style={{ width: `${(summary.totalInvested / summary.totalCurrentValue) * 100}%` }}
                >
                  {((summary.totalInvested / summary.totalCurrentValue) * 100).toFixed(0)}%
                </div>
                <div
                  className="bg-green-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
                  style={{ width: `${(summary.totalReturn / summary.totalCurrentValue) * 100}%` }}
                >
                  {((summary.totalReturn / summary.totalCurrentValue) * 100).toFixed(0)}%
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                  Principal: {formatCurrency(summary.totalInvested)}
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                  Returns: {formatCurrency(summary.totalReturn)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Investment Goals Progress */}
        {summary && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Investment Goals</h2>

            <div className="space-y-6">
              {/* Goal 1: Portfolio Value Goal */}
              <div>
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Portfolio Value Goal</div>
                    <div className="text-xs text-gray-500">Target: AED 100,000</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {((summary.totalCurrentValue / 100000) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">{formatCurrency(summary.totalCurrentValue)}</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                    style={{ width: `${Math.min((summary.totalCurrentValue / 100000) * 100, 100)}%` }}
                  >
                    <span className="text-xs text-white font-bold">🎯</span>
                  </div>
                </div>
              </div>

              {/* Goal 2: Monthly Income Goal */}
              <div>
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Monthly Income Goal</div>
                    <div className="text-xs text-gray-500">Target: AED 5,000/month</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {((avgMonthlyEarning / 5000) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">{formatCurrency(avgMonthlyEarning)}/mo</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                    style={{ width: `${Math.min((avgMonthlyEarning / 5000) * 100, 100)}%` }}
                  >
                    <span className="text-xs text-white font-bold">💰</span>
                  </div>
                </div>
              </div>

              {/* Goal 3: Diversification Goal */}
              <div>
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Diversification Goal</div>
                    <div className="text-xs text-gray-500">Target: 10 assets</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">
                      {((investments.length / 10) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">{investments.length} assets</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                    style={{ width: `${Math.min((investments.length / 10) * 100, 100)}%` }}
                  >
                    <span className="text-xs text-white font-bold">📊</span>
                  </div>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Achievements Unlocked</div>
                <div className="flex flex-wrap gap-2">
                  {summary.totalCurrentValue >= 10000 && (
                    <div className="badge bg-yellow-100 text-yellow-800 text-xs flex items-center">
                      🏆 AED 10K Portfolio
                    </div>
                  )}
                  {investments.length >= 3 && (
                    <div className="badge bg-blue-100 text-blue-800 text-xs flex items-center">
                      📈 Diversified Investor
                    </div>
                  )}
                  {parseFloat(summary.returnPercentage) >= 20 && (
                    <div className="badge bg-green-100 text-green-800 text-xs flex items-center">
                      🎯 20%+ ROI Master
                    </div>
                  )}
                  {monthlyPayouts.length >= 6 && (
                    <div className="badge bg-purple-100 text-purple-800 text-xs flex items-center">
                      💎 6-Month Veteran
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommended Investment Bundles */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Recommended Investment Bundles</h2>
            <p className="text-indigo-100">Pre-curated portfolios for instant diversification</p>
          </div>
          <div className="text-5xl">📦</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Smart Starter Bundle */}
          <Link href="/bundles/BUN001">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all cursor-pointer border border-white/20">
              <div className="text-sm text-indigo-200 mb-2">Balanced Income</div>
              <h3 className="text-xl font-bold mb-3">Smart Starter Bundle</h3>
              <div className="mb-4">
                <div className="text-3xl font-bold text-green-300">18%</div>
                <div className="text-sm text-indigo-200">Annual ROI</div>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-indigo-200">Min. Investment:</span>
                  <span className="font-bold">{formatCurrency(1000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Duration:</span>
                  <span className="font-bold">12 months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Assets:</span>
                  <span className="font-bold">3 deals</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/20">
                <div className="text-xs text-indigo-200">✓ Perfect for new investors</div>
                <div className="text-xs text-indigo-200">✓ Auto-diversified portfolio</div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold text-sm">
                View Bundle Details →
              </button>
            </div>
          </Link>

          {/* Growth Mix Bundle */}
          <Link href="/bundles/BUN002">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all cursor-pointer border border-white/20">
              <div className="text-sm text-indigo-200 mb-2">Moderate Growth</div>
              <h3 className="text-xl font-bold mb-3">Growth Mix Bundle</h3>
              <div className="mb-4">
                <div className="text-3xl font-bold text-green-300">28%</div>
                <div className="text-sm text-indigo-200">Annual ROI</div>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-indigo-200">Min. Investment:</span>
                  <span className="font-bold">{formatCurrency(5000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Duration:</span>
                  <span className="font-bold">24 months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Assets:</span>
                  <span className="font-bold">4 deals</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/20">
                <div className="text-xs text-indigo-200">✓ Stable & growth-focused</div>
                <div className="text-xs text-indigo-200">✓ Quarterly distributions</div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold text-sm">
                View Bundle Details →
              </button>
            </div>
          </Link>

          {/* Alpha Investor Bundle */}
          <Link href="/bundles/BUN003">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all cursor-pointer border border-white/20">
              <div className="text-sm text-indigo-200 mb-2">High Growth</div>
              <h3 className="text-xl font-bold mb-3">Alpha Investor Bundle</h3>
              <div className="mb-4">
                <div className="text-3xl font-bold text-green-300">45%</div>
                <div className="text-sm text-indigo-200">Annual ROI</div>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-indigo-200">Min. Investment:</span>
                  <span className="font-bold">{formatCurrency(10000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Duration:</span>
                  <span className="font-bold">36 months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Assets:</span>
                  <span className="font-bold">4 deals</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/20">
                <div className="text-xs text-indigo-200">✓ Long-term wealth creation</div>
                <div className="text-xs text-indigo-200">✓ Equity-based upside</div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold text-sm">
                View Bundle Details →
              </button>
            </div>
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link href="/bundles" className="inline-block px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold">
            View All 6 Investment Bundles →
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-6">
          <div className="text-sm text-blue-600 dark:text-blue-300 mb-2">Average Investment</div>
          <div className="text-3xl font-bold text-blue-900 dark:text-white">
            {formatCurrency(summary ? summary.totalInvested / investments.length : 0)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg p-6">
          <div className="text-sm text-green-600 dark:text-green-300 mb-2">Avg Monthly Earnings</div>
          <div className="text-3xl font-bold text-green-900 dark:text-white">
            {formatCurrency(
              monthlyPayouts.length > 0
                ? monthlyPayouts.reduce((sum, p) => sum + p.totalAmount, 0) / monthlyPayouts.length
                : 0
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg p-6">
          <div className="text-sm text-purple-600 dark:text-purple-300 mb-2">Portfolio Growth</div>
          <div className="text-3xl font-bold text-purple-900 dark:text-white">
            {summary ? formatPercentage(
              ((summary.totalCurrentValue - summary.totalInvested) / summary.totalInvested * 100).toString()
            ) : '0%'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
            <Link href="/activity" className="text-primary-600 hover:text-primary-900 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent activity
              </div>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'investment' ? 'bg-blue-100 dark:bg-blue-900' :
                      activity.type === 'payout' ? 'bg-green-100 dark:bg-green-900' :
                      'bg-gray-100 dark:bg-gray-600'
                    }`}>
                      {activity.type === 'investment' && (
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      )}
                      {activity.type === 'payout' && (
                        <svg className="w-5 h-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{activity.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {activity.amount && (
                    <div className={`font-semibold ${
                      activity.type === 'payout' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {activity.type === 'payout' ? '+' : ''}{formatCurrency(activity.amount)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Alerts</h2>
            <Link href="/notifications" className="text-primary-600 hover:text-primary-900 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {/* Upcoming Payout Alert */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100">Upcoming Payout</p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Next payout scheduled for end of month
                  </p>
                </div>
              </div>
            </div>

            {/* New Deals Alert */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">New Opportunities</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    5 new deals available for investment
                  </p>
                  <Link href="/deals" className="text-xs text-blue-600 font-semibold mt-2 inline-block">
                    Browse Deals →
                  </Link>
                </div>
              </div>
            </div>

            {/* Portfolio Performance */}
            {summary && parseFloat(summary.returnPercentage) > 0 && (
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Portfolio Up!</p>
                    <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                      Your portfolio has grown by {formatPercentage(summary.returnPercentage)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Secondary Market Alert */}
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">Secondary Market</p>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    New listings available for purchase
                  </p>
                  <Link href="/secondary-market" className="text-xs text-orange-600 font-semibold mt-2 inline-block">
                    Browse Market →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Goal Tracking */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Investment Goal Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goal 1: Total Investment Target */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Investment Target</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {summary ? formatCurrency(summary.totalInvested) : formatCurrency(0)} / {formatCurrency(100000)}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                style={{ width: `${summary ? Math.min((summary.totalInvested / 100000) * 100, 100) : 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {summary ? ((summary.totalInvested / 100000) * 100).toFixed(1) : 0}% of goal achieved
            </p>
          </div>

          {/* Goal 2: ROI Target */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ROI Target</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">
                {summary ? formatPercentage(summary.returnPercentage) : '0%'} / 20%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                style={{ width: `${summary ? Math.min((parseFloat(summary.returnPercentage.toString()) / 20) * 100, 100) : 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {summary ? ((parseFloat(summary.returnPercentage.toString()) / 20) * 100).toFixed(1) : 0}% of goal achieved
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Link href="/deals">
            <button className="w-full px-4 py-3 bg-primary-100 text-primary-800 rounded-lg hover:bg-primary-200 transition text-sm font-semibold">
              Browse Deals
            </button>
          </Link>
          <Link href="/bundles">
            <button className="w-full px-4 py-3 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 transition text-sm font-semibold">
              View Bundles
            </button>
          </Link>
          <Link href="/wallet">
            <button className="w-full px-4 py-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition text-sm font-semibold">
              Add Funds
            </button>
          </Link>
          <Link href="/analytics">
            <button className="w-full px-4 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition text-sm font-semibold">
              View Analytics
            </button>
          </Link>
          <Link href="/referrals">
            <button className="w-full px-4 py-3 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition text-sm font-semibold">
              Refer & Earn
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  color,
  clickable = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  clickable?: boolean;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6 ${clickable ? 'cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1' : ''}`}>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      <div className="text-sm text-gray-600">{subtitle}</div>
      {clickable && (
        <div className="mt-2 text-xs text-primary-600 font-semibold">
          Click to view details →
        </div>
      )}
    </div>
  );
}

function getColorForType(type: string): string {
  const colors: Record<string, string> = {
    real_estate: 'bg-blue-500',
    franchise: 'bg-purple-500',
    startup: 'bg-green-500',
    asset: 'bg-orange-500',
  };
  return colors[type] || 'bg-gray-500';
}
