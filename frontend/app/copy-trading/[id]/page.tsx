'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { usePreferences } from '@/context/PreferencesContext';
import {
  ArrowLeft, CheckCircle, Trophy, TrendingUp, Users, Activity, DollarSign,
  Target, Shield, Copy, Settings, BarChart3, Calendar, Award, Flame,
  Building, Store, Rocket, Star, AlertCircle, Zap, UserPlus, X, Package,
  Briefcase
} from 'lucide-react';

export default function TraderProfilePage() {
  const { formatCurrency } = usePreferences();
  const params = useParams();
  const router = useRouter();
  const [trader, setTrader] = useState<any>(null);
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Copy settings state
  const [copyAmount, setCopyAmount] = useState(5000);
  const [autoReinvest, setAutoReinvest] = useState(true);
  const [stopLoss, setStopLoss] = useState(20);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copyType, setCopyType] = useState<'full_profile' | 'bundle' | 'individual_deal'>('full_profile');
  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(null);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  useEffect(() => {
    fetchTraderData();
  }, [params.id]);

  const fetchTraderData = async () => {
    try {
      setLoading(true);

      // Fetch trader profile
      const traderRes = await fetch(`http://localhost:5001/api/copy-trading/traders/${params.id}`);
      const traderData = await traderRes.json();

      if (traderData.success) {
        setTrader(traderData.data.trader);

        // Fetch trader's bundles
        const bundlesRes = await fetch(`http://localhost:5001/api/copy-trading/traders/${params.id}/bundles`);
        const bundlesData = await bundlesRes.json();

        if (bundlesData.success) {
          setBundles(bundlesData.data.bundles);
        }
      }
    } catch (error) {
      console.error('Error fetching trader data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCopying = () => {
    setShowCopyModal(true);
  };

  const confirmCopy = () => {
    alert(`Successfully started copying ${trader?.user?.name} with ${formatCurrency(copyAmount)} (Type: ${copyType})`);
    setShowCopyModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading trader profile...</div>
      </div>
    );
  }

  if (!trader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Trader not found</div>
      </div>
    );
  }

  const portfolioComposition = trader.portfolioBreakdown || {};
  const portfolioArray = Object.entries(portfolioComposition).map(([type, percentage]) => ({
    type: type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
    percentage: parseFloat(percentage as string),
    color: type.includes('real') ? 'bg-blue-500' :
           type.includes('franchise') ? 'bg-green-500' :
           type.includes('tech') ? 'bg-orange-500' :
           'bg-purple-500'
  }));

  const deals = trader.user?.investments?.map((inv: any) => inv.deal).filter(Boolean) || [];

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
                {trader.user?.name?.charAt(0) || 'T'}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{trader.user?.name}</h1>
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-purple-300 text-lg mb-3">{trader.user?.email}</p>
                <div className="flex flex-wrap gap-2">
                  {trader.specialty && trader.specialty.map((spec: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                      {spec}
                    </span>
                  ))}
                  <span className={`px-3 py-1 text-sm rounded-full border ${
                    trader.risk_level === 'low'
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : trader.risk_level === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {trader.risk_level?.toUpperCase()} RISK
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
        {trader.bio && (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-3">About</h2>
            <p className="text-purple-200">{trader.bio}</p>
          </div>
        )}

        {/* Performance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-xl border border-green-500/30 p-6">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Total Return</span>
            </div>
            <div className="text-4xl font-bold text-green-400">+{trader.total_return}%</div>
            <div className="text-sm text-green-300 mt-1">Since joining</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-xl border border-blue-500/30 p-6">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Monthly Avg</span>
            </div>
            <div className="text-4xl font-bold text-blue-400">+{trader.monthly_return}%</div>
            <div className="text-sm text-blue-300 mt-1">Consistent growth</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Target className="w-5 h-5" />
              <span className="text-sm">Win Rate</span>
            </div>
            <div className="text-4xl font-bold text-purple-400">{trader.win_rate}%</div>
            <div className="text-sm text-purple-300 mt-1">Success rate</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl rounded-xl border border-orange-500/30 p-6">
            <div className="flex items-center gap-2 text-orange-400 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">Copiers</span>
            </div>
            <div className="text-4xl font-bold text-orange-400">{trader.total_copiers_count}</div>
            <div className="text-sm text-orange-300 mt-1">Active followers</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Portfolio Composition */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Portfolio Composition</h2>
            {portfolioArray.length > 0 ? (
              <div className="space-y-4">
                {portfolioArray.map((item, index) => (
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
            ) : (
              <p className="text-purple-300">No portfolio data available</p>
            )}

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
              <div>
                <div className="text-sm text-purple-300 mb-1">Total Invested</div>
                <div className="text-2xl font-bold text-white">{formatCurrency(trader.totalInvested || 0)}</div>
              </div>
              <div>
                <div className="text-sm text-purple-300 mb-1">Active Deals</div>
                <div className="text-2xl font-bold text-white">{trader.activeDealsCount || 0}</div>
              </div>
              <div>
                <div className="text-sm text-purple-300 mb-1">Commission Rate</div>
                <div className="text-2xl font-bold text-white">{trader.commission_rate}%</div>
              </div>
              <div>
                <div className="text-sm text-purple-300 mb-1">Min Copy Amount</div>
                <div className="text-2xl font-bold text-white">{formatCurrency(trader.min_copy_amount)}</div>
              </div>
            </div>
          </div>

          {/* Active Bundles */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Active Bundles</h2>
            {bundles.length > 0 ? (
              <div className="space-y-3">
                {bundles.map((bundle) => (
                  <div key={bundle.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/30 transition-all">
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="text-white font-semibold mb-1">{bundle.name}</div>
                        <div className="text-xs text-purple-300">{bundle.deals?.length || 0} deals</div>
                        <div className="text-xs text-gray-400 mt-1">{bundle.total_copiers} copiers</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-purple-300 text-sm">No active bundles</p>
            )}
          </div>
        </div>

        {/* Recent Deals */}
        {deals.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Active Deals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deals.slice(0, 6).map((deal: any) => (
                <div key={deal.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{deal.title}</div>
                      <div className="text-xs text-purple-300 capitalize">{deal.type?.replace('_', ' ')}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-sm">+{deal.expected_roi}%</div>
                    <div className="text-xs text-gray-400">{deal.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Copy Configuration Modal */}
      {showCopyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
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
              {/* Copy Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-3">
                  Select Copy Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setCopyType('full_profile');
                      setSelectedBundleId(null);
                      setSelectedDealId(null);
                    }}
                    className={`p-4 rounded-lg border transition-all ${
                      copyType === 'full_profile'
                        ? 'bg-purple-500/20 border-purple-500 text-white'
                        : 'bg-white/5 border-white/10 text-purple-300 hover:border-purple-500/50'
                    }`}
                  >
                    <UserPlus className="w-6 h-6 mb-2 mx-auto" />
                    <div className="font-semibold mb-1">Full Profile</div>
                    <div className="text-xs">Copy entire portfolio</div>
                  </button>

                  <button
                    onClick={() => {
                      setCopyType('bundle');
                      setSelectedDealId(null);
                    }}
                    className={`p-4 rounded-lg border transition-all ${
                      copyType === 'bundle'
                        ? 'bg-purple-500/20 border-purple-500 text-white'
                        : 'bg-white/5 border-white/10 text-purple-300 hover:border-purple-500/50'
                    }`}
                    disabled={bundles.length === 0}
                  >
                    <Package className="w-6 h-6 mb-2 mx-auto" />
                    <div className="font-semibold mb-1">Bundle</div>
                    <div className="text-xs">Copy specific bundle</div>
                  </button>

                  <button
                    onClick={() => {
                      setCopyType('individual_deal');
                      setSelectedBundleId(null);
                    }}
                    className={`p-4 rounded-lg border transition-all ${
                      copyType === 'individual_deal'
                        ? 'bg-purple-500/20 border-purple-500 text-white'
                        : 'bg-white/5 border-white/10 text-purple-300 hover:border-purple-500/50'
                    }`}
                    disabled={deals.length === 0}
                  >
                    <Briefcase className="w-6 h-6 mb-2 mx-auto" />
                    <div className="font-semibold mb-1">Individual Deal</div>
                    <div className="text-xs">Copy single deal</div>
                  </button>
                </div>
              </div>

              {/* Bundle Selection */}
              {copyType === 'bundle' && bundles.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-purple-300 mb-3">
                    Select Bundle
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {bundles.map((bundle) => (
                      <button
                        key={bundle.id}
                        onClick={() => setSelectedBundleId(bundle.id)}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          selectedBundleId === bundle.id
                            ? 'bg-purple-500/20 border-purple-500'
                            : 'bg-white/5 border-white/10 hover:border-purple-500/50'
                        }`}
                      >
                        <div className="text-white font-semibold">{bundle.name}</div>
                        <div className="text-xs text-purple-300 mt-1">{bundle.description}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {bundle.deals?.length || 0} deals • Min: {formatCurrency(bundle.min_copy_amount)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Deal Selection */}
              {copyType === 'individual_deal' && deals.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-purple-300 mb-3">
                    Select Deal
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {deals.map((deal: any) => (
                      <button
                        key={deal.id}
                        onClick={() => setSelectedDealId(deal.id)}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          selectedDealId === deal.id
                            ? 'bg-purple-500/20 border-purple-500'
                            : 'bg-white/5 border-white/10 hover:border-purple-500/50'
                        }`}
                      >
                        <div className="text-white font-semibold">{deal.title}</div>
                        <div className="text-xs text-purple-300 mt-1 capitalize">{deal.type?.replace('_', ' ')}</div>
                        <div className="text-xs text-green-400 mt-1">Expected ROI: +{deal.expected_roi}%</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Copy Amount */}
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-3">
                  Copy Amount: {formatCurrency(copyAmount)}
                </label>
                <input
                  type="range"
                  min={trader.min_copy_amount}
                  max="50000"
                  step="1000"
                  value={copyAmount}
                  onChange={(e) => setCopyAmount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-purple-400 mt-2">
                  <span>Min: {formatCurrency(trader.min_copy_amount)}</span>
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
                      <li>• Copy type: {copyType.replace('_', ' ').toUpperCase()}</li>
                      <li>• Investment: {formatCurrency(copyAmount)}</li>
                      <li>• Auto-reinvest: {autoReinvest ? 'Yes' : 'No'}</li>
                      <li>• Stop loss: {stopLoss}%</li>
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
                  disabled={
                    (copyType === 'bundle' && !selectedBundleId) ||
                    (copyType === 'individual_deal' && !selectedDealId)
                  }
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
