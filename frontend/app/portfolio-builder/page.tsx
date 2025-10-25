'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface PortfolioItem {
  id: string;
  dealTitle: string;
  type: string;
  amount: number;
  expectedRoi: number;
  holdingPeriod: number;
}

export default function PortfolioBuilderPage() {
  const [totalBudget, setTotalBudget] = useState(100000);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Available deals for portfolio
  const availableDeals = [
    { id: '1', title: 'Dubai Marina Waterfront', type: 'Real Estate', roi: 18, period: 24, min: 25000, color: 'bg-blue-500' },
    { id: '2', title: 'TikTok Café Franchise', type: 'Franchise', roi: 48, period: 12, min: 50000, color: 'bg-green-500' },
    { id: '3', title: 'Luxury Watch Portfolio', type: 'Alternative Assets', roi: 35, period: 18, min: 50000, color: 'bg-purple-500' },
    { id: '4', title: 'Smart Gym Chain', type: 'Franchise', roi: 27, period: 18, min: 100000, color: 'bg-green-500' },
    { id: '5', title: 'Trade Inventory Pool', type: 'Trade', roi: 22, period: 12, min: 10000, color: 'bg-yellow-500' },
    { id: '6', title: 'Tech Startup Fund', type: 'Equity', roi: 65, period: 36, min: 75000, color: 'bg-red-500' },
    { id: '7', title: 'Downtown Office Tower', type: 'Real Estate', roi: 16, period: 36, min: 50000, color: 'bg-blue-500' },
    { id: '8', title: 'Classic Car Collection', type: 'Alternative Assets', roi: 42, period: 24, min: 100000, color: 'bg-purple-500' },
  ];

  const addToPortfolio = (deal: typeof availableDeals[0], amount: number) => {
    const newItem: PortfolioItem = {
      id: `${deal.id}-${Date.now()}`,
      dealTitle: deal.title,
      type: deal.type,
      amount,
      expectedRoi: deal.roi,
      holdingPeriod: deal.period
    };
    setPortfolioItems([...portfolioItems, newItem]);
  };

  const removeFromPortfolio = (id: string) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
  };

  const updateItemAmount = (id: string, amount: number) => {
    setPortfolioItems(portfolioItems.map(item =>
      item.id === id ? { ...item, amount } : item
    ));
  };

  // Portfolio calculations
  const totalInvested = portfolioItems.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = totalBudget - totalInvested;
  const weightedROI = portfolioItems.length > 0
    ? portfolioItems.reduce((sum, item) => sum + (item.expectedRoi * item.amount), 0) / totalInvested
    : 0;
  const projectedAnnualReturn = (totalInvested * weightedROI) / 100;

  // Diversification analysis
  const typeDistribution = portfolioItems.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);

  const diversificationScore = Object.keys(typeDistribution).length >= 3 ? 85 :
    Object.keys(typeDistribution).length === 2 ? 60 : 40;

  const categories = ['all', 'Real Estate', 'Franchise', 'Alternative Assets', 'Trade', 'Equity'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Portfolio Builder
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Build and visualize your ideal investment portfolio with AI-powered diversification insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Portfolio Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Budget Setter */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Set Your Investment Budget</h2>
            <div className="mb-4">
              <input
                type="range"
                min={10000}
                max={1000000}
                step={10000}
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">AED 10,000</span>
                <span className="text-3xl font-bold text-blue-600">{formatCurrency(totalBudget)}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">AED 1,000,000</span>
              </div>
            </div>

            {/* Budget Status */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">Total Budget</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalBudget)}
                </div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">Invested</div>
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(totalInvested)}
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-xs text-gray-500 dark:text-gray-400">Remaining</div>
                <div className="text-lg font-bold text-purple-600">
                  {formatCurrency(remainingBudget)}
                </div>
              </div>
            </div>
          </div>

          {/* Current Portfolio */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Your Portfolio ({portfolioItems.length} deals)</h2>

            {portfolioItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Your portfolio is empty
                </p>
                <p className="text-sm text-gray-500">
                  Add deals from the available options below to start building
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {portfolioItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">{item.dealTitle}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{item.type}</div>
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateItemAmount(item.id, Number(e.target.value))}
                        className="w-full px-2 py-1 border rounded text-sm"
                        min={1000}
                        step={1000}
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">{formatPercentage(item.expectedRoi)}</div>
                      <div className="text-xs text-gray-500">{item.holdingPeriod}m</div>
                    </div>
                    <button
                      onClick={() => removeFromPortfolio(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Deals */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Available Deals</h2>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableDeals
                .filter(deal => selectedCategory === 'all' || deal.type === selectedCategory)
                .map((deal) => (
                  <div key={deal.id} className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className={`inline-block px-2 py-1 ${deal.color} text-white text-xs rounded mb-2`}>
                          {deal.type}
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">{deal.title}</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>
                        <div className="text-gray-500">ROI</div>
                        <div className="font-bold text-green-600">{deal.roi}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Min</div>
                        <div className="font-bold">{formatCurrency(deal.min)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => addToPortfolio(deal, deal.min)}
                      disabled={remainingBudget < deal.min}
                      className={`w-full py-2 rounded text-sm font-semibold ${
                        remainingBudget >= deal.min
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {remainingBudget >= deal.min ? 'Add to Portfolio' : 'Insufficient Budget'}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column - Analytics */}
        <div className="lg:col-span-1 space-y-6">
          {/* Portfolio Summary Sticky Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-lg p-6 sticky top-4 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Portfolio Analytics</h3>

            {/* Expected Returns */}
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Weighted Avg ROI</div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {portfolioItems.length > 0 ? formatPercentage(weightedROI) : '0%'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Projected Annual Return: <span className="font-bold text-green-600">{formatCurrency(projectedAnnualReturn)}</span>
              </div>
            </div>

            {/* Diversification Score */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Diversification Score</span>
                <span className="text-2xl font-bold text-blue-600">{diversificationScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full"
                  style={{ width: `${diversificationScore}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {diversificationScore >= 85 ? '✓ Well diversified' :
                  diversificationScore >= 60 ? '⚠️ Moderate diversification' :
                    '❌ Low diversification'}
              </p>
            </div>

            {/* Asset Allocation Pie Chart */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3">Asset Allocation</h4>
              {totalInvested > 0 ? (
                <div className="space-y-2">
                  {Object.entries(typeDistribution).map(([type, amount]) => {
                    const percentage = (amount / totalInvested) * 100;
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-700 dark:text-gray-300">{type}</span>
                          <span className="font-semibold">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No allocations yet</p>
              )}
            </div>

            {/* Risk Analysis */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
              <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Risk Assessment
              </h4>
              <div className="text-xs text-yellow-800 dark:text-yellow-200">
                {weightedROI > 40 ? '⚠️ High Risk - High ROI portfolio' :
                  weightedROI > 25 ? '📊 Moderate Risk - Balanced approach' :
                    '🛡️ Low Risk - Conservative strategy'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                disabled={portfolioItems.length === 0}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Portfolio
              </button>
              <Link href="/deals">
                <button className="w-full btn-secondary">
                  Browse More Deals
                </button>
              </Link>
            </div>
          </div>

          {/* Recommendations */}
          {portfolioItems.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-3">Suggestions</h3>
              <div className="space-y-3 text-sm">
                {diversificationScore < 85 && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="font-semibold text-blue-900 dark:text-blue-100">Improve Diversification</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Add deals from different categories to reduce risk
                    </div>
                  </div>
                )}
                {remainingBudget > 10000 && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="font-semibold text-green-900 dark:text-green-100">Deploy Remaining Capital</div>
                    <div className="text-xs text-green-700 dark:text-green-300 mt-1">
                      You have {formatCurrency(remainingBudget)} available to invest
                    </div>
                  </div>
                )}
                {weightedROI < 20 && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="font-semibold text-purple-900 dark:text-purple-100">Boost Returns</div>
                    <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                      Consider adding higher ROI deals to increase overall returns
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
