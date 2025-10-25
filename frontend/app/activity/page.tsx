'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

interface ActivityLog {
  id: string;
  action: string;
  action_category: string;
  entity_type: string | null;
  entity_id: string | null;
  description: string;
  severity: string;
  ip_address: string | null;
  user_agent: string | null;
  changes: any;
  metadata: any;
  created_at: string;
}

interface ActivityStats {
  totalLogs: number;
  recentActivity: number;
  byCategory: { category: string; count: number }[];
  bySeverity: { severity: string; count: number }[];
  recentUsers: any[];
}

export default function ActivityPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: 'all',
    severity: 'all',
    limit: 50,
  });

  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, [filter]);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filter.category !== 'all') params.append('category', filter.category);
      if (filter.severity !== 'all') params.append('severity', filter.severity);
      params.append('limit', filter.limit.toString());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/activity-logs/my-activity?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      setActivities(data.logs);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activity-logs/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'critical':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return '🔐';
      case 'investment':
        return '💰';
      case 'deal':
        return '📊';
      case 'document':
        return '📄';
      case 'profile':
        return '👤';
      case 'kyc':
        return '✅';
      case 'payout':
        return '💸';
      case 'notification':
        return '🔔';
      default:
        return '📝';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading activity...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600 mt-2">Track your account activity and platform interactions</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Total Activities</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalLogs}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Last 24 Hours</div>
              <div className="text-3xl font-bold text-blue-600">{stats.recentActivity}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Top Category</div>
              <div className="text-xl font-bold text-gray-900 capitalize">
                {stats.byCategory[0]?.category || 'N/A'}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-sm text-gray-600 mb-1">Active Sessions</div>
              <div className="text-3xl font-bold text-green-600">
                {stats.recentUsers.length}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filter.category}
                  onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="auth">Authentication</option>
                  <option value="investment">Investments</option>
                  <option value="deal">Deals</option>
                  <option value="document">Documents</option>
                  <option value="profile">Profile</option>
                  <option value="kyc">KYC</option>
                  <option value="payout">Payouts</option>
                  <option value="notification">Notifications</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                <select
                  value={filter.severity}
                  onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Severities</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Show</label>
                <select
                  value={filter.limit}
                  onChange={(e) => setFilter({ ...filter, limit: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="25">Last 25</option>
                  <option value="50">Last 50</option>
                  <option value="100">Last 100</option>
                  <option value="200">Last 200</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>
            {activities.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No activities found for the selected filters
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex-shrink-0 text-2xl">
                      {getCategoryIcon(activity.action_category)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 mb-1">
                            {activity.action}
                          </h3>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                              activity.severity
                            )}`}
                          >
                            {activity.severity}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <span>⏰</span>
                          {formatDate(activity.created_at)}
                        </span>
                        {activity.entity_type && (
                          <span className="flex items-center gap-1">
                            <span>📦</span>
                            {activity.entity_type}
                          </span>
                        )}
                        {activity.ip_address && (
                          <span className="flex items-center gap-1">
                            <span>🌐</span>
                            {activity.ip_address}
                          </span>
                        )}
                      </div>

                      {activity.changes && Object.keys(activity.changes).length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                            View changes
                          </summary>
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(activity.changes, null, 2)}
                            </pre>
                          </div>
                        </details>
                      )}

                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                            View metadata
                          </summary>
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(activity.metadata, null, 2)}
                            </pre>
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {stats && stats.byCategory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity by Category</h2>
              <div className="space-y-3">
                {stats.byCategory.map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{getCategoryIcon(item.category)}</span>
                      <span className="text-sm text-gray-700 capitalize">{item.category}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity by Severity</h2>
              <div className="space-y-3">
                {stats.bySeverity.map((item) => (
                  <div key={item.severity} className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                        item.severity
                      )}`}
                    >
                      {item.severity}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
