'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { investmentAPI } from '@/lib/api';
import { usePreferences } from '@/context/PreferencesContext';
import Link from 'next/link';
import axios from 'axios';

interface MonthlyPayout {
  month: string;
  amount: number;
  status: string;
  date: string;
}

export default function InvestmentDetailPage() {
  const { formatCurrency } = usePreferences();
  const params = useParams();
  const router = useRouter();
  const [investment, setInvestment] = useState<any>(null);
  const [monthlyPayouts, setMonthlyPayouts] = useState<MonthlyPayout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchInvestment(params.id as string);
    }
  }, [params?.id]);

  const fetchInvestment = async (id: string) => {
    try {
      setLoading(true);
      const response = await investmentAPI.get(id);
      setInvestment(response.data.data.investment);

      // Fetch monthly payouts/earnings for this investment
      const token = localStorage.getItem('token');
      try {
        const payoutsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/investments/my-transactions?type=payout`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Generate monthly payouts based on investment timeline
        const investedDate = new Date(response.data.data.investment.invested_at);
        const now = new Date();
        const monthsPassed = Math.floor((now.getTime() - investedDate.getTime()) / (1000 * 60 * 60 * 24 * 30));

        const holdingPeriodMonths = response.data.data.investment.deal?.holding_period_months || 12;
        const monthlyROI = parseFloat(response.data.data.investment.deal?.expected_roi || 0) / holdingPeriodMonths;
        const investedAmount = parseFloat(response.data.data.investment.amount);

        const payouts: MonthlyPayout[] = [];
        // Generate payouts for the entire holding period
        for (let i = 0; i < holdingPeriodMonths; i++) {
          const payoutDate = new Date(investedDate);
          payoutDate.setMonth(payoutDate.getMonth() + i + 1);

          const monthlyAmount = (investedAmount * monthlyROI) / 100;
          const isCompleted = payoutDate <= now;

          payouts.push({
            month: payoutDate.toISOString().substring(0, 7),
            amount: monthlyAmount,
            status: isCompleted ? 'completed' : 'projected',
            date: payoutDate.toISOString(),
          });
        }

        setMonthlyPayouts(payouts);
      } catch (payoutError) {
        console.error('Error fetching payouts:', payoutError);
        // Continue without payouts
      }
    } catch (error) {
      console.error('Error fetching investment:', error);
      alert('Investment not found');
      router.push('/investments');
    } finally {
      setLoading(false);
    }
  };

  const calculateROI = () => {
    if (!investment) return '0.00';
    const invested = parseFloat(investment.amount || 0);
    const current = parseFloat(investment.current_value || invested);
    return invested > 0 ? (((current - invested) / invested) * 100).toFixed(2) : '0.00';
  };

  const calculateGainLoss = () => {
    if (!investment) return 0;
    const invested = parseFloat(investment.amount || 0);
    const current = parseFloat(investment.current_value || invested);
    return current - invested;
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      exited: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!investment) {
    return null;
  }

  const roi = calculateROI();
  const gainLoss = calculateGainLoss();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm">
        <Link href="/investments" className="text-primary-600 hover:text-primary-800">
          ← Back to My Investments
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {investment.deal?.title || 'Investment Details'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Investment ID: {investment.id}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(investment.status)}`}>
            {investment.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Invested Amount</div>
          <div className="text-3xl font-bold text-blue-600">{formatCurrency(investment.amount)}</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Value</div>
          <div className="text-3xl font-bold text-purple-600">
            {formatCurrency(investment.current_value || investment.amount)}
          </div>
        </div>
        <div className={`${gainLoss >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} rounded-lg p-6`}>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Gain/Loss</div>
          <div className={`text-3xl font-bold ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)}
          </div>
        </div>
        <div className={`${parseFloat(roi) >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} rounded-lg p-6`}>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">ROI</div>
          <div className={`text-3xl font-bold ${parseFloat(roi) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(roi) >= 0 ? '+' : ''}{roi}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Investment Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Investment Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Investment Date</span>
                <span className="font-semibold">{new Date(investment.invested_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Shares Issued</span>
                <span className="font-semibold">{investment.shares_issued?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Share Price</span>
                <span className="font-semibold">
                  {formatCurrency(parseFloat(investment.amount) / (investment.shares_issued || 1))}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Deal Type</span>
                <span className="font-semibold capitalize">{investment.deal?.type?.replace('_', ' ') || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-600 dark:text-gray-400">Location</span>
                <span className="font-semibold">{investment.deal?.location || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Monthly Earnings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Monthly Earnings</h2>
              {monthlyPayouts.length > 0 && (
                <div className="flex gap-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Earned</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(monthlyPayouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Projected Total</div>
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(monthlyPayouts.reduce((sum, p) => sum + p.amount, 0))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {monthlyPayouts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">No payouts received yet</p>
                <p className="text-sm text-gray-500 mt-2">Payouts will appear here once the holding period begins</p>
              </div>
            ) : (
              <>
                {/* Earnings Chart */}
                <div className="mb-6">
                  <div className="flex justify-end mb-2 text-xs space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                      <span className="text-gray-600 dark:text-gray-400">Completed</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-400 rounded mr-1"></div>
                      <span className="text-gray-600 dark:text-gray-400">Projected</span>
                    </div>
                  </div>
                  <div className="flex items-end justify-between h-32 space-x-2">
                    {monthlyPayouts.slice(0, 12).map((payout, index) => {
                      const maxAmount = Math.max(...monthlyPayouts.map(p => p.amount), 1);
                      const height = (payout.amount / maxAmount) * 100;
                      const isCompleted = payout.status === 'completed';
                      return (
                        <div key={payout.month} className="flex-1 flex flex-col items-center">
                          <div className="w-full flex flex-col justify-end h-full">
                            <div className={`text-xs text-center mb-1 font-semibold ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                              {formatCurrency(payout.amount).replace('.00', '')}
                            </div>
                            <div
                              className={`w-full rounded-t-md ${isCompleted ? 'bg-gradient-to-t from-green-500 to-green-300' : 'bg-gradient-to-t from-blue-400 to-blue-200'}`}
                              style={{ height: `${height}%`, minHeight: '20px' }}
                            ></div>
                          </div>
                          <div className="text-xs mt-2 text-gray-600 dark:text-gray-400 text-center">
                            {new Date(payout.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payout Table */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Payout History</h3>
                  <div className="max-h-64 overflow-y-auto">
                    {monthlyPayouts.map((payout, index) => {
                      const isCompleted = payout.status === 'completed';
                      return (
                        <div key={payout.month} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${isCompleted ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'} rounded-full flex items-center justify-center`}>
                              <svg className={`w-4 h-4 ${isCompleted ? 'text-green-600 dark:text-green-300' : 'text-blue-600 dark:text-blue-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                {new Date(payout.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </div>
                              <div className="text-xs text-gray-500">Monthly payout #{index + 1}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                              {isCompleted ? '+' : ''}{formatCurrency(payout.amount)}
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {payout.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Transaction History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">Initial Investment</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(investment.invested_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{formatCurrency(investment.amount)}</div>
                  <div className="text-sm text-gray-600">{investment.shares_issued} shares</div>
                </div>
              </div>

              {monthlyPayouts.filter(p => p.status === 'completed').length > 0 && (
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-green-900 dark:text-green-100">Total Payouts Received</div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        {monthlyPayouts.filter(p => p.status === 'completed').length} completed payments
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600 text-lg">
                      +{formatCurrency(monthlyPayouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0))}
                    </div>
                    <div className="text-sm text-green-700">Cumulative</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Deal Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Related Deal</h3>
            {investment.deal && (
              <div>
                <h4 className="font-semibold mb-2">{investment.deal.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {investment.deal.description?.substring(0, 100)}...
                </p>
                <Link href={`/deals/${investment.deal_id}`}>
                  <button className="w-full btn-primary text-sm">
                    View Deal Details
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {investment.status === 'active' && (
                <>
                  <Link href="/secondary-market">
                    <button className="w-full px-4 py-3 bg-primary-100 text-primary-800 rounded-lg hover:bg-primary-200 transition text-sm font-semibold">
                      List Shares for Sale
                    </button>
                  </Link>
                  <Link href="/documents">
                    <button className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-semibold">
                      View Documents
                    </button>
                  </Link>
                  <Link href="/analytics">
                    <button className="w-full px-4 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition text-sm font-semibold">
                      View Analytics
                    </button>
                  </Link>
                </>
              )}
              <button
                onClick={() => window.print()}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-semibold"
              >
                Print Statement
              </button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Performance Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Holding Period</span>
                <span className="font-semibold">
                  {Math.floor((new Date().getTime() - new Date(investment.invested_at).getTime()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Expected ROI</span>
                <span className="font-semibold text-green-600">{investment.deal?.expected_roi || 0}%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Holding Period</span>
                <span className="font-semibold">{investment.deal?.holding_period_months || 0} months</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
