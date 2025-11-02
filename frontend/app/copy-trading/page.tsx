'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPercentage } from '@/lib/utils';
import { usePreferences } from '@/context/PreferencesContext';
import { copyTradingAPI } from '@/lib/api';
import {
  Users, TrendingUp, Copy, CheckCircle, Target, Award, Filter,
  BarChart3, Star, Clock, DollarSign, Zap, ArrowRight, Shield,
  Trophy, Flame, Eye, UserPlus, Activity, ChevronDown, Search, X, AlertCircle
} from 'lucide-react';

interface Trader {
  id: string;
  user_id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  is_active: boolean;
  bio: string | null;
  specialty: string[];
  min_copy_amount: number;
  commission_rate: number;
  total_copiers_count: number;
  total_return: number;
  monthly_return: number;
  win_rate: number;
  risk_level: 'low' | 'medium' | 'high';
  created_at: string;
  bundles?: any[];
}

interface CopyModalData {
  trader: Trader;
  showModal: boolean;
}

export default function CopyTradingPage() {
  const { formatCurrency } = usePreferences();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'total_return' | 'total_copiers_count' | 'win_rate'>('total_copiers_count');
  const [searchQuery, setSearchQuery] = useState('');
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Copy modal state
  const [copyModal, setCopyModal] = useState<CopyModalData | null>(null);
  const [copyType, setCopyType] = useState<'full_profile' | 'bundle' | 'individual_deal'>('full_profile');
  const [copyAmount, setCopyAmount] = useState(5000);
  const [autoReinvest, setAutoReinvest] = useState(false);
  const [stopLoss, setStopLoss] = useState(20);
  const [selectedBundle, setSelectedBundle] = useState<string>('');
  const [selectedDeal, setSelectedDeal] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTraders();
  }, [sortBy, selectedFilter]);

  const fetchTraders = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = { sortBy };

      if (selectedFilter === 'verified') {
        // Backend doesn't have verified filter yet, so we'll filter client-side
      } else if (selectedFilter === 'low-risk') {
        params.risk_level = 'low';
      } else if (selectedFilter === 'high-return') {
        params.min_return = 150;
      }

      const response = await copyTradingAPI.getTraders(params);
      setTraders(response.data.data.traders || []);
    } catch (err: any) {
      console.error('Error fetching traders:', err);
      setError(err.response?.data?.message || 'Failed to fetch traders');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCopying = (trader: Trader) => {
    setCopyModal({ trader, showModal: true });
    setCopyAmount(Math.max(trader.min_copy_amount, 5000));
    setSelectedBundle('');
    setSelectedDeal('');
  };

  const handleConfirmCopy = async () => {
    if (!copyModal) return;

    try {
      setSubmitting(true);

      const data: any = {
        trader_user_id: copyModal.trader.user_id,
        copy_type: copyType,
        copy_amount: copyAmount,
        auto_reinvest: autoReinvest,
        stop_loss_percentage: stopLoss,
      };

      if (copyType === 'bundle' && selectedBundle) {
        data.bundle_id = selectedBundle;
      } else if (copyType === 'individual_deal' && selectedDeal) {
        data.deal_id = selectedDeal;
      }

      await copyTradingAPI.startCopying(data);

      alert(`Successfully started copying ${copyModal.trader.user.name}!`);
      setCopyModal(null);

      // Refresh traders list to update copier counts
      fetchTraders();
    } catch (err: any) {
      console.error('Error starting copy:', err);
      alert(err.response?.data?.message || 'Failed to start copying');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTraders = traders.filter(trader => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'verified') return true; // All traders are "verified" for now
    if (selectedFilter === 'low-risk') return trader.risk_level === 'low';
    if (selectedFilter === 'high-return') return trader.total_return > 150;
    return true;
  }).filter(trader =>
    trader.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trader.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTraders = [...filteredTraders].sort((a, b) => {
    if (sortBy === 'total_return') return b.total_return - a.total_return;
    if (sortBy === 'total_copiers_count') return b.total_copiers_count - a.total_copiers_count;
    if (sortBy === 'win_rate') return b.win_rate - a.win_rate;
    return 0;
  });

  const getRiskColor = (risk: string) => {
    if (risk === 'low') return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (risk === 'medium') return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      {/* Hero Header with Gradient Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Copy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
                Copy Trading
              </h1>
              <p className="text-xl text-purple-200">Follow successful investors automatically</p>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-blue-300">Total Traders</span>
              </div>
              <div className="text-3xl font-bold text-white">{traders.length}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-300">Avg. Return</span>
              </div>
              <div className="text-3xl font-bold text-green-400">
                +{traders.length > 0 ? (traders.reduce((sum, t) => sum + t.total_return, 0) / traders.length).toFixed(1) : 0}%
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Copy className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-purple-300">Active Copiers</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {traders.reduce((sum, t) => sum + t.total_copiers_count, 0).toLocaleString()}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="text-sm text-orange-300">Win Rate</span>
              </div>
              <div className="text-3xl font-bold text-orange-400">
                {traders.length > 0 ? (traders.reduce((sum, t) => sum + t.win_rate, 0) / traders.length).toFixed(0) : 0}%
              </div>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-white">Automatic Copying</h3>
              </div>
              <p className="text-sm text-blue-200">Your portfolio mirrors the trader's moves in real-time</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-bold text-white">Risk Management</h3>
              </div>
              <p className="text-sm text-green-200">Set your own limits and stop-loss rules</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-bold text-white">Full Control</h3>
              </div>
              <p className="text-sm text-purple-200">Stop copying or adjust settings anytime</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Search & Filters */}
        <div className="mb-8 space-y-4 -mt-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search traders by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>

          {/* Filter and Sort Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 hover:bg-white/10'
                }`}
              >
                All Traders
              </button>
              <button
                onClick={() => setSelectedFilter('verified')}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  selectedFilter === 'verified'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 hover:bg-white/10'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Verified Only
              </button>
              <button
                onClick={() => setSelectedFilter('low-risk')}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  selectedFilter === 'low-risk'
                    ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                    : 'bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 hover:bg-white/10'
                }`}
              >
                <Shield className="w-4 h-4" />
                Low Risk
              </button>
              <button
                onClick={() => setSelectedFilter('high-return')}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  selectedFilter === 'high-return'
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 hover:bg-white/10'
                }`}
              >
                <Flame className="w-4 h-4" />
                High Returns
              </button>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-purple-300 font-medium">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-white text-sm font-medium focus:outline-none focus:border-purple-500/50 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <option value="total_return">Total Return</option>
                  <option value="total_copiers_count">Most Copiers</option>
                  <option value="win_rate">Win Rate</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-purple-200">
            Showing <span className="font-semibold text-white text-2xl">{sortedTraders.length}</span> <span className="text-white">traders</span>
          </p>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-purple-300 mt-4">Loading traders...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Traders Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {sortedTraders.map((trader, index) => (
              <div
                key={trader.id}
                className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02] p-6 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all">
                        {trader.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">{trader.user.name}</h3>
                      </div>
                      <p className="text-sm text-purple-300">{trader.user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                          <Trophy className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-yellow-400 font-semibold">Rank #{index + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${getRiskColor(trader.risk_level)}`}>
                    {trader.risk_level.toUpperCase()} RISK
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/30 group-hover:bg-green-500/20 transition-all">
                    <div className="flex items-center gap-1 text-xs text-green-300 mb-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Total Return</span>
                    </div>
                    <div className="text-2xl font-bold text-green-400">+{trader.total_return.toFixed(1)}%</div>
                  </div>
                  <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/30 group-hover:bg-blue-500/20 transition-all">
                    <div className="flex items-center gap-1 text-xs text-blue-300 mb-1.5">
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Monthly</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">+{trader.monthly_return.toFixed(1)}%</div>
                  </div>
                  <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/30 group-hover:bg-purple-500/20 transition-all">
                    <div className="flex items-center gap-1 text-xs text-purple-300 mb-1.5">
                      <Target className="w-3.5 h-3.5" />
                      <span>Win Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-400">{trader.win_rate.toFixed(0)}%</div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      Copiers
                    </span>
                    <span className="text-white font-semibold">{trader.total_copiers_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-white/10 pt-3">
                    <span className="text-purple-300 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-purple-400" />
                      Min. Copy Amount
                    </span>
                    <span className="text-white font-semibold">{formatCurrency(trader.min_copy_amount)}</span>
                  </div>
                </div>

                {/* Specialty Tags */}
                {trader.specialty && trader.specialty.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {trader.specialty.map((spec, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-lg text-xs font-medium">
                        <Star className="w-3 h-3" />
                        {spec}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStartCopying(trader)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group-hover:scale-105"
                  >
                    <Copy className="w-4 h-4" />
                    Start Copying
                  </button>
                  <Link href={`/copy-trading/${trader.id}`}>
                    <button className="px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 rounded-xl hover:bg-white/10 hover:border-purple-500/30 transition-all">
                      <Eye className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How It Works Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-8 text-center">
            How Copy Trading Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center group hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all">
                <Search className="w-10 h-10 text-white" />
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1 inline-block mb-3">
                <span className="text-blue-400 font-bold text-sm">Step 1</span>
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">Choose a Trader</h3>
              <p className="text-sm text-purple-200">Browse top performers and select one to copy</p>
            </div>
            <div className="text-center group hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all">
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-1 inline-block mb-3">
                <span className="text-purple-400 font-bold text-sm">Step 2</span>
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">Set Your Amount</h3>
              <p className="text-sm text-purple-200">Decide how much capital to allocate</p>
            </div>
            <div className="text-center group hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 transition-all">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1 inline-block mb-3">
                <span className="text-green-400 font-bold text-sm">Step 3</span>
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">Auto-Copy Trades</h3>
              <p className="text-sm text-purple-200">System automatically mirrors their investments</p>
            </div>
            <div className="text-center group hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-1 inline-block mb-3">
                <span className="text-orange-400 font-bold text-sm">Step 4</span>
              </div>
              <h3 className="font-bold text-white mb-2 text-lg">Earn Returns</h3>
              <p className="text-sm text-purple-200">Profit proportionally to their performance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copy Configuration Modal */}
      {copyModal?.showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Configure Copy Settings</h2>
              <button
                onClick={() => setCopyModal(null)}
                className="text-purple-300 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Copy Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-3">
                  Copy Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setCopyType('full_profile')}
                    className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                      copyType === 'full_profile'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white/5 border border-white/10 text-purple-300 hover:bg-white/10'
                    }`}
                  >
                    Full Portfolio
                  </button>
                  <button
                    onClick={() => setCopyType('bundle')}
                    className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                      copyType === 'bundle'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white/5 border border-white/10 text-purple-300 hover:bg-white/10'
                    }`}
                  >
                    Specific Bundle
                  </button>
                  <button
                    onClick={() => setCopyType('individual_deal')}
                    className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                      copyType === 'individual_deal'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white/5 border border-white/10 text-purple-300 hover:bg-white/10'
                    }`}
                  >
                    Individual Deal
                  </button>
                </div>
                <p className="text-xs text-purple-400 mt-2">
                  {copyType === 'full_profile' && 'Copy all investments from this trader'}
                  {copyType === 'bundle' && 'Copy only specific bundle of deals'}
                  {copyType === 'individual_deal' && 'Copy only a specific deal'}
                </p>
              </div>

              {/* Copy Amount */}
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-3">
                  Copy Amount: {formatCurrency(copyAmount)}
                </label>
                <input
                  type="range"
                  min={copyModal.trader.min_copy_amount}
                  max="50000"
                  step="1000"
                  value={copyAmount}
                  onChange={(e) => setCopyAmount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-purple-400 mt-2">
                  <span>Min: {formatCurrency(copyModal.trader.min_copy_amount)}</span>
                  <span>Max: {formatCurrency(50000)}</span>
                </div>
              </div>

              {/* Auto Reinvest */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <div className="text-white font-semibold mb-1">Auto-Reinvest Returns</div>
                  <div className="text-sm text-purple-300">Automatically reinvest profits into new deals</div>
                </div>
                <button
                  onClick={() => setAutoReinvest(!autoReinvest)}
                  className={`w-14 h-8 rounded-full transition-all ${
                    autoReinvest ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full transition-all ${
                    autoReinvest ? 'ml-7' : 'ml-1'
                  }`}></div>
                </button>
              </div>

              {/* Stop Loss */}
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-3">
                  Stop Loss: {stopLoss}%
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-purple-400 mt-2">
                  <span>5%</span>
                  <span>50%</span>
                </div>
                <p className="text-sm text-purple-300 mt-2">
                  Automatically stop copying if portfolio drops by {stopLoss}%
                </p>
              </div>

              {/* Summary */}
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-200">
                    <p className="font-semibold mb-2">You're about to:</p>
                    <ul className="space-y-1">
                      <li>• Copy {copyModal.trader.user.name}'s {copyType.replace('_', ' ')} with {formatCurrency(copyAmount)}</li>
                      <li>• Auto-reinvest: {autoReinvest ? 'Yes' : 'No'}</li>
                      <li>• Stop loss set at {stopLoss}%</li>
                      <li>• Trader commission: {copyModal.trader.commission_rate}% of profits</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setCopyModal(null)}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCopy}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Starting...' : 'Confirm & Start Copying'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
