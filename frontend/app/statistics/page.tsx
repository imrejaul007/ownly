'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp, DollarSign, Users, Building, Target, Award,
  BarChart3, PieChart, Activity, Wallet, ArrowRight, Globe,
  Calendar, CheckCircle, Clock, Star, TrendingDown, Percent
} from 'lucide-react';

export default function StatisticsPage() {
  const [timeframe, setTimeframe] = useState('all-time');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-AE').format(num);
  };

  // Mock data for demonstration
  const platformStats = {
    totalInvested: 245000000,
    totalInvestors: 8547,
    totalDeals: 342,
    avgROI: 28.5,
    totalPayouts: 67500000,
    activeDeals: 89,
    completedDeals: 253,
    successRate: 98.5,
    avgDealSize: 715000,
    totalProperties: 342,
    monthlyGrowth: 12.3
  };

  const performanceMetrics = [
    {
      category: 'Real Estate',
      deals: 156,
      avgROI: 24.5,
      totalInvested: 125000000,
      color: 'blue'
    },
    {
      category: 'Franchise',
      deals: 89,
      avgROI: 32.8,
      totalInvested: 67000000,
      color: 'green'
    },
    {
      category: 'Startups',
      deals: 54,
      avgROI: 41.2,
      totalInvested: 35000000,
      color: 'purple'
    },
    {
      category: 'Assets',
      deals: 43,
      avgROI: 19.5,
      totalInvested: 18000000,
      color: 'orange'
    }
  ];

  const monthlyTrends = [
    { month: 'Jan', deals: 12, investors: 145, amount: 8500000 },
    { month: 'Feb', deals: 15, investors: 189, amount: 11200000 },
    { month: 'Mar', deals: 18, investors: 234, amount: 14500000 },
    { month: 'Apr', deals: 21, investors: 287, amount: 17800000 },
    { month: 'May', deals: 24, investors: 312, amount: 19500000 },
    { month: 'Jun', deals: 28, investors: 398, amount: 23400000 }
  ];

  const topCities = [
    { city: 'Dubai', deals: 178, percentage: 52 },
    { city: 'Abu Dhabi', deals: 89, percentage: 26 },
    { city: 'Sharjah', deals: 45, percentage: 13 },
    { city: 'Ajman', deals: 30, percentage: 9 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-xl border border-purple-400/30 rounded-full text-purple-300 text-sm font-semibold mb-6">
            <BarChart3 className="w-4 h-4" />
            Platform Statistics
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            OWNLY by the Numbers
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Real-time insights into our platform's performance, investor activity, and deal success rates
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatCurrency(platformStats.totalInvested)}
            </div>
            <div className="text-sm text-purple-300">Total Invested</div>
            <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
              <ArrowRight className="w-3 h-3" />
              +{platformStats.monthlyGrowth}% this month
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatNumber(platformStats.totalInvestors)}
            </div>
            <div className="text-sm text-purple-300">Active Investors</div>
            <div className="mt-3 flex items-center gap-2 text-xs text-blue-400">
              <ArrowRight className="w-3 h-3" />
              +{formatNumber(398)} this month
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <CheckCircle className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {platformStats.totalDeals}
            </div>
            <div className="text-sm text-purple-300">Total Deals</div>
            <div className="mt-3 flex items-center gap-2 text-xs text-purple-400">
              <Activity className="w-3 h-3" />
              {platformStats.activeDeals} currently active
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Percent className="w-6 h-6 text-white" />
              </div>
              <Star className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {platformStats.avgROI}%
            </div>
            <div className="text-sm text-purple-300">Average ROI</div>
            <div className="mt-3 flex items-center gap-2 text-xs text-orange-400">
              <TrendingUp className="w-3 h-3" />
              Outperforms market by 3.5x
            </div>
          </div>
        </div>

        {/* Performance by Category */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Performance by Category</h2>
            <PieChart className="w-6 h-6 text-purple-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="text-lg font-bold text-white mb-2">{metric.category}</div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-purple-300 mb-1">Total Deals</div>
                    <div className="text-2xl font-bold text-white">{metric.deals}</div>
                  </div>
                  <div>
                    <div className="text-sm text-purple-300 mb-1">Avg ROI</div>
                    <div className={`text-xl font-bold text-${metric.color}-400`}>{metric.avgROI}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-purple-300 mb-1">Total Invested</div>
                    <div className="text-lg font-semibold text-white">{formatCurrency(metric.totalInvested)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Monthly Growth</h2>
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>

            <div className="space-y-4">
              {monthlyTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-semibold text-white w-12">{trend.month}</div>
                    <div>
                      <div className="text-sm text-purple-300">{trend.deals} deals</div>
                      <div className="text-xs text-purple-400">+{trend.investors} investors</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">{formatCurrency(trend.amount)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Top Cities</h2>
              <Globe className="w-6 h-6 text-purple-400" />
            </div>

            <div className="space-y-4">
              {topCities.map((city, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-semibold">{city.city}</div>
                    <div className="text-purple-300">{city.deals} deals ({city.percentage}%)</div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                      style={{ width: `${city.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
              <div className="text-sm text-blue-200">
                UAE-wide presence across all 7 emirates
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6">
            <Wallet className="w-10 h-10 text-green-400 mb-4" />
            <div className="text-3xl font-bold text-white mb-2">
              {formatCurrency(platformStats.totalPayouts)}
            </div>
            <div className="text-sm text-green-200 mb-1">Total Payouts</div>
            <div className="text-xs text-green-300">Distributed to investors to date</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6">
            <Award className="w-10 h-10 text-blue-400 mb-4" />
            <div className="text-3xl font-bold text-white mb-2">
              {platformStats.successRate}%
            </div>
            <div className="text-sm text-blue-200 mb-1">Success Rate</div>
            <div className="text-xs text-blue-300">Deals meeting projected returns</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6">
            <Target className="w-10 h-10 text-purple-400 mb-4" />
            <div className="text-3xl font-bold text-white mb-2">
              {formatCurrency(platformStats.avgDealSize)}
            </div>
            <div className="text-sm text-purple-200 mb-1">Avg Deal Size</div>
            <div className="text-xs text-purple-300">Per investment opportunity</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Thousands of Successful Investors
          </h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Start earning passive income with OWNLY's vetted investment opportunities
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/deals">
              <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all flex items-center gap-2">
                Browse Deals
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/how-to-invest">
              <button className="px-8 py-4 bg-purple-700 text-white rounded-xl font-bold hover:bg-purple-800 transition-all border border-white/20">
                Learn How to Invest
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
