'use client';

import { useState, useEffect } from 'react';
import { sipAPI, bundleAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  Calendar, DollarSign, TrendingUp, Package, RefreshCw,
  Plus, ArrowRight, CheckCircle, Info, X, Zap, Target,
  Clock, BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SIPPlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [formData, setFormData] = useState({
    monthly_amount: '',
    payment_method_id: '',
    auto_deduct: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansResponse, bundlesResponse] = await Promise.all([
        sipAPI.list(),
        bundleAPI.list()
      ]);
      setPlans(plansResponse.data.data.plans || []);
      setBundles(bundlesResponse.data.data.bundles || []);
    } catch (error) {
      console.error('Error fetching SIP plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (plan: any) => {
    setSelectedPlan(plan);
    setFormData({
      monthly_amount: plan.min_amount || '',
      payment_method_id: '',
      auto_deduct: true
    });
    setShowSubscribeModal(true);
  };

  const handleSubscribeSubmit = async () => {
    if (!selectedPlan) return;

    try {
      setSubscribeLoading(true);
      await sipAPI.subscribe(selectedPlan.id, formData);
      alert('Successfully subscribed to SIP plan!');
      setShowSubscribeModal(false);
      setSelectedPlan(null);
      router.push('/sip');
    } catch (error: any) {
      console.error('Error subscribing to SIP:', error);
      alert(error.response?.data?.message || 'Failed to subscribe to SIP plan');
    } finally {
      setSubscribeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-green-200 text-lg">Loading SIP plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-10 h-10 text-white" />
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">SIP Plans</h1>
                  <p className="text-green-100">Choose a systematic investment plan</p>
                </div>
              </div>
              <Link href="/sip">
                <button className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-all">
                  My SIPs
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <span className="text-white font-semibold">Automated</span>
                </div>
                <p className="text-green-100 text-sm">Monthly investments happen automatically</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-yellow-300" />
                  <span className="text-white font-semibold">Disciplined</span>
                </div>
                <p className="text-green-100 text-sm">Build wealth through regular investing</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-yellow-300" />
                  <span className="text-white font-semibold">Flexible</span>
                </div>
                <p className="text-green-100 text-sm">Pause, resume, or cancel anytime</p>
              </div>
            </div>
          </div>
        </div>

        {plans.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No SIP plans available yet</p>
            <p className="text-gray-500 text-sm">Check back soon for new investment opportunities!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl p-6 hover:shadow-2xl hover:border-green-500/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-300 transition-colors">
                      {plan.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{plan.bundle?.name || 'Investment Bundle'}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    plan.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                  }`}>
                    {plan.status}
                  </div>
                </div>

                {plan.description && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{plan.description}</p>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-gray-400 text-sm">Min. Monthly</span>
                    </div>
                    <span className="text-white font-semibold">{formatCurrency(plan.min_amount || 0)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-400 text-sm">Max. Monthly</span>
                    </div>
                    <span className="text-white font-semibold">
                      {plan.max_amount ? formatCurrency(plan.max_amount) : 'Unlimited'}
                    </span>
                  </div>

                  {plan.bundle && (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-400 text-sm">Deals</span>
                        </div>
                        <span className="text-white font-semibold">{plan.bundle.deals_count || 0} deals</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-gray-400 text-sm">Avg. ROI</span>
                        </div>
                        <span className="text-green-400 font-semibold">
                          {plan.bundle.expected_roi ? `${plan.bundle.expected_roi}%` : 'N/A'}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-400 text-sm">Auto-Deduct</span>
                    </div>
                    <span className="text-white font-semibold">1st of month</span>
                  </div>
                </div>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={plan.status !== 'active'}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Plus className="w-5 h-5" />
                  Subscribe to Plan
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-3">How SIP Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p>Choose a SIP plan based on your investment goals</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p>Set your monthly investment amount (min. required)</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p>Funds are automatically deducted on the 1st of each month</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p>Pause, resume, or cancel your SIP anytime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSubscribeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Subscribe to SIP</h3>
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
                <p className="text-gray-400 text-sm mb-1">Selected Plan</p>
                <p className="text-white font-bold text-lg">{selectedPlan.name}</p>
                <p className="text-gray-400 text-sm">{selectedPlan.bundle?.name}</p>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Monthly Investment Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.monthly_amount}
                    onChange={(e) => setFormData({ ...formData, monthly_amount: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={`Min. ${formatCurrency(selectedPlan.min_amount || 0)}`}
                    min={selectedPlan.min_amount}
                    max={selectedPlan.max_amount || undefined}
                  />
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  Range: {formatCurrency(selectedPlan.min_amount)} - {selectedPlan.max_amount ? formatCurrency(selectedPlan.max_amount) : 'Unlimited'}
                </p>
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.auto_deduct}
                    onChange={(e) => setFormData({ ...formData, auto_deduct: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-green-600 focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-gray-300 text-sm">Enable automatic monthly deduction</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="flex-1 px-4 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubscribeSubmit}
                disabled={subscribeLoading || !formData.monthly_amount}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribeLoading ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
