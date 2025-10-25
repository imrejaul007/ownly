'use client';

import { useState, useEffect } from 'react';
import { agentAPI } from '@/lib/api';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';

export default function AgentDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'commissions'>('overview');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await agentAPI.getDashboard();
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching agent dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Agent Profile Not Found
          </h2>
          <p className="text-gray-600">You need to be registered as an agent to access this dashboard.</p>
        </div>
      </div>
    );
  }

  const { agent, metrics, monthlyPerformance, topInvestors, dealTypePerformance, recentActivity, allReferrals, allInvestments } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Agent Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your referrals and commissions
        </p>
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Your Referral Code</p>
          <p className="text-2xl font-bold text-primary-600">{agent.referral_code}</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Referrals"
          value={metrics.totalReferrals.toString()}
          subtitle={`${metrics.activeReferrals} active`}
          color="blue"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          subtitle={`${metrics.activeReferrals} / ${metrics.totalReferrals} invested`}
          color="green"
        />
        <MetricCard
          title="Total Volume"
          value={formatCurrency(metrics.totalInvestmentVolume)}
          color="purple"
        />
        <MetricCard
          title="Pending Commission"
          value={formatCurrency(metrics.pendingCommission)}
          subtitle={`Total earned: ${formatCurrency(metrics.totalCommissionEarned)}`}
          color="green"
        />
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            label="Overview"
          />
          <TabButton
            active={activeTab === 'referrals'}
            onClick={() => setActiveTab('referrals')}
            label="Referrals"
          />
          <TabButton
            active={activeTab === 'commissions'}
            onClick={() => setActiveTab('commissions')}
            label="Commissions"
          />
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Monthly Performance Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Monthly Performance (Last 12 Months)</h2>
            <div className="space-y-4">
              {monthlyPerformance.map((month: any) => (
                <div key={month.month} className="flex items-center space-x-4">
                  <div className="w-24 text-sm text-gray-600">{month.month}</div>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="bg-primary-500 h-full rounded-full flex items-center px-3"
                      style={{ width: `${Math.min((month.volume / 100000) * 100, 100)}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {formatCurrency(month.volume)}
                      </span>
                    </div>
                  </div>
                  <div className="w-32 text-sm text-gray-600">
                    {month.referrals} referrals, {month.investments} investments
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deal Type Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Performance by Deal Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dealTypePerformance.map((item: any) => (
                <div
                  key={item.dealType}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                >
                  <p className="text-sm text-gray-600 capitalize">{item.dealType}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.count}
                  </p>
                  <p className="text-sm text-gray-600">{formatCurrency(item.volume)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Investors */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Top 10 Referred Investors</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Investor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Invested
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Investments
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topInvestors.map((investor: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {investor.user.full_name}
                        </div>
                        <div className="text-sm text-gray-500">{investor.user.email}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {formatCurrency(investor.totalInvested)}
                      </td>
                      <td className="px-6 py-4">{investor.investmentCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Activity (Last 30 Days)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">New Referrals</p>
                <p className="text-3xl font-bold text-blue-600">{recentActivity.referrals}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">New Investments</p>
                <p className="text-3xl font-bold text-green-600">{recentActivity.investments}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Volume</p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatCurrency(recentActivity.volume)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Referrals Tab */}
      {activeTab === 'referrals' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">All Referrals</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    KYC Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allReferrals.map((referral: any) => (
                  <tr key={referral.id}>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {referral.full_name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{referral.email}</td>
                    <td className="px-6 py-4">
                      <span className={`badge badge-${referral.kyc_status === 'verified' ? 'green' : 'yellow'} capitalize`}>
                        {referral.kyc_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatDate(referral.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Commissions Tab */}
      {activeTab === 'commissions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 mb-2">Total Earned</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(agent.commission_earned)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 mb-2">Total Paid</p>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(agent.commission_paid)}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 mb-2">Pending</p>
              <p className="text-3xl font-bold text-orange-600">
                {formatCurrency(agent.pending_commission)}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Commission Breakdown</h2>
            <p className="text-gray-600">
              Commission is calculated based on referred investor activity. Contact admin for payout requests.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string;
  subtitle?: string;
  color: string;
}) {
  const colorClasses: { [key: string]: string } = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      {subtitle && <div className="text-sm text-gray-600">{subtitle}</div>}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-1 border-b-2 font-medium text-sm ${
        active
          ? 'border-primary-500 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}
