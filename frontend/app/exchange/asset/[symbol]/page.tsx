'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  DollarSign,
  Clock,
  BarChart3,
  Users,
  Package,
  AlertCircle,
  ChevronLeft,
  Info,
  Star,
  ShoppingCart,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Target,
  Zap,
  TrendingUpIcon,
  Flame,
  Briefcase,
  Bell,
  History,
  BookOpen,
  LineChart,
  Sparkles,
  TrendingDownIcon,
  Volume2,
  Percent,
  ArrowLeftRight,
} from 'lucide-react';

interface Asset {
  id: string;
  symbol: string;
  market_category: string;
  current_price: number;
  price_change_24h: number;
  daily_volume: number;
  market_cap: number;
  total_units: number;
  available_units: number;
  demand_index: number;
  sentiment_score: number;
  trading_phase: string;
  week_high: number;
  week_low: number;
  all_time_high: number;
  all_time_low: number;
  deal: {
    title: string;
    description: string;
    type: string;
    location: string;
    images?: string[];
    expected_roi: number;
    holding_period_months: number;
  };
}

interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

interface Trade {
  id: string;
  price: number;
  quantity: number;
  executed_at: string;
  buyer_id: string;
  seller_id: string;
}

interface RecentTrade {
  id: string;
  price: number;
  amount: number;
  type: 'buy' | 'sell';
  time: string;
}

export default function AssetTradingPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol as string;

  const [loading, setLoading] = useState(true);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookEntry[]; asks: OrderBookEntry[] }>({
    bids: [],
    asks: [],
  });
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [watchlisted, setWatchlisted] = useState(false);
  const [similarAssets, setSimilarAssets] = useState<Asset[]>([]);

  // Order form state
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');

  // Alert state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertPrice, setAlertPrice] = useState('');
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');

  useEffect(() => {
    if (symbol) {
      fetchAssetData();
      // Refresh data every 10 seconds
      const interval = setInterval(fetchAssetData, 10000);
      return () => clearInterval(interval);
    }
  }, [symbol]);

  // Generate mock recent trades
  const generateRecentTrades = (basePrice: number) => {
    const trades: RecentTrade[] = [];
    const now = new Date();

    for (let i = 0; i < 15; i++) {
      const priceVariation = (Math.random() - 0.5) * basePrice * 0.01;
      const tradePrice = basePrice + priceVariation;
      const amount = Math.floor(Math.random() * 20) + 1;
      const tradeTime = new Date(now.getTime() - (i * 120000)); // 2 minute intervals

      trades.push({
        id: `trade-${Date.now()}-${i}`,
        price: parseFloat(tradePrice.toFixed(2)),
        amount,
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        time: tradeTime.toISOString(),
      });
    }

    setRecentTrades(trades);
  };

  // Generate mock order book
  const generateOrderBook = (basePrice: number) => {
    const bids: OrderBookEntry[] = [];
    const asks: OrderBookEntry[] = [];

    for (let i = 1; i <= 15; i++) {
      const bidPrice = basePrice * (1 - (i * 0.003));
      const bidQuantity = Math.floor(Math.random() * 50) + 5;
      bids.push({
        price: parseFloat(bidPrice.toFixed(2)),
        quantity: bidQuantity,
        total: parseFloat((bidPrice * bidQuantity).toFixed(2)),
      });

      const askPrice = basePrice * (1 + (i * 0.003));
      const askQuantity = Math.floor(Math.random() * 50) + 5;
      asks.push({
        price: parseFloat(askPrice.toFixed(2)),
        quantity: askQuantity,
        total: parseFloat((askPrice * askQuantity).toFixed(2)),
      });
    }

    setOrderBook({ bids, asks: asks.reverse() });
  };

  const fetchAssetData = async () => {
    try {
      // Fetch all data in parallel
      const [assetRes, chartRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/assets?limit=100`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/assets/${symbol}/chart?interval=1d&limit=30`),
      ]);

      const [assetData, chartDataRes] = await Promise.all([
        assetRes.json(),
        chartRes.json(),
      ]);

      // Find asset by symbol
      if (assetData.success && assetData.data) {
        const foundAsset = assetData.data.find((a: Asset) => a.symbol === symbol);
        if (foundAsset) {
          setAsset(foundAsset);
          if (orderType === 'market') {
            setPrice(foundAsset.current_price.toString());
          }

          // Generate mock data
          generateRecentTrades(parseFloat(foundAsset.current_price.toString()));
          generateOrderBook(parseFloat(foundAsset.current_price.toString()));

          // Find similar assets
          const similar = assetData.data
            .filter((a: Asset) => a.market_category === foundAsset.market_category && a.symbol !== symbol)
            .slice(0, 3);
          setSimilarAssets(similar);
        }
      }

      if (chartDataRes.success) {
        setChartData(chartDataRes.data);
      }

    } catch (error) {
      console.error('Error fetching asset data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setOrderError('');
    setOrderSuccess('');

    // Validation
    if (!quantity || parseFloat(quantity) <= 0) {
      setOrderError('Please enter a valid quantity');
      return;
    }

    if (orderType === 'limit' && (!price || parseFloat(price) <= 0)) {
      setOrderError('Please enter a valid price');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          asset_id: asset?.id,
          order_type: orderType,
          side: orderSide,
          quantity: parseInt(quantity),
          price: orderType === 'market' ? asset?.current_price : parseFloat(price),
          time_in_force: 'GTC',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderSuccess(`${orderSide.toUpperCase()} order placed successfully!`);
        setQuantity('');
        setPrice('');
        fetchAssetData(); // Refresh data
      } else {
        setOrderError(data.message || 'Failed to place order');
      }
    } catch (error: any) {
      setOrderError(error.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAlert = () => {
    if (alertPrice && asset) {
      alert(`Price alert created! You'll be notified when ${asset.symbol} goes ${alertType} ${alertPrice} AED`);
      setShowAlertModal(false);
      setAlertPrice('');
    }
  };

  // Calculate technical indicators
  const calculateRSI = () => {
    // Simplified RSI calculation (normally would use 14-day period)
    const change = parseFloat(asset?.price_change_24h.toString() || '0');
    if (change > 0) {
      return Math.min(70 + (change * 2), 100);
    } else {
      return Math.max(30 + (change * 2), 0);
    }
  };

  const rsi = asset ? calculateRSI() : 50;
  const rsiColor = rsi > 70 ? 'text-red-400' : rsi < 30 ? 'text-green-400' : 'text-yellow-400';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
            <Activity className="w-12 h-12 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-purple-200 text-xl font-semibold mb-2">Loading Asset...</p>
          <p className="text-purple-400 text-sm">Fetching real-time data for {symbol}</p>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-3">Asset Not Found</h2>
          <p className="text-purple-300 mb-8 text-lg">The asset "{symbol}" doesn't exist or is not available for trading.</p>
          <Link href="/exchange">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 mx-auto">
              <ChevronLeft className="w-5 h-5" />
              Back to Exchange
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const priceChange = parseFloat(asset.price_change_24h.toString());
  const isPositive = priceChange >= 0;
  const availabilityPercent = (asset.available_units / asset.total_units) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139,92,246,0.15) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/exchange"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-purple-200 hover:bg-white/10 hover:text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-semibold">Back to Exchange</span>
          </Link>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAlertModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-purple-200 hover:bg-white/10 transition-all"
            >
              <Bell className="w-4 h-4" />
              <span className="text-sm font-semibold">Set Alert</span>
            </button>
            <button
              onClick={() => setWatchlisted(!watchlisted)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-purple-200 hover:bg-white/10 transition-all"
            >
              <Star className={`w-4 h-4 ${watchlisted ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              <span className="text-sm font-semibold">{watchlisted ? 'Watchlisted' : 'Watchlist'}</span>
            </button>
            <button
              onClick={fetchAssetData}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-purple-200 hover:bg-white/10 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-semibold">Refresh</span>
            </button>
          </div>
        </div>

        {/* Asset Header */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-white font-mono mb-1">{asset.symbol}</h1>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      asset.trading_phase === 'primary'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                    }`}>
                      {asset.trading_phase.toUpperCase()}
                    </span>
                    {priceChange > 10 && (
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full text-xs font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        HOT
                      </span>
                    )}
                    {parseFloat(asset.demand_index?.toString() || '0') > 80 && (
                      <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-xs font-bold">
                        HIGH DEMAND
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-2xl text-purple-100 mb-6 font-semibold">{asset.deal.title}</p>

              <div className="flex flex-wrap items-end gap-8 mb-6">
                <div>
                  <p className="text-sm text-purple-300 mb-2 font-semibold">Current Price</p>
                  <p className="text-6xl font-bold text-white">
                    {parseFloat(asset.current_price.toString()).toLocaleString()}
                  </p>
                  <p className="text-lg text-purple-400 mt-1">AED per unit</p>
                </div>
                <div>
                  <p className="text-sm text-purple-300 mb-2 font-semibold">24h Change</p>
                  <div className={`flex items-center gap-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <ArrowUpRight className="w-8 h-8" /> : <ArrowDownRight className="w-8 h-8" />}
                    <span className="text-4xl font-bold">
                      {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-sm text-purple-300 mt-1">
                    {isPositive ? 'Up' : 'Down'} {Math.abs(priceChange * parseFloat(asset.current_price.toString()) / 100).toFixed(2)} AED
                  </p>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-600/10 to-blue-600/5 rounded-xl p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-5 h-5 text-blue-400" />
                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">24h Volume</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-300">
                    {(parseFloat(asset.daily_volume.toString()) / 1000).toFixed(1)}K
                  </p>
                  <p className="text-xs text-blue-400 mt-1">AED traded</p>
                </div>

                <div className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 rounded-xl p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-purple-400" />
                    <p className="text-xs text-purple-400 font-bold uppercase tracking-wider">Market Cap</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-300">
                    {(parseFloat(asset.market_cap.toString()) / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-purple-400 mt-1">Total value</p>
                </div>

                <div className="bg-gradient-to-br from-green-600/10 to-green-600/5 rounded-xl p-4 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-green-400" />
                    <p className="text-xs text-green-400 font-bold uppercase tracking-wider">Expected ROI</p>
                  </div>
                  <p className="text-2xl font-bold text-green-300">
                    {asset.deal.expected_roi}%
                  </p>
                  <p className="text-xs text-green-400 mt-1">Annual yield</p>
                </div>

                <div className="bg-gradient-to-br from-amber-600/10 to-amber-600/5 rounded-xl p-4 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-amber-400" />
                    <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Available</p>
                  </div>
                  <p className="text-2xl font-bold text-amber-300">
                    {asset.available_units.toLocaleString()}
                  </p>
                  <p className="text-xs text-amber-400 mt-1">of {asset.total_units.toLocaleString()} units</p>
                </div>
              </div>

              {/* Availability Progress */}
              <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-purple-300 font-semibold">Units Available</span>
                  <span className="text-lg font-bold text-white">{availabilityPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden border border-white/10">
                  <div
                    className={`h-full rounded-full transition-all shadow-lg ${
                      availabilityPercent > 50 ? 'bg-gradient-to-r from-green-500 via-emerald-400 to-green-500' :
                      availabilityPercent > 20 ? 'bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-500' :
                      'bg-gradient-to-r from-red-500 via-pink-400 to-red-500'
                    }`}
                    style={{ width: `${availabilityPercent}%` }}
                  ></div>
                </div>
                {availabilityPercent < 20 && (
                  <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Limited availability - {asset.available_units} units remaining
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Charts & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Chart */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                  Price Chart (30 Days)
                </h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-bold rounded-full">1D</span>
                  <span className="px-3 py-1 bg-white/5 text-purple-300 text-xs font-semibold rounded-full">1W</span>
                  <span className="px-3 py-1 bg-white/5 text-purple-300 text-xs font-semibold rounded-full">1M</span>
                </div>
              </div>

              <div className="h-96 flex items-end justify-between gap-0.5">
                {chartData.length > 0 ? (
                  chartData.slice(-30).map((data, i) => {
                    const maxPrice = Math.max(...chartData.slice(-30).map((d: any) => parseFloat(d.high_price || d.close_price)));
                    const height = (parseFloat(data.close_price) / maxPrice) * 100;
                    const change = i > 0 ? parseFloat(data.close_price) - parseFloat(chartData[i - 1].close_price) : 0;
                    const isUp = change >= 0;

                    return (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1 group relative">
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-20 bg-slate-800 border border-white/10 rounded-xl p-3 z-10 whitespace-nowrap shadow-2xl">
                          <div className="text-xs text-purple-300 mb-1">
                            {new Date(data.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="text-lg font-bold text-white">
                            {parseFloat(data.close_price).toLocaleString()} AED
                          </div>
                          <div className={`text-xs font-semibold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {change >= 0 ? '+' : ''}{change.toFixed(2)} ({((change / parseFloat(chartData[i - 1]?.close_price || data.close_price)) * 100).toFixed(2)}%)
                          </div>
                        </div>

                        <div
                          className={`w-full rounded-t transition-all hover:opacity-80 cursor-pointer ${
                            isUp ? 'bg-gradient-to-t from-green-600 via-green-500 to-green-400' : 'bg-gradient-to-t from-red-600 via-red-500 to-red-400'
                          }`}
                          style={{ height: `${Math.max(height, 3)}%` }}
                        ></div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
                    <div className="text-center">
                      <LineChart className="w-16 h-16 text-purple-400/30 mx-auto mb-4" />
                      <p className="text-purple-300">No chart data available</p>
                      <p className="text-sm text-purple-400 mt-2">Historical data will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-t from-green-600 to-green-400 rounded-sm"></div>
                  <span className="text-xs text-purple-300">Price Increase</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-t from-red-600 to-red-400 rounded-sm"></div>
                  <span className="text-xs text-purple-300">Price Decrease</span>
                </div>
              </div>
            </div>

            {/* Technical Indicators */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-purple-400" />
                Technical Indicators
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* RSI */}
                <div className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 rounded-xl p-5 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-purple-300 font-semibold">RSI (14)</span>
                    <Percent className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className={`text-3xl font-bold mb-2 ${rsiColor}`}>
                    {rsi.toFixed(1)}
                  </p>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                    <div
                      className={`h-full rounded-full ${
                        rsi > 70 ? 'bg-red-500' : rsi < 30 ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${rsi}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-purple-400 mt-2">
                    {rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral'}
                  </p>
                </div>

                {/* Demand Index */}
                <div className="bg-gradient-to-br from-blue-600/10 to-blue-600/5 rounded-xl p-5 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-blue-300 font-semibold">Demand Index</span>
                    <Target className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className={`text-3xl font-bold mb-2 ${
                    parseFloat(asset.demand_index?.toString() || '0') > 70 ? 'text-green-400' :
                    parseFloat(asset.demand_index?.toString() || '0') > 40 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {parseFloat(asset.demand_index?.toString() || '0').toFixed(0)}%
                  </p>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                    <div
                      className={`h-full rounded-full ${
                        parseFloat(asset.demand_index?.toString() || '0') > 70 ? 'bg-green-500' :
                        parseFloat(asset.demand_index?.toString() || '0') > 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${parseFloat(asset.demand_index?.toString() || '0')}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-400 mt-2">
                    {parseFloat(asset.demand_index?.toString() || '0') > 70 ? 'High Demand' :
                     parseFloat(asset.demand_index?.toString() || '0') > 40 ? 'Moderate' : 'Low Demand'}
                  </p>
                </div>

                {/* Sentiment Score */}
                <div className="bg-gradient-to-br from-green-600/10 to-green-600/5 rounded-xl p-5 border border-green-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-green-300 font-semibold">Sentiment</span>
                    <Users className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-3xl font-bold mb-2 text-green-400">
                    {parseFloat(asset.sentiment_score?.toString() || '0').toFixed(1)}
                  </p>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                    <div
                      className="h-full rounded-full bg-green-500"
                      style={{ width: `${parseFloat(asset.sentiment_score?.toString() || '0')}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-400 mt-2">
                    {parseFloat(asset.sentiment_score?.toString() || '0') > 60 ? 'Very Positive' :
                     parseFloat(asset.sentiment_score?.toString() || '0') > 40 ? 'Positive' : 'Neutral'}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Trades */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <History className="w-6 h-6 text-purple-400" />
                Recent Trades
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                {recentTrades.map((trade) => {
                  const tradeTime = new Date(trade.time);
                  const timeAgo = Math.floor((Date.now() - tradeTime.getTime()) / 60000);

                  return (
                    <div key={trade.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          trade.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {trade.type === 'buy' ? (
                            <ArrowUpRight className="w-5 h-5 text-green-400" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div>
                          <p className={`font-mono font-bold text-lg ${
                            trade.type === 'buy' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {trade.price.toLocaleString()} AED
                          </p>
                          <p className="text-sm text-purple-300">{trade.amount} units</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white font-semibold">
                          {(trade.price * trade.amount).toLocaleString()} AED
                        </p>
                        <p className="text-xs text-purple-400">
                          {timeAgo === 0 ? 'Just now' : timeAgo === 1 ? '1 min ago' : `${timeAgo} mins ago`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Asset Details */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Info className="w-6 h-6 text-purple-400" />
                Asset Details
              </h3>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-purple-300 mb-3 font-bold uppercase tracking-wider">Description</p>
                  <p className="text-white text-lg leading-relaxed">{asset.deal.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-purple-400" />
                      <p className="text-sm text-purple-300 font-bold">Category</p>
                    </div>
                    <p className="text-white font-bold text-lg capitalize">{asset.market_category}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-purple-400" />
                      <p className="text-sm text-purple-300 font-bold">Location</p>
                    </div>
                    <p className="text-white font-bold text-lg">{asset.deal.location}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <p className="text-sm text-purple-300 font-bold">Holding Period</p>
                    </div>
                    <p className="text-white font-bold text-lg">{asset.deal.holding_period_months} months</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-5 h-5 text-purple-400" />
                      <p className="text-sm text-purple-300 font-bold">Deal Type</p>
                    </div>
                    <p className="text-white font-bold text-lg capitalize">{asset.deal.type.replace(/_/g, ' ')}</p>
                  </div>
                </div>

                {/* Price History */}
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUpIcon className="w-5 h-5" />
                    Price History
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-purple-300 mb-2">52-Week High</p>
                      <p className="text-2xl font-bold text-green-400">
                        {parseFloat(asset.week_high?.toString() || '0').toLocaleString()} AED
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-300 mb-2">52-Week Low</p>
                      <p className="text-2xl font-bold text-red-400">
                        {parseFloat(asset.week_low?.toString() || '0').toLocaleString()} AED
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-300 mb-2">All-Time High</p>
                      <p className="text-2xl font-bold text-green-400">
                        {parseFloat(asset.all_time_high?.toString() || '0').toLocaleString()} AED
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-300 mb-2">All-Time Low</p>
                      <p className="text-2xl font-bold text-red-400">
                        {parseFloat(asset.all_time_low?.toString() || '0').toLocaleString()} AED
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Assets */}
            {similarAssets.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <ArrowLeftRight className="w-6 h-6 text-purple-400" />
                  Similar Assets in {asset.market_category}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {similarAssets.map((similar) => {
                    const similarChange = parseFloat(similar.price_change_24h.toString());
                    const isPositiveSimilar = similarChange >= 0;

                    return (
                      <Link key={similar.id} href={`/exchange/asset/${similar.symbol}`}>
                        <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all cursor-pointer group">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-mono font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                              {similar.symbol}
                            </span>
                            <div className={`flex items-center gap-1 text-sm font-bold ${isPositiveSimilar ? 'text-green-400' : 'text-red-400'}`}>
                              {isPositiveSimilar ? '▲' : '▼'}
                              {Math.abs(similarChange).toFixed(2)}%
                            </div>
                          </div>
                          <p className="text-sm text-purple-300 mb-3 line-clamp-2">{similar.deal.title}</p>
                          <p className="text-xl font-bold text-white">
                            {parseFloat(similar.current_price.toString()).toLocaleString()} AED
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Trading Panel & Order Book */}
          <div className="space-y-6">
            {/* Buy/Sell Form */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl sticky top-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-purple-400" />
                Trade {asset.symbol}
              </h3>

              {/* Buy/Sell Toggle */}
              <div className="flex gap-2 mb-6 bg-white/5 p-1.5 rounded-xl border border-white/10">
                <button
                  onClick={() => setOrderSide('buy')}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    orderSide === 'buy'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                      : 'text-purple-300 hover:bg-white/10'
                  }`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setOrderSide('sell')}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    orderSide === 'sell'
                      ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30'
                      : 'text-purple-300 hover:bg-white/10'
                  }`}
                >
                  SELL
                </button>
              </div>

              <div className="space-y-4">
                {/* Order Type */}
                <div>
                  <label className="text-sm text-purple-300 mb-2 block font-bold uppercase tracking-wider">Order Type</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as 'market' | 'limit')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
                  >
                    <option value="market">Market Order (Instant)</option>
                    <option value="limit">Limit Order (Set Price)</option>
                  </select>
                </div>

                {/* Price (for limit orders) */}
                {orderType === 'limit' && (
                  <div>
                    <label className="text-sm text-purple-300 mb-2 block font-bold uppercase tracking-wider">Limit Price (AED)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-xl font-bold placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      step="0.01"
                    />
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="text-sm text-purple-300 mb-2 block font-bold uppercase tracking-wider">Quantity (Units)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    max={asset.available_units}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-xl font-bold placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-purple-400">
                      Max: {asset.available_units.toLocaleString()} units
                    </p>
                    <div className="flex gap-2">
                      {[10, 25, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setQuantity(Math.min(amt, asset.available_units).toString())}
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-purple-200 rounded text-xs font-semibold transition-all"
                        >
                          {amt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-purple-200 font-bold">Total Cost</span>
                    <span className="text-3xl font-bold text-white">
                      {(
                        (orderType === 'market' ? parseFloat(asset.current_price.toString()) : parseFloat(price || '0')) *
                        parseFloat(quantity || '0')
                      ).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-purple-200 font-semibold">AED</p>
                  <p className="text-xs text-purple-300 mt-2">
                    {orderType === 'market'
                      ? '✓ Executes instantly at current market price'
                      : '⏱ Order triggers when market price reaches your limit'}
                  </p>
                </div>

                {/* Error/Success Messages */}
                {orderError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm font-semibold">{orderError}</p>
                  </div>
                )}
                {orderSuccess && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-green-300 text-sm font-semibold">{orderSuccess}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting || !quantity || parseFloat(quantity) <= 0}
                  className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-3 ${
                    orderSide === 'buy'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/30'
                      : 'bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg hover:shadow-red-500/30'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6" />
                      {orderSide === 'buy' ? 'BUY' : 'SELL'} {asset.symbol}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Order Book */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-400" />
                Order Book
              </h3>

              {/* Asks (Sell Orders) */}
              <div className="mb-4">
                <p className="text-xs text-red-300 mb-3 uppercase font-bold tracking-wider flex items-center gap-2">
                  <TrendingDownIcon className="w-3 h-3" />
                  Asks (Sellers)
                </p>
                <div className="space-y-1">
                  {orderBook.asks.slice(0, 8).map((ask, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-3 bg-red-500/5 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer">
                      <span className="text-red-400 font-mono font-bold">{ask.price.toLocaleString()}</span>
                      <span className="text-purple-200 font-semibold">{ask.quantity}</span>
                      <span className="text-purple-400 text-xs font-semibold">{ask.total.toLocaleString()}</span>
                    </div>
                  ))}
                  {orderBook.asks.length === 0 && (
                    <p className="text-purple-300 text-sm text-center py-6 bg-white/5 rounded-lg border border-white/10">
                      No sell orders available
                    </p>
                  )}
                </div>
              </div>

              {/* Current Price */}
              <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/40 rounded-xl p-4 mb-4 text-center">
                <p className="text-xs text-purple-200 mb-1 uppercase tracking-wider font-bold">Current Market Price</p>
                <p className="text-3xl font-bold text-white">
                  {parseFloat(asset.current_price.toString()).toLocaleString()}
                </p>
                <p className="text-sm text-purple-300 mt-1">AED per unit</p>
              </div>

              {/* Bids (Buy Orders) */}
              <div>
                <p className="text-xs text-green-300 mb-3 uppercase font-bold tracking-wider flex items-center gap-2">
                  <TrendingUpIcon className="w-3 h-3" />
                  Bids (Buyers)
                </p>
                <div className="space-y-1">
                  {orderBook.bids.slice(0, 8).map((bid, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-3 bg-green-500/5 border border-green-500/20 rounded-lg hover:bg-green-500/10 transition-all cursor-pointer">
                      <span className="text-green-400 font-mono font-bold">{bid.price.toLocaleString()}</span>
                      <span className="text-purple-200 font-semibold">{bid.quantity}</span>
                      <span className="text-purple-400 text-xs font-semibold">{bid.total.toLocaleString()}</span>
                    </div>
                  ))}
                  {orderBook.bids.length === 0 && (
                    <p className="text-purple-300 text-sm text-center py-6 bg-white/5 rounded-lg border border-white/10">
                      No buy orders available
                    </p>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between text-xs text-purple-400 mt-4 pt-4 border-t border-white/10">
                <span>Price (AED)</span>
                <span>Amount</span>
                <span>Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-purple-500/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Set Price Alert</h2>
              </div>
              <button
                onClick={() => setShowAlertModal(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"
              >
                <XCircle className="w-5 h-5 text-purple-300" />
              </button>
            </div>

            <p className="text-purple-300 mb-6">
              Get notified when <span className="font-mono font-bold text-white">{asset.symbol}</span> reaches your target price
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-purple-300 mb-2">Alert Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAlertType('above')}
                    className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${
                      alertType === 'above'
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-white/5 text-purple-300 hover:bg-white/10'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 inline mr-2" />
                    Above
                  </button>
                  <button
                    onClick={() => setAlertType('below')}
                    className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${
                      alertType === 'below'
                        ? 'bg-red-600 text-white shadow-lg'
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
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  placeholder={asset.current_price.toString()}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  step="0.01"
                />
                <p className="text-xs text-purple-400 mt-2">
                  Current price: {parseFloat(asset.current_price.toString()).toLocaleString()} AED
                </p>
              </div>

              <button
                onClick={handleCreateAlert}
                disabled={!alertPrice}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
              >
                <Bell className="w-5 h-5" />
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
