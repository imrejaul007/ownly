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

export default function SIPDashboardPage() {
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
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-10 h-10 text-white" />
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">SIP Dashboard</h1>
                  <p className="text-green-100">Systematic Investment Plans</p>
                </div>
              </div>
              <Link href="/sip/plans">
                <button className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New SIP
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active SIPs</p>
                <p className="text-3xl font-bold text-white">{activeCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Monthly Commitment</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(monthlyCommitment)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Invested</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(totalInvested)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-3 rounded-lg ${totalReturns >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <TrendingUp className={`w-6 h-6 ${totalReturns >= 0 ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Returns</p>
                <p className={`text-3xl font-bold ${totalReturns >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(totalReturns)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex gap-4 mb-6 overflow-x-auto">
            {(['active', 'paused', 'cancelled', 'all'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/10">
                  {tab === 'all' ? subscriptions.length : subscriptions.filter(s => s.status === tab).length}
                </span>
              </button>
            ))}
          </div>

          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No {activeTab !== 'all' ? activeTab : ''} SIP subscriptions found</p>
              <Link href="/sip/plans">
                <button className="mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 mx-auto">
                  <Plus className="w-4 h-4" />
                  Start Your First SIP
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-xl p-6 hover:shadow-lg hover:border-green-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{subscription.plan?.name || 'SIP Plan'}</h3>
                      <p className="text-gray-400 text-sm">{subscription.plan?.bundle?.name || 'Bundle'}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      subscription.status === 'active' ? 'bg-green-500/20 text-green-300' :
                      subscription.status === 'paused' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {subscription.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Monthly Amount</p>
                      <p className="text-white font-semibold">{formatCurrency(subscription.monthly_amount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Total Invested</p>
                      <p className="text-white font-semibold">{formatCurrency(subscription.total_invested || 0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Next Payment</p>
                      <p className="text-white font-semibold">{subscription.next_payment_date ? formatDate(subscription.next_payment_date) : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Investments</p>
                      <p className="text-white font-semibold">{subscription.investments_count || 0} times</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {subscription.status === 'active' && (
                      <>
                        <button
                          onClick={() => handlePauseSubscription(subscription.id)}
                          disabled={actionLoading[subscription.id]}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-all disabled:opacity-50"
                        >
                          <Pause className="w-4 h-4" />
                          Pause
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSubscription(subscription);
                            setShowCancelModal(true);
                          }}
                          disabled={actionLoading[subscription.id]}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    )}
                    {subscription.status === 'paused' && (
                      <button
                        onClick={() => handleResumeSubscription(subscription.id)}
                        disabled={actionLoading[subscription.id]}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all disabled:opacity-50"
                      >
                        <Play className="w-4 h-4" />
                        Resume
                      </button>
                    )}
                    <Link href={`/sip/${subscription.id}`}>
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Cancel SIP Subscription</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to cancel this SIP? This action cannot be undone.
            </p>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Reason for cancellation (optional)</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Please share why you're cancelling..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedSubscription(null);
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all"
              >
                Keep SIP
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={actionLoading[selectedSubscription?.id]}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {actionLoading[selectedSubscription?.id] ? 'Cancelling...' : 'Cancel SIP'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
