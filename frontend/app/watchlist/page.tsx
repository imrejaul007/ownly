'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatCurrency, formatPercentage, getDealTypeLabel } from '@/lib/utils';
import {
  Star, TrendingUp, TrendingDown, DollarSign, Users, Building, Store,
  Rocket, Target, Zap, ArrowRight, Flame, Eye, Activity, Trash2,
  BellRing, RefreshCw, Filter, MapPin, Clock, AlertCircle
} from 'lucide-react';

interface WatchlistItem {
  id: string;
  type: 'deal' | 'bundle' | 'secondary';
  dealId: string;
  title: string;
  dealType: string;
  expectedROI: number;
  minInvestment: number;
  location?: string;
  investorCount: number;
  priceChange: number;
  addedAt: string;
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'roi' | 'price'>('recent');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      // Simulate fetching from localStorage or API
      const stored = localStorage.getItem('watchlist');
      if (stored) {
        setWatchlist(JSON.parse(stored));
      } else {
        // Demo data
        setWatchlist([
          {
            id: '1',
            type: 'deal',
            dealId: 'deal-1',
            title: 'Dubai Marina Luxury Tower',
            dealType: 'real_estate',
            expectedROI: 28.5,
            minInvestment: 50000,
            location: 'Dubai Marina',
            investorCount: 142,
            priceChange: 2.3,
            addedAt: new Date().toISOString(),
          },
          {
            id: '2',
            type: 'deal',
            dealId: 'deal-2',
            title: 'Coffee Shop Franchise Chain',
            dealType: 'franchise',
            expectedROI: 35.2,
            minInvestment: 25000,
            location: 'Abu Dhabi',
            investorCount: 89,
            priceChange: -1.2,
            addedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '3',
            type: 'deal',
            dealId: 'deal-3',
            title: 'AI Tech Startup Fund',
            dealType: 'startup',
            expectedROI: 45.0,
            minInvestment: 10000,
            location: 'Dubai',
            investorCount: 234,
            priceChange: 5.7,
            addedAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWatchlist();
    setRefreshing(false);
  };

  const removeFromWatchlist = (id: string) => {
    const updated = watchlist.filter(item => item.id !== id);
    setWatchlist(updated);
    localStorage.setItem('watchlist', JSON.stringify(updated));
  };

  const togglePriceAlert = (id: string) => {
    alert(`Price alerts for this item will be configured`);
  };

  const filteredWatchlist = filter === 'all'
    ? watchlist
    : watchlist.filter(item => item.dealType === filter);

  const sortedWatchlist = [...filteredWatchlist].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    if (sortBy === 'roi') return b.expectedROI - a.expectedROI;
    return b.minInvestment - a.minInvestment;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading your watchlist...</p>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent flex items-center gap-3 mb-2">
                <Star className="w-10 h-10 text-yellow-400 fill-yellow-400" />
                My Watchlist
              </h1>
              <p className="text-purple-300">Track your favorite investment opportunities</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 transition-all"
            >
              <RefreshCw className={`w-5 h-5 text-purple-300 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
              <div className="text-sm text-purple-300 mb-1">Watchlist Items</div>
              <div className="text-3xl font-bold text-white">{watchlist.length}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
              <div className="text-sm text-purple-300 mb-1">Avg. Expected ROI</div>
              <div className="text-3xl font-bold text-green-400">
                {watchlist.length > 0
                  ? (watchlist.reduce((sum, item) => sum + item.expectedROI, 0) / watchlist.length).toFixed(1)
                  : 0}%
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
              <div className="text-sm text-purple-300 mb-1">Price Alerts</div>
              <div className="text-3xl font-bold text-blue-400">0</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
              <div className="text-sm text-purple-300 mb-1">Trending Up</div>
              <div className="text-3xl font-bold text-purple-400">
                {watchlist.filter(item => item.priceChange > 0).length}
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/5 border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('real_estate')}
              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                filter === 'real_estate'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              <Building className="w-4 h-4" />
              Real Estate
            </button>
            <button
              onClick={() => setFilter('franchise')}
              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                filter === 'franchise'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/5 border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              <Store className="w-4 h-4" />
              Franchises
            </button>
            <button
              onClick={() => setFilter('startup')}
              className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                filter === 'startup'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white/5 border border-white/10 text-purple-200 hover:bg-white/10'
              }`}
            >
              <Rocket className="w-4 h-4" />
              Startups
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <option value="recent">Recently Added</option>
              <option value="roi">Highest ROI</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>

        {/* Watchlist Grid */}
        {sortedWatchlist.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
            <Star className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
            <p className="text-purple-200 text-lg mb-4">Your watchlist is empty</p>
            <Link href="/deals">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition-all">
                Browse Deals
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWatchlist.map((item) => (
              <div key={item.id} className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-purple-500/30 transition-all overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-semibold border border-blue-500/30">
                      {getDealTypeLabel(item.dealType)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePriceAlert(item.id)}
                        className="p-2 bg-white/5 rounded-lg hover:bg-yellow-500/20 transition-all"
                        title="Set Price Alert"
                      >
                        <BellRing className="w-4 h-4 text-yellow-400" />
                      </button>
                      <button
                        onClick={() => removeFromWatchlist(item.id)}
                        className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 transition-all"
                        title="Remove from Watchlist"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Location */}
                  {item.location && (
                    <div className="flex items-center gap-1 text-sm text-purple-300 mb-4">
                      <MapPin className="w-4 h-4" />
                      {item.location}
                    </div>
                  )}

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
                      <div className="text-xs text-green-400 mb-1">Expected ROI</div>
                      <div className="text-2xl font-bold text-green-400">{item.expectedROI}%</div>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
                      <div className="text-xs text-blue-400 mb-1">Min. Investment</div>
                      <div className="text-lg font-bold text-blue-400">{formatCurrency(item.minInvestment)}</div>
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2 text-purple-200">
                      <Users className="w-4 h-4" />
                      {item.investorCount} investors
                    </div>
                    <div className={`flex items-center gap-1 font-semibold ${
                      item.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {item.priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {Math.abs(item.priceChange).toFixed(1)}%
                    </div>
                  </div>

                  {/* Actions */}
                  <Link href={`/deals/${item.dealId}`}>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-500/10 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Pro Tip: Set Price Alerts</h3>
              <p className="text-blue-200 text-sm">
                Click the bell icon on any watchlist item to get notified when prices change or new opportunities match your preferences.
                Never miss a great investment opportunity!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
