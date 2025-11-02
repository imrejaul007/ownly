'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatPercentage } from '@/lib/utils';
import { usePreferences } from '@/context/PreferencesContext';
import {
  Users, TrendingUp, Copy, CheckCircle, Target, Award, Filter,
  BarChart3, Star, Clock, DollarSign, Zap, ArrowRight, Shield,
  Trophy, Flame, Eye, UserPlus, Activity, ChevronDown, Search
} from 'lucide-react';

interface Trader {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  rank: number;
  totalReturn: number;
  monthlyReturn: number;
  copiers: number;
  totalInvested: number;
  winRate: number;
  activeDeals: number;
  riskLevel: 'low' | 'medium' | 'high';
  specialty: string[];
  joinedDate: string;
  minCopyAmount: number;
}

export default function CopyTradingPage() {
  const { formatCurrency } = usePreferences();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'return' | 'copiers' | 'winRate'>('return');
  const [searchQuery, setSearchQuery] = useState('');

  const traders: Trader[] = [
    {
      id: '1',
      name: 'Ahmed Al Mansoori',
      username: '@realEstatePro',
      avatar: 'A',
      verified: true,
      rank: 1,
      totalReturn: 156.8,
      monthlyReturn: 12.4,
      copiers: 1247,
      totalInvested: 2450000,
      winRate: 94,
      activeDeals: 18,
      riskLevel: 'medium',
      specialty: ['Real Estate', 'Commercial'],
      joinedDate: '2023-01',
      minCopyAmount: 5000,
    },
    {
      id: '2',
      name: 'Sarah Al Hashimi',
      username: '@franchiseQueen',
      avatar: 'S',
      verified: true,
      rank: 2,
      totalReturn: 142.3,
      monthlyReturn: 11.8,
      copiers: 892,
      totalInvested: 1850000,
      winRate: 91,
      activeDeals: 24,
      riskLevel: 'low',
      specialty: ['Franchises', 'F&B'],
      joinedDate: '2023-03',
      minCopyAmount: 3000,
    },
    {
      id: '3',
      name: 'Omar Al Falasi',
      username: '@techInvestor',
      avatar: 'O',
      verified: true,
      rank: 3,
      totalReturn: 198.5,
      monthlyReturn: 15.2,
      copiers: 1456,
      totalInvested: 3200000,
      winRate: 87,
      activeDeals: 32,
      riskLevel: 'high',
      specialty: ['Startups', 'Tech'],
      joinedDate: '2022-11',
      minCopyAmount: 10000,
    },
    {
      id: '4',
      name: 'Fatima Al Zaabi',
      username: '@balancedInvestor',
      avatar: 'F',
      verified: true,
      rank: 4,
      totalReturn: 128.7,
      monthlyReturn: 9.8,
      copiers: 2103,
      totalInvested: 1650000,
      winRate: 96,
      activeDeals: 15,
      riskLevel: 'low',
      specialty: ['Mixed Portfolio', 'Stable Returns'],
      joinedDate: '2023-02',
      minCopyAmount: 2000,
    },
    {
      id: '5',
      name: 'Khalid Al Nuaimi',
      username: '@aggressiveGrowth',
      avatar: 'K',
      verified: false,
      rank: 5,
      totalReturn: 176.4,
      monthlyReturn: 13.9,
      copiers: 654,
      totalInvested: 2100000,
      winRate: 85,
      activeDeals: 28,
      riskLevel: 'high',
      specialty: ['High Risk', 'Startups'],
      joinedDate: '2023-04',
      minCopyAmount: 8000,
    },
    {
      id: '6',
      name: 'Mariam Al Bloushi',
      username: '@conservativeWins',
      avatar: 'M',
      verified: true,
      rank: 6,
      totalReturn: 115.2,
      monthlyReturn: 8.5,
      copiers: 1789,
      totalInvested: 1420000,
      winRate: 98,
      activeDeals: 12,
      riskLevel: 'low',
      specialty: ['Real Estate', 'Low Risk'],
      joinedDate: '2023-01',
      minCopyAmount: 2500,
    },
  ];

  const filteredTraders = traders.filter(trader => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'verified') return trader.verified;
    if (selectedFilter === 'low-risk') return trader.riskLevel === 'low';
    if (selectedFilter === 'high-return') return trader.totalReturn > 150;
    return true;
  }).filter(trader =>
    trader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trader.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTraders = [...filteredTraders].sort((a, b) => {
    if (sortBy === 'return') return b.totalReturn - a.totalReturn;
    if (sortBy === 'copiers') return b.copiers - a.copiers;
    if (sortBy === 'winRate') return b.winRate - a.winRate;
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
              <div className="text-3xl font-bold text-white">{sortedTraders.length}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-300">Avg. Return</span>
              </div>
              <div className="text-3xl font-bold text-green-400">+142%</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Copy className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-purple-300">Active Copiers</span>
              </div>
              <div className="text-3xl font-bold text-white">8.1K</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="text-sm text-orange-300">Win Rate</span>
              </div>
              <div className="text-3xl font-bold text-orange-400">92%</div>
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
                  <option value="return">Total Return</option>
                  <option value="copiers">Most Copiers</option>
                  <option value="winRate">Win Rate</option>
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

        {/* Traders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {sortedTraders.map((trader) => (
            <div
              key={trader.id}
              className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02] p-6 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all">
                      {trader.avatar}
                    </div>
                    {trader.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-slate-900">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">{trader.name}</h3>
                    </div>
                    <p className="text-sm text-purple-300">{trader.username}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                        <Trophy className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-yellow-400 font-semibold">Rank #{trader.rank}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${getRiskColor(trader.riskLevel)}`}>
                  {trader.riskLevel.toUpperCase()} RISK
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/30 group-hover:bg-green-500/20 transition-all">
                  <div className="flex items-center gap-1 text-xs text-green-300 mb-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Total Return</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">+{trader.totalReturn}%</div>
                </div>
                <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/30 group-hover:bg-blue-500/20 transition-all">
                  <div className="flex items-center gap-1 text-xs text-blue-300 mb-1.5">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Monthly</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">+{trader.monthlyReturn}%</div>
                </div>
                <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/30 group-hover:bg-purple-500/20 transition-all">
                  <div className="flex items-center gap-1 text-xs text-purple-300 mb-1.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>Win Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">{trader.winRate}%</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    Copiers
                  </span>
                  <span className="text-white font-semibold">{trader.copiers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-400" />
                    Total Invested
                  </span>
                  <span className="text-white font-semibold">{formatCurrency(trader.totalInvested)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    Active Deals
                  </span>
                  <span className="text-white font-semibold">{trader.activeDeals}</span>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-white/10 pt-3">
                  <span className="text-purple-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-400" />
                    Min. Copy Amount
                  </span>
                  <span className="text-white font-semibold">{formatCurrency(trader.minCopyAmount)}</span>
                </div>
              </div>

              {/* Specialty Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {trader.specialty.map((spec, index) => (
                  <span key={index} className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-lg text-xs font-medium">
                    <Star className="w-3 h-3" />
                    {spec}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link href={`/copy-trading/${trader.id}`} className="flex-1">
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group-hover:scale-105">
                    <Copy className="w-4 h-4" />
                    Start Copying
                  </button>
                </Link>
                <Link href={`/copy-trading/${trader.id}`}>
                  <button className="px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 text-purple-200 rounded-xl hover:bg-white/10 hover:border-purple-500/30 transition-all">
                    <Eye className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

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
    </div>
  );
}
