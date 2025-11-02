'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { usePreferences } from '@/context/PreferencesContext';
import {
  ArrowLeft, CheckCircle, Trophy, TrendingUp, Users, Activity, DollarSign,
  Target, Shield, Copy, Settings, BarChart3, Calendar, Award, Flame,
  Building, Store, Rocket, Star, AlertCircle, Zap, UserPlus, X
} from 'lucide-react';

export default function TraderProfilePage() {
  const { formatCurrency } = usePreferences();
  const params = useParams();
  const router = useRouter();
  const [copyAmount, setCopyAmount] = useState(5000);
  const [autoReinvest, setAutoReinvest] = useState(true);
  const [stopLoss, setStopLoss] = useState(20);
  const [showCopyModal, setShowCopyModal] = useState(false);

  // Mock trader data - in real app, fetch based on params.id
  const trader = {
    id: params.id,
    name: 'Ahmed Al Mansoori',
    username: '@realEstatePro',
    avatar: 'A',
    verified: true,
    rank: 1,
    totalReturn: 156.8,
    monthlyReturn: 12.4,
    yearlyReturn: 148.8,
    copiers: 1247,
    totalInvested: 2450000,
    winRate: 94,
    activeDeals: 18,
    riskLevel: 'medium',
    specialty: ['Real Estate', 'Commercial'],
    joinedDate: '2023-01',
    minCopyAmount: 5000,
    avgHoldingPeriod: '18 months',
    totalTrades: 156,
    profitableTrades: 147,
    bio: 'Real estate investment specialist with 8+ years of experience in commercial properties across UAE. Focus on high-yield properties with strong fundamentals.',
  };

  const portfolioComposition = [
    { type: 'Real Estate', percentage: 65, color: 'bg-blue-500' },
    { type: 'Franchises', percentage: 25, color: 'bg-green-500' },
    { type: 'Startups', percentage: 10, color: 'bg-orange-500' },
  ];

  const recentTrades = [
    { id: 1, deal: 'Dubai Marina Tower', type: 'real_estate', return: 28.5, status: 'active' },
    { id: 2, deal: 'Business Bay Office', type: 'real_estate', return: 32.1, status: 'completed' },
    { id: 3, deal: 'Retail Mall Unit', type: 'real_estate', return: 19.8, status: 'active' },
    { id: 4, deal: 'Coffee Shop Franchise', type: 'franchise', return: 35.2, status: 'completed' },
    { id: 5, deal: 'Warehouse Complex', type: 'real_estate', return: 24.7, status: 'active' },
  ];

  const performanceData = [
    { month: 'Jan', return: 8.2 },
    { month: 'Feb', return: 12.5 },
    { month: 'Mar', return: 10.8 },
    { month: 'Apr', return: 15.3 },
    { month: 'May', return: 11.7 },
    { month: 'Jun', return: 13.9 },
  ];

  const handleStartCopying = () => {
    setShowCopyModal(true);
  };

  const confirmCopy = () => {
    // Handle copy confirmation
    alert(`Successfully started copying ${trader.name} with ${formatCurrency(copyAmount)}`);
    setShowCopyModal(false);
  };

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
          Back to Traders
        </button>

        {/* Trader Header */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {trader.avatar}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{trader.name}</h1>
                  {trader.verified && (
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                  )}
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-yellow-400 font-semibold">Rank #{trader.rank}</span>
                  </div>
                </div>
                <p className="text-purple-300 text-lg mb-3">{trader.username}</p>
                <div className="flex flex-wrap gap-2">
                  {trader.specialty.map((spec, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                      {spec}
                    </span>
                  ))}
                  <span className={`px-3 py-1 text-sm rounded-full border ${
                    trader.riskLevel === 'low'
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : trader.riskLevel === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {trader.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleStartCopying}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:scale-105 transition-all flex items-center gap-3 shadow-lg"
            >
              <Copy className="w-5 h-5" />
              Start Copying
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-3">About</h2>
          <p className="text-purple-200">{trader.bio}</p>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl border border-green-500/30 p-6">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Total Return</span>
            </div>
            <div className="text-4xl font-bold text-green-400">+{trader.totalReturn}%</div>
            <div className="text-sm text-green-300 mt-1">Since joining</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Monthly Avg</span>
            </div>
            <div className="text-4xl font-bold text-blue-400">+{trader.monthlyReturn}%</div>
            <div className="text-sm text-blue-300 mt-1">Consistent growth</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Target className="w-5 h-5" />
              <span className="text-sm">Win Rate</span>
            </div>
            <div className="text-4xl font-bold text-purple-400">{trader.winRate}%</div>
            <div className="text-sm text-purple-300 mt-1">{trader.profitableTrades}/{trader.totalTrades} trades</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl rounded-xl border border-orange-500/30 p-6">
            <div className="flex items-center gap-2 text-orange-400 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">Copiers</span>
            </div>
            <div className="text-4xl font-bold text-orange-400">{trader.copiers.toLocaleString()}</div>
            <div className="text-sm text-orange-300 mt-1">Active followers</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Portfolio Composition */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Portfolio Composition</h2>
            <div className="space-y-4">
              {portfolioComposition.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{item.type}</span>
                    <span className="text-purple-300 font-semibold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${item.color} h-full transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
              <div>
                <div className="text-sm text-purple-300 mb-1">Total Invested</div>
                <div className="text-2xl font-bold text-white">{formatCurrency(trader.totalInvested)}</div>
              </div>
              <div>
                <div className="text-sm text-purple-300 mb-1">Active Deals</div>
                <div className="text-2xl font-bold text-white">{trader.activeDeals}</div>
              </div>
              <div>
                <div className="text-sm text-purple-300 mb-1">Avg Holding</div>
                <div className="text-2xl font-bold text-white">{trader.avgHoldingPeriod}</div>
              </div>
              <div>
                <div className="text-sm text-purple-300 mb-1">Min Copy Amount</div>
                <div className="text-2xl font-bold text-white">{formatCurrency(trader.minCopyAmount)}</div>
              </div>
            </div>
          </div>

          {/* Monthly Performance Chart */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6">6-Month Performance</h2>
            <div className="space-y-3">
              {performanceData.map((data, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-purple-300">{data.month}</span>
                    <span className="text-sm text-green-400 font-semibold">+{data.return}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all"
                      style={{ width: `${(data.return / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Trades</h2>
          <div className="space-y-3">
            {recentTrades.map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    trade.type === 'real_estate' ? 'bg-blue-500/20' :
                    trade.type === 'franchise' ? 'bg-green-500/20' :
                    'bg-orange-500/20'
                  }`}>
                    {trade.type === 'real_estate' ? <Building className="w-5 h-5 text-blue-400" /> :
                     trade.type === 'franchise' ? <Store className="w-5 h-5 text-green-400" /> :
                     <Rocket className="w-5 h-5 text-orange-400" />}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{trade.deal}</div>
                    <div className="text-sm text-purple-300 capitalize">{trade.type.replace('_', ' ')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-green-400 font-bold">+{trade.return}%</div>
                    <div className={`text-xs ${trade.status === 'active' ? 'text-blue-400' : 'text-gray-400'}`}>
                      {trade.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copy Configuration Modal */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Configure Copy Settings</h2>
              <button
                onClick={() => setShowCopyModal(false)}
                className="text-purple-300 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Copy Amount */}
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-3">
                  Copy Amount: {formatCurrency(copyAmount)}
                </label>
                <input
                  type="range"
                  min={trader.minCopyAmount}
                  max="50000"
                  step="1000"
                  value={copyAmount}
                  onChange={(e) => setCopyAmount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-purple-400 mt-2">
                  <span>Min: {formatCurrency(trader.minCopyAmount)}</span>
                  <span>Max: {formatCurrency(50000)}</span>
                </div>
              </div>

              {/* Auto Reinvest */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <div className="text-white font-semibold mb-1">Auto-Reinvest Returns</div>
                  <div className="text-sm text-purple-300">Automatically reinvest profits into new deals</div>
                </div>
                <button
                  onClick={() => setAutoReinvest(!autoReinvest)}
                  className={`w-14 h-8 rounded-full transition-all ${
                    autoReinvest ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full transition-all ${
                    autoReinvest ? 'ml-7' : 'ml-1'
                  }`}></div>
                </button>
              </div>

              {/* Stop Loss */}
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-3">
                  Stop Loss: {stopLoss}%
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-purple-400 mt-2">
                  <span>5%</span>
                  <span>50%</span>
                </div>
                <p className="text-sm text-purple-300 mt-2">
                  Automatically stop copying if portfolio drops by {stopLoss}%
                </p>
              </div>

              {/* Summary */}
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-200">
                    <p className="font-semibold mb-2">You're about to:</p>
                    <ul className="space-y-1">
                      <li>• Copy {trader.name}'s portfolio with {formatCurrency(copyAmount)}</li>
                      <li>• Auto-reinvest: {autoReinvest ? 'Yes' : 'No'}</li>
                      <li>• Stop loss set at {stopLoss}%</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCopyModal(false)}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCopy}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition-all"
                >
                  Confirm & Start Copying
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
