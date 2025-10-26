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
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [watchlisted, setWatchlisted] = useState(false);

  // Order form state
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');

  useEffect(() => {
    if (symbol) {
      fetchAssetData();
      // Refresh data every 10 seconds
      const interval = setInterval(fetchAssetData, 10000);
      return () => clearInterval(interval);
    }
  }, [symbol]);

  const fetchAssetData = async () => {
    try {
      // Fetch all data in parallel
      const [assetRes, orderBookRes, tradesRes, chartRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/assets?limit=100`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/assets/${symbol}/orderbook?depth=15`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/assets?limit=100`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/assets/${symbol}/chart?interval=1d&limit=30`),
      ]);

      const [assetData, orderBookData, tradesData, chartDataRes] = await Promise.all([
        assetRes.json(),
        orderBookRes.json(),
        tradesRes.json(),
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
        }
      }

      if (orderBookData.success) {
        setOrderBook(orderBookData.data);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading Asset...</p>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Asset Not Found</h2>
          <p className="text-purple-300 mb-6">The asset you're looking for doesn't exist.</p>
          <Link href="/exchange">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all">
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
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button & Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/exchange"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Exchange</span>
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => setWatchlisted(!watchlisted)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-purple-200 hover:bg-white/10 transition-all"
            >
              <Star className={`w-4 h-4 ${watchlisted ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              <span className="text-sm">{watchlisted ? 'Watchlisted' : 'Add to Watchlist'}</span>
            </button>
            <button
              onClick={fetchAssetData}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 text-purple-200 hover:bg-white/10 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Asset Header */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold text-white font-mono">{asset.symbol}</h1>
                <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                  asset.trading_phase === 'primary'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : asset.trading_phase === 'secondary'
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                }`}>
                  {asset.trading_phase}
                </span>
                {priceChange > 10 && (
                  <span className="px-3 py-1.5 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    Hot
                  </span>
                )}
              </div>
              <p className="text-2xl text-purple-100 mb-6">{asset.deal.title}</p>

              <div className="flex flex-wrap items-end gap-8 mb-6">
                <div>
                  <p className="text-sm text-purple-300 mb-2">Current Price</p>
                  <p className="text-5xl font-bold text-white">
                    {parseFloat(asset.current_price.toString()).toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-400 mt-1">AED</p>
                </div>
                <div>
                  <p className="text-sm text-purple-300 mb-2">24h Change</p>
                  <div className={`flex items-center gap-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                    <span className="text-3xl font-bold">
                      {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-blue-600/10 rounded-xl p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <p className="text-xs text-blue-400 font-semibold">24h Volume</p>
                  </div>
                  <p className="text-lg font-bold text-blue-300">
                    {(parseFloat(asset.daily_volume.toString()) / 1000).toFixed(1)}K
                  </p>
                </div>
                <div className="bg-purple-600/10 rounded-xl p-4 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-purple-400" />
                    <p className="text-xs text-purple-400 font-semibold">Market Cap</p>
                  </div>
                  <p className="text-lg font-bold text-purple-300">
                    {(parseFloat(asset.market_cap.toString()) / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div className="bg-green-600/10 rounded-xl p-4 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-green-400" />
                    <p className="text-xs text-green-400 font-semibold">Expected ROI</p>
                  </div>
                  <p className="text-lg font-bold text-green-300">
                    {asset.deal.expected_roi}% APY
                  </p>
                </div>
                <div className="bg-amber-600/10 rounded-xl p-4 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-amber-400" />
                    <p className="text-xs text-amber-400 font-semibold">Available</p>
                  </div>
                  <p className="text-lg font-bold text-amber-300">
                    {asset.available_units.toLocaleString()}
                  </p>
                  <p className="text-xs text-amber-400 mt-1">of {asset.total_units.toLocaleString()}</p>
                </div>
              </div>

              {/* Availability Bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-purple-300">Availability</span>
                  <span className="text-sm font-bold text-white">{availabilityPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
                  <div
                    className={`h-full rounded-full transition-all ${
                      availabilityPercent > 50 ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                      availabilityPercent > 20 ? 'bg-gradient-to-r from-yellow-500 to-orange-400' :
                      'bg-gradient-to-r from-red-500 to-red-400'
                    }`}
                    style={{ width: `${availabilityPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Trading Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Chart & Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Chart */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                Price Chart (30 Days)
              </h3>
              <div className="h-96 flex items-end justify-between gap-1">
                {chartData.length > 0 ? (
                  chartData.slice(-30).map((data, i) => {
                    const maxPrice = Math.max(...chartData.slice(-30).map((d: any) => parseFloat(d.high_price || d.close_price)));
                    const height = (parseFloat(data.close_price) / maxPrice) * 100;
                    const change = i > 0 ? parseFloat(data.close_price) - parseFloat(chartData[i - 1].close_price) : 0;
                    const isUp = change >= 0;

                    return (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1 group relative">
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-16 bg-slate-800 border border-white/10 rounded-lg p-2 z-10 whitespace-nowrap shadow-xl">
                          <div className="text-xs text-purple-300">
                            {new Date(data.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-sm font-bold text-white">
                            {parseFloat(data.close_price).toLocaleString()} AED
                          </div>
                        </div>

                        <div
                          className={`w-full rounded-t transition-all hover:opacity-80 ${
                            isUp ? 'bg-gradient-to-t from-green-600 to-green-400' : 'bg-gradient-to-t from-red-600 to-red-400'
                          }`}
                          style={{ height: `${Math.max(height, 2)}%` }}
                        ></div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full flex items-center justify-center">
                    <p className="text-purple-300">No chart data available</p>
                  </div>
                )}
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
                  <p className="text-sm text-purple-300 mb-2 font-semibold">Description</p>
                  <p className="text-white text-lg leading-relaxed">{asset.deal.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-purple-400" />
                      <p className="text-sm text-purple-300 font-semibold">Category</p>
                    </div>
                    <p className="text-white font-semibold capitalize">{asset.market_category}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <p className="text-sm text-purple-300 font-semibold">Location</p>
                    </div>
                    <p className="text-white font-semibold">{asset.deal.location}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <p className="text-sm text-purple-300 font-semibold">Holding Period</p>
                    </div>
                    <p className="text-white font-semibold">{asset.deal.holding_period_months} months</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-4 h-4 text-purple-400" />
                      <p className="text-sm text-purple-300 font-semibold">Deal Type</p>
                    </div>
                    <p className="text-white font-semibold capitalize">{asset.deal.type.replace(/_/g, ' ')}</p>
                  </div>
                </div>

                {/* Price History */}
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Price History</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-purple-300 mb-1">52-Week High</p>
                      <p className="text-xl font-bold text-green-400">
                        {parseFloat(asset.week_high?.toString() || '0').toLocaleString()} AED
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-300 mb-1">52-Week Low</p>
                      <p className="text-xl font-bold text-red-400">
                        {parseFloat(asset.week_low?.toString() || '0').toLocaleString()} AED
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-300 mb-1">All-Time High</p>
                      <p className="text-xl font-bold text-green-400">
                        {parseFloat(asset.all_time_high?.toString() || '0').toLocaleString()} AED
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-300 mb-1">All-Time Low</p>
                      <p className="text-xl font-bold text-red-400">
                        {parseFloat(asset.all_time_low?.toString() || '0').toLocaleString()} AED
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Trading & Order Book */}
          <div className="space-y-6">
            {/* Buy/Sell Form */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl sticky top-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-purple-400" />
                Trade {asset.symbol}
              </h3>

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setOrderSide('buy')}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    orderSide === 'buy'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                      : 'bg-white/5 text-purple-300 hover:bg-white/10'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setOrderSide('sell')}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    orderSide === 'sell'
                      ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30'
                      : 'bg-white/5 text-purple-300 hover:bg-white/10'
                  }`}
                >
                  Sell
                </button>
              </div>

              <div className="space-y-4">
                {/* Order Type */}
                <div>
                  <label className="text-sm text-purple-300 mb-2 block font-semibold">Order Type</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as 'market' | 'limit')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="market">Market Order (Instant)</option>
                    <option value="limit">Limit Order (Set Price)</option>
                  </select>
                </div>

                {/* Price (for limit orders) */}
                {orderType === 'limit' && (
                  <div>
                    <label className="text-sm text-purple-300 mb-2 block font-semibold">Limit Price (AED)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-lg font-semibold placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="text-sm text-purple-300 mb-2 block font-semibold">Quantity (Units)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    max={asset.available_units}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-lg font-semibold placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-purple-400 mt-1">
                    Max: {asset.available_units.toLocaleString()} units available
                  </p>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-purple-200 font-semibold">Total Cost</span>
                    <span className="text-2xl font-bold text-white">
                      {(
                        (orderType === 'market' ? parseFloat(asset.current_price.toString()) : parseFloat(price || '0')) *
                        parseFloat(quantity || '0')
                      ).toLocaleString()} AED
                    </span>
                  </div>
                  <p className="text-xs text-purple-300">
                    {orderType === 'market'
                      ? 'Executed instantly at current market price'
                      : 'Order triggers when market price reaches your limit'}
                  </p>
                </div>

                {/* Error/Success Messages */}
                {orderError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm">{orderError}</p>
                  </div>
                )}
                {orderSuccess && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-green-300 text-sm">{orderSuccess}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting || !quantity || parseFloat(quantity) <= 0}
                  className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-2 ${
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
                      <Zap className="w-5 h-5" />
                      {orderSide === 'buy' ? 'Buy' : 'Sell'} {asset.symbol}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Order Book */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-purple-400" />
                Order Book
              </h3>

              {/* Asks (Sell Orders) */}
              <div className="mb-6">
                <p className="text-xs text-purple-300 mb-3 uppercase font-bold tracking-wider">Asks (Sellers)</p>
                <div className="space-y-2">
                  {orderBook.asks.slice(0, 5).map((ask, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-3 bg-red-500/5 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all">
                      <span className="text-red-400 font-mono font-bold">{ask.price.toLocaleString()}</span>
                      <span className="text-purple-200 font-semibold">{ask.quantity} units</span>
                    </div>
                  ))}
                  {orderBook.asks.length === 0 && (
                    <p className="text-purple-300 text-sm text-center py-4 bg-white/5 rounded-lg">No sell orders</p>
                  )}
                </div>
              </div>

              {/* Current Price */}
              <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/30 rounded-xl p-4 mb-6 text-center">
                <p className="text-xs text-purple-200 mb-1 uppercase tracking-wider font-semibold">Market Price</p>
                <p className="text-3xl font-bold text-white">
                  {parseFloat(asset.current_price.toString()).toLocaleString()} AED
                </p>
              </div>

              {/* Bids (Buy Orders) */}
              <div>
                <p className="text-xs text-purple-300 mb-3 uppercase font-bold tracking-wider">Bids (Buyers)</p>
                <div className="space-y-2">
                  {orderBook.bids.slice(0, 5).map((bid, i) => (
                    <div key={i} className="flex justify-between items-center text-sm p-3 bg-green-500/5 border border-green-500/20 rounded-lg hover:bg-green-500/10 transition-all">
                      <span className="text-green-400 font-mono font-bold">{bid.price.toLocaleString()}</span>
                      <span className="text-purple-200 font-semibold">{bid.quantity} units</span>
                    </div>
                  ))}
                  {orderBook.bids.length === 0 && (
                    <p className="text-purple-300 text-sm text-center py-4 bg-white/5 rounded-lg">No buy orders</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
