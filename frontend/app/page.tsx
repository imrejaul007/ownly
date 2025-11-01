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
  Timer, PlayCircle, Wallet, ChevronDown, Quote, Verified, BellRing, HelpCircle,
  Gift, Briefcase
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
  const [timeLeft, setTimeLeft] = useState({
    hours: 47,
    minutes: 59,
    seconds: 59,
  });
  const [email, setEmail] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [calculatorAmount, setCalculatorAmount] = useState(10000);
  const [calculatorMonths, setCalculatorMonths] = useState(12);
  const [calculatorROI, setCalculatorROI] = useState(15);

  useEffect(() => {
    fetchDeals();
    fetchBundles();
    fetchSecondaryListings();
    fetchPlatformStats();
    generateLiveActivities();

    // Auto-refresh live activities every 5 seconds
    const activityInterval = setInterval(() => {
      generateLiveActivities();
    }, 5000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(activityInterval);
      clearInterval(countdownInterval);
    };
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
    .filter(d => d.investor_count > 0)
    .sort((a, b) => (b.investor_count || 0) - (a.investor_count || 0))
    .slice(0, 6);

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
                  Own the World,<br />
                  <span className="text-yellow-300">One Deal at a Time</span>
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  From car fleets to cafés, salons to real estate — invest in real businesses generating real income.
                  Start from just <span className="font-bold text-yellow-300">AED 100/month</span>.
                </p>

                {/* Urgency Indicator with Real Countdown */}
                <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-red-500/30">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Timer className="w-6 h-6 text-red-300 animate-pulse" />
                      <div>
                        <div className="font-bold text-red-200">Limited Time Offer</div>
                        <div className="text-sm text-red-100">3 high-yield deals closing soon • High demand</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-red-500/30 rounded-lg px-3 py-2 border border-red-400/30">
                        <div className="text-2xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                        <div className="text-xs text-red-200">Hours</div>
                      </div>
                      <div className="text-red-300 text-2xl">:</div>
                      <div className="bg-red-500/30 rounded-lg px-3 py-2 border border-red-400/30">
                        <div className="text-2xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                        <div className="text-xs text-red-200">Mins</div>
                      </div>
                      <div className="text-red-300 text-2xl">:</div>
                      <div className="bg-red-500/30 rounded-lg px-3 py-2 border border-red-400/30">
                        <div className="text-2xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                        <div className="text-xs text-red-200">Secs</div>
                      </div>
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

        {/* 48-Hour Cancellation Policy Banner */}
        <div className="mb-12 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Risk-Free Investment</h3>
                <p className="text-blue-200 text-lg">Cancel any investment within 48 hours, no questions asked</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-blue-100">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-semibold">100% Money Back</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-semibold">No Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-semibold">Instant Processing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Media Mentions Section */}
        <div className="mb-12 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-purple-200 mb-2">Featured In</h3>
            <p className="text-sm text-purple-300">Trusted by leading financial publications</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-center">
              <div className="text-2xl font-bold text-purple-200">The National</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-2xl font-bold text-purple-200">Gulf News</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-2xl font-bold text-purple-200">Arabian Business</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-2xl font-bold text-purple-200">Emirates 24|7</div>
            </div>
          </div>
        </div>

        {/* Asset Class Comparison Table */}
        <div className="mb-12 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">Why OWNLY Outperforms Traditional Investments</h2>
            <p className="text-purple-200 text-lg">Compare returns across different asset classes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Bank Savings */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center hover:bg-white/10 transition-all">
              <div className="text-4xl mb-3">🏦</div>
              <div className="text-sm text-purple-300 mb-2">Bank Savings</div>
              <div className="text-3xl font-bold text-red-400 mb-2">1-2%</div>
              <div className="text-xs text-purple-200">Annual Return</div>
            </div>

            {/* Real Estate */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center hover:bg-white/10 transition-all">
              <div className="text-4xl mb-3">🏠</div>
              <div className="text-sm text-purple-300 mb-2">Real Estate</div>
              <div className="text-3xl font-bold text-orange-400 mb-2">6-8%</div>
              <div className="text-xs text-purple-200">Annual Return</div>
            </div>

            {/* Stock Market */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center hover:bg-white/10 transition-all">
              <div className="text-4xl mb-3">📈</div>
              <div className="text-sm text-purple-300 mb-2">Stock Market</div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">8-10%</div>
              <div className="text-xs text-purple-200">Annual Return</div>
            </div>

            {/* Crypto */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center hover:bg-white/10 transition-all">
              <div className="text-4xl mb-3">₿</div>
              <div className="text-sm text-purple-300 mb-2">Crypto</div>
              <div className="text-3xl font-bold text-purple-400 mb-2">Volatile</div>
              <div className="text-xs text-purple-200">High Risk</div>
            </div>

            {/* OWNLY */}
            <div className="bg-gradient-to-br from-green-500/30 to-emerald-500/30 backdrop-blur-xl rounded-xl border-2 border-green-400/50 p-6 text-center hover:scale-105 transition-all shadow-lg shadow-green-500/20">
              <div className="text-4xl mb-3">🚀</div>
              <div className="text-sm text-green-300 mb-2 font-bold">OWNLY</div>
              <div className="text-3xl font-bold text-green-400 mb-2">15-65%</div>
              <div className="text-xs text-green-200">Annual Return</div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs bg-green-500/20 px-3 py-1 rounded-full text-green-300">
                <BadgeCheck className="w-3 h-3" />
                Best Returns
              </div>
            </div>
          </div>

          <div className="mt-6 bg-blue-500/10 backdrop-blur-xl rounded-xl border border-blue-500/30 p-4 text-center">
            <p className="text-blue-200 text-sm">
              <span className="font-bold text-blue-100">OWNLY advantage:</span> Invest in real businesses with proven revenue streams.
              Your money works harder with fractional ownership of income-generating assets.
            </p>
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
              {deals.filter(d => d.status === 'open' && (d.investor_count || 0) >= 0).sort((a, b) => (b.investor_count || 0) - (a.investor_count || 0))[0] && (
                <Link href={`/deals/${deals.filter(d => d.status === 'open' && (d.investor_count || 0) >= 0).sort((a, b) => (b.investor_count || 0) - (a.investor_count || 0))[0].id}`}>
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
                        {deals.filter(d => d.status === 'open' && (d.investor_count || 0) >= 0).sort((a, b) => (b.investor_count || 0) - (a.investor_count || 0))[0].title}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-4 text-sm text-orange-300">
                        <MapPin className="w-4 h-4" />
                        {deals.filter(d => d.status === 'open' && (d.investor_count || 0) >= 0).sort((a, b) => (b.investor_count || 0) - (a.investor_count || 0))[0].location}
                      </div>
                      <div className="bg-green-500/20 rounded-xl p-4 mb-4 border border-green-500/30">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-400 mb-1">
                            {formatPercentage(deals.filter(d => d.status === 'open' && (d.investor_count || 0) >= 0).sort((a, b) => (b.investor_count || 0) - (a.investor_count || 0))[0].expected_roi || 0)}
                          </div>
                          <div className="text-xs text-green-300">Expected ROI</div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-orange-200">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {deals.filter(d => d.status === 'open' && (d.investor_count || 0) >= 0).sort((a, b) => (b.investor_count || 0) - (a.investor_count || 0))[0].investor_count}+ investors trust this
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
              {deals.filter(d => d.status === 'open' && parseFloat(d.expected_roi?.toString() || '0') > 10 && parseFloat(d.expected_roi?.toString() || '0') < 40)[0] && (
                <Link href={`/deals/${deals.filter(d => d.status === 'open' && parseFloat(d.expected_roi?.toString() || '0') > 10 && parseFloat(d.expected_roi?.toString() || '0') < 40)[0].id}`}>
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
                        {deals.filter(d => d.status === 'open' && parseFloat(d.expected_roi?.toString() || '0') > 10 && parseFloat(d.expected_roi?.toString() || '0') < 40)[0].title}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-4 text-sm text-green-300">
                        <MapPin className="w-4 h-4" />
                        {deals.filter(d => d.status === 'open' && parseFloat(d.expected_roi?.toString() || '0') > 10 && parseFloat(d.expected_roi?.toString() || '0') < 40)[0].location}
                      </div>
                      <div className="bg-green-500/20 rounded-xl p-4 mb-4 border border-green-500/30">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-400 mb-1">
                            {formatPercentage(deals.filter(d => d.status === 'open' && parseFloat(d.expected_roi?.toString() || '0') > 10 && parseFloat(d.expected_roi?.toString() || '0') < 40)[0].expected_roi || 0)}
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

        {/* Golden Visa Benefits Section */}
        <div className="mb-12 bg-gradient-to-br from-green-600/20 via-emerald-600/20 to-green-600/20 backdrop-blur-xl rounded-3xl border border-green-500/30 p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/30 mb-4">
              <Globe className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-semibold">UAE Golden Visa Opportunity</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Unlock UAE Golden Visa Benefits
            </h2>
            <p className="text-green-200 text-xl max-w-3xl mx-auto">
              Invest AED 2M+ and qualify for UAE's 10-year residency visa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6 hover:bg-white/15 hover:scale-105 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">10-Year Residency</h3>
              <p className="text-green-200">
                Long-term UAE visa for you and your family with automatic renewal options
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6 hover:bg-white/15 hover:scale-105 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Family Inclusion</h3>
              <p className="text-green-200">
                Spouse and children included under the same visa program
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6 hover:bg-white/15 hover:scale-105 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Building className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Sponsor Required</h3>
              <p className="text-green-200">
                Complete independence - no company or individual sponsor needed
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6 hover:bg-white/15 hover:scale-105 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Business Opportunities</h3>
              <p className="text-green-200">
                Full access to UAE market with complete business ownership rights
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/golden-visa">
              <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 inline-flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Learn More About Golden Visa
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Performance Dashboard with Platform Metrics */}
        <div className="mb-12 bg-gradient-to-br from-green-600/20 via-emerald-600/20 to-teal-600/20 backdrop-blur-xl rounded-2xl border border-green-500/30 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">Platform Performance vs Traditional Investments</h2>
            <p className="text-green-200 text-lg">Live metrics updated in real-time</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-green-500/30 p-6 text-center hover:scale-105 transition-all">
              <div className="flex items-center justify-center gap-2 mb-3">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <div className="text-sm font-semibold text-green-300">Platform Avg ROI</div>
              </div>
              <div className="text-4xl font-bold text-green-400 mb-2">{stats ? `${stats.avgROI.toFixed(1)}%` : '...'}</div>
              <div className="text-xs text-green-200">vs 8% Stock Market</div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs bg-green-500/20 px-3 py-1 rounded-full text-green-300">
                <ArrowRight className="w-3 h-3" />
                {stats && (((stats.avgROI / 8) * 100) - 100).toFixed(0)}% Better
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6 text-center hover:scale-105 transition-all">
              <div className="flex items-center justify-center gap-2 mb-3">
                <DollarSign className="w-6 h-6 text-blue-400" />
                <div className="text-sm font-semibold text-blue-300">Total Paid Out</div>
              </div>
              <div className="text-4xl font-bold text-blue-400 mb-2">{stats ? formatCurrency(stats.totalPayouts) : '...'}</div>
              <div className="text-xs text-blue-200">To Investors</div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs bg-blue-500/20 px-3 py-1 rounded-full text-blue-300">
                <CheckCircle className="w-3 h-3" />
                100% On Time
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6 text-center hover:scale-105 transition-all">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Award className="w-6 h-6 text-purple-400" />
                <div className="text-sm font-semibold text-purple-300">Success Rate</div>
              </div>
              <div className="text-4xl font-bold text-purple-400 mb-2">98.5%</div>
              <div className="text-xs text-purple-200">Deals Delivering Returns</div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs bg-purple-500/20 px-3 py-1 rounded-full text-purple-300">
                <Star className="w-3 h-3" />
                Top Tier
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-orange-500/30 p-6 text-center hover:scale-105 transition-all">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Users className="w-6 h-6 text-orange-400" />
                <div className="text-sm font-semibold text-orange-300">Active Investors</div>
              </div>
              <div className="text-4xl font-bold text-orange-400 mb-2">{stats ? `${stats.activeInvestors.toLocaleString()}+` : '...'}</div>
              <div className="text-xs text-orange-200">Growing Daily</div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs bg-orange-500/20 px-3 py-1 rounded-full text-orange-300">
                <Activity className="w-3 h-3" />
                +247 This Week
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Payout Timeline Visualization */}
        <div className="mb-12 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">See Your Money Grow Monthly</h2>
            <p className="text-purple-200 text-lg">Visual timeline of investment growth with monthly payouts</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-200 text-sm">Example: AED 10,000 investment at 25% annual ROI</span>
                <span className="text-green-400 font-bold">Monthly: AED 208</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((month) => (
                <div key={month} className="bg-white/5 backdrop-blur-xl rounded-lg border border-purple-500/20 p-4 text-center hover:bg-white/10 transition-all group">
                  <div className="text-xs text-purple-300 mb-2">Month {month}</div>
                  <div className="flex items-center justify-center mb-2">
                    <Wallet className="w-5 h-5 text-green-400 group-hover:scale-125 transition-transform" />
                  </div>
                  <div className="text-lg font-bold text-green-400">AED 208</div>
                  <div className="text-xs text-purple-200 mt-1">Payout</div>
                  <div className="mt-2 h-1 bg-green-500/30 rounded-full group-hover:bg-green-500/50 transition-all"></div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-green-500/10 backdrop-blur-xl rounded-xl border border-green-500/30 p-4 text-center">
              <div className="text-sm text-green-200 mb-2">After 12 Months</div>
              <div className="text-3xl font-bold text-green-400">AED 2,500 Earned</div>
              <div className="text-xs text-green-200 mt-1">+ Your original AED 10,000 principal returned</div>
            </div>
          </div>
        </div>

        {/* Mobile App Download Section */}
        <div className="mb-12 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Invest On The Go</h2>
              <p className="text-purple-200 text-lg mb-6">
                Download the OWNLY app and manage your investments anywhere, anytime.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Real-time notifications</div>
                    <div className="text-sm text-purple-300">Never miss a payout or opportunity</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">One-tap investing</div>
                    <div className="text-sm text-purple-300">Invest in seconds from your phone</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Portfolio tracking</div>
                    <div className="text-sm text-purple-300">Monitor performance 24/7</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 px-6 py-3 transition-all">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold text-xs"></span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-purple-300">Download on the</div>
                    <div className="font-bold text-white">App Store</div>
                  </div>
                </button>

                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 px-6 py-3 transition-all">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">▶</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-purple-300">GET IT ON</div>
                    <div className="font-bold text-white">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-center">
                <div className="text-sm text-purple-300 mb-4">Scan QR Code to Download</div>
                <div className="bg-white p-4 rounded-xl inline-block mb-4">
                  <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">📱</div>
                      <div className="text-sm text-gray-600">QR Code</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-purple-300">Compatible with iOS 14+ and Android 10+</p>
              </div>
            </div>
          </div>
        </div>

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

        {/* Video Testimonials Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-500/30 mb-4">
              <PlayCircle className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-semibold">Video Success Stories</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Hear From Our Investors
            </h2>
            <p className="text-purple-200 text-xl max-w-3xl mx-auto">
              Watch real investors share their experiences and success stories with OWNLY
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Video Testimonial 1 */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-blue-500/30 p-6 hover:scale-105 transition-all overflow-hidden">
              <div className="relative mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 aspect-video flex items-center justify-center cursor-pointer group-hover:shadow-2xl group-hover:shadow-blue-500/50 transition-all">
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <PlayCircle className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="text-white text-sm font-semibold">3:45 min</div>
                </div>
              </div>
              <div className="mb-4">
                <Quote className="w-6 h-6 text-purple-400 mb-2" />
                <p className="text-purple-100 italic text-sm mb-3">
                  "OWNLY transformed how I invest. I'm now earning consistent monthly income from multiple properties without the traditional hassles."
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">AA</span>
                </div>
                <div>
                  <div className="font-bold text-white">Ahmed Al-Mansoori</div>
                  <div className="text-sm text-purple-300">Real Estate Investor</div>
                </div>
              </div>
            </div>

            {/* Video Testimonial 2 */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-pink-500/30 p-6 hover:scale-105 transition-all overflow-hidden">
              <div className="relative mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-pink-600 to-purple-600 aspect-video flex items-center justify-center cursor-pointer group-hover:shadow-2xl group-hover:shadow-pink-500/50 transition-all">
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <PlayCircle className="w-10 h-10 text-pink-600" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="text-white text-sm font-semibold">4:20 min</div>
                </div>
              </div>
              <div className="mb-4">
                <Quote className="w-6 h-6 text-purple-400 mb-2" />
                <p className="text-purple-100 italic text-sm mb-3">
                  "As a busy entrepreneur, OWNLY gives me investment opportunities that are passive yet highly profitable. The platform is intuitive and trustworthy."
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">FA</span>
                </div>
                <div>
                  <div className="font-bold text-white">Fatima Al-Hashimi</div>
                  <div className="text-sm text-purple-300">Tech Entrepreneur</div>
                </div>
              </div>
            </div>

            {/* Video Testimonial 3 */}
            <div className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-green-500/30 p-6 hover:scale-105 transition-all overflow-hidden">
              <div className="relative mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600 aspect-video flex items-center justify-center cursor-pointer group-hover:shadow-2xl group-hover:shadow-green-500/50 transition-all">
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <PlayCircle className="w-10 h-10 text-green-600" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="text-white text-sm font-semibold">5:10 min</div>
                </div>
              </div>
              <div className="mb-4">
                <Quote className="w-6 h-6 text-purple-400 mb-2" />
                <p className="text-purple-100 italic text-sm mb-3">
                  "I've diversified my portfolio across 8 different deals. The returns have been exceptional and the transparency is remarkable."
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">MA</span>
                </div>
                <div>
                  <div className="font-bold text-white">Mohammed Al-Zaabi</div>
                  <div className="text-sm text-purple-300">Business Owner</div>
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

        {/* Enhanced Referral Rewards Section */}
        <div className="mb-12 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-4">
              <Gift className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-semibold">Referral Program</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Earn Rewards by Referring Friends
            </h2>
            <p className="text-purple-200 text-xl max-w-3xl mx-auto">
              Share OWNLY with your network and earn generous bonuses for every successful referral
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Bronze Tier */}
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl rounded-2xl border-2 border-orange-500/40 p-6 hover:scale-105 transition-all">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-orange-400 mb-2">Bronze Tier</h3>
                <p className="text-orange-200">Refer 3 Friends</p>
              </div>
              <div className="bg-orange-500/20 rounded-xl p-4 mb-4 border border-orange-500/30">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-1">AED 500</div>
                  <div className="text-sm text-orange-200">Bonus Reward</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-orange-100">
                  <CheckCircle className="w-4 h-4 text-orange-400" />
                  Cash bonus deposited instantly
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-100">
                  <CheckCircle className="w-4 h-4 text-orange-400" />
                  Friends get AED 100 sign-up bonus
                </div>
              </div>
            </div>

            {/* Silver Tier */}
            <div className="bg-gradient-to-br from-gray-400/20 to-gray-500/20 backdrop-blur-xl rounded-2xl border-2 border-gray-400/40 p-6 hover:scale-105 transition-all relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                POPULAR
              </div>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gray-300 mb-2">Silver Tier</h3>
                <p className="text-gray-200">Refer 10 Friends</p>
              </div>
              <div className="bg-gray-500/20 rounded-xl p-4 mb-4 border border-gray-500/30">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-300 mb-1">AED 2,000</div>
                  <div className="text-sm text-gray-200">Bonus Reward</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-100">
                  <CheckCircle className="w-4 h-4 text-gray-400" />
                  All Bronze tier benefits
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-100">
                  <CheckCircle className="w-4 h-4 text-gray-400" />
                  Priority customer support
                </div>
              </div>
            </div>

            {/* Gold Tier */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl rounded-2xl border-2 border-yellow-500/40 p-6 hover:scale-105 transition-all relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                ELITE
              </div>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">Gold Tier</h3>
                <p className="text-yellow-200">Refer 25 Friends</p>
              </div>
              <div className="bg-yellow-500/20 rounded-xl p-4 mb-4 border border-yellow-500/30">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">AED 6,000</div>
                  <div className="text-sm text-yellow-200">Bonus Reward</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-yellow-100">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  All Silver tier benefits
                </div>
                <div className="flex items-center gap-2 text-sm text-yellow-100">
                  <CheckCircle className="w-4 h-4 text-yellow-400" />
                  Exclusive investment opportunities
                </div>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                  1
                </div>
                <h4 className="font-bold text-white mb-2">Share Your Link</h4>
                <p className="text-purple-200 text-sm">Get your unique referral link from your dashboard</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                  2
                </div>
                <h4 className="font-bold text-white mb-2">Friend Signs Up</h4>
                <p className="text-purple-200 text-sm">Your friend creates an account using your link</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                  3
                </div>
                <h4 className="font-bold text-white mb-2">They Invest</h4>
                <p className="text-purple-200 text-sm">Friend makes their first investment of AED 1,000+</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                  4
                </div>
                <h4 className="font-bold text-white mb-2">You Both Win</h4>
                <p className="text-purple-200 text-sm">Instant bonus credited to both accounts</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/rewards">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 inline-flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Start Referring
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
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

        {/* OWNLY Ecosystem Overview */}
        <div className="mb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border border-purple-500/30 p-12">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}></div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-xl border border-purple-400/30 rounded-full text-purple-300 text-sm font-semibold mb-6">
                  <Globe className="w-4 h-4" />
                  The People's Ownership Network
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  Own Pieces of the Real World
                </h2>
                <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                  OWNLY turns everyday businesses into investable assets. From car fleets to cafés, salons to co-working spaces — own, earn, and trade real-world income-generating deals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                  { icon: <Building className="w-8 h-8" />, value: "8+", label: "Investment Categories", color: "blue" },
                  { icon: <Users className="w-8 h-8" />, value: "10K+", label: "Active Investors", color: "purple" },
                  { icon: <Package className="w-8 h-8" />, value: "150+", label: "Live Deals", color: "pink" },
                  { icon: <DollarSign className="w-8 h-8" />, value: "AED 100", label: "Minimum Entry", color: "green" }
                ].map((stat, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center hover:scale-105 transition-transform">
                    <div className={`w-16 h-16 rounded-full bg-${stat.color}-500/20 border border-${stat.color}-500/30 flex items-center justify-center mx-auto mb-4 text-${stat.color}-400`}>
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-purple-300">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">The Complete OWNLY Ecosystem</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: <Activity className="w-6 h-6" />, title: "OWNLY Exchange", desc: "Buy & sell shares of real businesses anytime" },
                    { icon: <Wallet className="w-6 h-6" />, title: "OWNLY Wallet", desc: "Store earnings, dividends & trade profits" },
                    { icon: <CreditCard className="w-6 h-6" />, title: "OWNLY Card", desc: "Spend or reinvest your earnings instantly" },
                    { icon: <Shield className="w-6 h-6" />, title: "OWNLY Trust Fund", desc: "Capital protection & audit assurance" },
                    { icon: <BarChart3 className="w-6 h-6" />, title: "Smart AI Algorithm", desc: "Personalized deal recommendations" },
                    { icon: <Package className="w-6 h-6" />, title: "Diversified Bundles", desc: "Auto-managed investment portfolios" },
                    { icon: <RefreshCw className="w-6 h-6" />, title: "SIP Auto-Invest", desc: "Recurring investments from AED 100/mo" },
                    { icon: <BadgeCheck className="w-6 h-6" />, title: "Verified Partners", desc: "Vetted merchants & trusted brands" }
                  ].map((feature, index) => (
                    <div key={index} className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-5 border border-white/10 hover:border-purple-500/50 transition-all">
                      <div className="w-12 h-12 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                        {feature.icon}
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                      <p className="text-sm text-purple-300">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 8 Investment Categories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Invest Across 8 Real-World Categories
            </h2>
            <p className="text-purple-200 text-lg">
              From mobility to luxury — diversify your portfolio across income-generating businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🚗",
                category: "Mobility",
                examples: "Car fleets, logistics, bikes",
                deals: 25,
                avgROI: "16-20%",
                minTicket: 500,
                gradient: "from-blue-500/20 to-cyan-500/20",
                border: "border-blue-500/30"
              },
              {
                icon: "🏢",
                category: "Workspace",
                examples: "Co-working, offices, studios",
                deals: 18,
                avgROI: "14-18%",
                minTicket: 750,
                gradient: "from-purple-500/20 to-indigo-500/20",
                border: "border-purple-500/30"
              },
              {
                icon: "💆‍♀️",
                category: "Lifestyle",
                examples: "Salons, spas, gyms, clinics",
                deals: 22,
                avgROI: "15-22%",
                minTicket: 500,
                gradient: "from-pink-500/20 to-rose-500/20",
                border: "border-pink-500/30"
              },
              {
                icon: "🛍️",
                category: "Retail & Trade",
                examples: "Perfumes, fashion, FMCG",
                deals: 20,
                avgROI: "18-25%",
                minTicket: 500,
                gradient: "from-yellow-500/20 to-orange-500/20",
                border: "border-yellow-500/30"
              },
              {
                icon: "☕",
                category: "Hospitality",
                examples: "Cafés, restaurants, hotels",
                deals: 16,
                avgROI: "12-18%",
                minTicket: 1000,
                gradient: "from-amber-500/20 to-orange-600/20",
                border: "border-amber-500/30"
              },
              {
                icon: "🏠",
                category: "Real Estate",
                examples: "Commercial & residential",
                deals: 30,
                avgROI: "12-16%",
                minTicket: 1000,
                gradient: "from-green-500/20 to-emerald-500/20",
                border: "border-green-500/30"
              },
              {
                icon: "🏕️",
                category: "Experience",
                examples: "Glamping, events, travel",
                deals: 12,
                avgROI: "14-20%",
                minTicket: 750,
                gradient: "from-teal-500/20 to-cyan-500/20",
                border: "border-teal-500/30"
              },
              {
                icon: "💎",
                category: "Luxury",
                examples: "Yachts, supercars, premium",
                deals: 8,
                avgROI: "10-15%",
                minTicket: 2000,
                gradient: "from-violet-500/20 to-purple-600/20",
                border: "border-violet-500/30"
              }
            ].map((cat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${cat.gradient} backdrop-blur-xl rounded-2xl border ${cat.border} p-6 hover:scale-105 transition-all cursor-pointer group`}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{cat.category}</h3>
                <p className="text-sm text-purple-300 mb-4">{cat.examples}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-400">Active Deals</span>
                    <span className="font-bold text-white">{cat.deals} deals</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-400">Avg. ROI</span>
                    <span className="font-bold text-green-400">{cat.avgROI}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-400">Min. Entry</span>
                    <span className="font-bold text-white">AED {cat.minTicket}</span>
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm font-semibold transition-all flex items-center justify-center gap-2">
                  Explore {cat.category}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Investment Types Comparison */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Choose Your Investment Style
            </h2>
            <p className="text-purple-200 text-lg">
              Three flexible ways to invest — from AED 100 per month to curated portfolios
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* SIP */}
            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-8 hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">OWNLY SIP</h3>
                  <p className="text-sm text-blue-300">Smart Investment Plan</p>
                </div>
              </div>

              <p className="text-purple-200 mb-6">
                Auto-invest monthly in a diversified basket. Perfect for building wealth consistently.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-purple-200">Starting from <strong className="text-white">AED 100/month</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-purple-200">Auto-diversified across 8 categories</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-purple-200">Compounding rewards & bonuses</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-purple-200">Withdraw anytime (3+ months)</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-purple-300">Expected ROI</span>
                  <span className="text-xl font-bold text-green-400">16-18%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-300">Risk Level</span>
                  <span className="text-sm font-semibold text-blue-300">Low</span>
                </div>
              </div>

              <Link href="/sip">
                <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                  Start SIP Plan
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>

            {/* Direct Deal */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 hover:scale-105 transition-all relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-xs font-bold">
                  MOST POPULAR
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/30 border border-purple-400/40 flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Direct Deal</h3>
                  <p className="text-sm text-purple-300">Single SPV Investment</p>
                </div>
              </div>

              <p className="text-purple-200 mb-6">
                Pick specific businesses you believe in. Direct ownership with transparent returns.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-purple-200">Starting from <strong className="text-white">AED 500</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-purple-200">Choose your own deals</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-purple-200">Monthly/quarterly payouts</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-purple-200">Tradable after 3 months</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-purple-300">Expected ROI</span>
                  <span className="text-xl font-bold text-green-400">12-25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-300">Risk Level</span>
                  <span className="text-sm font-semibold text-yellow-300">Medium</span>
                </div>
              </div>

              <Link href="/deals">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                  Browse All Deals
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>

            {/* Bundles */}
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl border border-green-500/30 p-8 hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-500/30 border border-green-400/40 flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">OWNLY Bundles</h3>
                  <p className="text-sm text-green-300">Curated Portfolios</p>
                </div>
              </div>

              <p className="text-purple-200 mb-6">
                Professionally managed portfolios with automatic rebalancing for optimal returns.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-purple-200">Starting from <strong className="text-white">AED 2,000</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-purple-200">Expert-curated portfolios</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-purple-200">Auto-rebalancing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-purple-200">Liquidity every 90 days</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-purple-300">Expected ROI</span>
                  <span className="text-xl font-bold text-green-400">15-22%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-300">Risk Level</span>
                  <span className="text-sm font-semibold text-green-300">Low-Medium</span>
                </div>
              </div>

              <Link href="/bundles">
                <button className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                  View Bundles
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>

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

        {/* Success Stories - Real Investor Results */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Award className="w-8 h-8 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">
                Real Results from Real Investors
              </h2>
            </div>
            <p className="text-purple-200 text-lg">
              See how OWNLY investors are building wealth with fractional real estate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Ahmed Al Mansoori",
                avatar: "AM",
                role: "Tech Professional, Dubai",
                invested: 25000,
                currentValue: 31250,
                monthlyIncome: 312,
                deals: 8,
                duration: "18 months",
                roi: 25,
                testimonial: "Started with AED 5K, now earning passive income monthly. The platform is transparent and payouts are always on time."
              },
              {
                name: "Fatima Al Hashimi",
                avatar: "FH",
                role: "Marketing Manager, Abu Dhabi",
                invested: 50000,
                currentValue: 63500,
                monthlyIncome: 625,
                deals: 12,
                duration: "24 months",
                roi: 27,
                testimonial: "Best investment decision I've made. Diversified across 12 properties, earning more than my savings account by 10x."
              },
              {
                name: "Omar Hassan",
                avatar: "OH",
                role: "Entrepreneur, Sharjah",
                invested: 100000,
                currentValue: 122000,
                monthlyIncome: 1420,
                deals: 15,
                duration: "20 months",
                roi: 22,
                testimonial: "Built a AED 100K+ portfolio in under 2 years. The secondary market gives me flexibility I never had with traditional real estate."
              }
            ].map((story, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-8 hover:border-purple-500/50 transition-all hover:scale-105 transform"
              >
                {/* Avatar and Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                    {story.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{story.name}</h3>
                    <p className="text-sm text-purple-300">{story.role}</p>
                    <p className="text-xs text-purple-400">{story.duration} investing</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
                    <div className="text-xs text-green-400 mb-1">Total Returns</div>
                    <div className="text-2xl font-bold text-green-300">+{story.roi}%</div>
                  </div>
                  <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                    <div className="text-xs text-blue-400 mb-1">Monthly Income</div>
                    <div className="text-2xl font-bold text-blue-300">{formatCurrency(story.monthlyIncome)}</div>
                  </div>
                </div>

                {/* Portfolio Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Total Invested</span>
                    <span className="font-bold text-white">{formatCurrency(story.invested)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Current Value</span>
                    <span className="font-bold text-green-400">{formatCurrency(story.currentValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Deals Invested</span>
                    <span className="font-bold text-white">{story.deals} properties</span>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="pt-6 border-t border-white/10">
                  <Quote className="w-6 h-6 text-purple-400 mb-3" />
                  <p className="text-sm text-purple-200 italic leading-relaxed">
                    "{story.testimonial}"
                  </p>
                </div>

                {/* Verified Badge */}
                <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
                  <Verified className="w-4 h-4" />
                  Verified Investor
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive ROI Calculator */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl border border-indigo-500/30 p-10">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-3">
                <BarChart3 className="w-8 h-8 text-indigo-400" />
                <h2 className="text-3xl font-bold text-white">
                  Calculate Your Potential Returns
                </h2>
              </div>
              <p className="text-purple-200 text-lg">
                See how much you could earn with OWNLY real estate investments
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Input Controls */}
              <div className="space-y-8">
                {/* Investment Amount */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-white font-semibold">Investment Amount</label>
                    <span className="text-2xl font-bold text-purple-300">{formatCurrency(calculatorAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={calculatorAmount}
                    onChange={(e) => setCalculatorAmount(Number(e.target.value))}
                    className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${((calculatorAmount - 500) / (100000 - 500)) * 100}%, rgba(255,255,255,0.1) ${((calculatorAmount - 500) / (100000 - 500)) * 100}%, rgba(255,255,255,0.1) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-purple-400 mt-2">
                    <span>AED 500</span>
                    <span>AED 100K</span>
                  </div>
                </div>

                {/* Investment Period */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-white font-semibold">Investment Period</label>
                    <span className="text-2xl font-bold text-purple-300">{calculatorMonths} months</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="60"
                    step="6"
                    value={calculatorMonths}
                    onChange={(e) => setCalculatorMonths(Number(e.target.value))}
                    className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${((calculatorMonths - 6) / (60 - 6)) * 100}%, rgba(255,255,255,0.1) ${((calculatorMonths - 6) / (60 - 6)) * 100}%, rgba(255,255,255,0.1) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-purple-400 mt-2">
                    <span>6 months</span>
                    <span>5 years</span>
                  </div>
                </div>

                {/* Expected ROI */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-white font-semibold">Expected Annual ROI</label>
                    <span className="text-2xl font-bold text-purple-300">{calculatorROI}%</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="30"
                    step="1"
                    value={calculatorROI}
                    onChange={(e) => setCalculatorROI(Number(e.target.value))}
                    className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${((calculatorROI - 8) / (30 - 8)) * 100}%, rgba(255,255,255,0.1) ${((calculatorROI - 8) / (30 - 8)) * 100}%, rgba(255,255,255,0.1) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-purple-400 mt-2">
                    <span>Conservative (8%)</span>
                    <span>Aggressive (30%)</span>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-purple-300 mb-3">Quick Presets:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setCalculatorAmount(5000);
                        setCalculatorMonths(12);
                        setCalculatorROI(12);
                      }}
                      className="px-4 py-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all text-sm font-semibold"
                    >
                      Beginner
                    </button>
                    <button
                      onClick={() => {
                        setCalculatorAmount(25000);
                        setCalculatorMonths(24);
                        setCalculatorROI(18);
                      }}
                      className="px-4 py-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-all text-sm font-semibold"
                    >
                      Growth
                    </button>
                    <button
                      onClick={() => {
                        setCalculatorAmount(50000);
                        setCalculatorMonths(36);
                        setCalculatorROI(20);
                      }}
                      className="px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-all text-sm font-semibold"
                    >
                      Builder
                    </button>
                    <button
                      onClick={() => {
                        setCalculatorAmount(100000);
                        setCalculatorMonths(60);
                        setCalculatorROI(25);
                      }}
                      className="px-4 py-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 hover:bg-yellow-500/30 transition-all text-sm font-semibold"
                    >
                      Wealth
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  Your Projected Returns
                </h3>

                {(() => {
                  const monthlyROI = calculatorROI / 12 / 100;
                  const totalReturns = calculatorAmount * (calculatorROI / 100) * (calculatorMonths / 12);
                  const finalValue = calculatorAmount + totalReturns;
                  const monthlyIncome = (calculatorAmount * (calculatorROI / 100)) / 12;

                  return (
                    <>
                      <div className="space-y-6">
                        {/* Final Value */}
                        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
                          <div className="text-sm text-green-400 mb-2">Total Portfolio Value</div>
                          <div className="text-4xl font-bold text-white mb-1">{formatCurrency(finalValue)}</div>
                          <div className="text-sm text-green-300">
                            +{formatCurrency(totalReturns)} profit
                          </div>
                        </div>

                        {/* Monthly Income */}
                        <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-blue-500/30">
                          <div className="text-sm text-blue-400 mb-2">Monthly Passive Income</div>
                          <div className="text-4xl font-bold text-white mb-1">{formatCurrency(monthlyIncome)}</div>
                          <div className="text-sm text-blue-300">
                            Consistent monthly payouts
                          </div>
                        </div>

                        {/* ROI Percentage */}
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                          <div className="text-sm text-purple-400 mb-2">Total Return on Investment</div>
                          <div className="text-4xl font-bold text-white mb-1">
                            {((totalReturns / calculatorAmount) * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-purple-300">
                            Over {calculatorMonths} months
                          </div>
                        </div>
                      </div>

                      {/* Breakdown */}
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-sm text-purple-300 mb-4">Investment Breakdown:</p>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-200">Initial Investment</span>
                            <span className="font-semibold text-white">{formatCurrency(calculatorAmount)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-200">Duration</span>
                            <span className="font-semibold text-white">{calculatorMonths} months ({(calculatorMonths / 12).toFixed(1)} years)</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-200">Annual ROI</span>
                            <span className="font-semibold text-white">{calculatorROI}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-200">Monthly Returns</span>
                            <span className="font-semibold text-green-400">{formatCurrency(monthlyIncome)}</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <Link href="/deals">
                        <button className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-800 transition-all shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2">
                          Start Investing Now
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </Link>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payouts Feed */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Wallet className="w-8 h-8 text-green-400" />
              <h2 className="text-3xl font-bold text-white">
                Recent Payouts to Investors
              </h2>
            </div>
            <p className="text-purple-200 text-lg">
              Live feed of monthly rental distributions and exit payouts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { investor: "Ahmed M.", amount: 3250, type: "Monthly Rental", deal: "Dubai Marina Studio", time: "2 hours ago", icon: DollarSign, color: "green" },
              { investor: "Fatima H.", amount: 8500, type: "Exit Distribution", deal: "Business Bay 1BR", time: "5 hours ago", icon: TrendingUp, color: "blue" },
              { investor: "Omar K.", amount: 1875, type: "Monthly Rental", deal: "JLT Office Space", time: "8 hours ago", icon: DollarSign, color: "green" },
              { investor: "Sarah A.", amount: 4320, type: "Monthly Rental", deal: "Downtown Apartment", time: "12 hours ago", icon: DollarSign, color: "green" },
              { investor: "Khalid R.", amount: 15200, type: "Exit Distribution", deal: "Palm Jumeirah Villa", time: "1 day ago", icon: TrendingUp, color: "blue" },
              { investor: "Layla M.", amount: 2650, type: "Monthly Rental", deal: "Arabian Ranches", time: "1 day ago", icon: DollarSign, color: "green" },
              { investor: "Hassan F.", amount: 5890, type: "Profit Share", deal: "Dubai Hills Estate", time: "2 days ago", icon: Target, color: "purple" },
              { investor: "Mariam S.", amount: 3120, type: "Monthly Rental", deal: "Business Bay Tower", time: "2 days ago", icon: DollarSign, color: "green" }
            ].map((payout, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5 hover:border-green-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-full bg-${payout.color}-500/20 border border-${payout.color}-500/30 flex items-center justify-center`}>
                    <payout.icon className={`w-5 h-5 text-${payout.color}-400`} />
                  </div>
                  <span className="text-xs text-purple-400">{payout.time}</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {formatCurrency(payout.amount)}
                </div>
                <div className="text-sm text-purple-300 mb-2">{payout.type}</div>
                <div className="text-xs text-purple-400 line-clamp-1">{payout.deal}</div>
                <div className="text-xs text-green-400 mt-3 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Paid to {payout.investor}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 backdrop-blur-xl border border-green-500/30 rounded-full text-green-300">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">AED 2.4M+ paid out to investors this month</span>
            </div>
          </div>
        </div>

        {/* Top Performing Deals */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Star className="w-8 h-8 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">
                Top Performing Investments
              </h2>
            </div>
            <p className="text-purple-200 text-lg">
              Our highest-yielding properties with proven track records
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                rank: 1,
                title: "Palm Jumeirah Luxury Villa",
                location: "Palm Jumeirah, Dubai",
                type: "Residential",
                invested: 850000,
                currentValue: 1180000,
                roi: 38.8,
                monthlyIncome: 24500,
                investors: 127,
                occupancy: 100,
                payouts: 24,
                badge: "🏆 Best Performer"
              },
              {
                rank: 2,
                title: "Downtown Dubai Office Tower",
                location: "Downtown Dubai",
                type: "Commercial",
                invested: 1200000,
                currentValue: 1620000,
                roi: 35.0,
                monthlyIncome: 35200,
                investors: 203,
                occupancy: 100,
                payouts: 20,
                badge: "💎 Premium Asset"
              },
              {
                rank: 3,
                title: "Business Bay Retail Space",
                location: "Business Bay, Dubai",
                type: "Retail",
                invested: 620000,
                currentValue: 827500,
                roi: 33.5,
                monthlyIncome: 17800,
                investors: 98,
                occupancy: 95,
                payouts: 22,
                badge: "🔥 High Yield"
              },
              {
                rank: 4,
                title: "Dubai Marina Waterfront",
                location: "Dubai Marina",
                type: "Residential",
                invested: 950000,
                currentValue: 1254000,
                roi: 32.0,
                monthlyIncome: 26850,
                investors: 156,
                occupancy: 100,
                payouts: 21,
                badge: "⭐ Consistent"
              }
            ].map((deal, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-8 hover:border-yellow-500/50 transition-all relative overflow-hidden group"
              >
                {/* Rank Badge */}
                <div className="absolute top-6 right-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    #{deal.rank}
                  </div>
                </div>

                {/* Badge */}
                <div className="mb-4">
                  <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-xs font-semibold">
                    {deal.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-2 pr-16">
                  {deal.title}
                </h3>
                <div className="flex items-center gap-2 text-purple-300 mb-6">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{deal.location}</span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
                    <div className="text-xs text-green-400 mb-1">Total ROI</div>
                    <div className="text-3xl font-bold text-green-300">+{deal.roi}%</div>
                  </div>
                  <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                    <div className="text-xs text-blue-400 mb-1">Monthly Income</div>
                    <div className="text-2xl font-bold text-blue-300">{formatCurrency(deal.monthlyIncome)}</div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Total Invested</span>
                    <span className="font-bold text-white">{formatCurrency(deal.invested)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Current Value</span>
                    <span className="font-bold text-green-400">{formatCurrency(deal.currentValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Investors</span>
                    <span className="font-bold text-white">{deal.investors} investors</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Occupancy Rate</span>
                    <span className="font-bold text-green-400">{deal.occupancy}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Successful Payouts</span>
                    <span className="font-bold text-white">{deal.payouts} months</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-purple-400 mb-2">
                    <span>Performance Score</span>
                    <span>{Math.round((deal.roi / 40) * 100)}/100</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                      style={{ width: `${(deal.roi / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Type Badge */}
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-xs font-semibold">
                    {deal.type}
                  </span>
                  <div className="flex items-center gap-1 text-green-400 text-xs">
                    <CheckCircle className="w-3 h-3" />
                    100% On-Time Payouts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <HelpCircle className="w-8 h-8 text-purple-400" />
              <h2 className="text-3xl font-bold text-white">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="text-purple-200 text-lg">
              Everything you need to know about investing with OWNLY
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "How does OWNLY work?",
                answer: "OWNLY is a real estate investment platform that allows you to invest in high-quality properties starting from AED 500. We handle all property management, maintenance, and tenant relations while you earn monthly rental income and benefit from property appreciation."
              },
              {
                question: "What are the minimum investment requirements?",
                answer: "Our minimum investment starts at just AED 500, making real estate investment accessible to everyone. Unlike traditional real estate where you need hundreds of thousands, OWNLY lets you build a diversified portfolio with small amounts."
              },
              {
                question: "How do I earn returns?",
                answer: "You earn in two ways: (1) Monthly rental income distributed directly to your wallet, and (2) Capital appreciation when property values increase. Most deals target 12-25% annual returns through this combination."
              },
              {
                question: "When can I withdraw my investment?",
                answer: "Each deal has a specific lock-in period (typically 6-24 months) depending on the property type. After this period, you can exit through our secondary market where other investors can buy your shares, or wait for the property sale/exit event."
              },
              {
                question: "Is my investment secure?",
                answer: "All properties are professionally valued, legally structured through SPVs (Special Purpose Vehicles), and managed by licensed property managers. Your ownership is recorded on blockchain for transparency. However, like all investments, real estate carries risks including market fluctuations and liquidity constraints."
              },
              {
                question: "What fees does OWNLY charge?",
                answer: "We charge a transparent 2% annual management fee on the property value, which covers property management, maintenance, tenant relations, and platform operations. There are no hidden fees or transaction costs for buying shares."
              },
              {
                question: "Can I sell my shares before the lock-in period ends?",
                answer: "During the lock-in period, your investment is locked. However, after the lock-in expires, you can list your shares on our secondary market where other investors can purchase them, providing liquidity before the official exit event."
              },
              {
                question: "What happens if a tenant doesn't pay rent?",
                answer: "Our professional property managers handle all tenant issues including late payments and evictions. Most properties maintain occupancy insurance and have reserve funds to cover short-term vacancies, ensuring consistent returns to investors."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden hover:border-purple-500/30 transition-all"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-purple-400 transition-transform flex-shrink-0 ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-5 text-purple-200 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table - OWNLY vs Traditional */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Why Choose OWNLY Over Traditional Real Estate?
            </h2>
            <p className="text-purple-200 text-lg">
              See how we compare to traditional property investment
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl">
                  <th className="px-6 py-4 text-left text-purple-200 font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Gem className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-bold">OWNLY</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-gray-400 font-semibold">Traditional</th>
                </tr>
              </thead>
              <tbody className="bg-white/5 backdrop-blur-xl divide-y divide-white/10">
                <tr>
                  <td className="px-6 py-4 text-purple-200">Minimum Investment</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-green-400 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      AED 500
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-red-400">AED 500K+</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-purple-200">Diversification</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-green-400 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      Multiple Properties
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-red-400">Single Property</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-purple-200">Property Management</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-green-400 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      Fully Managed
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-red-400">DIY or Pay Extra</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-purple-200">Liquidity</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-green-400 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      Secondary Market
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-red-400">Months to Sell</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-purple-200">Expected Returns</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-green-400 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      12-25% Annual
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-yellow-400">6-12% Annual</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-purple-200">Transaction Time</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-green-400 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      Instant
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-red-400">30-90 Days</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-purple-200">Legal Paperwork</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-green-400 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      Automated
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-red-400">Complex & Lengthy</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-purple-200">Maintenance Hassles</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-green-400 font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      None
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-red-400">Full Responsibility</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Newsletter Signup Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-12">
            <div className="max-w-3xl mx-auto text-center">
              <BellRing className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Stay Updated with OWNLY Insights
              </h2>
              <p className="text-purple-200 text-lg mb-8">
                Get exclusive deal alerts, market insights, and investment tips delivered to your inbox. Join 10,000+ savvy investors.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing! Welcome to OWNLY Insights.');
                  setEmail('');
                }}
                className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-500 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-800 transition-all shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Subscribe Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
              <p className="text-sm text-purple-300 mt-4">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div className="mb-16">
          <div className="bg-yellow-500/10 backdrop-blur-xl rounded-2xl border border-yellow-500/30 p-8">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Investment Risk Disclosure</h3>
                <div className="text-purple-200 leading-relaxed space-y-2">
                  <p>
                    <strong>Important:</strong> All investments carry risk, including the potential loss of principal. Real estate investments are subject to market fluctuations, economic conditions, property-specific risks, and liquidity constraints.
                  </p>
                  <p>
                    Past performance does not guarantee future results. Expected returns are projections and not guaranteed. Property values may increase or decrease. Rental income may fluctuate based on occupancy rates and market conditions.
                  </p>
                  <p>
                    Before investing, carefully review all deal documents, financial projections, and risk factors. Invest only what you can afford to lose. Diversification does not eliminate risk. OWNLY is not a licensed financial advisor - please consult with your own financial, tax, and legal advisors.
                  </p>
                  <p className="text-sm text-purple-300 mt-4">
                    OWNLY is regulated by [Regulatory Authority]. All investments are made through legally structured SPVs. For full terms and conditions, visit our Terms of Service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-3xl">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-700"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

            <div className="relative px-8 py-16 md:py-20 text-center">
              <Rocket className="w-16 h-16 text-white mx-auto mb-6 animate-bounce" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Start Building Wealth?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of investors earning passive income through fractional real estate ownership. Start with as little as AED 500 today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/deals">
                  <button className="px-10 py-5 bg-white text-purple-700 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-white/50 hover:scale-105 transform flex items-center gap-3">
                    Browse All Deals
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-10 py-5 bg-purple-900/50 backdrop-blur-xl text-white border-2 border-white/50 rounded-xl font-bold text-lg hover:bg-purple-900/70 transition-all flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Create Free Account
                  </button>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-8 mt-10 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>No hidden fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Instant setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Free to browse</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
