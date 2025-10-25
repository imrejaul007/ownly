'use client';

import { useState, useEffect } from 'react';
import { investmentAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, exited

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const response = await investmentAPI.myInvestments();
      setInvestments(response.data.data.investments || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      exited: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getAssetIcon = (type: string) => {
    const icons: any = {
      real_estate: '🏠',
      franchise: '💼',
      startup: '🚀',
      asset: '💎',
    };
    return icons[type] || '📊';
  };

  const calculateROI = (investment: any) => {
    const invested = parseFloat(investment.amount || 0);
    const current = parseFloat(investment.current_value || invested);
    return invested > 0 ? (((current - invested) / invested) * 100).toFixed(2) : '0.00';
  };

  const calculateGainLoss = (investment: any) => {
    const invested = parseFloat(investment.amount || 0);
    const current = parseFloat(investment.current_value || invested);
    return current - invested;
  };

  const filteredInvestments = investments.filter((inv) => {
    if (filter === 'all') return true;
    if (filter === 'active') return inv.status === 'active';
    if (filter === 'exited') return inv.status === 'exited' || inv.status === 'completed';
    return true;
  });

  // Calculate portfolio summary
  const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + parseFloat(inv.current_value || inv.amount || 0), 0);
  const totalGainLoss = totalCurrentValue - totalInvested;
  const portfolioROI = totalInvested > 0 ? ((totalGainLoss / totalInvested) * 100).toFixed(2) : '0.00';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              My Investment Portfolio
            </h1>
            <p className="text-blue-100">
              {investments.length} {investments.length === 1 ? 'Investment' : 'Investments'} • {investments.filter(i => i.status === 'active').length} Active
            </p>
          </div>
          <div className="hidden md:block text-7xl">💼</div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-blue-100 text-xs mb-1">Total Invested</div>
            <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-blue-100 text-xs mb-1">Current Value</div>
            <div className="text-2xl font-bold">{formatCurrency(totalCurrentValue)}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-blue-100 text-xs mb-1">Total Returns</div>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-blue-100 text-xs mb-1">Portfolio ROI</div>
            <div className={`text-2xl font-bold ${parseFloat(portfolioROI) >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {parseFloat(portfolioROI) >= 0 ? '+' : ''}{portfolioROI}%
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Asset Allocation Pie */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Asset Allocation</h3>

          {/* Calculate asset type breakdown */}
          {(() => {
            const assetTypes = investments.reduce((acc, inv) => {
              const type = inv.deal?.type || 'unknown';
              const amount = parseFloat(inv.amount || 0);
              acc[type] = (acc[type] || 0) + amount;
              return acc;
            }, {} as Record<string, number>);

            const totalAmount = Object.values(assetTypes).reduce((sum, val) => sum + val, 0);

            return (
              <div className="space-y-3">
                {Object.entries(assetTypes).map(([type, amount]) => {
                  const percentage = totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : '0';
                  const colors: Record<string, string> = {
                    real_estate: 'bg-blue-500',
                    franchise: 'bg-green-500',
                    startup: 'bg-orange-500',
                    asset: 'bg-purple-500',
                  };

                  return (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center">
                          <span className="mr-2">{getAssetIcon(type)}</span>
                          <span className="text-gray-700 dark:text-gray-300 capitalize">
                            {type.replace('_', ' ')}
                          </span>
                        </span>
                        <span className="font-bold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colors[type] || 'bg-gray-500'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Performance Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Performance Overview</h3>

          <div className="space-y-4">
            {/* Best Performer */}
            {(() => {
              const bestPerformer = [...investments].sort((a, b) =>
                parseFloat(calculateROI(b)) - parseFloat(calculateROI(a))
              )[0];

              return bestPerformer && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">🏆 Best Performer</div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {bestPerformer.deal?.title}
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    +{calculateROI(bestPerformer)}% ROI
                  </div>
                </div>
              );
            })()}

            {/* Total Shares Owned */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Shares</div>
              <div className="text-2xl font-bold text-blue-600">
                {investments.reduce((sum, inv) => sum + (inv.shares_issued || 0), 0).toLocaleString()}
              </div>
            </div>

            {/* Diversification Score */}
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Diversification</div>
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 bg-purple-500 rounded-full"
                      style={{ width: `${Math.min((investments.length / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <span className="ml-2 text-sm font-bold text-purple-600">
                  {investments.length}/10
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>

          <div className="space-y-3">
            <Link href="/deals">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold text-sm flex items-center justify-between">
                <span>Browse New Deals</span>
                <span>→</span>
              </button>
            </Link>

            <Link href="/bundles">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition font-semibold text-sm flex items-center justify-between">
                <span>Smart Bundles</span>
                <span>→</span>
              </button>
            </Link>

            <Link href="/secondary-market">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold text-sm flex items-center justify-between">
                <span>Secondary Market</span>
                <span>→</span>
              </button>
            </Link>

            <Link href="/dashboard">
              <button className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-semibold text-sm flex items-center justify-between">
                <span>View Analytics</span>
                <span>📊</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All ({investments.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'active'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Active ({investments.filter((i) => i.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('exited')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'exited'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Exited ({investments.filter((i) => i.status === 'exited' || i.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Investments List */}
      {filteredInvestments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2">No investments yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start building your fractional ownership portfolio today
          </p>
          <Link href="/deals">
            <button className="btn-primary">
              Browse Investment Opportunities
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredInvestments.map((investment) => {
            const roi = calculateROI(investment);
            const gainLoss = calculateGainLoss(investment);
            const isPositive = parseFloat(roi) >= 0;
            const roiValue = Math.abs(parseFloat(roi));

            return (
              <div
                key={investment.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-800"
              >
                {/* Top Status Bar */}
                <div className={`h-2 ${isPositive ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-orange-500'}`}></div>

                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Left Section - Deal Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icon with gradient background */}
                      <div className="relative">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${
                          investment.deal?.type === 'real_estate' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                          investment.deal?.type === 'franchise' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                          investment.deal?.type === 'startup' ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                          'bg-gradient-to-br from-purple-400 to-purple-600'
                        } shadow-lg`}>
                          {getAssetIcon(investment.deal?.type)}
                        </div>
                        {/* Performance indicator badge */}
                        {isPositive && roiValue > 10 && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-xs">🔥</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <Link href={`/investments/${investment.id}`}>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition cursor-pointer mb-1">
                                {investment.deal?.title || 'Unknown Deal'}
                              </h3>
                            </Link>
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(investment.status)}`}>
                                {investment.status}
                              </span>
                              {investment.deal?.type && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                                  {investment.deal.type.replace('_', ' ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <span className="mr-2">📍</span>
                            <span>{investment.deal?.location || 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">📅</span>
                            <span>{new Date(investment.invested_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">🔢</span>
                            <span>{investment.shares_issued?.toLocaleString() || 0} shares</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Performance Metrics */}
                    <div className="lg:w-1/2">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {/* Invested Amount */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1 flex items-center">
                            <span className="mr-1">💰</span>
                            Invested
                          </div>
                          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                            {formatCurrency(investment.amount)}
                          </div>
                        </div>

                        {/* Current Value */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                          <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1 flex items-center">
                            <span className="mr-1">📈</span>
                            Current Value
                          </div>
                          <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                            {formatCurrency(investment.current_value || investment.amount)}
                          </div>
                        </div>

                        {/* Monthly Earnings */}
                        {(() => {
                          // Calculate estimated monthly earnings based on expected annual ROI
                          const expectedAnnualROI = investment.deal?.expected_roi || 12; // Default to 12% if not available
                          const monthlyEarning = (parseFloat(investment.amount || 0) * (expectedAnnualROI / 100)) / 12;

                          return (
                            <div className="bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-800/20 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
                              <div className="text-xs text-teal-600 dark:text-teal-400 font-semibold mb-1 flex items-center">
                                <span className="mr-1">💵</span>
                                Est. Monthly
                              </div>
                              <div className="text-xl font-bold text-teal-700 dark:text-teal-300">
                                {formatCurrency(monthlyEarning)}
                              </div>
                              <div className="text-xs text-teal-600 dark:text-teal-400 mt-1">
                                ~{expectedAnnualROI}% APY
                              </div>
                            </div>
                          );
                        })()}

                        {/* Gain/Loss */}
                        <div className={`bg-gradient-to-br ${
                          gainLoss >= 0
                            ? 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border-green-200 dark:border-green-800'
                            : 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border-red-200 dark:border-red-800'
                        } rounded-lg p-4 border`}>
                          <div className={`text-xs font-semibold mb-1 flex items-center ${
                            gainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            <span className="mr-1">{gainLoss >= 0 ? '↗' : '↘'}</span>
                            Gain/Loss
                          </div>
                          <div className={`text-xl font-bold ${
                            gainLoss >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                          }`}>
                            {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)}
                          </div>
                        </div>

                        {/* ROI with Progress Bar */}
                        <div className={`bg-gradient-to-br ${
                          isPositive
                            ? 'from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/20 border-green-200 dark:border-green-800'
                            : 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border-red-200 dark:border-red-800'
                        } rounded-lg p-4 border`}>
                          <div className={`text-xs font-semibold mb-1 flex items-center ${
                            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            <span className="mr-1">🎯</span>
                            Current ROI
                          </div>
                          <div className={`text-xl font-bold ${
                            isPositive ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                          }`}>
                            {isPositive ? '+' : '-'}{roiValue.toFixed(2)}%
                          </div>
                          {/* Mini Progress Bar */}
                          <div className="w-full bg-white dark:bg-gray-700 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                isPositive ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(roiValue, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Total Earned (if available) */}
                        {investment.total_payouts_received && parseFloat(investment.total_payouts_received) > 0 && (
                          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-800/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                            <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-1 flex items-center">
                              <span className="mr-1">💎</span>
                              Total Earned
                            </div>
                            <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
                              {formatCurrency(investment.total_payouts_received)}
                            </div>
                            <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                              Payouts received
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Performance Indicator */}
                      {isPositive && roiValue > 15 && (
                        <div className="mt-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2 flex items-center">
                          <span className="text-lg mr-2">⭐</span>
                          <span className="text-xs font-semibold text-yellow-800 dark:text-yellow-300">
                            Outstanding Performance! Top 10% ROI
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
                    <Link href={`/investments/${investment.id}`}>
                      <button className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg flex items-center">
                        <span className="mr-2">📊</span>
                        View Details
                      </button>
                    </Link>
                    <Link href={`/deals/${investment.deal_id}`}>
                      <button className="px-5 py-2.5 text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center">
                        <span className="mr-2">🏢</span>
                        Deal Info
                      </button>
                    </Link>
                    {investment.status === 'active' && (
                      <>
                        <Link href="/secondary-market">
                          <button className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/40 dark:hover:to-pink-800/40 transition-all flex items-center border border-purple-200 dark:border-purple-800">
                            <span className="mr-2">💱</span>
                            List for Sale
                          </button>
                        </Link>
                        <Link href="/documents">
                          <button className="px-5 py-2.5 text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center">
                            <span className="mr-2">📄</span>
                            Documents
                          </button>
                        </Link>
                        <Link href="/analytics">
                          <button className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:from-blue-200 hover:to-indigo-200 dark:hover:from-blue-800/40 dark:hover:to-indigo-800/40 transition-all flex items-center border border-blue-200 dark:border-blue-800">
                            <span className="mr-2">📈</span>
                            Analytics
                          </button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Investment Tips */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-3">💡 Investment Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>✓ Diversify across multiple asset classes (real estate, franchises, tech ventures)</li>
          <li>✓ Monitor your portfolio regularly and track ROI trends</li>
          <li>✓ Use the secondary market to exit positions early if needed</li>
          <li>✓ Reinvest dividends for compound growth</li>
          <li>✓ Review risk scores before making new investments</li>
        </ul>
      </div>
    </div>
  );
}
