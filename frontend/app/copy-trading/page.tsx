'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency, formatPercentage } from '@/lib/utils';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20 lg:pb-8">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Copy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                Copy Trading
              </h1>
              <p className="text-purple-300">Follow successful investors automatically</p>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-500/10 backdrop-blur-xl rounded-xl border border-blue-500/20 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white">Automatic Copying</h3>
              </div>
              <p className="text-sm text-blue-200">Your portfolio mirrors the trader's moves in real-time</p>
            </div>
            <div className="bg-green-500/10 backdrop-blur-xl rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-white">Risk Management</h3>
              </div>
              <p className="text-sm text-green-200">Set your own limits and stop-loss rules</p>
            </div>
            <div className="bg-purple-500/10 backdrop-blur-xl rounded-xl border border-purple-500/20 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white">Full Control</h3>
              </div>
              <p className="text-sm text-purple-200">Stop copying or adjust settings anytime</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search traders by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/5 border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              All Traders
            </button>
            <button
              onClick={() => setSelectedFilter('verified')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                selectedFilter === 'verified'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Verified Only
            </button>
            <button
              onClick={() => setSelectedFilter('low-risk')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                selectedFilter === 'low-risk'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/5 border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              <Shield className="w-4 h-4" />
              Low Risk
            </button>
            <button
              onClick={() => setSelectedFilter('high-return')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                selectedFilter === 'high-return'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white/5 border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              <Flame className="w-4 h-4" />
              High Returns
            </button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-purple-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            >
              <option value="return">Total Return</option>
              <option value="copiers">Most Copiers</option>
              <option value="winRate">Win Rate</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-white">
          <span className="text-2xl font-bold">{sortedTraders.length}</span>
          <span className="text-purple-300 ml-2">traders available</span>
        </div>

        {/* Traders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {sortedTraders.map((trader) => (
            <div key={trader.id} className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-purple-500/30 transition-all p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {trader.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{trader.name}</h3>
                      {trader.verified && (
                        <CheckCircle className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <p className="text-sm text-purple-300">{trader.username}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-yellow-400 font-semibold">Rank #{trader.rank}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(trader.riskLevel)}`}>
                  {trader.riskLevel.toUpperCase()} RISK
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                  <div className="flex items-center gap-1 text-xs text-green-400 mb-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Total Return</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400">+{trader.totalReturn}%</div>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
                  <div className="flex items-center gap-1 text-xs text-blue-400 mb-1">
                    <BarChart3 className="w-3 h-3" />
                    <span>Monthly</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">+{trader.monthlyReturn}%</div>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
                  <div className="flex items-center gap-1 text-xs text-purple-400 mb-1">
                    <Target className="w-3 h-3" />
                    <span>Win Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">{trader.winRate}%</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Copiers
                  </span>
                  <span className="text-white font-semibold">{trader.copiers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Total Invested
                  </span>
                  <span className="text-white font-semibold">{formatCurrency(trader.totalInvested)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Active Deals
                  </span>
                  <span className="text-white font-semibold">{trader.activeDeals}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Min. Copy Amount
                  </span>
                  <span className="text-white font-semibold">{formatCurrency(trader.minCopyAmount)}</span>
                </div>
              </div>

              {/* Specialty Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {trader.specialty.map((spec, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                    {spec}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link href={`/copy-trading/${trader.id}`} className="flex-1">
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <Copy className="w-4 h-4" />
                    Start Copying
                  </button>
                </Link>
                <Link href={`/copy-trading/${trader.id}`}>
                  <button className="px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all">
                    <Eye className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How Copy Trading Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">1. Choose a Trader</h3>
              <p className="text-sm text-purple-200">Browse top performers and select one to copy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">2. Set Your Amount</h3>
              <p className="text-sm text-purple-200">Decide how much capital to allocate</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">3. Auto-Copy Trades</h3>
              <p className="text-sm text-purple-200">System automatically mirrors their investments</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">4. Earn Returns</h3>
              <p className="text-sm text-purple-200">Profit proportionally to their performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
