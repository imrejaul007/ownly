'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notificationAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications({
        unreadOnly: filter === 'unread',
      });
      setNotifications(response.data.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await notificationAPI.getStats();
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      fetchNotifications();
      fetchStats();
      alert('All notifications marked as read');
    } catch (error: any) {
      console.error('Error marking all as read:', error);
      alert(error.response?.data?.message || 'Failed to mark all as read');
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (!confirm('Delete this notification?')) return;

    try {
      await notificationAPI.deleteNotification(notificationId);
      fetchNotifications();
      fetchStats();
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      alert(error.response?.data?.message || 'Failed to delete notification');
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      investment: '💰',
      payout: '💵',
      deal_update: '📊',
      kyc_status: '✅',
      secondary_market: '🔄',
      agent_referral: '👥',
      system: '⚙️',
      announcement: '📢',
    };
    return icons[type] || '📌';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: 'text-gray-600',
      normal: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {stats && `${stats.unread} unread of ${stats.total} total`}
          </p>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          className="btn-secondary text-sm"
          disabled={!stats || stats.unread === 0}
        >
          Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setFilter('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              filter === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Notifications
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              filter === 'unread'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Unread {stats && stats.unread > 0 && `(${stats.unread})`}
          </button>
        </nav>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition ${
                !notification.read ? 'border-l-4 border-primary-500' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-2xl">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`font-semibold ${notification.read ? 'text-gray-600' : 'text-gray-900 dark:text-white'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                        <span>{formatDate(notification.created_at)}</span>
                        <span className="capitalize">{notification.type.replace('_', ' ')}</span>
                        <span className={getPriorityColor(notification.priority)}>
                          {notification.priority !== 'normal' && notification.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-sm text-primary-600 hover:text-primary-900"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="text-sm text-red-600 hover:text-red-900"
                      >
                        Delete
                        </button>
                    </div>
                  </div>
                  {notification.link && (
                    <Link
                      href={notification.link}
                      className="inline-block mt-2 text-sm text-primary-600 hover:text-primary-900 font-medium"
                    >
                      View Details →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      {stats && stats.byType && Object.keys(stats.byType).length > 0 && (
        <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Notifications by Type
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.byType).map(([type, count]: [string, any]) => (
              <div key={type} className="text-center">
                <div className="text-2xl mb-1">{getNotificationIcon(type)}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {type.replace('_', ' ')}
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{count}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
