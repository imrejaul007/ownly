'use client';

import { useState, useEffect } from 'react';
import { sipAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Calendar, DollarSign, TrendingUp, Pause, Play, X, Plus,
  RefreshCw, BarChart3, Clock, CheckCircle, AlertCircle,
  ArrowRight, Target, Zap, Package, Activity, Eye,
  TrendingDown, Percent, PieChart, LineChart, Edit,
  Download, Upload, Bell, Settings, Award, Sparkles,
  Calculator, Calendar as CalendarIcon, ArrowUp, Info,
  ChevronRight, Filter, Search, SlidersHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SIPDashboardPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'paused' | 'cancelled' | 'all'>('active');
  const [viewMode, setViewMode] = useState<'cards' | 'timeline' | 'analytics'>('cards');
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showGoalTracker, setShowGoalTracker] = useState(false);

  // Calculator state
  const [calculatorInputs, setCalculatorInputs] = useState({
    monthlyAmount: 1000,
    duration: 12,
    expectedReturn: 12,
  });

  // Goal tracker state
  const [investmentGoal, setInvestmentGoal] = useState({
    targetAmount: 100000,
    targetDate: '',
    currentProgress: 0,
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await sipAPI.getMySubscriptions();
      setSubscriptions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching SIP subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to pause this SIP subscription?')) return;

    try {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: true }));
      await sipAPI.pauseSubscription(subscriptionId);
      await fetchSubscriptions();
      alert('SIP subscription paused successfully!');
    } catch (error: any) {
      console.error('Error pausing subscription:', error);
      alert(error.response?.data?.message || 'Failed to pause subscription');
    } finally {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: false }));
    }
  };

  const handleResumeSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to resume this SIP subscription?')) return;

    try {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: true }));
      await sipAPI.resumeSubscription(subscriptionId);
      await fetchSubscriptions();
      alert('SIP subscription resumed successfully!');
    } catch (error: any) {
      console.error('Error resuming subscription:', error);
      alert(error.response?.data?.message || 'Failed to resume subscription');
    } finally {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: false }));
    }
  };

  const handleCancelSubscription = async () => {
    if (!selectedSubscription) return;

    try {
      setActionLoading(prev => ({ ...prev, [selectedSubscription.id]: true }));
      await sipAPI.cancelSubscription(selectedSubscription.id, { reason: cancelReason });
      await fetchSubscriptions();
      setShowCancelModal(false);
      setSelectedSubscription(null);
      setCancelReason('');
      alert('SIP subscription cancelled successfully!');
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      alert(error.response?.data?.message || 'Failed to cancel subscription');
    } finally {
      setActionLoading(prev => ({ ...prev, [selectedSubscription.id]: false }));
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (activeTab === 'all') return true;
    return sub.status === activeTab;
  });

  const totalInvested = subscriptions.reduce((sum, sub) => sum + parseFloat(sub.total_invested || 0), 0);
  const totalCurrentValue = subscriptions.reduce((sum, sub) => sum + parseFloat(sub.current_value || 0), 0);
  const totalReturns = totalCurrentValue - totalInvested;
  const returnsPercentage = totalInvested > 0 ? ((totalReturns / totalInvested) * 100) : 0;
  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const monthlyCommitment = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, sub) => sum + parseFloat(sub.monthly_amount || 0), 0);

  // Calculate projected annual investment
  const projectedAnnualInvestment = monthlyCommitment * 12;

  // Calculate average monthly return
  const totalMonths = subscriptions.reduce((sum, sub) => {
    const startDate = new Date(sub.start_date);
    const now = new Date();
    const months = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
    return sum + Math.max(1, months);
  }, 0);
  const avgMonthlyReturn = totalMonths > 0 ? (totalReturns / totalMonths) : 0;

  // SIP Calculator
  const calculateSIPReturns = () => {
    const { monthlyAmount, duration, expectedReturn } = calculatorInputs;
    const monthlyRate = expectedReturn / 12 / 100;
    const totalAmount = monthlyAmount * duration;
    const futureValue = monthlyAmount * (((Math.pow(1 + monthlyRate, duration) - 1) / monthlyRate) * (1 + monthlyRate));
    const returns = futureValue - totalAmount;

    return {
      totalInvested: totalAmount,
      estimatedReturns: returns,
      futureValue: futureValue,
    };
  };

  const sipProjection = calculateSIPReturns();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-500 mx-auto mb-4 absolute top-0 left-1/2 -translate-x-1/2" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-purple-200 text-lg font-semibold">Loading your SIP dashboard...</p>
          <p className="text-purple-400 text-sm mt-2">Calculating your investment journey</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 mb-8 overflow-hidden">
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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30">
                  <RefreshCw className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white mb-1">SIP Dashboard</h1>
                  <p className="text-green-100 text-lg">Systematic Investment Plans - Building Wealth Automatically</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCalculator(true)}
                  className="bg-white/20 backdrop-blur-xl text-white px-4 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2 border border-white/30"
                >
                  <Calculator className="w-5 h-5" />
                  Calculator
                </button>
                <Link href="/sip/plans">
                  <button className="bg-white text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all flex items-center gap-2 shadow-xl">
                    <Plus className="w-5 h-5" />
                    New SIP
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active SIPs */}
          <div className="group relative bg-gradient-to-br from-green-500/90 to-emerald-600/90 backdrop-blur-xl rounded-2xl p-6 overflow-hidden border border-green-400/30 shadow-2xl hover:scale-105 transition-all cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-full">
                  <span className="text-xs font-bold text-white">ACTIVE</span>
                </div>
              </div>
              <p className="text-green-100 text-sm font-medium mb-1">Active SIPs</p>
              <p className="text-5xl font-bold text-white mb-2">{activeCount}</p>
              <div className="flex items-center gap-2 text-green-100 text-xs">
                <TrendingUp className="w-4 h-4" />
                <span>Running smoothly</span>
              </div>
            </div>
          </div>

          {/* Monthly Commitment */}
          <div className="group relative bg-gradient-to-br from-blue-500/90 to-indigo-600/90 backdrop-blur-xl rounded-2xl p-6 overflow-hidden border border-blue-400/30 shadow-2xl hover:scale-105 transition-all cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-full">
                  <span className="text-xs font-bold text-white">MONTHLY</span>
                </div>
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">Monthly Commitment</p>
              <p className="text-5xl font-bold text-white mb-2">{formatCurrency(monthlyCommitment)}</p>
              <div className="flex items-center gap-2 text-blue-100 text-xs">
                <ArrowUp className="w-4 h-4" />
                <span>{formatCurrency(projectedAnnualInvestment)}/year</span>
              </div>
            </div>
          </div>

          {/* Total Invested */}
          <div className="group relative bg-gradient-to-br from-purple-500/90 to-pink-600/90 backdrop-blur-xl rounded-2xl p-6 overflow-hidden border border-purple-400/30 shadow-2xl hover:scale-105 transition-all cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-full">
                  <span className="text-xs font-bold text-white">INVESTED</span>
                </div>
              </div>
              <p className="text-purple-100 text-sm font-medium mb-1">Total Invested</p>
              <p className="text-5xl font-bold text-white mb-2">{formatCurrency(totalInvested)}</p>
              <div className="flex items-center gap-2 text-purple-100 text-xs">
                <Package className="w-4 h-4" />
                <span>Across {subscriptions.length} SIP{subscriptions.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Total Returns */}
          <div className={`group relative backdrop-blur-xl rounded-2xl p-6 overflow-hidden shadow-2xl hover:scale-105 transition-all cursor-pointer ${
            totalReturns >= 0
              ? 'bg-gradient-to-br from-emerald-500/90 to-green-600/90 border-emerald-400/30'
              : 'bg-gradient-to-br from-red-500/90 to-rose-600/90 border-red-400/30'
          } border`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  {totalReturns >= 0 ? (
                    <TrendingUp className="w-7 h-7 text-white" />
                  ) : (
                    <TrendingDown className="w-7 h-7 text-white" />
                  )}
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-full">
                  <span className="text-xs font-bold text-white">{returnsPercentage >= 0 ? '+' : ''}{returnsPercentage.toFixed(1)}%</span>
                </div>
              </div>
              <p className={`text-sm font-medium mb-1 ${totalReturns >= 0 ? 'text-emerald-100' : 'text-red-100'}`}>
                Total Returns
              </p>
              <p className="text-5xl font-bold text-white mb-2">{formatCurrency(totalReturns)}</p>
              <div className={`flex items-center gap-2 text-xs ${totalReturns >= 0 ? 'text-emerald-100' : 'text-red-100'}`}>
                <Award className="w-4 h-4" />
                <span>~{formatCurrency(avgMonthlyReturn)}/month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Panel */}
        {totalInvested > 0 && (
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-indigo-400/30 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-indigo-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Portfolio Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-indigo-300 text-sm mb-1">Current Portfolio Value</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(totalCurrentValue)}</p>
                    <p className="text-xs text-indigo-200 mt-1">
                      {returnsPercentage >= 0 ? '↗' : '↘'} {Math.abs(returnsPercentage).toFixed(2)}% return
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-purple-300 text-sm mb-1">Projected Annual Growth</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(avgMonthlyReturn * 12)}</p>
                    <p className="text-xs text-purple-200 mt-1">
                      Based on current average
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-pink-300 text-sm mb-1">Next Payment</p>
                    <p className="text-2xl font-bold text-white">
                      {subscriptions.filter(s => s.status === 'active' && s.next_payment_date).length > 0
                        ? formatDate(
                            subscriptions
                              .filter(s => s.status === 'active' && s.next_payment_date)
                              .sort((a, b) => new Date(a.next_payment_date).getTime() - new Date(b.next_payment_date).getTime())[0]
                              ?.next_payment_date
                          )
                        : 'N/A'
                      }
                    </p>
                    <p className="text-xs text-pink-200 mt-1">
                      Upcoming debit date
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {(['active', 'paused', 'cancelled', 'all'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    {tab === 'all' ? subscriptions.length : subscriptions.filter(s => s.status === tab).length}
                  </span>
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  viewMode === 'cards'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  viewMode === 'timeline'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Timeline</span>
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  viewMode === 'analytics'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {filteredSubscriptions.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <Package className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No {activeTab !== 'all' ? activeTab : ''} SIP subscriptions
              </h3>
              <p className="text-gray-400 mb-6">
                Start building your wealth automatically with systematic investment plans.
                Choose from our curated bundles and let your money work for you.
              </p>
              <Link href="/sip/plans">
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-green-500/30 transition-all flex items-center gap-3 mx-auto">
                  <Plus className="w-5 h-5" />
                  Start Your First SIP
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Cards View */}
            {viewMode === 'cards' && (
              <div className="space-y-6">
                {filteredSubscriptions.map((subscription) => {
                  const invested = parseFloat(subscription.total_invested || 0);
                  const currentValue = parseFloat(subscription.current_value || 0);
                  const returns = currentValue - invested;
                  const returnsPercent = invested > 0 ? ((returns / invested) * 100) : 0;

                  return (
                    <div
                      key={subscription.id}
                      className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-green-500/30 transition-all shadow-xl hover:shadow-2xl hover:shadow-green-500/20"
                    >
                      {/* Status Badge - Top Right */}
                      <div className="absolute top-6 right-6">
                        <div className={`px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-xl border ${
                          subscription.status === 'active'
                            ? 'bg-green-500/20 text-green-300 border-green-400/30' :
                          subscription.status === 'paused'
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' :
                            'bg-gray-500/20 text-gray-300 border-gray-400/30'
                        }`}>
                          {subscription.status.toUpperCase()}
                        </div>
                      </div>

                      {/* Header */}
                      <div className="mb-6 pr-24">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                          {subscription.plan?.name || 'SIP Plan'}
                        </h3>
                        <p className="text-purple-300 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          {subscription.plan?.bundle?.name || 'Investment Bundle'}
                        </p>
                      </div>

                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Monthly Amount
                          </p>
                          <p className="text-white font-bold text-lg">{formatCurrency(subscription.monthly_amount)}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            Total Invested
                          </p>
                          <p className="text-white font-bold text-lg">{formatCurrency(invested)}</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Current Value
                          </p>
                          <p className="text-white font-bold text-lg">{formatCurrency(currentValue)}</p>
                        </div>
                        <div className={`rounded-xl p-4 border ${
                          returns >= 0
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-red-500/10 border-red-500/30'
                        }`}>
                          <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                            <Percent className="w-3 h-3" />
                            Returns
                          </p>
                          <p className={`font-bold text-lg ${returns >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(returns)} ({returnsPercent >= 0 ? '+' : ''}{returnsPercent.toFixed(1)}%)
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {subscription.end_date && (
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-gray-400 text-sm">Investment Progress</p>
                            <p className="text-white text-sm font-semibold">
                              {subscription.investments_count || 0} payments made
                            </p>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                              style={{
                                width: `${Math.min(100, (parseFloat(subscription.total_invested || 0) / parseFloat(subscription.target_amount || 1)) * 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Timeline Info */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/20">
                          <p className="text-blue-300 text-xs mb-1">Started On</p>
                          <p className="text-white font-semibold text-sm">
                            {subscription.start_date ? formatDate(subscription.start_date) : 'N/A'}
                          </p>
                        </div>
                        <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20">
                          <p className="text-purple-300 text-xs mb-1">Next Payment</p>
                          <p className="text-white font-semibold text-sm">
                            {subscription.next_payment_date ? formatDate(subscription.next_payment_date) : 'N/A'}
                          </p>
                        </div>
                        <div className="bg-pink-500/10 rounded-xl p-3 border border-pink-500/20">
                          <p className="text-pink-300 text-xs mb-1">Total Payments</p>
                          <p className="text-white font-semibold text-sm">
                            {subscription.investments_count || 0} times
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3">
                        {subscription.status === 'active' && (
                          <>
                            <button
                              onClick={() => handlePauseSubscription(subscription.id)}
                              disabled={actionLoading[subscription.id]}
                              className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500/20 text-yellow-300 rounded-xl hover:bg-yellow-500/30 transition-all disabled:opacity-50 font-semibold border border-yellow-500/30"
                            >
                              <Pause className="w-4 h-4" />
                              Pause SIP
                            </button>
                            <button
                              onClick={() => {
                                setSelectedSubscription(subscription);
                                setShowCancelModal(true);
                              }}
                              disabled={actionLoading[subscription.id]}
                              className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-all disabled:opacity-50 font-semibold border border-red-500/30"
                            >
                              <X className="w-4 h-4" />
                              Cancel SIP
                            </button>
                          </>
                        )}
                        {subscription.status === 'paused' && (
                          <button
                            onClick={() => handleResumeSubscription(subscription.id)}
                            disabled={actionLoading[subscription.id]}
                            className="flex items-center gap-2 px-5 py-2.5 bg-green-500/20 text-green-300 rounded-xl hover:bg-green-500/30 transition-all disabled:opacity-50 font-semibold border border-green-500/30"
                          >
                            <Play className="w-4 h-4" />
                            Resume SIP
                          </button>
                        )}
                        <Link href={`/sip/${subscription.id}`} className="ml-auto">
                          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-semibold">
                            <Eye className="w-4 h-4" />
                            View Details
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Timeline View */}
            {viewMode === 'timeline' && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-green-400" />
                  Investment Timeline
                </h3>
                <div className="space-y-8">
                  {filteredSubscriptions
                    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
                    .map((subscription, index) => (
                      <div key={subscription.id} className="relative">
                        {/* Timeline Line */}
                        {index !== filteredSubscriptions.length - 1 && (
                          <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-green-500 to-purple-500"></div>
                        )}

                        <div className="flex gap-6">
                          {/* Timeline Dot */}
                          <div className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                            subscription.status === 'active'
                              ? 'bg-green-500 border-green-300'
                              : subscription.status === 'paused'
                              ? 'bg-yellow-500 border-yellow-300'
                              : 'bg-gray-500 border-gray-300'
                          }`}>
                            {subscription.status === 'active' ? (
                              <Activity className="w-6 h-6 text-white" />
                            ) : subscription.status === 'paused' ? (
                              <Pause className="w-6 h-6 text-white" />
                            ) : (
                              <X className="w-6 h-6 text-white" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-6 border border-white/10 hover:border-green-500/30 transition-all">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-xl font-bold text-white mb-1">{subscription.plan?.name || 'SIP Plan'}</h4>
                                <p className="text-purple-300 text-sm">{subscription.plan?.bundle?.name || 'Bundle'}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-400 text-xs">Started</p>
                                <p className="text-white font-semibold">{formatDate(subscription.start_date)}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-gray-400 text-xs mb-1">Monthly</p>
                                <p className="text-white font-bold">{formatCurrency(subscription.monthly_amount)}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs mb-1">Invested</p>
                                <p className="text-white font-bold">{formatCurrency(subscription.total_invested || 0)}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs mb-1">Payments</p>
                                <p className="text-white font-bold">{subscription.investments_count || 0}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Analytics View */}
            {viewMode === 'analytics' && (
              <div className="space-y-6">
                {/* Performance Summary */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-purple-400" />
                    Performance Analytics
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-blue-400/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                          <LineChart className="w-6 h-6 text-blue-300" />
                        </div>
                        <div>
                          <p className="text-blue-200 text-sm">Average Return</p>
                          <p className="text-3xl font-bold text-white">{returnsPercentage.toFixed(2)}%</p>
                        </div>
                      </div>
                      <p className="text-blue-200 text-xs">Across all active SIPs</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-400/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                          <PieChart className="w-6 h-6 text-purple-300" />
                        </div>
                        <div>
                          <p className="text-purple-200 text-sm">Success Rate</p>
                          <p className="text-3xl font-bold text-white">
                            {subscriptions.length > 0 ? ((activeCount / subscriptions.length) * 100).toFixed(0) : 0}%
                          </p>
                        </div>
                      </div>
                      <p className="text-purple-200 text-xs">{activeCount} of {subscriptions.length} SIPs active</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-400/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                          <Target className="w-6 h-6 text-green-300" />
                        </div>
                        <div>
                          <p className="text-green-200 text-sm">Avg Monthly</p>
                          <p className="text-3xl font-bold text-white">{formatCurrency(avgMonthlyReturn)}</p>
                        </div>
                      </div>
                      <p className="text-green-200 text-xs">Monthly return average</p>
                    </div>
                  </div>

                  {/* Individual SIP Analytics */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white mb-4">Individual SIP Performance</h4>
                    {filteredSubscriptions.map((subscription) => {
                      const invested = parseFloat(subscription.total_invested || 0);
                      const currentValue = parseFloat(subscription.current_value || 0);
                      const returns = currentValue - invested;
                      const returnsPercent = invested > 0 ? ((returns / invested) * 100) : 0;

                      return (
                        <div key={subscription.id} className="bg-white/5 rounded-xl p-5 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-white font-semibold">{subscription.plan?.name || 'SIP Plan'}</h5>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              returnsPercent >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                            }`}>
                              {returnsPercent >= 0 ? '+' : ''}{returnsPercent.toFixed(2)}%
                            </span>
                          </div>

                          {/* Performance Bar */}
                          <div className="relative w-full h-8 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                            <div
                              className={`absolute top-0 left-0 h-full transition-all ${
                                returnsPercent >= 0
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                  : 'bg-gradient-to-r from-red-500 to-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.abs(returnsPercent) * 5)}%` }}
                            ></div>
                            <div className="relative z-10 flex items-center justify-between px-3 h-full">
                              <span className="text-white text-xs font-semibold">
                                {formatCurrency(invested)} invested
                              </span>
                              <span className={`text-xs font-semibold ${
                                returnsPercent >= 0 ? 'text-green-300' : 'text-red-300'
                              }`}>
                                {formatCurrency(returns)} returns
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* SIP Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                <Calculator className="w-8 h-8 text-green-400" />
                SIP Calculator
              </h3>
              <button
                onClick={() => setShowCalculator(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <p className="text-gray-400 mb-6">
              Calculate your potential returns with systematic investment plans
            </p>

            <div className="space-y-6 mb-8">
              {/* Monthly Amount */}
              <div>
                <label className="block text-white font-semibold mb-3 flex items-center justify-between">
                  <span>Monthly Investment Amount</span>
                  <span className="text-green-400">{formatCurrency(calculatorInputs.monthlyAmount)}</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={calculatorInputs.monthlyAmount}
                  onChange={(e) => setCalculatorInputs({...calculatorInputs, monthlyAmount: Number(e.target.value)})}
                  className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>AED 100</span>
                  <span>AED 10,000</span>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-white font-semibold mb-3 flex items-center justify-between">
                  <span>Investment Duration</span>
                  <span className="text-blue-400">{calculatorInputs.duration} months ({(calculatorInputs.duration / 12).toFixed(1)} years)</span>
                </label>
                <input
                  type="range"
                  min="6"
                  max="120"
                  step="6"
                  value={calculatorInputs.duration}
                  onChange={(e) => setCalculatorInputs({...calculatorInputs, duration: Number(e.target.value)})}
                  className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>6 months</span>
                  <span>120 months (10 years)</span>
                </div>
              </div>

              {/* Expected Return */}
              <div>
                <label className="block text-white font-semibold mb-3 flex items-center justify-between">
                  <span>Expected Annual Return</span>
                  <span className="text-purple-400">{calculatorInputs.expectedReturn}%</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={calculatorInputs.expectedReturn}
                  onChange={(e) => setCalculatorInputs({...calculatorInputs, expectedReturn: Number(e.target.value)})}
                  className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5%</span>
                  <span>30%</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-400/30 mb-6">
              <h4 className="text-xl font-bold text-white mb-4">Projected Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <p className="text-green-300 text-sm mb-1">Total Invested</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(sipProjection.totalInvested)}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <p className="text-blue-300 text-sm mb-1">Estimated Returns</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(sipProjection.estimatedReturns)}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <p className="text-purple-300 text-sm mb-1">Future Value</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(sipProjection.futureValue)}</p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 flex gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-300 text-sm">
                  This calculator provides estimates based on the power of compounding.
                  Actual returns may vary based on market conditions and investment performance.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCalculator(false)}
                className="flex-1 px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all font-semibold"
              >
                Close
              </button>
              <Link href="/sip/plans" className="flex-1">
                <button
                  onClick={() => setShowCalculator(false)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all font-semibold"
                >
                  Start SIP Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 text-center">Cancel SIP Subscription?</h3>
            <p className="text-gray-400 mb-6 text-center">
              Are you sure you want to cancel this SIP? This action cannot be undone and you'll stop building your wealth automatically.
            </p>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-semibold">Reason for cancellation (optional)</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                rows={4}
                placeholder="Please share why you're cancelling... Your feedback helps us improve."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedSubscription(null);
                  setCancelReason('');
                }}
                className="flex-1 px-6 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all font-semibold"
              >
                Keep SIP
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={actionLoading[selectedSubscription?.id]}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 font-semibold"
              >
                {actionLoading[selectedSubscription?.id] ? 'Cancelling...' : 'Yes, Cancel SIP'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
}
