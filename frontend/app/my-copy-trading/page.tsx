'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Calendar,
  BarChart3,
  Activity,
  XCircle,
  Eye,
  ArrowLeft
} from 'lucide-react';

interface Trader {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  copyTraderProfile: {
    total_return: number;
    monthly_return: number;
    win_rate: number;
    risk_level: string;
  };
}

interface CopyFollowing {
  id: string;
  copy_type: string;
  copy_amount: number;
  total_copied_investments: number;
  total_profit_loss: number;
  auto_reinvest: boolean;
  stop_loss_percentage: number;
  started_at: string;
  trader: Trader;
  bundle?: {
    id: string;
    name: string;
    description: string;
  };
  deal?: {
    id: string;
    title: string;
    type: string;
  };
  copyTrades: any[];
}

export default function MyCopyTradingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState<CopyFollowing[]>([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [selectedCopy, setSelectedCopy] = useState<CopyFollowing | null>(null);
  const [showStopModal, setShowStopModal] = useState(false);

  useEffect(() => {
    fetchCopyTradingData();
  }, []);

  const fetchCopyTradingData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5001/api/copy-trading/my-following', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setFollowing(data.data.following);
        setTotalInvested(parseFloat(data.data.totalInvested));
      }
    } catch (error) {
      console.error('Error fetching copy trading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStopCopying = async (copyId: string) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`http://localhost:5001/api/copy-trading/stop/${copyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setShowStopModal(false);
        setSelectedCopy(null);
        fetchCopyTradingData();
      }
    } catch (error) {
      console.error('Error stopping copy:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `AED ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'high': return 'bg-red-500/10 border-red-500/30 text-red-400';
      default: return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
    }
  };

  const getCopyTypeLabel = (type: string) => {
    switch (type) {
      case 'full_profile': return 'Full Profile';
      case 'bundle': return 'Bundle';
      case 'individual_deal': return 'Individual Deal';
      default: return type;
    }
  };

  // Calculate summary stats
  const totalProfitLoss = following.reduce((sum, f) => sum + parseFloat(f.total_profit_loss?.toString() || '0'), 0);
  const totalCopiedInvestments = following.reduce((sum, f) => sum + (f.total_copied_investments || 0), 0);
  const avgReturn = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading your copy trading portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20 lg:pb-8">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-purple-300 hover:text-white mb-6 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Copy Trading</h1>
          <p className="text-purple-300">Track all your copied traders and their performance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-purple-300 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">Active Copies</span>
            </div>
            <div className="text-3xl font-bold text-white">{following.length}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-blue-300 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm">Total Invested</span>
            </div>
            <div className="text-3xl font-bold text-white">{formatCurrency(totalInvested)}</div>
          </div>

          <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${totalProfitLoss >= 0 ? '' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
              {totalProfitLoss >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <span className={`text-sm ${totalProfitLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                Total P/L
              </span>
            </div>
            <div className={`text-3xl font-bold ${totalProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(totalProfitLoss)}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-orange-300 mb-2">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm">Avg Return</span>
            </div>
            <div className={`text-3xl font-bold ${avgReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {avgReturn >= 0 ? '+' : ''}{avgReturn.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Copy Trading List */}
        {following.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <Activity className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Active Copy Trading</h3>
            <p className="text-purple-300 mb-6">You're not currently copying any traders</p>
            <button
              onClick={() => router.push('/copy-trading')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:scale-105 transition-all"
            >
              Browse Traders
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {following.map((copy) => {
              const profitLoss = parseFloat(copy.total_profit_loss?.toString() || '0');
              const returnPct = copy.copy_amount > 0 ? (profitLoss / copy.copy_amount) * 100 : 0;
              const daysSince = Math.floor((new Date().getTime() - new Date(copy.started_at).getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div key={copy.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{copy.trader.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(copy.trader.copyTraderProfile.risk_level)}`}>
                            {copy.trader.copyTraderProfile.risk_level.toUpperCase()} RISK
                          </span>
                          <span className="text-xs text-purple-300">
                            {getCopyTypeLabel(copy.copy_type)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCopy(copy);
                        setShowStopModal(true);
                      }}
                      className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Stop Copying
                    </button>
                  </div>

                  {/* Copy Details */}
                  {copy.copy_type === 'bundle' && copy.bundle && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                      <div className="text-sm text-blue-300 mb-1">Copying Bundle</div>
                      <div className="text-white font-semibold">{copy.bundle.name}</div>
                      <div className="text-xs text-blue-200 mt-1">{copy.bundle.description}</div>
                    </div>
                  )}

                  {copy.copy_type === 'individual_deal' && copy.deal && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                      <div className="text-sm text-green-300 mb-1">Copying Deal</div>
                      <div className="text-white font-semibold">{copy.deal.title}</div>
                      <div className="text-xs text-green-200 mt-1 capitalize">{copy.deal.type.replace('_', ' ')}</div>
                    </div>
                  )}

                  {/* Performance Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-purple-300 mb-1">Copy Amount</div>
                      <div className="text-white font-semibold">{formatCurrency(copy.copy_amount)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-purple-300 mb-1">Profit/Loss</div>
                      <div className={`font-semibold ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {profitLoss >= 0 ? '+' : ''}{formatCurrency(profitLoss)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-purple-300 mb-1">Return</div>
                      <div className={`font-semibold ${returnPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {returnPct >= 0 ? '+' : ''}{returnPct.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-purple-300 mb-1">Copied Trades</div>
                      <div className="text-white font-semibold">{copy.total_copied_investments || 0}</div>
                    </div>
                    <div>
                      <div className="text-xs text-purple-300 mb-1">Days Active</div>
                      <div className="text-white font-semibold">{daysSince}</div>
                    </div>
                  </div>

                  {/* Trader Performance */}
                  <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                    <div className="text-sm text-purple-300">Trader Performance:</div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-green-300">Total Return:</span>
                      <span className="text-sm font-semibold text-green-400">+{copy.trader.copyTraderProfile.total_return}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-blue-300">Win Rate:</span>
                      <span className="text-sm font-semibold text-blue-400">{copy.trader.copyTraderProfile.win_rate}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-purple-300">Started:</span>
                      <span className="text-sm font-semibold text-white">{formatDate(copy.started_at)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stop Copying Modal */}
      {showStopModal && selectedCopy && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Stop Copying Trader?</h2>
            <p className="text-purple-300 mb-6">
              Are you sure you want to stop copying <span className="text-white font-semibold">{selectedCopy.trader.name}</span>?
              This will stop automatic copying of their future trades.
            </p>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <div className="text-sm text-red-300 mb-2">Your current copied investments will remain active.</div>
              <div className="text-xs text-red-200">You can manage them separately from your investments page.</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStopModal(false);
                  setSelectedCopy(null);
                }}
                className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStopCopying(selectedCopy.id)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                Stop Copying
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
