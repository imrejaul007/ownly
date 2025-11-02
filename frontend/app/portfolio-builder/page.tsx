'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatPercentage } from '@/lib/utils';
import { usePreferences } from '@/context/PreferencesContext';
import {
  Briefcase, DollarSign, TrendingUp, PieChart, Target, Sparkles,
  Plus, X, BarChart3, AlertCircle, Check, Filter, Package
} from 'lucide-react';

interface PortfolioItem {
  id: string;
  dealTitle: string;
  type: string;
  amount: number;
  expectedRoi: number;
  holdingPeriod: number;
}

export default function PortfolioBuilderPage() {
  const { formatCurrency } = usePreferences();
  const [totalBudget, setTotalBudget] = useState(100000);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Available deals for portfolio
  const availableDeals = [
    { id: '1', title: 'Dubai Marina Waterfront', type: 'Real Estate', roi: 18, period: 24, min: 25000, color: 'from-blue-500 to-cyan-600' },
    { id: '2', title: 'TikTok Café Franchise', type: 'Franchise', roi: 48, period: 12, min: 50000, color: 'from-green-500 to-emerald-600' },
    { id: '3', title: 'Luxury Watch Portfolio', type: 'Alternative Assets', roi: 35, period: 18, min: 50000, color: 'from-purple-500 to-pink-600' },
    { id: '4', title: 'Smart Gym Chain', type: 'Franchise', roi: 27, period: 18, min: 100000, color: 'from-green-500 to-emerald-600' },
    { id: '5', title: 'Trade Inventory Pool', type: 'Trade', roi: 22, period: 12, min: 10000, color: 'from-yellow-500 to-orange-600' },
    { id: '6', title: 'Tech Startup Fund', type: 'Equity', roi: 65, period: 36, min: 75000, color: 'from-red-500 to-pink-600' },
    { id: '7', title: 'Downtown Office Tower', type: 'Real Estate', roi: 16, period: 36, min: 50000, color: 'from-blue-500 to-cyan-600' },
    { id: '8', title: 'Classic Car Collection', type: 'Alternative Assets', roi: 42, period: 24, min: 100000, color: 'from-purple-500 to-pink-600' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                Portfolio Builder
              </h1>
            </div>
          </div>
          <p className="text-purple-200 text-lg">
            Build and visualize your ideal investment portfolio with AI-powered diversification insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Portfolio Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Budget Setter */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Set Your Investment Budget</h2>
              </div>
              <div className="mb-6">
                <input
                  type="range"
                  min={10000}
                  max={1000000}
                  step={10000}
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full h-3 bg-blue-500/20 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${((totalBudget - 10000) / 990000) * 100}%, rgba(59, 130, 246, 0.2) ${((totalBudget - 10000) / 990000) * 100}%, rgba(59, 130, 246, 0.2) 100%)`
                  }}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-purple-300">AED 10,000</span>
                  <span className="text-3xl font-bold text-blue-400">{formatCurrency(totalBudget)}</span>
                  <span className="text-sm text-purple-300">AED 1,000,000</span>
                </div>
              </div>

              {/* Budget Status */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <div className="text-xs text-blue-300 mb-2">Total Budget</div>
                  <div className="text-xl font-bold text-white">
                    {formatCurrency(totalBudget)}
                  </div>
                </div>
                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="text-xs text-green-300 mb-2">Invested</div>
                  <div className="text-xl font-bold text-green-400">
                    {formatCurrency(totalInvested)}
                  </div>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <div className="text-xs text-purple-300 mb-2">Remaining</div>
                  <div className="text-xl font-bold text-purple-400">
                    {formatCurrency(remainingBudget)}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Portfolio */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Your Portfolio ({portfolioItems.length} deals)</h2>
              </div>

              {portfolioItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-white font-semibold mb-2">
                    Your portfolio is empty
                  </p>
                  <p className="text-sm text-purple-300">
                    Add deals from the available options below to start building
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolioItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex-1">
                        <div className="font-bold text-white">{item.dealTitle}</div>
                        <div className="text-xs text-purple-300">{item.type}</div>
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateItemAmount(item.id, Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-500"
                          min={1000}
                          step={1000}
                        />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-400">{formatPercentage(item.expectedRoi)}</div>
                        <div className="text-xs text-purple-300">{item.holdingPeriod}m</div>
                      </div>
                      <button
                        onClick={() => removeFromPortfolio(item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Deals */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Filter className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">Available Deals</h2>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-slate-800">{cat === 'all' ? 'All Categories' : cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableDeals
                  .filter(deal => selectedCategory === 'all' || deal.type === selectedCategory)
                  .map((deal) => (
                    <div key={deal.id} className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/30 transition-all hover:scale-105 duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className={`inline-block px-3 py-1 bg-gradient-to-r ${deal.color} text-white text-xs rounded-full mb-2 font-semibold`}>
                            {deal.type}
                          </div>
                          <h3 className="font-bold text-white text-sm">{deal.title}</h3>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                        <div className="p-2 bg-white/5 rounded-lg">
                          <div className="text-purple-300 mb-1">ROI</div>
                          <div className="font-bold text-green-400">{deal.roi}%</div>
                        </div>
                        <div className="p-2 bg-white/5 rounded-lg">
                          <div className="text-purple-300 mb-1">Min</div>
                          <div className="font-bold text-white">{formatCurrency(deal.min)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => addToPortfolio(deal, deal.min)}
                        disabled={remainingBudget < deal.min}
                        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                          remainingBudget >= deal.min
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
                            : 'bg-white/10 text-purple-400 cursor-not-allowed border border-white/10'
                        }`}
                      >
                        {remainingBudget >= deal.min ? (
                          <>
                            <Plus className="w-4 h-4" />
                            Add to Portfolio
                          </>
                        ) : 'Insufficient Budget'}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column - Analytics */}
          <div className="lg:col-span-1 space-y-6">
            {/* Portfolio Summary Sticky Card */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 sticky top-4 border-2 border-blue-500/30 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <PieChart className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Portfolio Analytics</h3>
              </div>

              {/* Expected Returns */}
              <div className="mb-6 p-4 bg-white/10 rounded-xl border border-white/10">
                <div className="text-xs text-purple-200 mb-2">Weighted Avg ROI</div>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {portfolioItems.length > 0 ? formatPercentage(weightedROI) : '0%'}
                </div>
                <div className="text-xs text-purple-300">
                  Projected Annual Return: <span className="font-bold text-green-400">{formatCurrency(projectedAnnualReturn)}</span>
                </div>
              </div>

              {/* Diversification Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white">Diversification Score</span>
                  <span className="text-2xl font-bold text-blue-400">{diversificationScore}/100</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 mb-2 overflow-hidden border border-white/10">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${diversificationScore}%` }}
                  />
                </div>
                <p className="text-xs text-purple-200 flex items-center gap-2">
                  {diversificationScore >= 85 ? (
                    <><Check className="w-4 h-4 text-green-400" /> Well diversified</>
                  ) : diversificationScore >= 60 ? (
                    <><AlertCircle className="w-4 h-4 text-yellow-400" /> Moderate diversification</>
                  ) : (
                    <><AlertCircle className="w-4 h-4 text-red-400" /> Low diversification</>
                  )}
                </p>
              </div>

              {/* Asset Allocation */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Asset Allocation
                </h4>
                {totalInvested > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(typeDistribution).map(([type, amount]) => {
                      const percentage = (amount / totalInvested) * 100;
                      return (
                        <div key={type}>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-purple-200">{type}</span>
                            <span className="font-bold text-white">{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden border border-white/10">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-purple-300 text-center py-4">No allocations yet</p>
                )}
              </div>

              {/* Risk Analysis */}
              <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20 mb-6">
                <h4 className="text-sm font-bold text-yellow-200 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Risk Assessment
                </h4>
                <div className="text-xs text-yellow-100">
                  {weightedROI > 40 ? 'High Risk - High ROI portfolio' :
                    weightedROI > 25 ? 'Moderate Risk - Balanced approach' :
                      'Low Risk - Conservative strategy'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  disabled={portfolioItems.length === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Save Portfolio
                </button>
                <Link href="/deals">
                  <button className="w-full bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/15 transition-all flex items-center justify-center gap-2 border border-white/10">
                    <TrendingUp className="w-5 h-5" />
                    Browse More Deals
                  </button>
                </Link>
              </div>
            </div>

            {/* Recommendations */}
            {portfolioItems.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Suggestions</h3>
                <div className="space-y-3 text-sm">
                  {diversificationScore < 85 && (
                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <div className="font-bold text-blue-300 mb-1">Improve Diversification</div>
                      <div className="text-xs text-blue-200">
                        Add deals from different categories to reduce risk
                      </div>
                    </div>
                  )}
                  {remainingBudget > 10000 && (
                    <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                      <div className="font-bold text-green-300 mb-1">Deploy Remaining Capital</div>
                      <div className="text-xs text-green-200">
                        You have {formatCurrency(remainingBudget)} available to invest
                      </div>
                    </div>
                  )}
                  {weightedROI < 20 && (
                    <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                      <div className="font-bold text-purple-300 mb-1">Boost Returns</div>
                      <div className="text-xs text-purple-200">
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
    </div>
  );
}
