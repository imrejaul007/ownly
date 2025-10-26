'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Search,
  Grid3x3,
  List,
  Store,
  Building2,
  Gem,
  Package,
  Briefcase,
  DollarSign,
  Activity,
  BarChart3,
  Star,
  ShoppingCart,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  SortAsc,
  SortDesc,
  CheckCircle,
  X,
  Target,
  Flame,
} from 'lucide-react';

export default function MarketCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;

  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [marketStats, setMarketStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('volume');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [tradeAmount, setTradeAmount] = useState('');

  useEffect(() => {
    fetchCategoryData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchCategoryData, 30000);
    return () => clearInterval(interval);
  }, [category]);

  const fetchCategoryData = async () => {
    try {
      const [assetsRes, statsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/assets?category=${category}`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/markets/${category}`)
      ]);

      const [assetsData, statsData] = await Promise.all([
        assetsRes.json(),
        statsRes.json()
      ]);

      if (assetsData.success) setAssets(assetsData.data);
      if (statsData.success) setMarketStats(statsData.data);
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const openTradeModal = (asset: any) => {
    setSelectedAsset(asset);
    setShowTradeModal(true);
  };

  const handleTrade = () => {
    alert(`BUY ${tradeAmount} shares of ${selectedAsset?.symbol}`);
    setShowTradeModal(false);
    setTradeAmount('');
  };

  const filteredAssets = assets.filter((asset: any) =>
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.deal?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAssets = [...filteredAssets].sort((a: any, b: any) => {
    let aValue, bValue;
    switch (sortBy) {
      case 'price':
        aValue = parseFloat(a.current_price);
        bValue = parseFloat(b.current_price);
        break;
      case 'change':
        aValue = parseFloat(a.price_change_24h);
        bValue = parseFloat(b.price_change_24h);
        break;
      case 'volume':
        aValue = parseFloat(a.daily_volume);
        bValue = parseFloat(b.daily_volume);
        break;
      case 'cap':
        aValue = parseFloat(a.market_cap);
        bValue = parseFloat(b.market_cap);
        break;
      default:
        return 0;
    }
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const categoryIcons = {
    franchise: Store,
    property: Building2,
    luxury: Gem,
    inventory: Package,
    equity: Briefcase,
  };

  const categoryInfo = {
    franchise: { name: 'Franchise', color: 'from-purple-500 to-pink-500' },
    property: { name: 'Property', color: 'from-blue-500 to-cyan-500' },
    luxury: { name: 'Luxury', color: 'from-yellow-500 to-orange-500' },
    inventory: { name: 'Inventory', color: 'from-green-500 to-emerald-500' },
    equity: { name: 'Equity', color: 'from-indigo-500 to-purple-500' }
  };

  const info = categoryInfo[category as keyof typeof categoryInfo] || { name: category, color: 'from-gray-500 to-gray-700' };
  const Icon = categoryIcons[category as keyof typeof categoryIcons] || BarChart3;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading {info.name} Market...</p>
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

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${info.color} opacity-20`}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <Link href="/exchange" className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Exchange</span>
            </Link>
            <button
              onClick={fetchCategoryData}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-purple-200 hover:bg-white/10 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className={`w-20 h-20 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center shadow-2xl`}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                {info.name} Market
              </h1>
              <p className="text-xl text-purple-200 mt-2">
                Trade {info.name.toLowerCase()} assets on OWNLY Exchange
              </p>
            </div>
          </div>

          {marketStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl hover:scale-105 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-purple-300">Total Assets</span>
                </div>
                <p className="text-3xl font-bold text-white">{marketStats?.asset_count || 0}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl hover:scale-105 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-purple-300">Market Cap</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {((marketStats?.total_market_cap || 0) / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-purple-400 mt-1">AED</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl hover:scale-105 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-purple-300">24h Volume</span>
                </div>
                <p className="text-3xl font-bold text-white">
                  {((marketStats?.total_volume_24h || 0) / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-purple-400 mt-1">AED</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl hover:scale-105 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${(marketStats?.avg_change_24h || 0) >= 0 ? 'from-green-600 to-emerald-500' : 'from-red-600 to-red-500'} rounded-xl flex items-center justify-center shadow-lg`}>
                    {(marketStats?.avg_change_24h || 0) >= 0 ? (
                      <TrendingUp className="w-6 h-6 text-white" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <span className="text-sm text-purple-300">24h Change</span>
                </div>
                <p className={`text-3xl font-bold ${(marketStats?.avg_change_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(marketStats?.avg_change_24h || 0) >= 0 ? '+' : ''}{(marketStats?.avg_change_24h || 0).toFixed(2)}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters & View Controls */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-2 bg-white/5 rounded-xl border border-white/10 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-white/5'}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-white/5'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sorting Options */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-purple-300 self-center">Sort by:</span>
            {(['cap', 'price', 'change', 'volume'] as const).map((option) => (
              <button
                key={option}
                onClick={() => {
                  if (sortBy === option) {
                    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy(option);
                    setSortOrder('desc');
                  }
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  sortBy === option
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-purple-300 hover:bg-white/10'
                }`}
              >
                {option === 'cap' ? 'Market Cap' : option.charAt(0).toUpperCase() + option.slice(1)}
                {sortBy === option && (
                  sortOrder === 'desc' ? <SortDesc className="w-3 h-3 inline ml-1" /> : <SortAsc className="w-3 h-3 inline ml-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Assets Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAssets.map((asset: any) => {
              const isWatchlisted = watchlist.includes(asset.symbol);
              const priceChange = parseFloat(asset.price_change_24h);
              const isPositive = priceChange >= 0;

              return (
                <div
                  key={asset.id}
                  className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all overflow-hidden hover:scale-105 cursor-pointer shadow-2xl"
                  onClick={() => router.push(`/exchange/asset/${asset.symbol}`)}
                >
                  {/* Status Bar */}
                  <div className={`h-1 ${isPositive ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`}></div>

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-lg text-white">{asset.symbol}</span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            asset.trading_phase === 'primary'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-green-500/20 text-green-300 border border-green-500/30'
                          }`}>
                            {asset.trading_phase}
                          </span>
                        </div>
                        <p className="text-sm text-purple-300 line-clamp-1">{asset.deal?.title || 'Asset'}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(asset.symbol);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all"
                      >
                        <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-yellow-400 text-yellow-400' : 'text-purple-300'}`} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-white mb-1">
                        {parseFloat(asset.current_price).toLocaleString()} AED
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {isPositive ? '+' : ''}{priceChange.toFixed(2)}% (24h)
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-600/10 rounded-lg p-3 border border-blue-500/20">
                        <div className="text-xs text-blue-400 mb-1">Volume</div>
                        <div className="text-sm font-bold text-blue-300">
                          {(parseFloat(asset.daily_volume) / 1000).toFixed(1)}K
                        </div>
                      </div>
                      <div className="bg-purple-600/10 rounded-lg p-3 border border-purple-500/20">
                        <div className="text-xs text-purple-400 mb-1">Market Cap</div>
                        <div className="text-sm font-bold text-purple-300">
                          {(parseFloat(asset.market_cap) / 1000000).toFixed(2)}M
                        </div>
                      </div>
                    </div>

                    {/* Demand Indicator */}
                    {asset.demand_index && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex-1">
                          <div className="text-xs text-purple-400 mb-1">Demand</div>
                          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                              style={{ width: `${asset.demand_index}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-green-400">{asset.demand_index}%</div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openTradeModal(asset);
                        }}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all font-semibold text-sm flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Buy
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/exchange/asset/${asset.symbol}`);
                        }}
                        className="px-4 py-2.5 bg-white/5 border border-white/10 text-purple-200 rounded-xl hover:bg-white/10 transition-all font-semibold text-sm flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-purple-300">Symbol</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-purple-300">Name</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-purple-300">Price</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-purple-300">24h Change</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-purple-300">Volume</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-purple-300">Market Cap</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-purple-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAssets.map((asset: any) => {
                  const priceChange = parseFloat(asset.price_change_24h);
                  const isPositive = priceChange >= 0;

                  return (
                    <tr
                      key={asset.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWatchlist(asset.symbol);
                            }}
                          >
                            <Star className={`w-4 h-4 ${watchlist.includes(asset.symbol) ? 'fill-yellow-400 text-yellow-400' : 'text-purple-400'}`} />
                          </button>
                          <span className="font-mono font-bold text-white">{asset.symbol}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white">{asset.deal?.title || 'Asset'}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-semibold text-white">
                          {parseFloat(asset.current_price).toLocaleString()} AED
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`font-semibold flex items-center gap-1 justify-end ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-purple-200">
                          {(parseFloat(asset.daily_volume) / 1000).toFixed(1)}K
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-purple-200">
                          {(parseFloat(asset.market_cap) / 1000000).toFixed(2)}M
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openTradeModal(asset);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all font-semibold text-sm"
                          >
                            Buy
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/exchange/asset/${asset.symbol}`);
                            }}
                            className="px-4 py-2 bg-white/5 border border-white/10 text-purple-200 rounded-lg hover:bg-white/10 transition-all font-semibold text-sm"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {sortedAssets.length === 0 && (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <Package className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
            <p className="text-purple-300 text-lg">No assets found in this category.</p>
          </div>
        )}
      </div>

      {/* Trade Modal */}
      {showTradeModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Buy {selectedAsset.symbol}</h2>
              <button
                onClick={() => setShowTradeModal(false)}
                className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-purple-300" />
              </button>
            </div>

            <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-sm text-purple-300 mb-1">Current Price</p>
              <p className="font-semibold text-2xl text-white">{parseFloat(selectedAsset.current_price).toLocaleString()} AED</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-purple-300 mb-2">Number of Shares</label>
              <input
                type="number"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
              />
            </div>

            {tradeAmount && (
              <div className="mb-6 bg-purple-600/20 border border-purple-500/30 rounded-xl p-4">
                <div className="text-sm text-purple-300 mb-1">Total Cost</div>
                <div className="text-2xl font-bold text-white">
                  {(parseFloat(selectedAsset.current_price) * parseFloat(tradeAmount)).toLocaleString()} AED
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleTrade}
                disabled={!tradeAmount || parseFloat(tradeAmount) <= 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                Confirm Purchase
              </button>
              <button
                onClick={() => setShowTradeModal(false)}
                className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-purple-200 rounded-xl hover:bg-white/10 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
