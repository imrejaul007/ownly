'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Store,
  Gem,
  Package,
  Briefcase,
  Search,
  Filter,
  Clock,
  Star,
  Bell,
  ShoppingCart,
  Eye,
  Flame,
  Zap,
  Target,
  Users,
  ArrowRight,
  RefreshCw,
  Grid3x3,
  List,
  SortAsc,
  SortDesc,
  X,
  CheckCircle,
  AlertCircle,
  Play,
  TrendingUpIcon,
} from 'lucide-react';

interface ExchangeAsset {
  id: string;
  symbol: string;
  market_category: string;
  current_price: number;
  price_change_24h: number;
  daily_volume: number;
  market_cap: number;
  demand_index: number;
  sentiment_score: number;
  trading_phase: string;
  deal: {
    title: string;
    images?: string[];
  };
}

interface MarketCategory {
  category: string;
  asset_count: number;
  total_market_cap: number;
  total_volume_24h: number;
  avg_change_24h: number;
}

export default function ExchangePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [markets, setMarkets] = useState<MarketCategory[]>([]);
  const [topGainers, setTopGainers] = useState<ExchangeAsset[]>([]);
  const [topLosers, setTopLosers] = useState<ExchangeAsset[]>([]);
  const [allAssets, setAllAssets] = useState<ExchangeAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'volume' | 'cap'>('cap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<ExchangeAsset | null>(null);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchExchangeData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchExchangeData();
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchExchangeData = async () => {
    try {
      const [marketsRes, gainersRes, losersRes, assetsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/markets`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/assets?sort=gainers&limit=5`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/assets?sort=losers&limit=5`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/assets?limit=100`),
      ]);

      const [marketsData, gainersData, losersData, assetsData] = await Promise.all([
        marketsRes.json(),
        gainersRes.json(),
        losersRes.json(),
        assetsRes.json(),
      ]);

      if (marketsData.success) setMarkets(marketsData.data);
      if (gainersData.success) setTopGainers(gainersData.data);
      if (losersData.success) setTopLosers(losersData.data);
      if (assetsData.success) setAllAssets(assetsData.data);
    } catch (error) {
      console.error('Error fetching exchange data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    franchise: Store,
    property: Building2,
    luxury: Gem,
    inventory: Package,
    equity: Briefcase,
  };

  const categoryColors = {
    franchise: 'from-purple-500 to-pink-500',
    property: 'from-blue-500 to-cyan-500',
    luxury: 'from-yellow-500 to-orange-500',
    inventory: 'from-green-500 to-emerald-500',
    equity: 'from-indigo-500 to-purple-500',
  };

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const openTradeModal = (asset: ExchangeAsset, type: 'buy' | 'sell') => {
    setSelectedAsset(asset);
    setTradeType(type);
    setShowTradeModal(true);
  };

  const handleTrade = () => {
    // Implement trade logic here
    alert(`${tradeType.toUpperCase()} ${tradeAmount} shares of ${selectedAsset?.symbol}`);
    setShowTradeModal(false);
    setTradeAmount('');
  };

  const filteredAssets = allAssets
    .filter((asset) => {
      const matchesSearch =
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.deal.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || asset.market_category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'price':
          aValue = parseFloat(a.current_price.toString());
          bValue = parseFloat(b.current_price.toString());
          break;
        case 'change':
          aValue = parseFloat(a.price_change_24h.toString());
          bValue = parseFloat(b.price_change_24h.toString());
          break;
        case 'volume':
          aValue = parseFloat(a.daily_volume.toString());
          bValue = parseFloat(b.daily_volume.toString());
          break;
        case 'cap':
        default:
          aValue = parseFloat(a.market_cap.toString());
          bValue = parseFloat(b.market_cap.toString());
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const totalMarketCap = markets.reduce((sum, m) => sum + m.total_market_cap, 0);
  const totalVolume = markets.reduce((sum, m) => sum + m.total_volume_24h, 0);
  const avgChange = markets.length > 0
    ? markets.reduce((sum, m) => sum + m.avg_change_24h, 0) / markets.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading Exchange...</p>
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
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-3">
                OWNLY Exchange
              </h1>
              <p className="text-xl text-purple-200">
                Trade Real Assets. Real-Time Prices. Real Returns.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-purple-200">Live</span>
              </div>
              <button
                onClick={() => fetchExchangeData()}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-purple-200 hover:bg-white/10 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-purple-300">Total Market Cap</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {(totalMarketCap / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-purple-400 mt-1">AED</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-purple-300">24h Volume</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {(totalVolume / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-purple-400 mt-1">AED</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-sm text-purple-300">Active Markets</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{markets.length}</p>
              <p className="text-xs text-purple-400 mt-1">Categories</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${avgChange >= 0 ? 'from-green-600 to-emerald-500' : 'from-red-600 to-red-500'} rounded-xl flex items-center justify-center shadow-lg`}>
                  {avgChange >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-sm text-purple-300">Avg Change 24h</span>
                </div>
              </div>
              <p className={`text-3xl font-bold ${avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
              </p>
              <p className="text-xs text-purple-400 mt-1">Market Sentiment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Market Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-400" />
            Market Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {markets.map((market) => {
              const Icon = categoryIcons[market.category as keyof typeof categoryIcons];
              const gradient = categoryColors[market.category as keyof typeof categoryColors];

              return (
                <Link
                  key={market.category}
                  href={`/exchange/markets/${market.category}`}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity`}></div>
                  <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1">
                        {market.avg_change_24h >= 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-sm font-semibold ${market.avg_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {market.avg_change_24h >= 0 ? '+' : ''}{market.avg_change_24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white capitalize mb-2">
                      {market.category}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm text-purple-200 flex items-center gap-2">
                        <Package className="w-3 h-3" />
                        {market.asset_count} assets
                      </p>
                      <p className="text-xs text-purple-300 flex items-center gap-2">
                        <DollarSign className="w-3 h-3" />
                        {(market.total_market_cap / 1000000).toFixed(1)}M cap
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Top Gainers & Losers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Top Gainers */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Top Gainers
              </h3>
              <span className="text-sm text-purple-300 px-3 py-1 bg-white/5 rounded-full">24h</span>
            </div>
            <div className="space-y-3">
              {topGainers.map((asset, index) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group cursor-pointer border border-white/10"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-8 h-8 bg-gradient-to-br ${index === 0 ? 'from-yellow-500 to-orange-500' : 'from-green-600 to-emerald-500'} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {asset.symbol}
                      </p>
                      <p className="text-xs text-purple-300 line-clamp-1">{asset.deal.title}</p>
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-bold text-white">{parseFloat(asset.current_price.toString()).toLocaleString()} AED</p>
                    <p className="text-sm text-green-400 flex items-center gap-1 justify-end">
                      <ArrowUpRight className="w-3 h-3" />
                      +{parseFloat(asset.price_change_24h.toString()).toFixed(2)}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTradeModal(asset, 'buy');
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all text-sm font-semibold"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                Top Losers
              </h3>
              <span className="text-sm text-purple-300 px-3 py-1 bg-white/5 rounded-full">24h</span>
            </div>
            <div className="space-y-3">
              {topLosers.map((asset, index) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group cursor-pointer border border-white/10"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {asset.symbol}
                      </p>
                      <p className="text-xs text-purple-300 line-clamp-1">{asset.deal.title}</p>
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-bold text-white">{parseFloat(asset.current_price.toString()).toLocaleString()} AED</p>
                    <p className="text-sm text-red-400 flex items-center gap-1 justify-end">
                      <ArrowDownRight className="w-3 h-3" />
                      {parseFloat(asset.price_change_24h.toString()).toFixed(2)}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTradeModal(asset, 'buy');
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all text-sm font-semibold"
                    >
                      Buy Dip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Assets Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-purple-400" />
              All Trading Assets
            </h3>
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Markets</option>
                <option value="franchise">Franchise</option>
                <option value="property">Property</option>
                <option value="luxury">Luxury</option>
                <option value="inventory">Inventory</option>
                <option value="equity">Equity</option>
              </select>
              <div className="flex gap-2 bg-white/5 rounded-xl border border-white/10 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-white/5'}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-white/5'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sorting Options */}
          <div className="flex flex-wrap gap-2 mb-6">
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

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => {
                const isWatchlisted = watchlist.includes(asset.symbol);
                const priceChange = parseFloat(asset.price_change_24h.toString());
                const isPositive = priceChange >= 0;

                return (
                  <div
                    key={asset.id}
                    className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all overflow-hidden hover:scale-105 cursor-pointer"
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
                          <p className="text-sm text-purple-300 line-clamp-1">{asset.deal.title}</p>
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
                          {parseFloat(asset.current_price.toString()).toLocaleString()} AED
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
                            {(parseFloat(asset.daily_volume.toString()) / 1000).toFixed(1)}K
                          </div>
                        </div>
                        <div className="bg-purple-600/10 rounded-lg p-3 border border-purple-500/20">
                          <div className="text-xs text-purple-400 mb-1">Market Cap</div>
                          <div className="text-sm font-bold text-purple-300">
                            {(parseFloat(asset.market_cap.toString()) / 1000000).toFixed(2)}M
                          </div>
                        </div>
                      </div>

                      {/* Indicators */}
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

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openTradeModal(asset, 'buy');
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
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-purple-300">Symbol</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-purple-300">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-purple-300">Category</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-purple-300">Price</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-purple-300">24h Change</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-purple-300">Volume</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-purple-300">Market Cap</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-purple-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => {
                    const priceChange = parseFloat(asset.price_change_24h.toString());
                    const isPositive = priceChange >= 0;

                    return (
                      <tr
                        key={asset.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4">
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
                        <td className="py-4 px-4">
                          <span className="text-white">{asset.deal.title}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-purple-300 capitalize">{asset.market_category}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="font-semibold text-white">
                            {parseFloat(asset.current_price.toString()).toLocaleString()} AED
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={`font-semibold flex items-center gap-1 justify-end ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-purple-200">
                            {(parseFloat(asset.daily_volume.toString()) / 1000).toFixed(1)}K
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-purple-200">
                            {(parseFloat(asset.market_cap.toString()) / 1000000).toFixed(2)}M
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openTradeModal(asset, 'buy');
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

          {filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
              <p className="text-purple-300">No assets found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Trade Modal */}
      {showTradeModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedAsset.symbol}</h2>
              <button
                onClick={() => setShowTradeModal(false)}
                className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-purple-300" />
              </button>
            </div>

            <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-sm text-purple-300 mb-1">Current Price</p>
              <p className="font-semibold text-2xl text-white">{parseFloat(selectedAsset.current_price.toString()).toLocaleString()} AED</p>
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
                  {(parseFloat(selectedAsset.current_price.toString()) * parseFloat(tradeAmount)).toLocaleString()} AED
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
                Confirm {tradeType === 'buy' ? 'Purchase' : 'Sale'}
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
