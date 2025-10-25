'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { webhookAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  secret: string;
  headers?: Record<string, string>;
  timeout: number;
  retry_config: {
    max_attempts: number;
    retry_delay: number;
    backoff_multiplier: number;
  };
  statistics: {
    total_deliveries: number;
    successful_deliveries: number;
    failed_deliveries: number;
  };
  last_triggered_at?: string;
  created_at: string;
}

interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event_type: string;
  status: 'pending' | 'success' | 'failed';
  attempt_count: number;
  max_attempts: number;
  response_status?: number;
  error_message?: string;
  created_at: string;
}

interface EventCategory {
  category: string;
  events: Array<{
    name: string;
    description: string;
  }>;
}

export default function WebhooksPage() {
  const router = useRouter();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [availableEvents, setAvailableEvents] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeliveries, setShowDeliveries] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: [] as string[],
    status: 'active' as 'active' | 'inactive',
    timeout: 30,
  });

  useEffect(() => {
    fetchWebhooks();
    fetchAvailableEvents();
  }, []);

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      const response = await webhookAPI.getWebhooks();
      setWebhooks(response.data.webhooks || []);
    } catch (error: any) {
      console.error('Error fetching webhooks:', error);
      showMessage('error', error.response?.data?.message || 'Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableEvents = async () => {
    try {
      const response = await webhookAPI.getAvailableEvents();
      setAvailableEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching available events:', error);
    }
  };

  const fetchDeliveries = async (webhookId: string) => {
    try {
      const response = await webhookAPI.getDeliveries(webhookId);
      setDeliveries(response.data.deliveries || []);
      setShowDeliveries(true);
    } catch (error: any) {
      console.error('Error fetching deliveries:', error);
      showMessage('error', error.response?.data?.message || 'Failed to load delivery logs');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.events.length === 0) {
      showMessage('error', 'Please select at least one event');
      return;
    }

    setProcessing(true);
    try {
      await webhookAPI.createWebhook(formData);
      showMessage('success', 'Webhook created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchWebhooks();
    } catch (error: any) {
      console.error('Error creating webhook:', error);
      showMessage('error', error.response?.data?.message || 'Failed to create webhook');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return;

    setProcessing(true);
    try {
      await webhookAPI.deleteWebhook(webhookId);
      showMessage('success', 'Webhook deleted successfully');
      fetchWebhooks();
    } catch (error: any) {
      console.error('Error deleting webhook:', error);
      showMessage('error', error.response?.data?.message || 'Failed to delete webhook');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleStatus = async (webhook: Webhook) => {
    setProcessing(true);
    try {
      await webhookAPI.updateWebhook(webhook.id, {
        status: webhook.status === 'active' ? 'inactive' : 'active',
      });
      showMessage('success', `Webhook ${webhook.status === 'active' ? 'disabled' : 'enabled'}`);
      fetchWebhooks();
    } catch (error: any) {
      console.error('Error updating webhook:', error);
      showMessage('error', error.response?.data?.message || 'Failed to update webhook');
    } finally {
      setProcessing(false);
    }
  };

  const handleTestWebhook = async (webhookId: string) => {
    setProcessing(true);
    try {
      await webhookAPI.testWebhook(webhookId);
      showMessage('success', 'Test webhook sent successfully');
    } catch (error: any) {
      console.error('Error testing webhook:', error);
      showMessage('error', error.response?.data?.message || 'Failed to send test webhook');
    } finally {
      setProcessing(false);
    }
  };

  const handleRetryDelivery = async (webhookId: string, deliveryId: string) => {
    setProcessing(true);
    try {
      await webhookAPI.retryDelivery(webhookId, deliveryId);
      showMessage('success', 'Delivery retry initiated');
      if (selectedWebhook) {
        fetchDeliveries(selectedWebhook.id);
      }
    } catch (error: any) {
      console.error('Error retrying delivery:', error);
      showMessage('error', error.response?.data?.message || 'Failed to retry delivery');
    } finally {
      setProcessing(false);
    }
  };

  const toggleEvent = (eventName: string) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.includes(eventName)
        ? prev.events.filter((e) => e !== eventName)
        : [...prev.events, eventName],
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      events: [],
      status: 'active',
      timeout: 30,
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/settings')}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
          >
            ← Back to Settings
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Webhooks</h1>
              <p className="mt-2 text-gray-600">Configure webhooks to receive real-time event notifications</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              + Create Webhook
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Webhooks List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading webhooks...</p>
          </div>
        ) : webhooks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No webhooks configured</h3>
            <p className="text-gray-600 mb-6">
              Create your first webhook to start receiving real-time event notifications
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Webhook
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{webhook.name}</h3>
                      {getStatusBadge(webhook.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{webhook.url}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {webhook.events.slice(0, 3).map((event) => (
                        <span
                          key={event}
                          className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md"
                        >
                          {event}
                        </span>
                      ))}
                      {webhook.events.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                          +{webhook.events.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Total Deliveries:</span>
                        <span className="ml-2 font-medium">{webhook.statistics.total_deliveries}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Success Rate:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {webhook.statistics.total_deliveries > 0
                            ? Math.round((webhook.statistics.successful_deliveries / webhook.statistics.total_deliveries) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Triggered:</span>
                        <span className="ml-2 font-medium">
                          {webhook.last_triggered_at ? formatDate(webhook.last_triggered_at) : 'Never'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col space-y-2">
                    <button
                      onClick={() => handleToggleStatus(webhook)}
                      disabled={processing}
                      className={`px-3 py-2 text-sm rounded-lg ${
                        webhook.status === 'active'
                          ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                          : 'text-green-700 bg-green-100 hover:bg-green-200'
                      } disabled:opacity-50`}
                    >
                      {webhook.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleTestWebhook(webhook.id)}
                      disabled={processing}
                      className="px-3 py-2 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50"
                    >
                      Test
                    </button>
                    <button
                      onClick={() => {
                        setSelectedWebhook(webhook);
                        fetchDeliveries(webhook.id);
                      }}
                      className="px-3 py-2 text-sm text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100"
                    >
                      View Logs
                    </button>
                    <button
                      onClick={() => handleDeleteWebhook(webhook.id)}
                      disabled={processing}
                      className="px-3 py-2 text-sm text-red-700 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Webhook Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 my-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">Create Webhook</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateWebhook}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="My Webhook"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Endpoint *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/webhook"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeout (seconds)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="60"
                      value={formData.timeout}
                      onChange={(e) => setFormData({ ...formData, timeout: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Events * (at least one)
                    </label>
                    <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4 space-y-4">
                      {availableEvents.map((category) => (
                        <div key={category.category}>
                          <h4 className="font-medium text-gray-900 mb-2">{category.category}</h4>
                          <div className="space-y-2 ml-4">
                            {category.events.map((event) => (
                              <label key={event.name} className="flex items-start space-x-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.events.includes(event.name)}
                                  onChange={() => toggleEvent(event.name)}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900">{event.name}</div>
                                  <div className="text-xs text-gray-500">{event.description}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {processing ? 'Creating...' : 'Create Webhook'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delivery Logs Modal */}
        {showDeliveries && selectedWebhook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 my-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Delivery Logs - {selectedWebhook.name}
                </h3>
                <button
                  onClick={() => {
                    setShowDeliveries(false);
                    setSelectedWebhook(null);
                    setDeliveries([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {deliveries.length === 0 ? (
                <div className="text-center py-12 text-gray-600">No delivery logs yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Attempts
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Response
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {deliveries.map((delivery) => (
                        <tr key={delivery.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {delivery.event_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(delivery.status)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {delivery.attempt_count}/{delivery.max_attempts}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {delivery.response_status ? (
                              <span className={delivery.response_status >= 200 && delivery.response_status < 300 ? 'text-green-600' : 'text-red-600'}>
                                {delivery.response_status}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(delivery.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {delivery.status === 'failed' && delivery.attempt_count < delivery.max_attempts && (
                              <button
                                onClick={() => handleRetryDelivery(selectedWebhook.id, delivery.id)}
                                disabled={processing}
                                className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                              >
                                Retry
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
