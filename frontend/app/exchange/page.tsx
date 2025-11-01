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
  Percent,
  Wallet,
  PieChart,
  ChevronDown,
  ChevronUp,
  LineChart,
  Layers,
  CandlestickChart,
  BookOpen,
  History,
  Volume2,
  Radio,
  Info,
  Settings,
  Download,
  Upload,
  ArrowUpDown,
  Minus,
  Plus,
  CircleDot,
  Sparkles,
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

interface Order {
  id: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  time: string;
}

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  time: string;
  status: 'completed' | 'pending' | 'cancelled';
}

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface RecentTrade {
  id: string;
  price: number;
  amount: number;
  type: 'buy' | 'sell';
  time: string;
}

interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  type: 'above' | 'below';
  created: string;
  triggered: boolean;
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
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'compact'>('grid');
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'volume' | 'cap'>('cap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<ExchangeAsset | null>(null);
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'all' | 'watchlist' | 'portfolio'>('all');
  const [showOrderBook, setShowOrderBook] = useState(false);
  const [showRecentTrades, setShowRecentTrades] = useState(true);
  const [portfolio, setPortfolio] = useState<Trade[]>([]);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
  const [portfolioChange, setPortfolioChange] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [volumeRange, setVolumeRange] = useState({ min: '', max: '' });
  const [showQuickTrade, setShowQuickTrade] = useState(true);
  const [marketSentiment, setMarketSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');

  // Order Book & Recent Trades
  const [buyOrders, setBuyOrders] = useState<OrderBookEntry[]>([]);
  const [sellOrders, setSellOrders] = useState<OrderBookEntry[]>([]);
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([]);

  // Price Alerts
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [newAlertPrice, setNewAlertPrice] = useState('');
  const [newAlertType, setNewAlertType] = useState<'above' | 'below'>('above');

  // Trade History
  const [showTradeHistory, setShowTradeHistory] = useState(false);

  useEffect(() => {
    fetchExchangeData();
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
      if (assetsData.success) {
        setAllAssets(assetsData.data);
        // Calculate market sentiment
        const avgChange = assetsData.data.reduce((sum: number, asset: ExchangeAsset) =>
          sum + parseFloat(asset.price_change_24h.toString()), 0) / assetsData.data.length;
        setMarketSentiment(avgChange > 2 ? 'bullish' : avgChange < -2 ? 'bearish' : 'neutral');
      }
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

  // Generate mock order book data
  const generateOrderBook = (basePrice: number) => {
    const buyOrdersData: OrderBookEntry[] = [];
    const sellOrdersData: OrderBookEntry[] = [];

    // Generate buy orders (below current price)
    for (let i = 1; i <= 10; i++) {
      const price = basePrice * (1 - (i * 0.005)); // 0.5% decrements
      const amount = Math.floor(Math.random() * 100) + 10;
      buyOrdersData.push({
        price: parseFloat(price.toFixed(2)),
        amount,
        total: parseFloat((price * amount).toFixed(2)),
      });
    }

    // Generate sell orders (above current price)
    for (let i = 1; i <= 10; i++) {
      const price = basePrice * (1 + (i * 0.005)); // 0.5% increments
      const amount = Math.floor(Math.random() * 100) + 10;
      sellOrdersData.push({
        price: parseFloat(price.toFixed(2)),
        amount,
        total: parseFloat((price * amount).toFixed(2)),
      });
    }

    setBuyOrders(buyOrdersData);
    setSellOrders(sellOrdersData.reverse()); // Reverse to show lowest sell price first
  };

  // Generate mock recent trades
  const generateRecentTrades = (basePrice: number) => {
    const trades: RecentTrade[] = [];
    const now = new Date();

    for (let i = 0; i < 20; i++) {
      const priceVariation = (Math.random() - 0.5) * basePrice * 0.01; // ±1% variation
      const price = basePrice + priceVariation;
      const amount = Math.floor(Math.random() * 50) + 1;
      const tradeTime = new Date(now.getTime() - (i * 60000)); // 1 minute intervals

      trades.push({
        id: `trade-${Date.now()}-${i}`,
        price: parseFloat(price.toFixed(2)),
        amount,
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        time: tradeTime.toISOString(),
      });
    }

    setRecentTrades(trades);
  };

  const openTradeModal = (asset: ExchangeAsset, type: 'buy' | 'sell') => {
    setSelectedAsset(asset);
    setTradeType(type);
    setShowTradeModal(true);
    setLimitPrice(asset.current_price.toString());

    // Generate order book and recent trades for this asset
    generateOrderBook(parseFloat(asset.current_price.toString()));
    generateRecentTrades(parseFloat(asset.current_price.toString()));
  };

  const handleTrade = () => {
    if (!selectedAsset || !tradeAmount) return;

    const newTrade: Trade = {
      id: Date.now().toString(),
      symbol: selectedAsset.symbol,
      type: tradeType,
      price: orderType === 'market' ? selectedAsset.current_price : parseFloat(limitPrice),
      amount: parseFloat(tradeAmount),
      total: (orderType === 'market' ? selectedAsset.current_price : parseFloat(limitPrice)) * parseFloat(tradeAmount),
      time: new Date().toISOString(),
      status: orderType === 'market' ? 'completed' : 'pending',
    };

    setPortfolio(prev => [...prev, newTrade]);

    // Success notification
    alert(`${orderType.toUpperCase()} ${tradeType.toUpperCase()} order placed successfully!\n${tradeAmount} shares of ${selectedAsset.symbol}`);

    setShowTradeModal(false);
    setTradeAmount('');
    setLimitPrice('');
    setStopPrice('');
  };

  const filteredAssets = allAssets
    .filter((asset) => {
      const matchesSearch =
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.deal.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || asset.market_category === selectedCategory;

      const matchesPriceRange =
        (!priceRange.min || parseFloat(asset.current_price.toString()) >= parseFloat(priceRange.min)) &&
        (!priceRange.max || parseFloat(asset.current_price.toString()) <= parseFloat(priceRange.max));

      const matchesVolumeRange =
        (!volumeRange.min || parseFloat(asset.daily_volume.toString()) >= parseFloat(volumeRange.min)) &&
        (!volumeRange.max || parseFloat(asset.daily_volume.toString()) <= parseFloat(volumeRange.max));

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'watchlist' && watchlist.includes(asset.symbol)) ||
        (activeTab === 'portfolio' && portfolio.some(p => p.symbol === asset.symbol));

      return matchesSearch && matchesCategory && matchesPriceRange && matchesVolumeRange && matchesTab;
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

  // Calculate portfolio stats
  useEffect(() => {
    const totalValue = portfolio
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.total, 0);
    setTotalPortfolioValue(totalValue);

    // Simplified P&L calculation (would be more complex in production)
    const totalChange = portfolio.length > 0 ? (Math.random() - 0.5) * 20 : 0;
    setPortfolioChange(totalChange);
  }, [portfolio]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
            <Activity className="w-12 h-12 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-purple-200 text-xl font-semibold mb-2">Loading Exchange...</p>
          <p className="text-purple-400 text-sm">Fetching real-time market data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139,92,246,0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Live Price Ticker */}
      <div className="relative bg-gradient-to-r from-purple-950/50 to-blue-950/50 border-b border-white/10 overflow-hidden">
        <div className="flex animate-scroll" style={{ animation: 'scroll 60s linear infinite' }}>
          {[...allAssets, ...allAssets].map((asset, index) => {
            const priceChange = parseFloat(asset.price_change_24h.toString());
            const isPositive = priceChange >= 0;
            return (
              <div
                key={`ticker-${asset.id}-${index}`}
                className="flex items-center gap-2 px-4 py-2 border-r border-white/5 whitespace-nowrap cursor-pointer hover:bg-white/5 transition-all"
                onClick={() => router.push(`/exchange/asset/${asset.symbol}`)}
              >
                <span className="font-mono font-bold text-white text-sm">{asset.symbol}</span>
                <span className="text-purple-200 text-sm">{parseFloat(asset.current_price.toString()).toLocaleString()} AED</span>
                <span className={`text-xs font-bold flex items-center gap-0.5 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '▲' : '▼'}
                  {Math.abs(priceChange).toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>

      {/* Top Bar - Market Status */}
      <div className="relative border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  marketSentiment === 'bullish' ? 'bg-green-400' :
                  marketSentiment === 'bearish' ? 'bg-red-400' : 'bg-yellow-400'
                }`}></div>
                <span className="text-sm font-semibold text-purple-200">
                  Market {marketSentiment.charAt(0).toUpperCase() + marketSentiment.slice(1)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-purple-300">
                <DollarSign className="w-4 h-4" />
                <span>Vol 24h:</span>
                <span className="font-bold text-white">{(totalVolume / 1000000).toFixed(2)}M AED</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-purple-300">
                <Target className="w-4 h-4" />
                <span>Markets:</span>
                <span className="font-bold text-white">{allAssets.length}</span>
              </div>

              <div className={`flex items-center gap-2 text-sm ${avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {avgChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-bold">{avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-purple-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Updated {lastUpdate.toLocaleTimeString()}
              </div>
              <button
                onClick={() => setShowAlertsModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-purple-200 transition-all text-sm relative"
                title="Price Alerts"
              >
                <Bell className="w-3 h-3" />
                Alerts
                {priceAlerts.filter(a => !a.triggered).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                    {priceAlerts.filter(a => !a.triggered).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowTradeHistory(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-purple-200 transition-all text-sm"
                title="Trade History"
              >
                <History className="w-3 h-3" />
                History
                {portfolio.length > 0 && (
                  <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.5 rounded-full">
                    {portfolio.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => fetchExchangeData()}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-purple-200 transition-all text-sm"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10"></div>
        <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <CandlestickChart className="w-7 h-7 text-white" />
                </div>
                OWNLY Exchange
              </h1>
              <p className="text-lg text-purple-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Professional Trading Platform for Real Assets
              </p>
            </div>

            {/* Portfolio Summary Card */}
            {portfolio.length > 0 && (
              <div className="hidden lg:block bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl min-w-[300px]">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="w-5 h-5 text-purple-300" />
                  <span className="text-sm font-semibold text-purple-200">My Portfolio</span>
                </div>
                <div className="mb-2">
                  <div className="text-3xl font-bold text-white mb-1">
                    {totalPortfolioValue.toLocaleString()} AED
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${portfolioChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {portfolioChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {portfolioChange >= 0 ? '+' : ''}{portfolioChange.toFixed(2)}% Today
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-white text-xs font-semibold transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Market Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10 hover:border-purple-500/30 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs text-blue-400 font-semibold px-2 py-1 bg-blue-500/10 rounded-full">TVL</div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {(totalMarketCap / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-purple-300">Total Market Cap</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10 hover:border-purple-500/30 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs text-purple-400 font-semibold px-2 py-1 bg-purple-500/10 rounded-full">24H</div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {(totalVolume / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-purple-300">Trading Volume</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10 hover:border-purple-500/30 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs text-green-400 font-semibold px-2 py-1 bg-green-500/10 rounded-full">LIVE</div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{allAssets.length}</div>
              <div className="text-xs text-purple-300">Active Assets</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10 hover:border-purple-500/30 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${avgChange >= 0 ? 'from-green-600 to-emerald-500' : 'from-red-600 to-red-500'} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  {avgChange >= 0 ? <TrendingUp className="w-5 h-5 text-white" /> : <TrendingDown className="w-5 h-5 text-white" />}
                </div>
                <div className={`text-xs ${avgChange >= 0 ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'} font-semibold px-2 py-1 rounded-full`}>
                  {marketSentiment.toUpperCase()}
                </div>
              </div>
              <div className={`text-2xl font-bold mb-1 ${avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
              </div>
              <div className="text-xs text-purple-300">Market Change</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Categories */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-purple-400" />
              Market Categories
            </h2>
            <button className="text-sm text-purple-300 hover:text-white flex items-center gap-1 transition-colors">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {markets.map((market) => {
              const Icon = categoryIcons[market.category as keyof typeof categoryIcons];
              const gradient = categoryColors[market.category as keyof typeof categoryColors];

              return (
                <Link
                  key={market.category}
                  href={`/exchange/markets/${market.category}`}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity`}></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${gradient} opacity-5 rounded-full -mr-16 -mt-16"></div>

                  <div className="relative p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${market.avg_change_24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {market.avg_change_24h >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        <span className="text-xs font-bold">
                          {market.avg_change_24h >= 0 ? '+' : ''}{market.avg_change_24h.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white capitalize mb-3 group-hover:text-purple-200 transition-colors">
                      {market.category}
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-300 flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          Assets
                        </span>
                        <span className="font-bold text-white">{market.asset_count}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-300 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Market Cap
                        </span>
                        <span className="font-bold text-white">{(market.total_market_cap / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-300 flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          Volume 24h
                        </span>
                        <span className="font-bold text-white">{(market.total_volume_24h / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Top Movers Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Gainers */}
          <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/5 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Top Gainers</h3>
                  <p className="text-xs text-green-300">Biggest winners in 24h</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full">
                +{topGainers.length > 0 ? parseFloat(topGainers[0].price_change_24h.toString()).toFixed(1) : 0}%
              </div>
            </div>

            <div className="space-y-3">
              {topGainers.slice(0, 5).map((asset, index) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group cursor-pointer border border-white/10 hover:border-green-500/30"
                  onClick={() => router.push(`/exchange/asset/${asset.symbol}`)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 bg-gradient-to-br ${
                      index === 0 ? 'from-yellow-500 to-orange-500' :
                      index === 1 ? 'from-gray-400 to-gray-500' :
                      index === 2 ? 'from-orange-600 to-orange-700' :
                      'from-green-600 to-emerald-500'
                    } rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
                      {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white group-hover:text-green-300 transition-colors truncate">
                        {asset.symbol}
                      </p>
                      <p className="text-xs text-purple-300 truncate">{asset.deal.title}</p>
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <p className="font-bold text-white whitespace-nowrap">{parseFloat(asset.current_price.toString()).toLocaleString()} AED</p>
                    <p className="text-sm text-green-400 flex items-center gap-1 justify-end font-semibold">
                      <ArrowUpRight className="w-3 h-3" />
                      +{parseFloat(asset.price_change_24h.toString()).toFixed(2)}%
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openTradeModal(asset, 'buy');
                    }}
                    className="ml-3 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all text-sm font-semibold"
                  >
                    Buy
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="bg-gradient-to-br from-red-600/10 to-pink-600/5 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Top Losers</h3>
                  <p className="text-xs text-red-300">Biggest drops in 24h</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-red-500/20 text-red-300 text-xs font-bold rounded-full">
                {topLosers.length > 0 ? parseFloat(topLosers[0].price_change_24h.toString()).toFixed(1) : 0}%
              </div>
            </div>

            <div className="space-y-3">
              {topLosers.slice(0, 5).map((asset, index) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group cursor-pointer border border-white/10 hover:border-red-500/30"
                  onClick={() => router.push(`/exchange/asset/${asset.symbol}`)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white group-hover:text-red-300 transition-colors truncate">
                        {asset.symbol}
                      </p>
                      <p className="text-xs text-purple-300 truncate">{asset.deal.title}</p>
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <p className="font-bold text-white whitespace-nowrap">{parseFloat(asset.current_price.toString()).toLocaleString()} AED</p>
                    <p className="text-sm text-red-400 flex items-center gap-1 justify-end font-semibold">
                      <ArrowDownRight className="w-3 h-3" />
                      {parseFloat(asset.price_change_24h.toString()).toFixed(2)}%
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openTradeModal(asset, 'buy');
                    }}
                    className="ml-3 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all text-sm font-semibold whitespace-nowrap"
                  >
                    Buy Dip
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Assets Section with Advanced Controls */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header with Tabs */}
          <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-b border-white/10 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex gap-2 bg-white/5 rounded-xl p-1 border border-white/10">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      activeTab === 'all'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-purple-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Grid3x3 className="w-4 h-4" />
                      All Assets ({allAssets.length})
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('watchlist')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      activeTab === 'watchlist'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-purple-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Watchlist ({watchlist.length})
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      activeTab === 'portfolio'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-purple-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Portfolio ({portfolio.length})
                    </div>
                  </button>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-white/5 rounded-xl border border-white/10 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-white/5'
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-white/5'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    viewMode === 'compact' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-white/5'
                  }`}
                  title="Compact View"
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                <input
                  type="text"
                  placeholder="Search by symbol or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer hover:bg-white/10 transition-all"
              >
                <option value="all">All Categories</option>
                <option value="franchise">🏪 Franchise</option>
                <option value="property">🏢 Property</option>
                <option value="luxury">💎 Luxury</option>
                <option value="inventory">📦 Inventory</option>
                <option value="equity">💼 Equity</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 border rounded-xl font-semibold transition-all ${
                  showFilters
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-white/5 border-white/10 text-purple-200 hover:bg-white/10'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">Price Range (AED)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-purple-300 self-center">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2">Volume Range (AED)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={volumeRange.min}
                        onChange={(e) => setVolumeRange({ ...volumeRange, min: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="text-purple-300 self-center">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={volumeRange.max}
                        onChange={(e) => setVolumeRange({ ...volumeRange, max: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => {
                      setPriceRange({ min: '', max: '' });
                      setVolumeRange({ min: '', max: '' });
                    }}
                    className="px-4 py-2 bg-white/5 border border-white/10 text-purple-200 rounded-lg hover:bg-white/10 transition-all text-sm font-semibold"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Sorting Options */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-purple-300 self-center font-semibold">Sort by:</span>
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
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                    sortBy === option
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white/5 text-purple-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {option === 'cap' ? 'Market Cap' : option.charAt(0).toUpperCase() + option.slice(1)}
                  {sortBy === option && (
                    sortOrder === 'desc' ?
                    <SortDesc className="w-4 h-4" /> :
                    <SortAsc className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Assets Display */}
          <div className="p-6">
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredAssets.map((asset) => {
                  const isWatchlisted = watchlist.includes(asset.symbol);
                  const priceChange = parseFloat(asset.price_change_24h.toString());
                  const isPositive = priceChange >= 0;

                  return (
                    <div
                      key={asset.id}
                      className="group bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
                      onClick={() => router.push(`/exchange/asset/${asset.symbol}`)}
                    >
                      {/* Status Bar with Gradient */}
                      <div className={`h-1.5 ${isPositive ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-green-400' : 'bg-gradient-to-r from-red-400 via-pink-500 to-red-400'}`}></div>

                      <div className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-mono font-bold text-lg text-white">{asset.symbol}</span>
                              <div className="flex gap-1">
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                                  asset.trading_phase === 'primary'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                }`}>
                                  {asset.trading_phase}
                                </span>
                                {asset.demand_index > 80 && (
                                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1">
                                    <Flame className="w-3 h-3" />
                                    Hot
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-purple-300 line-clamp-2 leading-tight">{asset.deal.title}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWatchlist(asset.symbol);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all ml-2"
                          >
                            <Star className={`w-5 h-5 ${isWatchlisted ? 'fill-yellow-400 text-yellow-400' : 'text-purple-300'}`} />
                          </button>
                        </div>

                        {/* Price Display */}
                        <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                          <div className="text-xs text-purple-400 mb-1">Current Price</div>
                          <div className="flex items-baseline justify-between">
                            <div className="text-2xl font-bold text-white">
                              {parseFloat(asset.current_price.toString()).toLocaleString()}
                            </div>
                            <div className="text-xs text-purple-300">AED</div>
                          </div>
                          <div className={`flex items-center gap-1 mt-2 text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {isPositive ? '+' : ''}{priceChange.toFixed(2)}% (24h)
                          </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-gradient-to-br from-blue-600/10 to-blue-600/5 rounded-xl p-3 border border-blue-500/20">
                            <div className="flex items-center gap-1 mb-1">
                              <Volume2 className="w-3 h-3 text-blue-400" />
                              <div className="text-xs text-blue-400 font-semibold">Volume</div>
                            </div>
                            <div className="text-sm font-bold text-blue-300">
                              {(parseFloat(asset.daily_volume.toString()) / 1000).toFixed(1)}K
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 rounded-xl p-3 border border-purple-500/20">
                            <div className="flex items-center gap-1 mb-1">
                              <PieChart className="w-3 h-3 text-purple-400" />
                              <div className="text-xs text-purple-400 font-semibold">Market Cap</div>
                            </div>
                            <div className="text-sm font-bold text-purple-300">
                              {(parseFloat(asset.market_cap.toString()) / 1000000).toFixed(2)}M
                            </div>
                          </div>
                        </div>

                        {/* Demand Indicator */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-purple-400 font-semibold flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              Demand Index
                            </div>
                            <div className={`text-xs font-bold ${
                              asset.demand_index > 70 ? 'text-green-400' :
                              asset.demand_index > 40 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {asset.demand_index}%
                            </div>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden border border-white/10">
                            <div
                              className={`h-full rounded-full transition-all ${
                                asset.demand_index > 70 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                                asset.demand_index > 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                                'bg-gradient-to-r from-red-500 to-pink-400'
                              }`}
                              style={{ width: `${asset.demand_index}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openTradeModal(asset, 'buy');
                            }}
                            className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all font-bold text-sm flex items-center justify-center gap-2 group-hover:scale-105"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Buy
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/exchange/asset/${asset.symbol}`);
                            }}
                            className="px-4 py-2.5 bg-white/5 border border-white/10 text-purple-200 rounded-xl hover:bg-white/10 transition-all font-bold text-sm flex items-center justify-center gap-2"
                          >
                            <LineChart className="w-4 h-4" />
                            Chart
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
                      <th className="text-left py-4 px-4 text-sm font-bold text-purple-300">#</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-purple-300">Symbol</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-purple-300">Name</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-purple-300">Category</th>
                      <th className="text-right py-4 px-4 text-sm font-bold text-purple-300">Price</th>
                      <th className="text-right py-4 px-4 text-sm font-bold text-purple-300">24h Change</th>
                      <th className="text-right py-4 px-4 text-sm font-bold text-purple-300">Volume</th>
                      <th className="text-right py-4 px-4 text-sm font-bold text-purple-300">Market Cap</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-purple-300">Demand</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-purple-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.map((asset, index) => {
                      const priceChange = parseFloat(asset.price_change_24h.toString());
                      const isPositive = priceChange >= 0;

                      return (
                        <tr
                          key={asset.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                        >
                          <td className="py-4 px-4">
                            <span className="text-purple-400 font-semibold">{index + 1}</span>
                          </td>
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
                              {asset.demand_index > 80 && (
                                <Flame className="w-4 h-4 text-orange-400" />
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-white font-medium">{asset.deal.title}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-purple-300 capitalize px-2 py-1 bg-white/5 rounded-full border border-white/10">
                              {asset.market_category}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="font-bold text-white">
                              {parseFloat(asset.current_price.toString()).toLocaleString()} AED
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className={`font-bold flex items-center gap-1 justify-end ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-purple-200 font-semibold">
                              {(parseFloat(asset.daily_volume.toString()) / 1000).toFixed(1)}K
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-purple-200 font-semibold">
                              {(parseFloat(asset.market_cap.toString()) / 1000000).toFixed(2)}M
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                                <div
                                  className={`h-full rounded-full ${
                                    asset.demand_index > 70 ? 'bg-green-400' :
                                    asset.demand_index > 40 ? 'bg-yellow-400' : 'bg-red-400'
                                  }`}
                                  style={{ width: `${asset.demand_index}%` }}
                                ></div>
                              </div>
                              <span className={`text-xs font-bold ${
                                asset.demand_index > 70 ? 'text-green-400' :
                                asset.demand_index > 40 ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {asset.demand_index}%
                              </span>
                            </div>
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

            {/* Compact View */}
            {viewMode === 'compact' && (
              <div className="space-y-2">
                {filteredAssets.map((asset) => {
                  const isWatchlisted = watchlist.includes(asset.symbol);
                  const priceChange = parseFloat(asset.price_change_24h.toString());
                  const isPositive = priceChange >= 0;

                  return (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group cursor-pointer border border-white/10"
                      onClick={() => router.push(`/exchange/asset/${asset.symbol}`)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(asset.symbol);
                          }}
                        >
                          <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-yellow-400 text-yellow-400' : 'text-purple-400'}`} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-white">{asset.symbol}</span>
                            <span className="text-xs text-purple-300 capitalize px-2 py-0.5 bg-white/5 rounded-full border border-white/10">
                              {asset.market_category}
                            </span>
                          </div>
                          <p className="text-sm text-purple-300 truncate">{asset.deal.title}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-bold text-white whitespace-nowrap">
                            {parseFloat(asset.current_price.toString()).toLocaleString()} AED
                          </div>
                          <div className={`text-sm font-bold flex items-center gap-1 justify-end ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openTradeModal(asset, 'buy');
                            }}
                            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all font-semibold text-sm"
                          >
                            Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {filteredAssets.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-purple-300 opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Assets Found</h3>
                <p className="text-purple-300 mb-6">Try adjusting your filters or search criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceRange({ min: '', max: '' });
                    setVolumeRange({ min: '', max: '' });
                  }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Trade Modal */}
      {showTradeModal && selectedAsset && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/20 rounded-3xl p-8 max-w-2xl w-full shadow-2xl shadow-purple-500/20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-white">{selectedAsset.symbol}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    tradeType === 'buy'
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {tradeType === 'buy' ? 'BUY ORDER' : 'SELL ORDER'}
                  </span>
                </div>
                <p className="text-purple-300">{selectedAsset.deal.title}</p>
              </div>
              <button
                onClick={() => setShowTradeModal(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all group"
              >
                <X className="w-5 h-5 text-purple-300 group-hover:text-white" />
              </button>
            </div>

            {/* Order Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-purple-300 mb-3">Order Type</label>
              <div className="grid grid-cols-3 gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
                <button
                  onClick={() => setOrderType('market')}
                  className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                    orderType === 'market'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-purple-300 hover:bg-white/5'
                  }`}
                >
                  <CircleDot className="w-4 h-4 inline mr-2" />
                  Market
                </button>
                <button
                  onClick={() => setOrderType('limit')}
                  className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                    orderType === 'limit'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-purple-300 hover:bg-white/5'
                  }`}
                >
                  <Target className="w-4 h-4 inline mr-2" />
                  Limit
                </button>
                <button
                  onClick={() => setOrderType('stop')}
                  className={`px-4 py-3 rounded-lg font-bold text-sm transition-all ${
                    orderType === 'stop'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-purple-300 hover:bg-white/5'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Stop
                </button>
              </div>
            </div>

            {/* Current Price Card */}
            <div className="mb-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-5 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300 mb-1 font-semibold">Current Market Price</p>
                  <p className="font-bold text-3xl text-white">{parseFloat(selectedAsset.current_price.toString()).toLocaleString()} AED</p>
                </div>
                <div className={`px-4 py-2 rounded-xl ${
                  parseFloat(selectedAsset.price_change_24h.toString()) >= 0
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-red-500/20 text-red-300'
                } font-bold`}>
                  {parseFloat(selectedAsset.price_change_24h.toString()) >= 0 ? '+' : ''}
                  {parseFloat(selectedAsset.price_change_24h.toString()).toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Order Book & Recent Trades */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Order Book */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-white">Order Book</h3>
                </div>

                <div className="space-y-1">
                  {/* Sell Orders */}
                  <div className="space-y-0.5">
                    {sellOrders.slice(0, 5).reverse().map((order, index) => (
                      <div key={`sell-${index}`} className="grid grid-cols-3 gap-2 text-xs py-1 px-2 rounded hover:bg-red-500/10 transition-colors">
                        <span className="text-red-400 font-mono">{order.price.toLocaleString()}</span>
                        <span className="text-purple-300 text-right">{order.amount}</span>
                        <span className="text-purple-400 text-right font-semibold">{order.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Current Price */}
                  <div className="py-2 px-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                    <div className="grid grid-cols-3 gap-2 text-sm font-bold">
                      <span className="text-white">{parseFloat(selectedAsset.current_price.toString()).toLocaleString()}</span>
                      <span className="text-center text-purple-300">AED</span>
                      <span className={`text-right ${parseFloat(selectedAsset.price_change_24h.toString()) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {parseFloat(selectedAsset.price_change_24h.toString()) >= 0 ? '▲' : '▼'}
                        {Math.abs(parseFloat(selectedAsset.price_change_24h.toString())).toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Buy Orders */}
                  <div className="space-y-0.5">
                    {buyOrders.slice(0, 5).map((order, index) => (
                      <div key={`buy-${index}`} className="grid grid-cols-3 gap-2 text-xs py-1 px-2 rounded hover:bg-green-500/10 transition-colors">
                        <span className="text-green-400 font-mono">{order.price.toLocaleString()}</span>
                        <span className="text-purple-300 text-right">{order.amount}</span>
                        <span className="text-purple-400 text-right font-semibold">{order.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Labels */}
                <div className="grid grid-cols-3 gap-2 text-xs text-purple-400 mt-3 pt-3 border-t border-white/10">
                  <span>Price (AED)</span>
                  <span className="text-right">Amount</span>
                  <span className="text-right">Total</span>
                </div>
              </div>

              {/* Recent Trades */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-white">Recent Trades</h3>
                </div>

                <div className="space-y-1 max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                  {recentTrades.map((trade) => {
                    const tradeTime = new Date(trade.time);
                    const timeAgo = Math.floor((Date.now() - tradeTime.getTime()) / 60000);

                    return (
                      <div key={trade.id} className="grid grid-cols-3 gap-2 text-xs py-1.5 px-2 rounded hover:bg-white/5 transition-colors">
                        <span className={`font-mono font-bold ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.price.toLocaleString()}
                        </span>
                        <span className="text-purple-300 text-right">{trade.amount}</span>
                        <span className="text-purple-400 text-right text-[10px]">
                          {timeAgo === 0 ? 'Just now' : `${timeAgo}m ago`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Labels */}
                <div className="grid grid-cols-3 gap-2 text-xs text-purple-400 mt-3 pt-3 border-t border-white/10">
                  <span>Price (AED)</span>
                  <span className="text-right">Amount</span>
                  <span className="text-right">Time</span>
                </div>
              </div>
            </div>

            {/* Trade Inputs */}
            <div className="space-y-4 mb-6">
              {/* Limit Price (for limit and stop orders) */}
              {(orderType === 'limit' || orderType === 'stop') && (
                <div>
                  <label className="block text-sm font-bold text-purple-300 mb-2">
                    {orderType === 'limit' ? 'Limit Price (AED)' : 'Stop Price (AED)'}
                  </label>
                  <input
                    type="number"
                    value={orderType === 'limit' ? limitPrice : stopPrice}
                    onChange={(e) => orderType === 'limit' ? setLimitPrice(e.target.value) : setStopPrice(e.target.value)}
                    placeholder="Enter price"
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    step="0.01"
                  />
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block text-sm font-bold text-purple-300 mb-2">Number of Shares</label>
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                  step="1"
                />
                <div className="flex gap-2 mt-2">
                  {[10, 25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTradeAmount(amount.toString())}
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-purple-200 rounded-lg hover:bg-white/10 transition-all text-sm font-semibold"
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            {tradeAmount && (
              <div className="mb-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-white">Order Summary</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Order Type:</span>
                    <span className="text-white font-bold capitalize">{orderType} Order</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Shares:</span>
                    <span className="text-white font-bold">{parseFloat(tradeAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Price per Share:</span>
                    <span className="text-white font-bold">
                      {orderType === 'market'
                        ? parseFloat(selectedAsset.current_price.toString()).toLocaleString()
                        : orderType === 'limit'
                        ? parseFloat(limitPrice || '0').toLocaleString()
                        : parseFloat(stopPrice || '0').toLocaleString()
                      } AED
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-white font-bold">Total Cost:</span>
                      <span className="text-2xl font-bold text-white">
                        {(
                          (orderType === 'market'
                            ? selectedAsset.current_price
                            : orderType === 'limit'
                            ? parseFloat(limitPrice || '0')
                            : parseFloat(stopPrice || '0')
                          ) * parseFloat(tradeAmount)
                        ).toLocaleString()} AED
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleTrade}
                disabled={!tradeAmount || parseFloat(tradeAmount) <= 0 || ((orderType === 'limit' || orderType === 'stop') && (!limitPrice && !stopPrice))}
                className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  tradeType === 'buy'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/30'
                    : 'bg-gradient-to-r from-red-600 to-pink-600 hover:shadow-lg hover:shadow-red-500/30'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <CheckCircle className="w-6 h-6" />
                Place {orderType.charAt(0).toUpperCase() + orderType.slice(1)} Order
              </button>
              <button
                onClick={() => setShowTradeModal(false)}
                className="px-6 py-4 bg-white/5 border border-white/10 text-purple-200 rounded-xl hover:bg-white/10 transition-all font-bold text-lg"
              >
                Cancel
              </button>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <p className="text-xs text-yellow-200">
                  <strong>Important:</strong> {orderType === 'market' ? 'Market orders execute immediately at current market price.' : orderType === 'limit' ? 'Limit orders will only execute when the market price reaches your specified price.' : 'Stop orders will trigger when the market price reaches your stop price.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Alerts Modal */}
      {showAlertsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/20 rounded-3xl p-8 max-w-2xl w-full shadow-2xl shadow-purple-500/20 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Price Alerts</h2>
                  <p className="text-sm text-purple-300">Get notified when prices reach your targets</p>
                </div>
              </div>
              <button
                onClick={() => setShowAlertsModal(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-purple-300" />
              </button>
            </div>

            {/* Create Alert */}
            {selectedAsset && (
              <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/30 rounded-xl p-5 mb-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Alert for {selectedAsset.symbol}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-purple-300 mb-2">Alert Type</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setNewAlertType('above')}
                        className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                          newAlertType === 'above'
                            ? 'bg-green-600 text-white'
                            : 'bg-white/5 text-purple-300 hover:bg-white/10'
                        }`}
                      >
                        <ArrowUpRight className="w-4 h-4 inline mr-2" />
                        Above
                      </button>
                      <button
                        onClick={() => setNewAlertType('below')}
                        className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                          newAlertType === 'below'
                            ? 'bg-red-600 text-white'
                            : 'bg-white/5 text-purple-300 hover:bg-white/10'
                        }`}
                      >
                        <ArrowDownRight className="w-4 h-4 inline mr-2" />
                        Below
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-300 mb-2">Target Price (AED)</label>
                    <input
                      type="number"
                      value={newAlertPrice}
                      onChange={(e) => setNewAlertPrice(e.target.value)}
                      placeholder="Enter price"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                      step="0.01"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (newAlertPrice && selectedAsset) {
                      setPriceAlerts(prev => [...prev, {
                        id: Date.now().toString(),
                        symbol: selectedAsset.symbol,
                        targetPrice: parseFloat(newAlertPrice),
                        type: newAlertType,
                        created: new Date().toISOString(),
                        triggered: false,
                      }]);
                      setNewAlertPrice('');
                      alert(`Alert created! You'll be notified when ${selectedAsset.symbol} goes ${newAlertType} ${newAlertPrice} AED`);
                    }
                  }}
                  disabled={!newAlertPrice}
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Alert
                </button>
              </div>
            )}

            {/* Alerts List */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-purple-400" />
                Active Alerts ({priceAlerts.filter(a => !a.triggered).length})
              </h3>
              {priceAlerts.filter(a => !a.triggered).length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                  <Bell className="w-16 h-16 text-purple-400/30 mx-auto mb-4" />
                  <p className="text-purple-300">No active alerts</p>
                  <p className="text-sm text-purple-400 mt-2">Create an alert to get notified of price changes</p>
                </div>
              ) : (
                priceAlerts.filter(a => !a.triggered).map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        alert.type === 'above' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {alert.type === 'above' ? (
                          <ArrowUpRight className="w-6 h-6 text-green-400" />
                        ) : (
                          <ArrowDownRight className="w-6 h-6 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-white">{alert.symbol}</p>
                        <p className="text-sm text-purple-300">
                          Alert when price goes <span className="font-bold">{alert.type}</span> {alert.targetPrice.toLocaleString()} AED
                        </p>
                        <p className="text-xs text-purple-400 mt-1">
                          Created {new Date(alert.created).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setPriceAlerts(prev => prev.filter(a => a.id !== alert.id));
                      }}
                      className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trade History Modal */}
      {showTradeHistory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/20 rounded-3xl p-8 max-w-4xl w-full shadow-2xl shadow-purple-500/20 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <History className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Trade History</h2>
                  <p className="text-sm text-purple-300">Your completed and pending trades</p>
                </div>
              </div>
              <button
                onClick={() => setShowTradeHistory(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-purple-300" />
              </button>
            </div>

            {/* Trades List */}
            {portfolio.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
                <History className="w-20 h-20 text-purple-400/30 mx-auto mb-4" />
                <p className="text-xl font-bold text-white mb-2">No trades yet</p>
                <p className="text-purple-300">Start trading to see your history here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {portfolio.map(trade => (
                  <div key={trade.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                          trade.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {trade.type === 'buy' ? (
                            <ArrowUpRight className="w-7 h-7 text-green-400" />
                          ) : (
                            <ArrowDownRight className="w-7 h-7 text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-mono font-bold text-xl text-white">{trade.symbol}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              trade.type === 'buy'
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}>
                              {trade.type.toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              trade.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                              trade.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-gray-500/20 text-gray-300'
                            }`}>
                              {trade.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-purple-300 mt-1">
                            {new Date(trade.time).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{trade.total.toLocaleString()} AED</p>
                        <p className="text-sm text-purple-300">{trade.amount} shares @ {trade.price.toLocaleString()} AED</p>
                      </div>
                    </div>

                    {/* Trade Details */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                      <div className="bg-purple-600/10 rounded-lg p-3">
                        <p className="text-xs text-purple-400 mb-1">Shares</p>
                        <p className="font-bold text-white">{trade.amount}</p>
                      </div>
                      <div className="bg-blue-600/10 rounded-lg p-3">
                        <p className="text-xs text-blue-400 mb-1">Price per Share</p>
                        <p className="font-bold text-white">{trade.price.toLocaleString()} AED</p>
                      </div>
                      <div className="bg-green-600/10 rounded-lg p-3">
                        <p className="text-xs text-green-400 mb-1">Total Value</p>
                        <p className="font-bold text-white">{trade.total.toLocaleString()} AED</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            {portfolio.length > 0 && (
              <div className="mt-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-purple-300 mb-1">Total Trades</p>
                    <p className="text-2xl font-bold text-white">{portfolio.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-300 mb-1">Total Volume</p>
                    <p className="text-2xl font-bold text-white">{portfolio.reduce((sum, t) => sum + t.total, 0).toLocaleString()} AED</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-300 mb-1">Buy Orders</p>
                    <p className="text-2xl font-bold text-green-400">{portfolio.filter(t => t.type === 'buy').length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-300 mb-1">Sell Orders</p>
                    <p className="text-2xl font-bold text-red-400">{portfolio.filter(t => t.type === 'sell').length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
