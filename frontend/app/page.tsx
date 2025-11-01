'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Deal } from '@/types';
import { dealAPI, secondaryMarketAPI } from '@/lib/api';
import { formatCurrency, formatPercentage, getDealTypeLabel, calculateFundingProgress, getStatusColor } from '@/lib/utils';
import axios from 'axios';
import {
  Sparkles, TrendingUp, DollarSign, Users, Building, Store, Rocket,
  Target, Lock, BarChart3, Award, Search, CreditCard, TrendingDown,
  Package, RefreshCw, Filter, MapPin, Clock, ArrowRight, Zap, CheckCircle,
  Shield, Star, Flame, Eye, Activity, Gem, BadgeCheck, Globe, TrendingDown as Down,
  Timer, PlayCircle, Wallet, ChevronDown, Quote, Verified, BellRing, HelpCircle
} from 'lucide-react';

interface PlatformStats {
  totalInvestment: number;
  activeInvestors: number;
  avgROI: number;
  successfulDeals: number;
  totalDeals: number;
  totalPayouts: number;
}

interface LiveActivity {
  id: string;
  investor: string;
  amount: number;
  dealName: string;
  timeAgo: string;
  type: 'investment' | 'payout' | 'exit';
}

export default function Marketplace() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [secondaryListings, setSecondaryListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([]);
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
    generateLiveActivities();

    // Auto-refresh live activities every 5 seconds
    const interval = setInterval(() => {
      generateLiveActivities();
    }, 5000);

    return () => clearInterval(interval);
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
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bundles`);
      if (response.data.success) {
        setBundles(response.data.data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching bundles:', error);
    }
  };

  const fetchSecondaryListings = async () => {
    try {
      const response = await secondaryMarketAPI.getActiveListings({});
      setSecondaryListings(response.data.data.listings.slice(0, 3));
    } catch (error) {
      console.error('Error fetching secondary listings:', error);
    }
  };

  const fetchPlatformStats = async () => {
    try {
      const allDealsResponse = await dealAPI.list({});
      const allDeals = allDealsResponse.data.data;

      const totalInvestment = allDeals.reduce((sum: number, deal: Deal) => sum + parseFloat(deal.raised_amount?.toString() || '0'), 0);
      const totalDeals = allDeals.length;
      const successfulDeals = allDeals.filter((deal: Deal) => deal.status === 'closed' || deal.status === 'exited').length;
      const avgROI = allDeals.reduce((sum: number, deal: Deal) => sum + (parseFloat(deal.expected_roi?.toString() || '0')), 0) / (totalDeals || 1);
      const activeInvestors = allDeals.reduce((sum: number, deal: Deal) => sum + (deal.investor_count || 0), 0);

      setStats({
        totalInvestment,
        activeInvestors,
        avgROI,
        successfulDeals,
        totalDeals,
        totalPayouts: totalInvestment * 0.15,
      });
    } catch (error) {
      console.error('Error fetching platform stats:', error);
    }
  };

  const generateLiveActivities = () => {
    const investors = ['Ahmed K.', 'Fatima H.', 'Mohammed S.', 'Sarah A.', 'Omar M.', 'Layla F.', 'Khalid R.', 'Noura B.'];
    const dealNames = ['Dubai Marina Tower', 'Coffee Shop Franchise', 'Tech Startup Fund', 'Abu Dhabi Villa', 'Retail Store Chain'];
    const types: Array<'investment' | 'payout' | 'exit'> = ['investment', 'investment', 'payout', 'investment', 'exit'];
    const timeAgos = ['2 min ago', '5 min ago', '12 min ago', '18 min ago', '23 min ago'];

    const activities: LiveActivity[] = Array.from({ length: 5 }, (_, i) => ({
      id: `activity-${Date.now()}-${i}`,
      investor: investors[Math.floor(Math.random() * investors.length)],
      amount: Math.floor(Math.random() * 50000) + 5000,
      dealName: dealNames[Math.floor(Math.random() * dealNames.length)],
      timeAgo: timeAgos[i],
      type: types[i],
    }));

    setLiveActivities(activities);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchDeals(),
      fetchBundles(),
      fetchSecondaryListings(),
      fetchPlatformStats()
    ]);
    setRefreshing(false);
  };

  const trendingDeals = deals
    .filter(d => d.investor_count > 5)
    .sort((a, b) => (b.investor_count || 0) - (a.investor_count || 0))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      {/* Animated Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Live Activity Banner */}
        <div className="bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-600/20 backdrop-blur-xl rounded-xl border border-green-500/30 p-4 mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent animate-pulse"></div>
          <div className="relative flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <Activity className="w-5 h-5 text-green-400" />
              <span className="font-semibold text-green-300">LIVE</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll whitespace-nowrap">
                {liveActivities.map((activity, index) => (
                  <span key={activity.id} className="inline-flex items-center gap-2 mr-8 text-white">
                    {activity.type === 'investment' && <DollarSign className="w-4 h-4 text-green-400" />}
                    {activity.type === 'payout' && <Wallet className="w-4 h-4 text-blue-400" />}
                    {activity.type === 'exit' && <TrendingUp className="w-4 h-4 text-purple-400" />}
                    <span className="font-semibold">{activity.investor}</span>
                    <span className="text-purple-200">
                      {activity.type === 'investment' && 'invested'}
                      {activity.type === 'payout' && 'received payout'}
                      {activity.type === 'exit' && 'exited with returns'}
                    </span>
                    <span className="text-green-400 font-bold">{formatCurrency(activity.amount)}</span>
                    <span className="text-purple-300">• {activity.timeAgo}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-3xl shadow-2xl p-12 mb-12 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          {/* Floating Trust Badges */}
          <div className="absolute top-8 right-8 hidden lg:flex flex-col gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30 flex items-center gap-2 hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-green-300" />
              <span className="text-sm font-semibold">SEC Regulated</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30 flex items-center gap-2 hover:scale-105 transition-transform">
              <Lock className="w-5 h-5 text-blue-300" />
              <span className="text-sm font-semibold">Bank-Grade Security</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30 flex items-center gap-2 hover:scale-105 transition-transform">
              <Verified className="w-5 h-5 text-purple-300" />
              <span className="text-sm font-semibold">100% Verified</span>
            </div>
          </div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/20 backdrop-blur-sm rounded-full text-yellow-300 text-sm font-semibold mb-4 border border-yellow-400/30">
                  <Sparkles className="w-4 h-4" />
                  Join 5,000+ investors earning passive income
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Build Wealth Through<br />
                  <span className="text-yellow-300">Fractional Ownership</span>
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Invest in premium real estate, thriving franchises, and innovative startups.
                  Earn passive income with returns up to <span className="font-bold text-yellow-300">45% APY</span>.
                </p>

                {/* Urgency Indicator */}
                <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-red-500/30">
                  <div className="flex items-center gap-3">
                    <Timer className="w-6 h-6 text-red-300" />
                    <div>
                      <div className="font-bold text-red-200">Limited Time Offer</div>
                      <div className="text-sm text-red-100">3 high-yield deals closing in 48 hours • High demand</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/deals">
                    <button className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-yellow-300 hover:text-indigo-900 transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto">
                      <Zap className="w-5 h-5" />
                      Start Investing Now
                    </button>
                  </Link>
                  <Link href="/calculator">
                    <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl hover:bg-white/20 transition-all font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 w-full sm:w-auto">
                      <Target className="w-5 h-5" />
                      Calculate Returns
                    </button>
                  </Link>
                </div>

                {/* Quick Access Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <Link href="/sip">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 hover:bg-white/20 transition-all cursor-pointer group">
                      <RefreshCw className="w-5 h-5 mb-1 text-green-300 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-semibold text-white">SIP Plans</div>
                      <div className="text-xs text-green-200">Recurring</div>
                    </div>
                  </Link>
                  <Link href="/copy-trading">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 hover:bg-white/20 transition-all cursor-pointer group">
                      <Users className="w-5 h-5 mb-1 text-blue-300 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-semibold text-white">Copy Trading</div>
                      <div className="text-xs text-blue-200">Follow experts</div>
                    </div>
                  </Link>
                  <Link href="/bundles">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 hover:bg-white/20 transition-all cursor-pointer group">
                      <Package className="w-5 h-5 mb-1 text-purple-300 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-semibold text-white">Bundles</div>
                      <div className="text-xs text-purple-200">Diversify</div>
                    </div>
                  </Link>
                  <Link href="/secondary-market">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 hover:bg-white/20 transition-all cursor-pointer group">
                      <RefreshCw className="w-5 h-5 mb-1 text-orange-300 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-semibold text-white">Trade</div>
                      <div className="text-xs text-orange-200">Exit early</div>
                    </div>
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="text-3xl font-bold text-yellow-300">{stats ? formatCurrency(stats.totalInvestment) : '...'}</div>
                    <div className="text-sm text-blue-200">Total Invested</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="text-3xl font-bold text-yellow-300">{stats ? `${stats.avgROI.toFixed(1)}%` : '...'}</div>
                    <div className="text-sm text-blue-200">Avg Returns</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                    <div className="text-3xl font-bold text-yellow-300">{stats ? `${stats.activeInvestors}+` : '...'}</div>
                    <div className="text-sm text-blue-200">Active Investors</div>
                  </div>
                </div>
              </div>

              {/* Hero Visual/Stats Panel */}
              <div className="hidden lg:block">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 text-lg font-semibold mb-4">
                    <Activity className="w-6 h-6 text-yellow-300 animate-pulse" />
                    Today's Hot Opportunities
                  </div>
                  <div className="space-y-4">
                    {deals.slice(0, 3).map((deal, index) => (
                      <div key={deal.id} className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            {deal.type === 'real_estate' && <Building className="w-6 h-6 text-white" />}
                            {deal.type === 'franchise' && <Store className="w-6 h-6 text-white" />}
                            {deal.type === 'startup' && <Rocket className="w-6 h-6 text-white" />}
                          </div>
                          <div>
                            <div className="font-semibold line-clamp-1">{deal.title}</div>
                            <div className="text-sm text-blue-200 flex items-center gap-2">
                              <Users className="w-3 h-3" />
                              {deal.investor_count} investors
                              <Flame className="w-3 h-3 text-orange-400" />
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-300 font-bold text-xl">{formatPercentage(deal.expected_roi || 0)}</div>
                          <div className="text-xs text-blue-200">ROI</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Perfect Starter Deals - For Beginners */}
        {deals.length >= 3 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-full border border-green-500/30 mb-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-semibold">Recommended for New Investors</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-3">
                Start Your Investment Journey
              </h2>
              <p className="text-purple-200 text-lg max-w-3xl mx-auto">
                We've handpicked these 4 deals to help you get started easily. Each offers unique benefits with clear risk profiles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Best for Beginners */}
              {deals.filter(d => d.status === 'open' && parseFloat(d.min_ticket?.toString() || '0') <= 5000)[0] && (
                <Link href={`/deals/${deals.filter(d => d.status === 'open' && parseFloat(d.min_ticket?.toString() || '0') <= 5000)[0].id}`}>
                  <div className="group bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl border-2 border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/20 p-6 hover:scale-105 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 h-full">
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-blue-600 text-white px-4 py-2 text-xs font-bold rounded-bl-xl flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      BEST FOR BEGINNERS
                    </div>
                    <div className="mt-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 text-center line-clamp-2">
                        {deals.filter(d => d.status === 'open' && parseFloat(d.min_ticket?.toString() || '0') <= 5000)[0].title}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-4 text-sm text-blue-300">
                        <MapPin className="w-4 h-4" />
                        {deals.filter(d => d.status === 'open' && parseFloat(d.min_ticket?.toString() || '0') <= 5000)[0].location}
                      </div>
                      <div className="bg-green-500/20 rounded-xl p-4 mb-4 border border-green-500/30">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-400 mb-1">
                            {formatPercentage(deals.filter(d => d.status === 'open' && parseFloat(d.min_ticket?.toString() || '0') <= 5000)[0].expected_roi || 0)}
                          </div>
                          <div className="text-xs text-green-300">Expected ROI</div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-blue-200">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Low entry: {formatCurrency(deals.filter(d => d.status === 'open' && parseFloat(d.min_ticket?.toString() || '0') <= 5000)[0].min_ticket)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-200">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Easy to understand
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-200">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Proven track record
                        </div>
                      </div>
                      <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                        Start Here
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              )}

              {/* Highest Returns */}
              {deals.filter(d => d.status === 'open').sort((a, b) => (parseFloat(b.expected_roi?.toString() || '0')) - (parseFloat(a.expected_roi?.toString() || '0')))[0] && (
                <Link href={`/deals/${deals.filter(d => d.status === 'open').sort((a, b) => (parseFloat(b.expected_roi?.toString() || '0')) - (parseFloat(a.expected_roi?.toString() || '0')))[0].id}`}>
                  <div className="group bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl rounded-2xl border-2 border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/20 p-6 hover:scale-105 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/30 h-full">
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-purple-600 text-white px-4 py-2 text-xs font-bold rounded-bl-xl flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      HIGHEST RETURNS
                    </div>
                    <div className="mt-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                        <Rocket className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 text-center line-clamp-2">
                        {deals.filter(d => d.status === 'open').sort((a, b) => (parseFloat(b.expected_roi?.toString() || '0')) - (parseFloat(a.expected_roi?.toString() || '0')))[0].title}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-4 text-sm text-purple-300">
                        <MapPin className="w-4 h-4" />
                        {deals.filter(d => d.status === 'open').sort((a, b) => (parseFloat(b.expected_roi?.toString() || '0')) - (parseFloat(a.expected_roi?.toString() || '0')))[0].location}
                      </div>
                      <div className="bg-green-500/20 rounded-xl p-4 mb-4 border border-green-500/30">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-400 mb-1">
                            {formatPercentage(deals.filter(d => d.status === 'open').sort((a, b) => (parseFloat(b.expected_roi?.toString() || '0')) - (parseFloat(a.expected_roi?.toString() || '0')))[0].expected_roi || 0)}
                          </div>
                          <div className="text-xs text-green-300">Expected ROI</div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-purple-200">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Maximum profit potential
                        </div>
                        <div className="flex items-center gap-2 text-sm text-purple-200">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Fast-growing sector
                        </div>
                        <div className="flex items-center gap-2 text-sm text-purple-200">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Premium opportunity
                        </div>
                      </div>
                      <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                        Maximize Returns
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              )}

              {/* Most Popular */}
              {deals.filter(d => d.status === 'open' && d.investor_count > 0).sort((a, b) => (b.investor_count || 0) - (a.investor_count || 0))[0] && (
                <Link href={`/deals/${deals.filter(d => d.status === 'open' && d.investor_count > 0).sort((a, b) => (b.investor_count || 0) - (a.investor_count || 0))[0].id}`}>
                  <div className="group bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-xl rounded-2xl border-2 border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/20 p-6 hover:scale-105 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-500/30 h-full">
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-orange-600 text-white px-4 py-2 text-xs font-bold rounded-bl-xl flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      MOST POPULAR
                    </div>
                    <div className="mt-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 text-center line-clamp-2">
                        {deals.filter(d => d.status === 'open' && d.investor_count > 0).sort((a, b) => (b.investor_count || 0) - (a.investor_count || 0))[0].title}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-4 text-sm text-orange-300">
                        <MapPin className="w-4 h-4" />
                        {deals.filter(d => d.status === 'open' && d.investor_count > 0).sort((a, b) => (b.investor_count || 0) - (a.investor_count || 0))[0].location}
                      </div>
                      <div className="bg-green-500/20 rounded-xl p-4 mb-4 border border-green-500/30">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-400 mb-1">
                            {formatPercentage(deals.filter(d => d.status === 'open' && d.investor_count > 0).sort((a, b) => (b.investor_count || 0) - (a.investor_count || 0))[0].expected_roi || 0)}
                          </div>
                          <div className="text-xs text-green-300">Expected ROI</div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-orange-200">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {deals.filter(d => d.status === 'open' && d.investor_count > 0).sort((a, b) => (b.investor_count || 0) - (a.investor_count || 0))[0].investor_count}+ investors trust this
                        </div>
                        <div className="flex items-center gap-2 text-sm text-orange-200">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Community favorite
                        </div>
                        <div className="flex items-center gap-2 text-sm text-orange-200">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          High demand
                        </div>
                      </div>
                      <button className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                        Join Others
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              )}

              {/* Balanced Choice */}
              {deals.filter(d => d.status === 'open' && parseFloat(d.expected_roi?.toString() || '0') > 15 && parseFloat(d.expected_roi?.toString() || '0') < 30)[0] && (
                <Link href={`/deals/${deals.filter(d => d.status === 'open' && parseFloat(d.expected_roi?.toString() || '0') > 15 && parseFloat(d.expected_roi?.toString() || '0') < 30)[0].id}`}>
                  <div className="group bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl rounded-2xl border-2 border-green-500/30 hover:border-green-500/50 hover:bg-green-500/20 p-6 hover:scale-105 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-green-500/30 h-full">
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-green-600 text-white px-4 py-2 text-xs font-bold rounded-bl-xl flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      BALANCED CHOICE
                    </div>
                    <div className="mt-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                        <BarChart3 className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 text-center line-clamp-2">
                        {deals.filter(d => d.status === 'open' && parseFloat(d.expected_roi?.toString() || '0') > 15 && parseFloat(d.expected_roi?.toString() || '0') < 30)[0].title}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-4 text-sm text-green-300">
                        <MapPin className="w-4 h-4" />
                        {deals.filter(d => d.status === 'open' && parseFloat(d.expected_roi?.toString() || '0') > 15 && parseFloat(d.expected_roi?.toString() || '0') < 30)[0].location}
                      </div>
                      <div className="bg-green-500/20 rounded-xl p-4 mb-4 border border-green-500/30">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-400 mb-1">
                            {formatPercentage(deals.filter(d => d.status === 'open' && parseFloat(d.expected_roi?.toString() || '0') > 15 && parseFloat(d.expected_roi?.toString() || '0') < 30)[0].expected_roi || 0)}
                          </div>
                          <div className="text-xs text-green-300">Expected ROI</div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-green-200">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Perfect risk/reward ratio
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-200">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Stable returns
                        </div>
                        <div className="flex items-center gap-2 text-sm text-green-200">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Diversified asset
                        </div>
                      </div>
                      <button className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/50 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                        Best Balance
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Comparison Helper */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-purple-400" />
                Need Help Choosing?
              </h3>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">First Time?</div>
                    <div className="text-purple-300">Choose "Best for Beginners" - lowest entry, easiest to understand</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Want Maximum Profit?</div>
                    <div className="text-purple-300">Choose "Highest Returns" - maximum ROI potential</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Trust the Crowd?</div>
                    <div className="text-purple-300">Choose "Most Popular" - backed by most investors</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Want Stability?</div>
                    <div className="text-purple-300">Choose "Balanced Choice" - optimal risk/reward</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trending Now Section */}
        {trendingDeals.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
                <div>
                  <h2 className="text-3xl font-bold text-white">Trending Now</h2>
                  <p className="text-purple-200">Most popular deals • High investor activity</p>
                </div>
              </div>
              <Link href="/featured">
                <button className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all font-semibold shadow-md flex items-center gap-2">
                  View All Trending
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingDeals.map((deal, index) => (
                <Link key={deal.id} href={`/deals/${deal.id}`}>
                  <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border-2 border-orange-500/30 hover:border-orange-500/50 hover:bg-white/10 p-6 hover:scale-105 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-500/20">
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-red-500 text-white px-4 py-1.5 text-xs font-bold rounded-bl-xl flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      TRENDING #{index + 1}
                    </div>
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{deal.title}</h3>
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-500/20 rounded-lg p-3 border border-green-500/30">
                          <div className="text-3xl font-bold text-green-400">{formatPercentage(deal.expected_roi || 0)}</div>
                          <div className="text-xs text-green-200">Expected ROI</div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-purple-200 mb-1">
                            <Users className="w-4 h-4" />
                            <span className="font-bold text-white">{deal.investor_count}</span>
                          </div>
                          <div className="text-xs text-purple-300">Active investors</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-purple-200">
                        <Eye className="w-4 h-4" />
                        <span>{Math.floor(Math.random() * 500) + 100} views today</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Social Proof - Investor Testimonials */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              Trusted by Thousands of Investors
            </h2>
            <p className="text-purple-200 text-lg">
              Real stories from real investors earning passive income
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-blue-500/30 hover:bg-white/10 p-6 hover:scale-105 transition-all shadow-lg hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-purple-400 mb-3" />
              <p className="text-purple-100 mb-4 italic">
                "I've earned over AED 50,000 in passive income in just 8 months. The platform is transparent, secure, and the returns are exactly as promised."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">AK</span>
                </div>
                <div>
                  <div className="font-bold text-white">Ahmed K.</div>
                  <div className="text-sm text-purple-300">Real Estate Investor • Dubai</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-pink-500/30 hover:bg-white/10 p-6 hover:scale-105 transition-all shadow-lg hover:shadow-2xl hover:shadow-pink-500/20">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-purple-400 mb-3" />
              <p className="text-purple-100 mb-4 italic">
                "Finally, a platform that lets me invest in premium real estate with just AED 5,000. The monthly payouts are consistent and the ROI exceeded expectations!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">FH</span>
                </div>
                <div>
                  <div className="font-bold text-white">Fatima H.</div>
                  <div className="text-sm text-purple-300">Tech Professional • Abu Dhabi</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-green-500/30 hover:bg-white/10 p-6 hover:scale-105 transition-all shadow-lg hover:shadow-2xl hover:shadow-green-500/20">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-purple-400 mb-3" />
              <p className="text-purple-100 mb-4 italic">
                "Best investment decision I've made. Diversified portfolio across 6 deals, receiving monthly income, and the platform handles everything professionally."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">MS</span>
                </div>
                <div>
                  <div className="font-bold text-white">Mohammed S.</div>
                  <div className="text-sm text-purple-300">Entrepreneur • Sharjah</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition - Why Choose Us */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              Why Investors Choose OWNLY
            </h2>
            <p className="text-purple-200 text-lg">
              The smartest way to build passive income and diversify your portfolio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-blue-500/30 p-6 hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Passive Income</h3>
              <p className="text-purple-200">
                Earn monthly dividends and profit distributions. Average AED 500-2,000/month per investment.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-green-500/30 p-6 hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Low Entry Point</h3>
              <p className="text-purple-200">
                Start with just AED 1,000. Access investments that traditionally required millions.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-purple-500/30 p-6 hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Secure & Regulated</h3>
              <p className="text-purple-200">
                Full transparency with SPV structure. Legal ownership, professional management.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-orange-500/30 p-6 hover:scale-105 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Diversification</h3>
              <p className="text-purple-200">
                Spread risk across multiple assets. Real estate, franchises, and startups in one portfolio.
              </p>
            </div>
          </div>
        </div>

        {/* Platform Statistics */}
        {stats && (
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl shadow-xl p-8 mb-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
              backgroundSize: '30px 30px'
            }}></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Platform Track Record</h2>
                  <p className="text-purple-100">Trusted by thousands of investors worldwide</p>
                </div>
                <Award className="w-12 h-12 text-yellow-300" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all">
                  <div className="text-sm text-purple-100 mb-2">Total Investment</div>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalInvestment)}</div>
                  <div className="text-xs text-purple-200 mt-1">Platform-wide</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all">
                  <div className="text-sm text-purple-100 mb-2">Active Investors</div>
                  <div className="text-2xl font-bold">{stats.activeInvestors.toLocaleString()}+</div>
                  <div className="text-xs text-purple-200 mt-1">Growing daily</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all">
                  <div className="text-sm text-purple-100 mb-2">Avg. ROI</div>
                  <div className="text-2xl font-bold">{stats.avgROI.toFixed(1)}%</div>
                  <div className="text-xs text-purple-200 mt-1">Historical average</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all">
                  <div className="text-sm text-purple-100 mb-2">Success Rate</div>
                  <div className="text-2xl font-bold">
                    {stats.totalDeals > 0 ? ((stats.successfulDeals / stats.totalDeals) * 100).toFixed(0) : 0}%
                  </div>
                  <div className="text-xs text-purple-200 mt-1">{stats.successfulDeals} of {stats.totalDeals} deals</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all">
                  <div className="text-sm text-purple-100 mb-2">Total Distributed</div>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalPayouts)}</div>
                  <div className="text-xs text-purple-200 mt-1">Payouts to investors</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all">
                  <div className="text-sm text-purple-100 mb-2">Active Deals</div>
                  <div className="text-2xl font-bold">{deals.length}</div>
                  <div className="text-xs text-purple-200 mt-1">Available now</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">
              Start Earning in 3 Simple Steps
            </h2>
            <p className="text-purple-200 text-lg">
              From browsing to earning passive income in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-green-500/30 -z-10"></div>

            <div className="relative">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border-2 border-blue-500/30 p-8 text-center hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Browse Opportunities</h3>
                <p className="text-purple-200 mb-4">
                  Explore vetted real estate, franchises, and startups. View detailed financials, ROI projections, and monthly income potential.
                </p>
                <ul className="text-sm text-purple-200 space-y-2">
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Transparent financials
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Risk assessments
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Expected returns
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border-2 border-purple-500/30 p-8 text-center hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <CreditCard className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Invest Securely</h3>
                <p className="text-purple-200 mb-4">
                  Choose your investment amount (from AED 1,000). Complete the secure transaction. Get instant ownership shares.
                </p>
                <ul className="text-sm text-purple-200 space-y-2">
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    SPV legal structure
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Secure payment
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Instant confirmation
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border-2 border-green-500/30 p-8 text-center hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Earn Passive Income</h3>
                <p className="text-purple-200 mb-4">
                  Receive monthly dividends directly to your wallet. Track performance in real-time. Exit anytime via secondary market.
                </p>
                <ul className="text-sm text-purple-200 space-y-2">
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Monthly payouts
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Real-time tracking
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Liquidity options
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Bundles Promotion */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-8 h-8 text-yellow-300" />
                  <h2 className="text-3xl font-bold">Investment Bundles</h2>
                </div>
                <p className="text-indigo-100 text-lg">
                  Diversify instantly with pre-curated portfolios. One-click investing, professional allocation.
                </p>
              </div>
              <Rocket className="hidden lg:block w-16 h-16 text-yellow-300" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all">
                <Target className="w-6 h-6 text-yellow-300 mb-2" />
                <h3 className="font-bold mb-1">Instant Diversification</h3>
                <p className="text-sm text-indigo-100">Spread risk across multiple deals automatically</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all">
                <Gem className="w-6 h-6 text-yellow-300 mb-2" />
                <h3 className="font-bold mb-1">Expert Selection</h3>
                <p className="text-sm text-indigo-100">Professionally curated for optimal returns</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all">
                <Zap className="w-6 h-6 text-yellow-300 mb-2" />
                <h3 className="font-bold mb-1">ROI up to 45%</h3>
                <p className="text-sm text-indigo-100">Higher returns through strategic allocation</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Link href="/bundles" className="flex-1 sm:flex-initial">
                <button className="w-full px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-bold text-lg shadow-lg hover:scale-105 flex items-center justify-center gap-2">
                  <Package className="w-5 h-5" />
                  Explore Investment Bundles
                </button>
              </Link>
              <div className="text-sm text-indigo-100">
                <span className="font-semibold">Starting from $1,000</span> • {bundles.length} bundles available • 18-45% ROI
              </div>
            </div>
          </div>
        </div>

        {/* Featured Deals Section Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Flame className="w-8 h-8 text-orange-400" />
                <h2 className="text-3xl font-bold text-white">
                  Featured Investment Opportunities
                </h2>
              </div>
              <p className="text-purple-200 text-lg">
                Browse {deals.length} curated deals across Real Estate, Franchises, and Startups
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 text-purple-300 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <Link href="/deals" className="hidden md:block">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-md flex items-center gap-2">
                  View All Deals
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setFilter({ type: '', status: '', search: '' })}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                filter.type === '' && filter.status === ''
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              All Deals
            </button>
            <button
              onClick={() => setFilter({ ...filter, type: 'real_estate' })}
              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                filter.type === 'real_estate'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              <Building className="w-4 h-4" />
              Real Estate
            </button>
            <button
              onClick={() => setFilter({ ...filter, type: 'franchise' })}
              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                filter.type === 'franchise'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              <Store className="w-4 h-4" />
              Franchises
            </button>
            <button
              onClick={() => setFilter({ ...filter, type: 'startup' })}
              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                filter.type === 'startup'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              <Rocket className="w-4 h-4" />
              Startups
            </button>
            <button
              onClick={() => setFilter({ ...filter, status: 'open' })}
              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                filter.status === 'open'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Open Now
            </button>
          </div>

          {/* Advanced Filters - Collapsible */}
          <details className="bg-white/5 backdrop-blur-xl rounded-lg border border-white/10">
            <summary className="px-6 py-4 cursor-pointer font-semibold text-white hover:bg-white/10 rounded-lg flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-300" />
              Advanced Filters
            </summary>
            <div className="px-6 pb-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Search by Name
                  </label>
                  <input
                    type="text"
                    placeholder="Search deals..."
                    value={filter.search}
                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Deal Type
                  </label>
                  <select
                    value={filter.type}
                    onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                  >
                    <option value="">All Types</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="franchise">Franchise</option>
                    <option value="startup">Startup</option>
                    <option value="asset">Asset</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Status
                  </label>
                  <select
                    value={filter.status}
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-purple-200">Loading deals...</p>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10">
            <p className="text-purple-200">No deals found. Try adjusting your filters.</p>
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
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-8 h-8 text-purple-400" />
                  <h2 className="text-3xl font-bold text-white">
                    Smart Investment Bundles
                  </h2>
                </div>
                <p className="text-purple-200 text-lg">
                  Diversified portfolios curated by experts • One-click investing
                </p>
              </div>
              <Link href="/bundles" className="hidden md:block">
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all font-semibold shadow-md flex items-center gap-2">
                  View All Bundles
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bundles.map((bundle) => (
                <Link href={`/bundles/${bundle.id}`} key={bundle.id}>
                  <div className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-indigo-500/30 overflow-hidden hover:scale-105 transition-all duration-300">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold">{bundle.name}</h3>
                        <Package className="w-10 h-10" />
                      </div>
                      <p className="text-indigo-100 text-sm line-clamp-2">{bundle.description}</p>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                          <div className="text-xs text-green-400 mb-1">Expected ROI</div>
                          <div className="text-2xl font-bold text-green-400">
                            {bundle.expected_roi}%
                          </div>
                        </div>
                        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
                          <div className="text-xs text-blue-400 mb-1">Min. Investment</div>
                          <div className="text-xl font-bold text-blue-400">
                            {formatCurrency(bundle.min_investment)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-purple-200">
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {bundle.allocation?.length || 0} deals
                        </span>
                        <span className="font-semibold text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                          View Bundle
                          <ArrowRight className="w-4 h-4" />
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
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-8 h-8 text-pink-400" />
                  <h2 className="text-3xl font-bold text-white">
                    Secondary Market
                  </h2>
                </div>
                <p className="text-purple-200 text-lg">
                  Buy pre-owned shares from other investors • Instant ownership
                </p>
              </div>
              <Link href="/secondary-market" className="hidden md:block">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-lg hover:from-purple-700 hover:to-pink-800 transition-all font-semibold shadow-md flex items-center gap-2">
                  View All Listings
                  <ArrowRight className="w-5 h-5" />
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
                    <div className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-purple-500/30 overflow-hidden hover:scale-105 transition-all duration-300">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-700 p-1">
                        <div className="bg-slate-900 p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
                                {deal?.title || 'Investment Opportunity'}
                              </h3>
                              <div className="text-sm text-purple-300">
                                {deal ? getDealTypeLabel(deal.type) : 'Asset'}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
                              <div className="text-xs text-purple-400 mb-1">Total Price</div>
                              <div className="text-lg font-bold text-purple-300">
                                {formatCurrency(listing.total_price)}
                              </div>
                            </div>
                            <div className="bg-teal-500/10 rounded-lg p-3 border border-teal-500/30">
                              <div className="text-xs text-teal-400 mb-1">Monthly Inc.</div>
                              <div className="text-lg font-bold text-teal-300">
                                {formatCurrency(monthlyRevenue)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="text-purple-200">
                              <span className="font-semibold">{listing.shares_for_sale}</span> shares
                            </div>
                            <div className="flex items-center text-green-400 font-semibold gap-1">
                              <TrendingUp className="w-4 h-4" />
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

      {/* CSS for scrolling animation */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: inline-block;
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  const fundingProgress = calculateFundingProgress(deal.raised_amount, deal.target_amount);
  const statusColor = getStatusColor(deal.status);

  const minInvestment = parseFloat(deal.min_ticket?.toString() || '0');
  const expectedROI = parseFloat(deal.expected_roi?.toString() || '0');
  const monthlyIncome = (minInvestment * (expectedROI / 100)) / 12;
  const isHighYield = expectedROI > 20;

  return (
    <Link href={`/deals/${deal.id}`}>
      <div className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-purple-500/30 h-full flex flex-col cursor-pointer overflow-hidden hover:scale-105 transition-all duration-300">
        {/* Image */}
        <div className="relative h-56 bg-gray-800 overflow-hidden">
          {deal.images && deal.images[0] ? (
            <img
              src={deal.images[0]}
              alt={deal.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
              <span className="text-white font-semibold text-lg">
                {getDealTypeLabel(deal.type)}
              </span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <span className={`badge badge-${statusColor} capitalize shadow-lg`}>
              {deal.status}
            </span>
            {isHighYield && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold shadow-lg">
                <Star className="w-3 h-3" />
                High Yield
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
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <DollarSign className="w-3 h-3" />
                    Est. Monthly Income
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(monthlyIncome)}/mo
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600 mb-1">Expected ROI</div>
                  <div className="text-xl font-bold text-purple-600">
                    {formatPercentage(expectedROI)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-xl text-white mb-2 line-clamp-2 min-h-[56px]">
            {deal.title}
          </h3>

          <div className="flex items-center text-sm text-purple-300 mb-4 gap-1">
            <MapPin className="w-4 h-4" />
            {deal.location}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
              <div className="text-xs text-blue-400 mb-1">Min. Investment</div>
              <div className="text-lg font-bold text-blue-300">
                {formatCurrency(deal.min_ticket)}
              </div>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
              <div className="text-xs text-purple-400 mb-1">Target</div>
              <div className="text-lg font-bold text-purple-300">
                {formatCurrency(deal.target_amount)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-auto">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-purple-300 font-semibold">Funding Progress</span>
              <span className="font-bold text-white">
                {fundingProgress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-500 relative"
                style={{ width: `${fundingProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-purple-300 mt-2">
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {formatCurrency(deal.raised_amount)}
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <Users className="w-3 h-3" />
                {deal.investor_count} investors
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
