'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Investment, PortfolioSummary } from '@/types';
import { investmentAPI } from '@/lib/api';
import { formatCurrency, formatPercentage, getDealTypeLabel } from '@/lib/utils';
import axios from 'axios';
import ActivityFeed from '@/components/ActivityFeed';
import SmartRecommendations from '@/components/SmartRecommendations';
import {
  TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3,
  Award, Target, Zap, ArrowRight, Calendar, Users, Building,
  Wallet, Bell, RefreshCw, Eye, ShoppingCart, Package,
  Activity, Trophy, Star, Flame, ChevronRight, Sparkles,
  ArrowUpRight, Clock, Shield
} from 'lucide-react';

interface MonthlyPayout {
  month: string;
  totalAmount: number;
  withdrawn: number;
  reinvested: number;
  roiPercent: number;
}

interface ActivityItem {
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
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const portfolioResponse = await investmentAPI.myInvestments();
      setInvestments(portfolioResponse.data.data.investments);
      setSummary(portfolioResponse.data.data.summary);

      const token = localStorage.getItem('token');
      const transactionsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/investments/my-transactions?type=payout`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMonthlyPayouts(transactionsResponse.data.data.monthlyPayouts || []);

      const activities: ActivityItem[] = [];
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  const assetAllocation = investments.reduce((acc, inv) => {
    const type = inv.deal?.type || 'unknown';
    const amount = parseFloat(inv.amount.toString());
    acc[type] = (acc[type] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const totalInvested = Object.values(assetAllocation).reduce((a, b) => a + b, 0);
  const topPerformers = [...investments]
    .sort((a, b) => parseFloat(b.earnings?.actualRoi || '0') - parseFloat(a.earnings?.actualRoi || '0'))
    .slice(0, 3);

  const recentPayouts = monthlyPayouts.slice(0, 6).reverse();
  const maxPayout = Math.max(...recentPayouts.map(p => p.totalAmount), 1);
  const avgMonthlyEarning = monthlyPayouts.length > 0
    ? monthlyPayouts.reduce((sum, p) => sum + p.totalAmount, 0) / monthlyPayouts.length
    : 0;
  const lastMonthPayout = monthlyPayouts.length > 0 ? monthlyPayouts[0].totalAmount : 0;
  const payoutGrowth = monthlyPayouts.length >= 2
    ? ((monthlyPayouts[0].totalAmount - monthlyPayouts[1].totalAmount) / monthlyPayouts[1].totalAmount) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-purple-300">Welcome back! Here's your portfolio overview</p>
        </div>

        {/* Hero Performance Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Portfolio Value Card */}
            <Link href="/investments">
              <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-blue-500/30 transition-all shadow-2xl hover:scale-105 duration-300 cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    summary.totalCurrentValue > summary.totalInvested
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {summary.totalCurrentValue > summary.totalInvested ? (
                      <>
                        <TrendingUp className="w-3 h-3" />
                        {formatPercentage(((summary.totalCurrentValue - summary.totalInvested) / summary.totalInvested * 100).toString())}
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3 h-3" />
                        0%
                      </>
                    )}
                  </div>
                </div>
                <div className="text-purple-300 text-sm mb-1">Total Portfolio Value</div>
                <div className="text-3xl font-bold text-white mb-2">{formatCurrency(summary.totalCurrentValue)}</div>
                <div className="flex items-center text-green-400 text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  {formatCurrency(summary.totalCurrentValue - summary.totalInvested)} gain
                </div>
              </div>
            </Link>

            {/* Monthly Income Card */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-green-500/30 transition-all shadow-2xl hover:scale-105 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  payoutGrowth >= 0
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {payoutGrowth >= 0 ? (
                    <>
                      <TrendingUp className="w-3 h-3" />
                      {payoutGrowth.toFixed(1)}%
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3" />
                      {Math.abs(payoutGrowth).toFixed(1)}%
                    </>
                  )}
                </div>
              </div>
              <div className="text-purple-300 text-sm mb-1">Monthly Income</div>
              <div className="text-3xl font-bold text-white mb-2">{formatCurrency(avgMonthlyEarning)}</div>
              <div className="text-purple-300 text-sm">Average per month</div>
            </div>

            {/* Total ROI Card */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all shadow-2xl hover:scale-105 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400">
                  Overall
                </div>
              </div>
              <div className="text-purple-300 text-sm mb-1">Total ROI</div>
              <div className="text-3xl font-bold text-white mb-2">{formatPercentage(summary.returnPercentage)}</div>
              <div className="text-green-400 text-sm">{formatCurrency(summary.totalReturn)} earned</div>
            </div>

            {/* Active Investments Card */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-pink-500/30 transition-all shadow-2xl hover:scale-105 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-pink-500 rounded-xl flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/20 text-pink-400">
                  Active
                </div>
              </div>
              <div className="text-purple-300 text-sm mb-1">Active Investments</div>
              <div className="text-3xl font-bold text-white mb-2">{investments.length}</div>
              <div className="text-purple-300 text-sm">{Object.keys(assetAllocation).length} asset types</div>
            </div>
          </div>
        )}

        {/* Achievement Banner */}
        {summary && parseFloat(summary.returnPercentage) > 20 && (
          <div className="relative bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-2xl shadow-2xl p-6 mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Flame className="w-6 h-6" />
                    Excellent Performance!
                  </h3>
                  <p className="text-orange-100">Your portfolio is outperforming market averages with {formatPercentage(summary.returnPercentage)} ROI</p>
                </div>
              </div>
              <Link href="/investments">
                <button className="px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition flex items-center gap-2">
                  View Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Exchange Trading Banner */}
        <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative flex items-center justify-between flex-wrap gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <RefreshCw className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">OWNLY Exchange Now Live!</h2>
                  <p className="text-green-100">Trade real assets 24/7 with instant execution</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { value: '36', label: 'Assets Trading' },
                  { value: '5', label: 'Categories' },
                  { value: '24/7', label: 'Live Trading' },
                  { value: '0.5%', label: 'Trading Fees' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-green-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/exchange">
                <button className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold hover:bg-green-50 transition flex items-center gap-2 hover:scale-105">
                  <Zap className="w-5 h-5" />
                  Start Trading
                </button>
              </Link>
              <Link href="/exchange/portfolio">
                <button className="px-8 py-4 bg-green-500/30 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-green-500/50 transition border border-white/30">
                  View Portfolio
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Smart Recommendations */}
        <div className="mb-8">
          <SmartRecommendations
            userInvestments={investments}
            riskProfile="moderate"
            maxRecommendations={3}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Portfolio Growth Chart */}
          {summary && monthlyPayouts.length > 0 && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                    Portfolio Growth
                  </h2>
                  <p className="text-sm text-purple-300 mt-1">Last 6 months performance</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">{formatCurrency(avgMonthlyEarning)}</div>
                  <div className="text-xs text-purple-300">Avg/month</div>
                </div>
              </div>

              <div className="flex items-end justify-between h-64 space-x-2">
                {recentPayouts.map((payout, index) => {
                  const height = (payout.totalAmount / maxPayout) * 100;
                  const isLatest = index === recentPayouts.length - 1;
                  return (
                    <div key={payout.month} className="flex-1 flex flex-col items-center group">
                      <div className="w-full flex flex-col justify-end h-full relative">
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg p-2 z-10 whitespace-nowrap">
                          <div className="font-bold">{new Date(payout.month + '-01').toLocaleDateString('en-US', { month: 'short' })}</div>
                          <div className="text-green-300">{formatCurrency(payout.totalAmount)}</div>
                        </div>

                        <div className="text-xs text-center mb-2 font-semibold text-green-400">
                          {formatCurrency(payout.totalAmount, 'USD').replace('.00', '')}
                        </div>
                        <div
                          className={`w-full rounded-t-xl ${
                            isLatest
                              ? 'bg-gradient-to-t from-green-600 to-green-400'
                              : 'bg-gradient-to-t from-green-500/70 to-green-300/70'
                          } hover:opacity-90 transition-all`}
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                      <div className="text-xs mt-2 text-purple-300 text-center">
                        {new Date(payout.month + '-01').toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-200">{formatCurrency(Math.min(...recentPayouts.map(p => p.totalAmount)))}</div>
                  <div className="text-xs text-purple-400">Lowest</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-green-400">{formatCurrency(Math.max(...recentPayouts.map(p => p.totalAmount)))}</div>
                  <div className="text-xs text-purple-400">Highest</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-blue-400">{formatCurrency(avgMonthlyEarning)}</div>
                  <div className="text-xs text-purple-400">Average</div>
                </div>
              </div>
            </div>
          )}

          {/* Asset Allocation Chart */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-purple-400" />
              Asset Allocation
            </h2>

            {/* Legend with bars */}
            <div className="space-y-4">
              {Object.entries(assetAllocation).map(([type, amount]) => {
                const percentage = (amount / totalInvested) * 100;
                const colors: Record<string, string> = {
                  real_estate: 'from-blue-500 to-blue-600',
                  franchise: 'from-green-500 to-green-600',
                  startup: 'from-orange-500 to-orange-600',
                  asset: 'from-purple-500 to-purple-600',
                };
                return (
                  <div key={type}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-purple-200">
                        {getDealTypeLabel(type)}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
                      <div
                        className={`h-3 bg-gradient-to-r ${colors[type] || 'from-gray-500 to-gray-600'} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-400" />
              Top Performing Investments
            </h2>
            <Link href="/investments" className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topPerformers.map((investment, index) => {
              const medals = ['🥇', '🥈', '🥉'];
              const colors = ['from-yellow-600 to-orange-600', 'from-gray-400 to-gray-500', 'from-orange-600 to-orange-700'];
              return (
                <Link href={`/investments/${investment.id}`} key={investment.id}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5 hover:border-purple-500/30 transition-all cursor-pointer hover:scale-105">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${colors[index]} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        #{index + 1}
                      </div>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-semibold border border-blue-500/30">
                        {investment.deal ? getDealTypeLabel(investment.deal.type) : 'N/A'}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-white line-clamp-1">
                      {investment.deal?.title}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-purple-300">Invested:</span>
                        <span className="font-semibold text-white">
                          {formatCurrency(investment.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-300">Current:</span>
                        <span className="font-semibold text-green-400">
                          {formatCurrency(investment.current_value || investment.amount)}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-300">ROI:</span>
                          <span className="font-bold text-green-400 text-xl">
                            {formatPercentage(investment.earnings?.actualRoi || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-purple-400" />
                Recent Activity
              </h2>
              <Link href="/activity" className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8 text-purple-300">
                  No recent activity
                </div>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'investment' ? 'bg-blue-500/20 border border-blue-500/30' :
                        activity.type === 'payout' ? 'bg-green-500/20 border border-green-500/30' :
                        'bg-gray-500/20 border border-gray-500/30'
                      }`}>
                        {activity.type === 'investment' && <TrendingUp className="w-5 h-5 text-blue-400" />}
                        {activity.type === 'payout' && <DollarSign className="w-5 h-5 text-green-400" />}
                      </div>
                      <div>
                        <p className="font-medium text-white">{activity.description}</p>
                        <p className="text-xs text-purple-400">
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
                        activity.type === 'payout' ? 'text-green-400' : 'text-blue-400'
                      }`}>
                        {activity.type === 'payout' ? '+' : ''}{formatCurrency(activity.amount)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-400" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link href="/deals">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all font-semibold flex items-center justify-between group">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Browse Deals
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/bundles">
                <button className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all font-semibold flex items-center justify-between group">
                  <span className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Smart Bundles
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/exchange">
                <button className="w-full px-4 py-3 bg-green-500/20 border border-green-500/30 text-green-300 rounded-xl hover:bg-green-500/30 transition-all font-semibold flex items-center justify-between group">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Trade Assets
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/wallet">
                <button className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all font-semibold flex items-center justify-between group">
                  <span className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Add Funds
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/analytics">
                <button className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all font-semibold flex items-center justify-between group">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Analytics
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="mb-8">
          <ActivityFeed maxItems={10} />
        </div>
      </div>
    </div>
  );
}
