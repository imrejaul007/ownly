'use client';

import { useState, useEffect } from 'react';
import { investmentAPI } from '@/lib/api';
import { formatCurrency, getDealTypeLabel } from '@/lib/utils';
import Link from 'next/link';
import {
  Briefcase, TrendingUp, TrendingDown, DollarSign, PieChart,
  Building, Rocket, Home, Gem, Calendar, MapPin, Share2,
  Eye, FileText, BarChart3, ArrowRight, Filter, Zap,
  Award, Target, Package, RefreshCw, ChevronRight, Activity,
  AlertCircle, CheckCircle, Clock, Flame
} from 'lucide-react';

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const getAssetIcon = (type: string) => {
    const icons: any = {
      real_estate: Home,
      franchise: Building,
      startup: Rocket,
      asset: Gem,
    };
    return icons[type] || Briefcase;
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

  const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + parseFloat(inv.current_value || inv.amount || 0), 0);
  const totalGainLoss = totalCurrentValue - totalInvested;
  const portfolioROI = totalInvested > 0 ? ((totalGainLoss / totalInvested) * 100).toFixed(2) : '0.00';

  // Calculate asset allocation
  const assetTypes = investments.reduce((acc, inv) => {
    const type = inv.deal?.type || 'unknown';
    const amount = parseFloat(inv.amount || 0);
    acc[type] = (acc[type] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading investments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-2">
            My Investments
          </h1>
          <p className="text-purple-300">
            {investments.length} {investments.length === 1 ? 'Investment' : 'Investments'} • {investments.filter(i => i.status === 'active').length} Active
          </p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-purple-300 text-sm mb-1">Total Invested</div>
            <div className="text-3xl font-bold text-white">{formatCurrency(totalInvested)}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-purple-300 text-sm mb-1">Current Value</div>
            <div className="text-3xl font-bold text-white">{formatCurrency(totalCurrentValue)}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${totalGainLoss >= 0 ? 'from-green-600 to-green-500' : 'from-red-600 to-red-500'} rounded-xl flex items-center justify-center`}>
                {totalGainLoss >= 0 ? <TrendingUp className="w-6 h-6 text-white" /> : <TrendingDown className="w-6 h-6 text-white" />}
              </div>
            </div>
            <div className="text-purple-300 text-sm mb-1">Total Returns</div>
            <div className={`text-3xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalGainLoss >= 0 ? '+' : ''}{formatCurrency(totalGainLoss)}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${parseFloat(portfolioROI) >= 0 ? 'from-green-600 to-green-500' : 'from-red-600 to-red-500'} rounded-xl flex items-center justify-center`}>
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-purple-300 text-sm mb-1">Portfolio ROI</div>
            <div className={`text-3xl font-bold ${parseFloat(portfolioROI) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {parseFloat(portfolioROI) >= 0 ? '+' : ''}{portfolioROI}%
            </div>
          </div>
        </div>

        {/* Quick Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Asset Allocation */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-purple-400" />
              Asset Allocation
            </h3>
            <div className="space-y-4">
              {Object.entries(assetTypes).map(([type, amount]) => {
                const percentage = totalInvested > 0 ? ((amount / totalInvested) * 100).toFixed(1) : '0';
                const colors: Record<string, string> = {
                  real_estate: 'from-blue-500 to-blue-600',
                  franchise: 'from-green-500 to-green-600',
                  startup: 'from-orange-500 to-orange-600',
                  asset: 'from-purple-500 to-purple-600',
                };
                const Icon = getAssetIcon(type);
                return (
                  <div key={type}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-purple-200 flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {getDealTypeLabel(type)}
                      </span>
                      <span className="text-sm font-bold text-white">{percentage}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                      <div
                        className={`h-2 bg-gradient-to-r ${colors[type] || 'from-gray-500 to-gray-600'} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Best Performer */}
          {(() => {
            const bestPerformer = [...investments].sort((a, b) =>
              parseFloat(calculateROI(b)) - parseFloat(calculateROI(a))
            )[0];

            return bestPerformer && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  Best Performer
                </h3>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/30">
                  <div className="text-sm text-green-300 mb-2">Top ROI</div>
                  <div className="font-bold text-white mb-2 line-clamp-1">{bestPerformer.deal?.title}</div>
                  <div className="text-3xl font-bold text-green-400">+{calculateROI(bestPerformer)}%</div>
                </div>
                <div className="mt-4 text-sm text-purple-300">
                  Invested: {formatCurrency(bestPerformer.amount)}
                </div>
              </div>
            );
          })()}

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-400" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link href="/deals">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all font-semibold flex items-center justify-between group">
                  <span className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    New Deals
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/bundles">
                <button className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all font-semibold flex items-center justify-between group">
                  <span className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Bundles
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/secondary-market">
                <button className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all font-semibold flex items-center justify-between group">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Marketplace
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-purple-300" />
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10'
                }`}
              >
                All ({investments.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  filter === 'active'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10'
                }`}
              >
                Active ({investments.filter((i) => i.status === 'active').length})
              </button>
              <button
                onClick={() => setFilter('exited')}
                className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  filter === 'exited'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 backdrop-blur-sm border border-white/10 text-purple-200 hover:bg-white/10'
                }`}
              >
                Exited ({investments.filter((i) => i.status === 'exited' || i.status === 'completed').length})
              </button>
            </div>
          </div>
        </div>

        {/* Investments List */}
        {filteredInvestments.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center shadow-2xl">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No investments yet</h3>
            <p className="text-purple-300 mb-6">
              Start building your fractional ownership portfolio today
            </p>
            <Link href="/deals">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
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
              const Icon = getAssetIcon(investment.deal?.type);

              return (
                <div
                  key={investment.id}
                  className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all overflow-hidden shadow-2xl hover:scale-[1.02] duration-300"
                >
                  {/* Top Status Bar */}
                  <div className={`h-2 ${isPositive ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-orange-500'}`}></div>

                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      {/* Left Section - Deal Info */}
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="relative">
                          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                            investment.deal?.type === 'real_estate' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                            investment.deal?.type === 'franchise' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                            investment.deal?.type === 'startup' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                            'bg-gradient-to-br from-purple-500 to-purple-600'
                          } shadow-lg`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          {isPositive && roiValue > 15 && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                              <Flame className="w-4 h-4 text-yellow-900" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <Link href={`/investments/${investment.id}`}>
                            <h3 className="text-xl font-bold text-white hover:text-purple-400 transition cursor-pointer mb-2">
                              {investment.deal?.title || 'Unknown Deal'}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              investment.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              investment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                              <div className="flex items-center gap-1">
                                {investment.status === 'active' ? <CheckCircle className="w-3 h-3" /> :
                                 investment.status === 'pending' ? <Clock className="w-3 h-3" /> :
                                 <AlertCircle className="w-3 h-3" />}
                                {investment.status}
                              </div>
                            </span>
                            {investment.deal?.type && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-purple-300 border border-white/10 capitalize">
                                {getDealTypeLabel(investment.deal.type)}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-3 text-sm text-purple-300">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{investment.deal?.location || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(investment.invested_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Share2 className="w-4 h-4" />
                              <span>{investment.shares_issued?.toLocaleString() || 0} shares</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Metrics */}
                      <div className="lg:w-1/2">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                          {/* Invested */}
                          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                            <div className="text-xs text-blue-400 mb-1 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              Invested
                            </div>
                            <div className="text-xl font-bold text-blue-300">
                              {formatCurrency(investment.amount)}
                            </div>
                          </div>

                          {/* Current */}
                          <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
                            <div className="text-xs text-purple-400 mb-1 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Current
                            </div>
                            <div className="text-xl font-bold text-purple-300">
                              {formatCurrency(investment.current_value || investment.amount)}
                            </div>
                          </div>

                          {/* ROI */}
                          <div className={`${isPositive ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} rounded-xl p-4 border`}>
                            <div className={`text-xs mb-1 flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                              <Target className="w-3 h-3" />
                              ROI
                            </div>
                            <div className={`text-xl font-bold ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                              {isPositive ? '+' : '-'}{roiValue.toFixed(2)}%
                            </div>
                          </div>
                        </div>

                        {/* Performance Badge */}
                        {isPositive && roiValue > 15 && (
                          <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-2 flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs font-semibold text-yellow-300">
                              Outstanding Performance!
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-white/10">
                      <Link href={`/investments/${investment.id}`}>
                        <button className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </Link>
                      <Link href={`/deals/${investment.deal_id}`}>
                        <button className="px-5 py-2.5 text-sm font-semibold bg-white/5 backdrop-blur-sm text-white rounded-xl hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Deal Info
                        </button>
                      </Link>
                      {investment.status === 'active' && (
                        <>
                          <Link href="/secondary-market">
                            <button className="px-5 py-2.5 text-sm font-semibold bg-white/5 backdrop-blur-sm text-white rounded-xl hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2">
                              <RefreshCw className="w-4 h-4" />
                              List for Sale
                            </button>
                          </Link>
                          <Link href={`/investments/${investment.id}#analytics`}>
                            <button className="px-5 py-2.5 text-sm font-semibold bg-white/5 backdrop-blur-sm text-white rounded-xl hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
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

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-white/10 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-purple-400" />
            Investment Tips
          </h3>
          <ul className="space-y-2 text-sm text-purple-200">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              Diversify across multiple asset classes for balanced risk
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              Monitor portfolio regularly and track ROI trends
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              Use secondary market to exit positions when needed
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
              Reinvest dividends for compound growth
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
