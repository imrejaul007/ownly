'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Wallet,
  BarChart3,
  Package,
  PieChart,
  ChevronLeft,
  Eye,
  AlertCircle,
} from 'lucide-react';

interface PortfolioHolding {
  id: string;
  asset_id: string;
  quantity: number;
  total_invested: number;
  average_buy_price: number;
  realized_gain: number;
  roi_received: number;
  current_value: number;
  unrealized_gain: number;
  unrealized_gain_percent: number;
  asset: {
    symbol: string;
    current_price: number;
    market_category: string;
    price_change_24h: number;
    deal: {
      title: string;
      images?: string[];
    };
  };
}

interface PortfolioSummary {
  total_invested: number;
  total_current_value: number;
  total_unrealized_gain: number;
  total_realized_gain: number;
  total_roi_received: number;
  total_gain: number;
  total_return_percent: number;
}

export default function ExchangePortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary>({
    total_invested: 0,
    total_current_value: 0,
    total_unrealized_gain: 0,
    total_realized_gain: 0,
    total_roi_received: 0,
    total_gain: 0,
    total_return_percent: 0,
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const [portfolioRes, ordersRes, tradesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/portfolio`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/orders?limit=10`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exchange/trades?limit=10`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const [portfolioData, ordersData, tradesData] = await Promise.all([
        portfolioRes.json(),
        ordersRes.json(),
        tradesRes.json(),
      ]);

      if (portfolioData.success) {
        setHoldings(portfolioData.data.holdings);
        setSummary(portfolioData.data.summary);
      }

      if (ordersData.success) {
        setOrders(ordersData.data);
      }

      if (tradesData.success) {
        setTrades(tradesData.data);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      franchise: 'from-purple-500 to-pink-500',
      property: 'from-blue-500 to-cyan-500',
      luxury: 'from-yellow-500 to-orange-500',
      inventory: 'from-green-500 to-emerald-500',
      equity: 'from-indigo-500 to-purple-500',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  const totalReturn = summary.total_return_percent;
  const isPositive = totalReturn >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/exchange"
          className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Exchange
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Exchange Portfolio</h1>
          <p className="text-purple-200">Track your investments, P&L, and trading activity</p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Value */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-200">Portfolio Value</span>
              <Wallet className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              AED {summary.total_current_value.toLocaleString()}
            </p>
            <p className="text-sm text-purple-300">
              Invested: AED {summary.total_invested.toLocaleString()}
            </p>
          </div>

          {/* Total Return */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-200">Total Return</span>
              {isPositive ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
            </div>
            <p className={`text-3xl font-bold mb-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{totalReturn.toFixed(2)}%
            </p>
            <p className="text-sm text-purple-300">
              AED {summary.total_gain.toLocaleString()} gain
            </p>
          </div>

          {/* Unrealized Gain */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-200">Unrealized P&L</span>
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <p className={`text-3xl font-bold mb-1 ${summary.total_unrealized_gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {summary.total_unrealized_gain >= 0 ? '+' : ''}AED {summary.total_unrealized_gain.toLocaleString()}
            </p>
            <p className="text-sm text-purple-300">Paper gains/losses</p>
          </div>

          {/* Realized Gains + ROI */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-200">Cash Received</span>
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-green-400 mb-1">
              +AED {(summary.total_realized_gain + summary.total_roi_received).toLocaleString()}
            </p>
            <p className="text-sm text-purple-300">
              Realized + ROI payouts
            </p>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-purple-400" />
              Holdings
            </h2>
            <span className="text-purple-300">{holdings.length} Assets</span>
          </div>

          {holdings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-purple-300">Asset</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-purple-300">Quantity</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-purple-300">Avg Buy Price</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-purple-300">Current Price</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-purple-300">Invested</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-purple-300">Current Value</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-purple-300">Unrealized P&L</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-purple-300">ROI Received</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-purple-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding) => {
                    const plIsPositive = holding.unrealized_gain >= 0;
                    return (
                      <tr
                        key={holding.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-mono font-bold text-white">{holding.asset.symbol}</p>
                            <p className="text-xs text-purple-300">{holding.asset.deal.title}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-white font-semibold">{holding.quantity}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-purple-200">
                            AED {parseFloat(holding.average_buy_price.toString()).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div>
                            <p className="text-white font-semibold">
                              AED {parseFloat(holding.asset.current_price.toString()).toLocaleString()}
                            </p>
                            <p className={`text-xs ${holding.asset.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {holding.asset.price_change_24h >= 0 ? '+' : ''}{holding.asset.price_change_24h.toFixed(2)}%
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-purple-200">
                            AED {parseFloat(holding.total_invested.toString()).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-white font-semibold">
                            AED {holding.current_value.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div>
                            <p className={`font-semibold ${plIsPositive ? 'text-green-400' : 'text-red-400'}`}>
                              {plIsPositive ? '+' : ''}AED {holding.unrealized_gain.toLocaleString()}
                            </p>
                            <p className={`text-xs ${plIsPositive ? 'text-green-400' : 'text-red-400'}`}>
                              {plIsPositive ? '+' : ''}{holding.unrealized_gain_percent.toFixed(2)}%
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-green-400 font-semibold">
                            +AED {parseFloat(holding.roi_received.toString()).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Link
                            href={`/exchange/asset/${holding.asset.symbol}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Trade
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">No Holdings Yet</h3>
              <p className="text-purple-300 mb-6">Start trading to build your portfolio</p>
              <Link href="/exchange" className="btn-primary">
                Browse Exchange
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Recent Orders</h3>
            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">{order.asset?.symbol}</p>
                      <p className="text-xs text-purple-300">
                        {order.side.toUpperCase()} {order.quantity} @ AED {parseFloat(order.price).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        order.status === 'filled'
                          ? 'bg-green-500/20 text-green-300'
                          : order.status === 'open'
                          ? 'bg-blue-500/20 text-blue-300'
                          : order.status === 'cancelled'
                          ? 'bg-gray-500/20 text-gray-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-purple-300 text-center py-4">No recent orders</p>
            )}
          </div>

          {/* Recent Trades */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Recent Trades</h3>
            {trades.length > 0 ? (
              <div className="space-y-3">
                {trades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">{trade.asset?.symbol}</p>
                      <p className="text-xs text-purple-300">
                        {trade.quantity} units @ AED {parseFloat(trade.price).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        AED {(parseFloat(trade.price) * trade.quantity).toLocaleString()}
                      </p>
                      <p className="text-xs text-purple-300">
                        {new Date(trade.executed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-purple-300 text-center py-4">No recent trades</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
