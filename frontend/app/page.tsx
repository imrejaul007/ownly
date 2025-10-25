'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Deal } from '@/types';
import { dealAPI, bundleAPI, secondaryMarketAPI } from '@/lib/api';
import { formatCurrency, formatPercentage, getDealTypeLabel, calculateFundingProgress, getStatusColor } from '@/lib/utils';
import axios from 'axios';

interface PlatformStats {
  totalInvestment: number;
  activeInvestors: number;
  avgROI: number;
  successfulDeals: number;
  totalDeals: number;
  totalPayouts: number;
}

export default function Marketplace() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [secondaryListings, setSecondaryListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [filter, setFilter] = useState({
    type: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    fetchDeals();
    fetchBundles();
    fetchSecondaryListings();
    fetchPlatformStats();
  }, [filter]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await dealAPI.list(filter);
      setDeals(response.data.data);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBundles = async () => {
    try {
      const response = await bundleAPI.list();
      setBundles(response.data.data.slice(0, 3)); // Get top 3 bundles for home page
    } catch (error) {
      console.error('Error fetching bundles:', error);
    }
  };

  const fetchSecondaryListings = async () => {
    try {
      const response = await secondaryMarketAPI.getActiveListings({});
      setSecondaryListings(response.data.data.listings.slice(0, 3)); // Get top 3 listings for home page
    } catch (error) {
      console.error('Error fetching secondary listings:', error);
    }
  };

  const fetchPlatformStats = async () => {
    try {
      // Calculate stats from deals data
      const allDealsResponse = await dealAPI.list({});
      const allDeals = allDealsResponse.data.data;

      // Calculate aggregate stats
      const totalInvestment = allDeals.reduce((sum: number, deal: Deal) => sum + parseFloat(deal.raised_amount?.toString() || '0'), 0);
      const totalDeals = allDeals.length;
      const successfulDeals = allDeals.filter((deal: Deal) => deal.status === 'funded' || deal.status === 'completed').length;
      const avgROI = allDeals.reduce((sum: number, deal: Deal) => sum + (parseFloat(deal.expected_roi?.toString() || '0')), 0) / (totalDeals || 1);

      // Unique investors count (aggregate from all deals)
      const activeInvestors = allDeals.reduce((sum: number, deal: Deal) => sum + (deal.investor_count || 0), 0);

      setStats({
        totalInvestment,
        activeInvestors,
        avgROI,
        successfulDeals,
        totalDeals,
        totalPayouts: totalInvestment * 0.15, // Estimate: 15% of total investment as payouts
      });
    } catch (error) {
      console.error('Error fetching platform stats:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-12 mb-8 text-white overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32"></div>

        <div className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-yellow-400/20 backdrop-blur-sm rounded-full text-yellow-300 text-sm font-semibold mb-4 border border-yellow-400/30">
                ✨ Start investing from AED 1,000
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Build Wealth Through<br />
                <span className="text-yellow-300">Fractional Ownership</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Invest in premium real estate, thriving franchises, and innovative startups.
                Earn passive income with returns up to <span className="font-bold text-yellow-300">45% APY</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/deals">
                  <button className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-yellow-300 hover:text-indigo-900 transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
                    Start Investing Now →
                  </button>
                </Link>
                <Link href="/academy">
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all font-bold text-lg">
                    Learn How It Works
                  </button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-yellow-300">{stats ? formatCurrency(stats.totalInvestment) : '...'}</div>
                  <div className="text-sm text-blue-200">Total Invested</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-300">{stats ? `${stats.avgROI.toFixed(1)}%` : '...'}</div>
                  <div className="text-sm text-blue-200">Avg Returns</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-300">{stats ? `${stats.activeInvestors}+` : '...'}</div>
                  <div className="text-sm text-blue-200">Active Investors</div>
                </div>
              </div>
            </div>

            {/* Hero Visual/Stats Panel */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-lg font-semibold mb-4">💰 Today's Opportunities</div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-3 text-2xl">
                        🏠
                      </div>
                      <div>
                        <div className="font-semibold">Real Estate</div>
                        <div className="text-sm text-blue-200">{deals.filter(d => d.type === 'real_estate').length} deals available</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-300 font-bold">15-25%</div>
                      <div className="text-xs text-blue-200">ROI</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-3 text-2xl">
                        💼
                      </div>
                      <div>
                        <div className="font-semibold">Franchises</div>
                        <div className="text-sm text-blue-200">{deals.filter(d => d.type === 'franchise').length} deals available</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-300 font-bold">20-35%</div>
                      <div className="text-xs text-blue-200">ROI</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-3 text-2xl">
                        🚀
                      </div>
                      <div>
                        <div className="font-semibold">Startups</div>
                        <div className="text-sm text-blue-200">{deals.filter(d => d.type === 'startup').length} deals available</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-300 font-bold">25-45%</div>
                      <div className="text-xs text-blue-200">ROI</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition - Why Choose Us */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Why Investors Choose OWNLY
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            The smartest way to build passive income and diversify your portfolio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-200">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 text-2xl shadow-lg">
              💰
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Passive Income</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Earn monthly dividends and profit distributions. Average AED 500-2,000/month per investment.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all border-2 border-transparent hover:border-green-200">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 text-2xl shadow-lg">
              🎯
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Low Entry Point</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start with just AED 1,000. Access investments that traditionally required millions.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-200">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 text-2xl shadow-lg">
              🔒
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Secure & Regulated</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Full transparency with SPV structure. Legal ownership, professional management.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all border-2 border-transparent hover:border-orange-200">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 text-2xl shadow-lg">
              📊
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Instant Diversification</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Spread risk across multiple assets. Real estate, franchises, and startups in one portfolio.
            </p>
          </div>
        </div>
      </div>

      {/* Platform Statistics */}
      {stats && (
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Platform Track Record</h2>
              <p className="text-primary-100">Trusted by thousands of investors worldwide</p>
            </div>
            <div className="text-5xl">🏆</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all">
              <div className="text-sm text-primary-100 mb-2">Total Investment</div>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalInvestment)}</div>
              <div className="text-xs text-primary-200 mt-1">Platform-wide</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all">
              <div className="text-sm text-primary-100 mb-2">Active Investors</div>
              <div className="text-2xl font-bold">{stats.activeInvestors.toLocaleString()}+</div>
              <div className="text-xs text-primary-200 mt-1">Growing daily</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all">
              <div className="text-sm text-primary-100 mb-2">Avg. ROI</div>
              <div className="text-2xl font-bold">{stats.avgROI.toFixed(1)}%</div>
              <div className="text-xs text-primary-200 mt-1">Historical average</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all">
              <div className="text-sm text-primary-100 mb-2">Success Rate</div>
              <div className="text-2xl font-bold">
                {stats.totalDeals > 0 ? ((stats.successfulDeals / stats.totalDeals) * 100).toFixed(0) : 0}%
              </div>
              <div className="text-xs text-primary-200 mt-1">{stats.successfulDeals} of {stats.totalDeals} deals</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all">
              <div className="text-sm text-primary-100 mb-2">Total Distributed</div>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalPayouts)}</div>
              <div className="text-xs text-primary-200 mt-1">Payouts to investors</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all">
              <div className="text-sm text-primary-100 mb-2">Active Deals</div>
              <div className="text-2xl font-bold">{deals.length}</div>
              <div className="text-xs text-primary-200 mt-1">Available now</div>
            </div>
          </div>
        </div>
      )}

      {/* How It Works Section */}
      <div className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Start Earning in 3 Simple Steps
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            From browsing to earning passive income in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 -z-10"></div>

          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border-2 border-blue-200 hover:border-blue-400 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🔍</span>
              </div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Browse Opportunities</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Explore vetted real estate, franchises, and startups. View detailed financials, ROI projections, and monthly income potential.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center">✓ Transparent financials</li>
                <li className="flex items-center">✓ Risk assessments</li>
                <li className="flex items-center">✓ Expected returns</li>
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border-2 border-purple-200 hover:border-purple-400 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">💳</span>
              </div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Invest Securely</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Choose your investment amount (from AED 1,000). Complete the secure transaction. Get instant ownership shares.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center">✓ SPV legal structure</li>
                <li className="flex items-center">✓ Secure payment</li>
                <li className="flex items-center">✓ Instant confirmation</li>
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center border-2 border-green-200 hover:border-green-400 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">📈</span>
              </div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Earn Passive Income</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Receive monthly dividends directly to your wallet. Track performance in real-time. Exit anytime via secondary market.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center">✓ Monthly payouts</li>
                <li className="flex items-center">✓ Real-time tracking</li>
                <li className="flex items-center">✓ Liquidity options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Bundles Promotion */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">New: Investment Bundles 📦</h2>
            <p className="text-indigo-100 text-lg">
              Diversify instantly with pre-curated portfolios. One-click investing, professional allocation.
            </p>
          </div>
          <div className="hidden lg:block text-6xl">🚀</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-bold mb-1">Instant Diversification</h3>
            <p className="text-sm text-indigo-100">Spread risk across multiple deals automatically</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl mb-2">💎</div>
            <h3 className="font-bold mb-1">Expert Selection</h3>
            <p className="text-sm text-indigo-100">Professionally curated for optimal returns</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-bold mb-1">ROI up to 45%</h3>
            <p className="text-sm text-indigo-100">Higher returns through strategic allocation</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/bundles" className="flex-1 sm:flex-initial">
            <button className="w-full px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-bold text-lg shadow-lg">
              Explore 6 Investment Bundles →
            </button>
          </Link>
          <div className="text-sm text-indigo-100">
            <span className="font-semibold">Starting from $1,000</span> • 6 bundles available • 18-45% ROI
          </div>
        </div>
      </div>

      {/* Featured Deals Section Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🔥 Featured Investment Opportunities
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Browse {deals.length} curated deals across Real Estate, Franchises, and Startups
            </p>
          </div>
          <Link href="/deals" className="hidden md:block">
            <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all font-semibold shadow-md">
              View All Deals →
            </button>
          </Link>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter({ type: '', status: '', search: '' })}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              filter.type === '' && filter.status === ''
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            All Deals
          </button>
          <button
            onClick={() => setFilter({ ...filter, type: 'real_estate' })}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              filter.type === 'real_estate'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            🏠 Real Estate
          </button>
          <button
            onClick={() => setFilter({ ...filter, type: 'franchise' })}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              filter.type === 'franchise'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            💼 Franchises
          </button>
          <button
            onClick={() => setFilter({ ...filter, type: 'startup' })}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              filter.type === 'startup'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            🚀 Startups
          </button>
          <button
            onClick={() => setFilter({ ...filter, status: 'open' })}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              filter.status === 'open'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            ✨ Open Now
          </button>
        </div>

        {/* Advanced Filters - Collapsible */}
        <details className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
            🔍 Advanced Filters
          </summary>
          <div className="px-6 pb-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search by Name
                </label>
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deal Type
                </label>
                <select
                  value={filter.type}
                  onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Types</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="franchise">Franchise</option>
                  <option value="startup">Startup</option>
                  <option value="asset">Asset</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Status</option>
                  <option value="open">Open</option>
                  <option value="funding">Funding</option>
                  <option value="funded">Funded</option>
                </select>
              </div>
            </div>
          </div>
        </details>
      </div>

      {/* Deals Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading deals...</p>
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600">No deals found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}

      {/* Investment Bundles Section */}
      {bundles.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                📦 Smart Investment Bundles
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Diversified portfolios curated by experts • One-click investing
              </p>
            </div>
            <Link href="/bundles" className="hidden md:block">
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all font-semibold shadow-md">
                View All Bundles →
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <Link href={`/bundles/${bundle.id}`} key={bundle.id}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transform hover:-translate-y-1">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold">{bundle.name}</h3>
                      <span className="text-4xl">📦</span>
                    </div>
                    <p className="text-indigo-100 text-sm line-clamp-2">{bundle.description}</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                        <div className="text-xs text-green-600 dark:text-green-400 mb-1">Expected ROI</div>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                          {bundle.expected_roi}%
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                        <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Min. Investment</div>
                        <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                          {formatCurrency(bundle.min_investment)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        {bundle.allocation?.length || 0} deals
                      </span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        View Bundle →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Secondary Market Section */}
      {secondaryListings.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                💱 Secondary Market
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Buy pre-owned shares from other investors • Instant ownership
              </p>
            </div>
            <Link href="/secondary-market" className="hidden md:block">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-lg hover:from-purple-700 hover:to-pink-800 transition-all font-semibold shadow-md">
                View All Listings →
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {secondaryListings.map((listing) => {
              const deal = listing.investment?.deal;
              const expectedROI = deal?.expected_roi || 12;
              const monthlyRevenue = (parseFloat(listing.total_price || 0) * (expectedROI / 100)) / 12;

              return (
                <Link href={`/secondary-market/${listing.id}`} key={listing.id}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800 transform hover:-translate-y-1">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-700 p-1">
                      <div className="bg-white dark:bg-gray-800 p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                              {deal?.title || 'Investment Opportunity'}
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {deal ? getDealTypeLabel(deal.type) : 'Asset'}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                            <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Total Price</div>
                            <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                              {formatCurrency(listing.total_price)}
                            </div>
                          </div>
                          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3">
                            <div className="text-xs text-teal-600 dark:text-teal-400 mb-1">Monthly Inc.</div>
                            <div className="text-lg font-bold text-teal-700 dark:text-teal-300">
                              {formatCurrency(monthlyRevenue)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">{listing.shares_for_sale}</span> shares
                          </div>
                          <div className="flex items-center text-green-600 dark:text-green-400 font-semibold">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                            {expectedROI}% ROI
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  const fundingProgress = calculateFundingProgress(deal.raised_amount, deal.target_amount);
  const statusColor = getStatusColor(deal.status);

  // Calculate monthly passive income based on minimum investment
  const minInvestment = parseFloat(deal.min_ticket?.toString() || '0');
  const expectedROI = parseFloat(deal.expected_roi?.toString() || '0');
  const monthlyIncome = (minInvestment * (expectedROI / 100)) / 12;
  const isHighYield = expectedROI > 20;

  return (
    <Link href={`/deals/${deal.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-800 transform hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-56 bg-gray-200 overflow-hidden">
          {deal.images && deal.images[0] ? (
            <img
              src={deal.images[0]}
              alt={deal.title}
              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
              <span className="text-primary-600 font-semibold text-lg">
                {getDealTypeLabel(deal.type)}
              </span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <span className={`badge badge-${statusColor} capitalize shadow-lg`}>
              {deal.status}
            </span>
            {isHighYield && (
              <span className="badge bg-yellow-400 text-yellow-900 shadow-lg">
                ⭐ High Yield
              </span>
            )}
          </div>

          <div className="absolute top-3 left-3">
            <span className="badge bg-white text-gray-800 shadow-lg font-semibold">
              {getDealTypeLabel(deal.type)}
            </span>
          </div>

          {/* Monthly Income Banner */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-white/50 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-600 mb-1">💰 Est. Monthly Income</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(monthlyIncome)}/mo
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600 mb-1">Expected ROI</div>
                  <div className="text-xl font-bold text-primary-600">
                    {formatPercentage(expectedROI)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[56px]">
            {deal.title}
          </h3>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {deal.location}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Min. Investment</div>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(deal.min_ticket)}
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
              <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Target</div>
              <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                {formatCurrency(deal.target_amount)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-auto">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400 font-semibold">Funding Progress</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {fundingProgress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 relative"
                style={{ width: `${fundingProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                {formatCurrency(deal.raised_amount)}
              </span>
              <span className="flex items-center font-semibold">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                {deal.investor_count} investors
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
