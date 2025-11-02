'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { sipAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { usePreferences } from '@/context/PreferencesContext';
import {
  ArrowLeft, Calendar, DollarSign, TrendingUp, Package,
  Pause, Play, X, Clock, CheckCircle, AlertCircle,
  BarChart3, RefreshCw, Activity, Target, Award,
  LineChart, PieChart, Edit, Download, History,
  Zap, Sparkles, Info, ArrowUpRight, ArrowDown,
  TrendingDown, Percent, ChevronRight, Eye, Share2,
  Bell, Settings, FileText
} from 'lucide-react';

export default function SIPSubscriptionDetailPage() {
  const { formatCurrency } = usePreferences();
  const params = useParams();
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'projections' | 'insights'>('overview');

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await sipAPI.getSubscription(params.id as string);
      setSubscription(response.data.data.subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    if (!confirm('Are you sure you want to pause this SIP?')) return;
    try {
      setActionLoading(true);
      await sipAPI.pauseSubscription(params.id as string);
      await fetchSubscription();
      alert('SIP paused successfully!');
    } catch (error: any) {
      console.error('Error pausing subscription:', error);
      alert(error.response?.data?.message || 'Failed to pause subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    if (!confirm('Are you sure you want to resume this SIP?')) return;
    try {
      setActionLoading(true);
      await sipAPI.resumeSubscription(params.id as string);
      await fetchSubscription();
      alert('SIP resumed successfully!');
    } catch (error: any) {
      console.error('Error resuming subscription:', error);
      alert(error.response?.data?.message || 'Failed to resume subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setActionLoading(true);
      await sipAPI.cancelSubscription(params.id as string);
      setShowCancelModal(false);
      router.push('/sip');
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      alert(error.response?.data?.message || 'Failed to cancel subscription');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-emerald-500 mx-auto mb-4 absolute top-0 left-1/2 -translate-x-1/2" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-green-200 text-lg font-semibold">Loading subscription details...</p>
          <p className="text-green-400 text-sm mt-2">Calculating your investment journey</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Subscription Not Found</h2>
          <p className="text-gray-400 mb-6">
            We couldn't find this SIP subscription. It may have been deleted or you don't have access to it.
          </p>
          <Link href="/sip">
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2 mx-auto">
              <ArrowLeft className="w-5 h-5" />
              Back to My SIPs
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const invested = parseFloat(subscription.total_invested || 0);
  const currentValue = parseFloat(subscription.current_value || invested);
  const returns = currentValue - invested;
  const returnsPercent = invested > 0 ? ((returns / invested) * 100) : 0;
  const monthlyAmount = parseFloat(subscription.monthly_amount || 0);
  const investmentsCount = subscription.investments?.length || 0;

  // Calculate average investment per month
  const startDate = new Date(subscription.start_date);
  const now = new Date();
  const monthsActive = Math.max(1, (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth()));
  const avgPerMonth = invested / monthsActive;

  // Project future value (12 months ahead with 15% assumed return)
  const monthsToProject = 12;
  const assumedAnnualReturn = 0.15;
  const monthlyReturnRate = assumedAnnualReturn / 12;
  let futureValue = currentValue;
  for (let i = 0; i < monthsToProject; i++) {
    futureValue = (futureValue + monthlyAmount) * (1 + monthlyReturnRate);
  }
  const projectedInvestment = invested + (monthlyAmount * monthsToProject);
  const projectedReturns = futureValue - projectedInvestment;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          color: 'from-green-500/90 to-emerald-600/90',
          borderColor: 'border-green-400/30',
          textColor: 'text-green-300',
          bgColor: 'bg-green-500/20',
          icon: <Activity className="w-5 h-5" />,
          label: 'ACTIVE'
        };
      case 'paused':
        return {
          color: 'from-yellow-500/90 to-orange-600/90',
          borderColor: 'border-yellow-400/30',
          textColor: 'text-yellow-300',
          bgColor: 'bg-yellow-500/20',
          icon: <Pause className="w-5 h-5" />,
          label: 'PAUSED'
        };
      case 'cancelled':
        return {
          color: 'from-gray-500/90 to-slate-600/90',
          borderColor: 'border-gray-400/30',
          textColor: 'text-gray-300',
          bgColor: 'bg-gray-500/20',
          icon: <X className="w-5 h-5" />,
          label: 'CANCELLED'
        };
      default:
        return {
          color: 'from-gray-500/90 to-slate-600/90',
          borderColor: 'border-gray-400/30',
          textColor: 'text-gray-300',
          bgColor: 'bg-gray-500/20',
          icon: <Clock className="w-5 h-5" />,
          label: status.toUpperCase()
        };
    }
  };

  const statusConfig = getStatusConfig(subscription.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 right-1/3 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/sip">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-all group">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-all">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="font-medium">Back to My SIPs</span>
            </button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className={`relative bg-gradient-to-r ${statusConfig.color} backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-8 overflow-hidden border ${statusConfig.borderColor}`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          {/* Floating particles */}
          <div className="absolute top-10 left-20 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
          <div className="absolute top-20 right-40 w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-1/3 w-2 h-2 bg-white/25 rounded-full animate-bounce"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`px-4 py-2 rounded-xl backdrop-blur-xl border flex items-center gap-2 ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
                    {statusConfig.icon}
                    <span className="text-sm font-bold text-white">{statusConfig.label}</span>
                  </div>
                  {subscription.status === 'active' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg backdrop-blur-xl">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white font-semibold">Auto-Investing</span>
                    </div>
                  )}
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">{subscription.plan?.name || 'SIP Subscription'}</h1>
                <p className="text-green-100 text-lg flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  {subscription.plan?.bundle?.name || 'Investment Bundle'}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                {subscription.status === 'active' && (
                  <>
                    <button
                      onClick={handlePause}
                      disabled={actionLoading}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-xl text-white px-5 py-3 rounded-xl hover:bg-white/30 transition-all disabled:opacity-50 font-semibold border border-white/30"
                    >
                      <Pause className="w-4 h-4" />
                      Pause
                    </button>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      disabled={actionLoading}
                      className="flex items-center gap-2 bg-red-500/30 backdrop-blur-xl text-white px-5 py-3 rounded-xl hover:bg-red-500/50 transition-all disabled:opacity-50 font-semibold border border-red-400/30"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                )}
                {subscription.status === 'paused' && (
                  <>
                    <button
                      onClick={handleResume}
                      disabled={actionLoading}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-xl text-white px-5 py-3 rounded-xl hover:bg-white/30 transition-all disabled:opacity-50 font-semibold border border-white/30"
                    >
                      <Play className="w-4 h-4" />
                      Resume
                    </button>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      disabled={actionLoading}
                      className="flex items-center gap-2 bg-red-500/30 backdrop-blur-xl text-white px-5 py-3 rounded-xl hover:bg-red-500/50 transition-all disabled:opacity-50 font-semibold border border-red-400/30"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs">Monthly</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(monthlyAmount)}</p>
                  </div>
                </div>
                <p className="text-white/90 text-sm">Investment Amount</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs">Invested</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(invested)}</p>
                  </div>
                </div>
                <p className="text-white/90 text-sm">Total Amount</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs">Value</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(currentValue)}</p>
                  </div>
                </div>
                <p className="text-white/90 text-sm">Current Portfolio</p>
              </div>

              <div className={`backdrop-blur-xl rounded-xl p-5 border ${
                returns >= 0
                  ? 'bg-emerald-500/20 border-emerald-400/30'
                  : 'bg-red-500/20 border-red-400/30'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    returns >= 0 ? 'bg-emerald-500/30' : 'bg-red-500/30'
                  }`}>
                    {returns >= 0 ? (
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    ) : (
                      <ArrowDown className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs">Returns</p>
                    <p className="text-2xl font-bold text-white">
                      {returns >= 0 ? '+' : ''}{formatCurrency(returns)}
                    </p>
                  </div>
                </div>
                <p className="text-white/90 text-sm">
                  {returnsPercent >= 0 ? '+' : ''}{returnsPercent.toFixed(2)}% Total Return
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <p className="text-blue-200 text-sm">Investments Made</p>
                <p className="text-3xl font-bold text-white">{investmentsCount}</p>
              </div>
            </div>
            <p className="text-blue-200 text-xs">
              Average: {formatCurrency(avgPerMonth)}/month
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <p className="text-purple-200 text-sm">Duration</p>
                <p className="text-3xl font-bold text-white">{monthsActive}</p>
              </div>
            </div>
            <p className="text-purple-200 text-xs">
              Started {formatDate(subscription.start_date)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-300" />
              </div>
              <div>
                <p className="text-green-200 text-sm">Next Payment</p>
                <p className="text-xl font-bold text-white">
                  {subscription.status === 'active' ? '1st of Month' : 'Paused'}
                </p>
              </div>
            </div>
            <p className="text-green-200 text-xs">
              {subscription.status === 'active' ? 'Auto-debit enabled' : 'Resume to continue'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-2 mb-8 flex gap-2 overflow-x-auto">
          {(['overview', 'history', 'projections', 'insights'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab === 'overview' && <BarChart3 className="w-4 h-4" />}
              {tab === 'history' && <History className="w-4 h-4" />}
              {tab === 'projections' && <LineChart className="w-4 h-4" />}
              {tab === 'insights' && <Sparkles className="w-4 h-4" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Investment Timeline */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <History className="w-6 h-6 text-green-400" />
                Recent Activity
              </h2>

              {!subscription.investments || subscription.investments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                    <Package className="w-10 h-10 text-green-400" />
                  </div>
                  <p className="text-gray-400 text-lg mb-2">No investments yet</p>
                  <p className="text-gray-500 text-sm">
                    Your first investment will be made on the 1st of next month
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscription.investments.slice(0, 5).map((investment: any, index: number) => (
                    <div
                      key={investment.id}
                      className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-5 border border-white/10 hover:border-green-500/30 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-semibold text-lg">
                              {formatCurrency(investment.amount)}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {new Date(investment.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            investment.status === 'confirmed' || investment.status === 'active'
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : investment.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                          }`}>
                            {investment.status === 'confirmed' || investment.status === 'active' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            {investment.status}
                          </div>
                          <p className="text-gray-500 text-xs mt-1">
                            #{investment.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {subscription.investments && subscription.investments.length > 5 && (
                <button
                  onClick={() => setActiveTab('history')}
                  className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
                >
                  View All {subscription.investments.length} Investments
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Bundle Information */}
            {subscription.plan?.bundle && (
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-indigo-400/30 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Package className="w-6 h-6 text-indigo-400" />
                  Bundle Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-xl p-5 border border-white/10">
                    <p className="text-indigo-300 text-sm mb-2">Bundle Name</p>
                    <p className="text-white font-bold text-lg">{subscription.plan.bundle.name}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-5 border border-white/10">
                    <p className="text-purple-300 text-sm mb-2">Number of Deals</p>
                    <p className="text-white font-bold text-lg">
                      {subscription.plan.bundle.deals_count || 0} Properties
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-5 border border-white/10">
                    <p className="text-pink-300 text-sm mb-2">Expected ROI</p>
                    <p className="text-green-400 font-bold text-lg">
                      {subscription.plan.bundle.expected_roi ? `${subscription.plan.bundle.expected_roi}%` : '12-15%'}
                    </p>
                  </div>
                </div>

                {subscription.plan.bundle.description && (
                  <div className="mt-6 bg-white/5 rounded-xl p-5 border border-white/10">
                    <p className="text-white/90 leading-relaxed">{subscription.plan.bundle.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Complete Investment History</h2>

            {!subscription.investments || subscription.investments.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No investments yet</p>
                <p className="text-gray-500 text-sm">Your first investment will be made soon</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Date</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Amount</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Current Value</th>
                      <th className="text-left py-4 px-4 text-gray-400 font-semibold">Returns</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscription.investments.map((investment: any) => {
                      const invValue = parseFloat(investment.current_value || investment.amount);
                      const invAmount = parseFloat(investment.amount);
                      const invReturns = invValue - invAmount;
                      const invReturnsPercent = invAmount > 0 ? ((invReturns / invAmount) * 100) : 0;

                      return (
                        <tr key={investment.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 text-gray-300">
                            {new Date(investment.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="py-4 px-4 text-white font-semibold">
                            {formatCurrency(invAmount)}
                          </td>
                          <td className="py-4 px-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                              investment.status === 'confirmed' || investment.status === 'active'
                                ? 'bg-green-500/20 text-green-300'
                                : investment.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-gray-500/20 text-gray-300'
                            }`}>
                              {investment.status === 'confirmed' || investment.status === 'active' ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )}
                              {investment.status}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-white font-semibold">
                            {formatCurrency(invValue)}
                          </td>
                          <td className="py-4 px-4">
                            <div className={`font-semibold ${invReturns >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {invReturns >= 0 ? '+' : ''}{formatCurrency(invReturns)}
                              <span className="text-xs ml-1">({invReturnsPercent >= 0 ? '+' : ''}{invReturnsPercent.toFixed(1)}%)</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'projections' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <LineChart className="w-6 h-6 text-purple-400" />
                12-Month Projection
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <p className="text-purple-300 text-sm mb-2">Projected Investment</p>
                  <p className="text-3xl font-bold text-white mb-1">{formatCurrency(projectedInvestment)}</p>
                  <p className="text-purple-200 text-xs">+{formatCurrency(monthlyAmount * monthsToProject)} in 12 months</p>
                </div>
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <p className="text-pink-300 text-sm mb-2">Estimated Value</p>
                  <p className="text-3xl font-bold text-white mb-1">{formatCurrency(futureValue)}</p>
                  <p className="text-pink-200 text-xs">With 15% annual return</p>
                </div>
                <div className="bg-white/10 rounded-xl p-6 border border-white/10">
                  <p className="text-green-300 text-sm mb-2">Projected Returns</p>
                  <p className="text-3xl font-bold text-green-400 mb-1">+{formatCurrency(projectedReturns)}</p>
                  <p className="text-green-200 text-xs">
                    {((projectedReturns / projectedInvestment) * 100).toFixed(1)}% total return
                  </p>
                </div>
              </div>

              <div className="bg-indigo-500/10 rounded-xl p-5 border border-indigo-500/20 flex gap-3">
                <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-indigo-300 text-sm">
                    These projections assume a 15% annual return and consistent monthly investments.
                    Actual returns may vary based on market conditions and asset performance.
                  </p>
                </div>
              </div>
            </div>

            {/* Milestone Tracker */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Target className="w-5 h-5 text-green-400" />
                Investment Milestones
              </h3>

              <div className="space-y-4">
                {[
                  { amount: 10000, label: 'AED 10K', icon: '🎯' },
                  { amount: 25000, label: 'AED 25K', icon: '🚀' },
                  { amount: 50000, label: 'AED 50K', icon: '💎' },
                  { amount: 100000, label: 'AED 100K', icon: '🏆' },
                ].map((milestone) => {
                  const progress = Math.min(100, (invested / milestone.amount) * 100);
                  const achieved = invested >= milestone.amount;

                  return (
                    <div key={milestone.amount} className="bg-white/5 rounded-xl p-5 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{milestone.icon}</span>
                          <div>
                            <p className="text-white font-semibold">{milestone.label} Milestone</p>
                            <p className="text-gray-400 text-sm">
                              {achieved ? 'Achieved!' : `${formatCurrency(milestone.amount - invested)} to go`}
                            </p>
                          </div>
                        </div>
                        {achieved && (
                          <div className="px-3 py-1 bg-green-500/20 rounded-lg border border-green-500/30">
                            <span className="text-green-300 text-xs font-bold">✓ ACHIEVED</span>
                          </div>
                        )}
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
                        <div
                          className={`h-full rounded-full transition-all ${
                            achieved ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-400 text-xs mt-2 text-right">{progress.toFixed(1)}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* Performance Insights */}
            <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-indigo-400/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-indigo-400" />
                Performance Insights
              </h2>

              <div className="space-y-4">
                {returns >= 0 ? (
                  <div className="bg-green-500/10 rounded-xl p-5 border border-green-500/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-green-300 font-semibold mb-1">Positive Performance</p>
                        <p className="text-green-200 text-sm">
                          Your SIP is performing well with a {returnsPercent.toFixed(2)}% return.
                          You're {formatCurrency(returns)} ahead of your invested capital.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-500/10 rounded-xl p-5 border border-yellow-500/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-yellow-300 font-semibold mb-1">Building Position</p>
                        <p className="text-yellow-200 text-sm">
                          SIPs work best over the long term. Continue investing regularly to benefit from rupee cost averaging.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-500/10 rounded-xl p-5 border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-blue-300 font-semibold mb-1">Consistency Matters</p>
                      <p className="text-blue-200 text-sm">
                        You've made {investmentsCount} investments over {monthsActive} months.
                        Maintaining this discipline is key to wealth building.
                      </p>
                    </div>
                  </div>
                </div>

                {subscription.status === 'active' && (
                  <div className="bg-purple-500/10 rounded-xl p-5 border border-purple-500/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-purple-300 font-semibold mb-1">Power of Compounding</p>
                        <p className="text-purple-200 text-sm">
                          At your current pace of {formatCurrency(monthlyAmount)}/month,
                          you could accumulate {formatCurrency(futureValue)} in 12 months (assuming 15% returns).
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Award className="w-5 h-5 text-yellow-400" />
                Recommendations
              </h3>

              <div className="space-y-3">
                {monthlyAmount < 2000 && (
                  <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                    <ArrowUpRight className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">Consider Increasing Amount</p>
                      <p className="text-gray-400 text-xs">
                        Increasing your monthly SIP to AED 2,000+ can help you reach your goals faster.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                  <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">Stay Invested for Long Term</p>
                    <p className="text-gray-400 text-xs">
                      SIPs benefit most from staying invested for 5+ years to ride out market volatility.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
                  <Package className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">Diversify Your Portfolio</p>
                    <p className="text-gray-400 text-xs">
                      Consider starting additional SIPs in different bundles to spread risk.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 text-center">Cancel SIP?</h3>
            <p className="text-gray-400 mb-6 text-center">
              Canceling this SIP will stop all future automatic investments. Your existing investments will remain active.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
              <p className="text-gray-400 text-sm mb-2">Subscription Details</p>
              <p className="text-white font-bold text-xl mb-1">{subscription.plan?.name}</p>
              <p className="text-gray-400 text-sm mb-3">Monthly: {formatCurrency(subscription.monthly_amount)}</p>
              <p className="text-gray-400 text-sm">Total Invested: {formatCurrency(subscription.total_invested || 0)}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all font-semibold"
              >
                Keep SIP
              </button>
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 font-semibold"
              >
                {actionLoading ? 'Canceling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
