'use client';

import { useState, useEffect } from 'react';
import { dealAPI, spvAPI, analyticsAPI } from '@/lib/api';
import { formatCurrency, formatPercentage } from '@/lib/utils';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create-deal' | 'kyc'>('dashboard');
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchAnalytics();
    }
  }, [activeTab]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getPlatform();
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Panel
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage platform, deals, and operations
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {['dashboard', 'create-deal', 'kyc'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && <DashboardTab analytics={analytics} loading={loading} />}
      {activeTab === 'create-deal' && <CreateDealForm />}
      {activeTab === 'kyc' && <KYCManagementTab />}
    </div>
  );
}

function DashboardTab({ analytics, loading }: { analytics: any; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="text-center py-12">No data available</div>;
  }

  const { overview, breakdown, topPerformers, recentActivity } = analytics;

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Raised"
          value={formatCurrency(overview.totalRaised)}
          subtitle={`${overview.totalDeals} deals`}
          color="blue"
        />
        <MetricCard
          title="Active Investors"
          value={overview.totalInvestors.toLocaleString()}
          subtitle={`${overview.activeInvestments} active investments`}
          color="green"
        />
        <MetricCard
          title="Platform AUM"
          value={formatCurrency(overview.totalSPVBalance)}
          subtitle={`${overview.activeSPVs} active SPVs`}
          color="purple"
        />
        <MetricCard
          title="Payouts Distributed"
          value={formatCurrency(overview.totalPayoutsDistributed)}
          subtitle={`${formatPercentage(overview.fundingSuccessRate)} success rate`}
          color="yellow"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deals by Type */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Deals by Type</h3>
          <div className="space-y-3">
            {breakdown.dealsByType.map((item: any) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-24 text-sm font-medium capitalize">
                    {item.type.replace('_', ' ')}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-2 w-48">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${(item.count / overview.totalDeals) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold ml-4">
                  {item.count} ({formatCurrency(item.totalRaised)})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deals by Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Deals by Status</h3>
          <div className="space-y-3">
            {breakdown.dealsByStatus.map((item: any) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-24 text-sm font-medium capitalize">
                    {item.status}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-200 rounded-full h-2 w-48">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${(item.count / overview.totalDeals) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold ml-4">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Deals */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Top Performing Deals</h3>
          <div className="space-y-3">
            {topPerformers.topDeals.slice(0, 5).map((deal: any, index: number) => (
              <div key={deal.id} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 text-primary-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{deal.title}</div>
                    <div className="text-xs text-gray-600 capitalize">{deal.type.replace('_', ' ')}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(deal.raisedAmount)}</div>
                  <div className="text-xs text-gray-600">
                    {formatPercentage(deal.fundingPercentage)} funded
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Agents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Top Agents</h3>
          <div className="space-y-3">
            {topPerformers.topAgents.slice(0, 5).map((agent: any, index: number) => (
              <div key={agent.id} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{agent.name || agent.code}</div>
                    <div className="text-xs text-gray-600">{agent.referralCount} referrals</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(agent.totalReferred)}</div>
                  <div className="text-xs text-gray-600">
                    {formatCurrency(agent.commissionsEarned)} earned
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Recent Activity (Last 7 Days)</h3>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-600">{recentActivity.recentDeals}</div>
            <div className="text-sm text-gray-600 mt-1">New Deals</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">{recentActivity.recentInvestments}</div>
            <div className="text-sm text-gray-600 mt-1">New Investments</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">{recentActivity.recentTransactions}</div>
            <div className="text-sm text-gray-600 mt-1">Transactions</div>
          </div>
        </div>
      </div>
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
  subtitle: string;
  color: string;
}) {
  const colorClasses: { [key: string]: string } = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      <div className="text-xs text-gray-600">{subtitle}</div>
    </div>
  );
}

function CreateDealForm() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'real_estate',
    location: '',
    description: '',
    target_amount: '',
    min_ticket: '',
    max_ticket: '',
    holding_period_months: '',
    expected_roi: '',
    expected_irr: '',
    jurisdiction: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const dealResponse = await dealAPI.create({
        ...formData,
        target_amount: parseFloat(formData.target_amount),
        min_ticket: parseFloat(formData.min_ticket),
        max_ticket: formData.max_ticket ? parseFloat(formData.max_ticket) : null,
        holding_period_months: parseInt(formData.holding_period_months),
        expected_roi: parseFloat(formData.expected_roi),
        expected_irr: parseFloat(formData.expected_irr),
        fees: {
          platform_fee: 2.0,
          management_fee: 1.5,
          carry: 20.0,
        },
      });

      const dealId = dealResponse.data.data.deal.id;
      await spvAPI.create(dealId);
      await dealAPI.publish(dealId);

      setSuccess('Deal created and published successfully!');
      setFormData({
        title: '',
        type: 'real_estate',
        location: '',
        description: '',
        target_amount: '',
        min_ticket: '',
        max_ticket: '',
        holding_period_months: '',
        expected_roi: '',
        expected_irr: '',
        jurisdiction: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Deal</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deal Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Luxury Villa in Palm Jumeirah"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deal Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="real_estate">Real Estate</option>
              <option value="franchise">Franchise</option>
              <option value="startup">Startup</option>
              <option value="asset">Asset</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Dubai, UAE"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Amount (USD) *
            </label>
            <input
              type="number"
              value={formData.target_amount}
              onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 1000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Min Ticket (USD) *
            </label>
            <input
              type="number"
              value={formData.min_ticket}
              onChange={(e) => setFormData({ ...formData, min_ticket: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 10000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Holding Period (Months) *
            </label>
            <input
              type="number"
              value={formData.holding_period_months}
              onChange={(e) => setFormData({ ...formData, holding_period_months: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expected ROI (%) *
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.expected_roi}
              onChange={(e) => setFormData({ ...formData, expected_roi: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., 12.5"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Describe the investment opportunity..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create & Publish Deal'}
          </button>
        </div>
      </form>
    </div>
  );
}

function KYCManagementTab() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">KYC Management</h2>
      <p className="text-gray-600">
        KYC management features coming in the next update. Navigate to{' '}
        <a href="/kyc" className="text-primary-600 hover:underline">
          /kyc
        </a>{' '}
        for KYC queue.
      </p>
    </div>
  );
}
