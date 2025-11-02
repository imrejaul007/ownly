'use client';

import { useState, useEffect } from 'react';
import { sipAPI, bundleAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  Calendar, DollarSign, TrendingUp, Package, RefreshCw,
  Plus, ArrowRight, CheckCircle, Info, X, Zap, Target,
  Clock, BarChart3, Shield, Sparkles, ChevronRight, Tag,
  Activity, Award, Percent
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

  const getRiskLevelColor = (riskLevel?: string) => {
    if (!riskLevel) return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    const colors: any = {
      'low': 'bg-green-500/10 text-green-400 border-green-500/20',
      'medium': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'high': 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return colors[riskLevel.toLowerCase()] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500 mx-auto mb-4 absolute top-0 left-1/2 -translate-x-1/2" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-purple-200 text-lg font-semibold">Loading SIP plans...</p>
          <p className="text-purple-400 text-sm mt-2">Discovering investment opportunities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 via-emerald-600/20 to-teal-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-green-400/30">
                <RefreshCw className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent mb-2">
                  SIP Plans
                </h1>
                <p className="text-xl text-purple-200">
                  Systematic Investment Plans - Build Wealth Automatically
                </p>
              </div>
            </div>
            <Link href="/sip">
              <button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all">
                <Activity className="w-5 h-5" />
                My SIPs
              </button>
            </Link>
          </div>

          {/* Benefits Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <span className="text-white font-bold text-lg">Automated Investing</span>
                </div>
              </div>
              <p className="text-purple-200 text-sm">Monthly investments happen automatically without manual intervention</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <span className="text-white font-bold text-lg">Disciplined Growth</span>
                </div>
              </div>
              <p className="text-purple-200 text-sm">Build wealth through consistent, regular investing habits</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <span className="text-white font-bold text-lg">Full Flexibility</span>
                </div>
              </div>
              <p className="text-purple-200 text-sm">Pause, resume, or cancel your SIP anytime with no penalties</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-8">

        {plans.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                <Package className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No SIP Plans Available</h3>
              <p className="text-gray-400 mb-6">
                We're working on creating amazing systematic investment plans for you. Check back soon for new opportunities!
              </p>
              <Link href="/deals">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all flex items-center gap-3 mx-auto">
                  <Sparkles className="w-5 h-5" />
                  Explore One-Time Deals
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const riskLevel = plan.risk_level || plan.bundle?.risk_level;
              const category = plan.category || plan.bundle?.category;

              return (
                <div
                  key={plan.id}
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20"
                >
                  {/* Gradient Header */}
                  <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-6">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm border ${
                        plan.status === 'active'
                          ? 'bg-green-500/20 text-green-200 border-green-400/30'
                          : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
                      }`}>
                        {plan.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 border border-white/30">
                        <RefreshCw className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-100 transition-colors">
                        {plan.name}
                      </h3>
                      <p className="text-green-100 text-sm flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        {plan.bundle?.name || 'Investment Bundle'}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Category & Risk Level Badges */}
                    {(category || riskLevel) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {category && (
                          <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-lg text-xs font-semibold">
                            <Tag className="w-3 h-3" />
                            {category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        )}
                        {riskLevel && (
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border ${getRiskLevelColor(riskLevel)}`}>
                            <Shield className="w-3 h-3" />
                            {riskLevel.replace(/\b\w/g, (l: string) => l.toUpperCase())} Risk
                          </span>
                        )}
                      </div>
                    )}

                    {plan.description && (
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{plan.description}</p>
                    )}

                    {/* Pricing Section - Highlighted */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl p-4 mb-4">
                      <div className="text-center">
                        <p className="text-purple-300 text-xs font-semibold mb-1">MONTHLY INVESTMENT</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                          {formatCurrency(plan.min_amount || 0)}
                        </p>
                        <p className="text-purple-300 text-xs">
                          {plan.max_amount ? `up to ${formatCurrency(plan.max_amount)}` : 'Unlimited maximum'}
                        </p>
                      </div>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="space-y-3 mb-6">
                      {plan.bundle && (
                        <>
                          <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <Package className="w-4 h-4 text-blue-400" />
                              </div>
                              <span className="text-gray-300 text-sm">Investment Deals</span>
                            </div>
                            <span className="text-white font-bold">{plan.bundle.deals_count || 0}</span>
                          </div>

                          <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-green-400" />
                              </div>
                              <span className="text-gray-300 text-sm">Expected ROI</span>
                            </div>
                            <span className="text-green-400 font-bold text-lg">
                              {plan.bundle.expected_roi ? `${plan.bundle.expected_roi}%` : 'N/A'}
                            </span>
                          </div>
                        </>
                      )}

                      <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-yellow-400" />
                          </div>
                          <span className="text-gray-300 text-sm">Auto-Deduction</span>
                        </div>
                        <span className="text-white font-bold text-sm">1st of Month</span>
                      </div>
                    </div>

                    {/* Feature List */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>Automated monthly investments</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>Pause or cancel anytime</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>Diversified portfolio</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleSubscribe(plan)}
                      disabled={plan.status !== 'active'}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group-hover:scale-105"
                    >
                      <Plus className="w-5 h-5" />
                      Subscribe to Plan
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* How SIP Works Section */}
        <div className="mt-12 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-400/30 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-indigo-400/30 flex-shrink-0">
              <Info className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                How SIP Works
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Choose Your Plan</p>
                      <p className="text-gray-300 text-sm">Select a SIP plan aligned with your investment goals and risk tolerance</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Set Investment Amount</p>
                      <p className="text-gray-300 text-sm">Define your monthly investment amount within the plan's range</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Automatic Deduction</p>
                      <p className="text-gray-300 text-sm">Funds are automatically deducted on the 1st of each month</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Full Control</p>
                      <p className="text-gray-300 text-sm">Pause, resume, or cancel your SIP anytime with complete flexibility</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose SIP Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6">
            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4">
              <Award className="w-7 h-7 text-green-400" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Power of Compounding</h4>
            <p className="text-gray-300 text-sm">
              Benefit from the magic of compounding returns as your investments grow month after month
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6">
            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4">
              <Percent className="w-7 h-7 text-blue-400" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Rupee Cost Averaging</h4>
            <p className="text-gray-300 text-sm">
              Reduce market timing risk by investing consistently regardless of market conditions
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6">
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4">
              <Activity className="w-7 h-7 text-purple-400" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Financial Discipline</h4>
            <p className="text-gray-300 text-sm">
              Build lasting wealth through automated, disciplined investing without emotional decisions
            </p>
          </div>
        </div>
      </div>

      {/* Subscribe Modal */}
      {showSubscribeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-green-400/30">
                  <RefreshCw className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Subscribe to SIP</h3>
              </div>
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="mb-6">
              {/* Selected Plan Card */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-green-400" />
                  <p className="text-green-300 text-sm font-semibold">SELECTED PLAN</p>
                </div>
                <p className="text-white font-bold text-xl mb-1">{selectedPlan.name}</p>
                <p className="text-green-200 text-sm">{selectedPlan.bundle?.name}</p>
                {selectedPlan.bundle?.expected_roi && (
                  <div className="mt-3 pt-3 border-t border-green-400/20">
                    <div className="flex items-center justify-between">
                      <span className="text-green-300 text-sm">Expected ROI</span>
                      <span className="text-green-400 font-bold text-lg">{selectedPlan.bundle.expected_roi}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Monthly Amount Input */}
              <div>
                <label className="block text-white font-semibold mb-3">Monthly Investment Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                  <input
                    type="number"
                    value={formData.monthly_amount}
                    onChange={(e) => setFormData({ ...formData, monthly_amount: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white text-lg font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder={`Min. ${formatCurrency(selectedPlan.min_amount || 0)}`}
                    min={selectedPlan.min_amount}
                    max={selectedPlan.max_amount || undefined}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-gray-400 text-xs">
                    Range: {formatCurrency(selectedPlan.min_amount)} - {selectedPlan.max_amount ? formatCurrency(selectedPlan.max_amount) : 'Unlimited'}
                  </p>
                  {formData.monthly_amount && parseFloat(formData.monthly_amount) >= selectedPlan.min_amount && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </div>

              {/* Auto Deduct Option */}
              <div className="mt-5 bg-white/5 rounded-xl p-4 border border-white/10">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.auto_deduct}
                    onChange={(e) => setFormData({ ...formData, auto_deduct: e.target.checked })}
                    className="mt-0.5 w-5 h-5 rounded border-white/20 bg-white/5 text-green-600 focus:ring-2 focus:ring-green-500"
                  />
                  <div>
                    <span className="text-white font-semibold block mb-1">Enable Automatic Deduction</span>
                    <span className="text-gray-400 text-xs">Funds will be deducted automatically on the 1st of each month</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubscribeModal(false)}
                className="flex-1 px-6 py-4 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all font-semibold border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSubscribeSubmit}
                disabled={subscribeLoading || !formData.monthly_amount || parseFloat(formData.monthly_amount) < selectedPlan.min_amount}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-2xl hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2"
              >
                {subscribeLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Subscribing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Subscribe Now
                  </>
                )}
              </button>
            </div>

            {/* Info Note */}
            <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex gap-2">
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-blue-300 text-xs">
                You can pause, resume, or cancel your SIP subscription anytime from your dashboard without any penalties.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
