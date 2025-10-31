'use client';

import { useState, useEffect } from 'react';
import { sipAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Calendar, DollarSign, TrendingUp, Pause, Play, X, Plus,
  RefreshCw, BarChart3, Clock, CheckCircle, AlertCircle,
  ArrowRight, Target, Zap, Package, Activity, Eye
} from 'lucide-react';
import Link from 'next/link';

export default function SIPDashboard Page() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'paused' | 'cancelled' | 'all'>('active');
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState('');

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

  // Calculate summary statistics
  const totalInvested = subscriptions.reduce((sum, sub) => sum + parseFloat(sub.total_invested || 0), 0);
  const totalCurrentValue = subscriptions.reduce((sum, sub) => sum + parseFloat(sub.current_value || 0), 0);
  const totalReturns = totalCurrentValue - totalInvested;
  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const monthlyCommitment = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, sub) => sum + parseFloat(sub.monthly_amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading your SIP dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <RefreshCw className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    SIP Dashboard
                  </h1>
                  <p className="text-green-100 mt-1">
                    Systematic Investment Plans • Automated Monthly Investing
                  </p>
                </div>
              </div>
              <Link href="/sip/plans">
                <button className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl hover:bg-white/30 transition-all font-semibold flex items-center gap-2 hover:scale-105">
                  <Plus className="w-5 h-5" />
                  New SIP
                </button>
              </Link>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-200" />
                  <div className="text-green-100 text-xs">Active SIPs</div>
                </div>
                <div className="text-3xl font-bold text-white">{activeCount}</div>
                <div className="text-xs text-green-200 mt-1">Running subscriptions</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-200" />
                  <div className="text-green-100 text-xs">Monthly Commitment</div>
                </div>
                <div className="text-3xl font-bold text-white">
                  {formatCurrency(monthlyCommitment)}
                </div>
                <div className="text-xs text-green-200 mt-1">Per month</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-green-200" />
                  <div className="text-green-100 text-xs">Total Invested</div>
                </div>
                <div className="text-3xl font-bold text-white">
                  {formatCurrency(totalInvested)}
                </div>
                <div className="text-xs text-green-200 mt-1">Via all SIPs</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-200" />
                  <div className="text-green-100 text-xs">Total Returns</div>
                </div>
                <div className={\`text-3xl font-bold \${totalReturns >= 0 ? 'text-green-300' : 'text-red-300'}\`}>
                  {formatCurrency(Math.abs(totalReturns))}
                </div>
                <div className="text-xs text-green-200 mt-1">
                  {totalInvested > 0 ? \`\${((totalReturns / totalInvested) * 100).toFixed(2)}% gain\` : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-2 inline-flex gap-2 shadow-2xl">
            {[
              { key: 'active', label: 'Active', icon: CheckCircle },
              { key: 'paused', label: 'Paused', icon: Pause },
              { key: 'cancelled', label: 'Cancelled', icon: X },
              { key: 'all', label: 'All', icon: Package }
            ].map(tab => {
              const Icon = tab.icon;
              const count = tab.key === 'all'
                ? subscriptions.length
                : subscriptions.filter(s => s.status === tab.key).length;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={\`px-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center gap-2 \${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                      : 'text-purple-200 hover:text-white hover:bg-white/5'
                  }\`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {count > 0 && (
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subscriptions List or Empty State */}
        {filteredSubscriptions.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <RefreshCw className="w-16 h-16 text-purple-300 mx-auto mb-4 opacity-50" />
            <p className="text-purple-200 text-lg mb-4">
              {activeTab === 'all'
                ? "You don't have any SIP subscriptions yet"
                : \`No \${activeTab} subscriptions found\`}
            </p>
            <Link href="/sip/plans">
              <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2 mx-auto">
                <Plus className="w-5 h-5" />
                Start Your First SIP
              </button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <p className="text-purple-200">Feature under development. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
