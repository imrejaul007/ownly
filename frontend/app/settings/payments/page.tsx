'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { paymentAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  provider: string;
  provider_payment_method_id: string;
  card_last4?: string;
  card_brand?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  bank_last4?: string;
  bank_name?: string;
  is_default: boolean;
  is_verified: boolean;
  status: 'active' | 'inactive' | 'pending';
  last_used_at?: string;
  created_at: string;
}

interface Transaction {
  id: string;
  type: 'charge' | 'refund' | 'payout';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description: string;
  payment_method_id?: string;
  created_at: string;
}

export default function PaymentSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'methods' | 'transactions'>('methods');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'methods') {
        const response = await paymentAPI.getMethods();
        setPaymentMethods(response.data.payment_methods || []);
      } else {
        const response = await paymentAPI.getTransactions();
        setTransactions(response.data.transactions || []);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      showMessage('error', error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSetDefault = async (methodId: string) => {
    setProcessing(true);
    try {
      await paymentAPI.setDefaultMethod(methodId);
      showMessage('success', 'Default payment method updated');
      fetchData();
    } catch (error: any) {
      console.error('Error setting default:', error);
      showMessage('error', error.response?.data?.message || 'Failed to set default payment method');
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveMethod = async (methodId: string) => {
    if (!confirm('Are you sure you want to remove this payment method?')) return;

    setProcessing(true);
    try {
      await paymentAPI.removeMethod(methodId);
      showMessage('success', 'Payment method removed');
      fetchData();
    } catch (error: any) {
      console.error('Error removing method:', error);
      showMessage('error', error.response?.data?.message || 'Failed to remove payment method');
    } finally {
      setProcessing(false);
    }
  };

  const getCardBrandIcon = (brand?: string) => {
    const brandLower = brand?.toLowerCase();
    if (brandLower === 'visa') return '💳';
    if (brandLower === 'mastercard') return '💳';
    if (brandLower === 'amex') return '💳';
    if (brandLower === 'discover') return '💳';
    return '💳';
  };

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-blue-100 text-blue-800',
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
          <h1 className="text-3xl font-bold text-gray-900">Payment Settings</h1>
          <p className="mt-2 text-gray-600">Manage your payment methods and view transaction history</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('methods')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'methods'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Payment Methods
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'transactions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transaction History
              </button>
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
              </div>
            ) : activeTab === 'methods' ? (
              <div>
                {/* Payment Methods */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Your Payment Methods</h2>
                  <button
                    onClick={() => setShowAddCard(true)}
                    disabled={processing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Add Payment Method
                  </button>
                </div>

                {paymentMethods.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-600 mb-4">No payment methods added yet</p>
                    <button
                      onClick={() => setShowAddCard(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Your First Payment Method
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 rounded-lg border-2 ${
                          method.is_default ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl">
                              {method.type === 'card' ? getCardBrandIcon(method.card_brand) : '🏦'}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {method.type === 'card'
                                    ? `${method.card_brand || 'Card'} •••• ${method.card_last4}`
                                    : `${method.bank_name || 'Bank'} •••• ${method.bank_last4}`}
                                </h3>
                                {method.is_default && (
                                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    Default
                                  </span>
                                )}
                                {getStatusBadge(method.status)}
                              </div>
                              {method.type === 'card' && (
                                <p className="text-sm text-gray-600 mt-1">
                                  Expires {method.card_exp_month}/{method.card_exp_year}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                Added {formatDate(method.created_at)}
                                {method.last_used_at && ` • Last used ${formatDate(method.last_used_at)}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!method.is_default && (
                              <button
                                onClick={() => handleSetDefault(method.id)}
                                disabled={processing}
                                className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
                              >
                                Set as Default
                              </button>
                            )}
                            <button
                              onClick={() => handleRemoveMethod(method.id)}
                              disabled={processing}
                              className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Card Modal */}
                {showAddCard && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">Add Payment Method</h3>
                        <button
                          onClick={() => setShowAddCard(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-gray-600 mb-4">
                          Stripe Elements integration would go here
                        </p>
                        <p className="text-sm text-gray-500">
                          Install @stripe/stripe-js and @stripe/react-stripe-js
                          <br />to enable Stripe payment method collection
                        </p>
                      </div>
                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          onClick={() => setShowAddCard(false)}
                          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* Transactions */}
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Transaction History</h2>

                {transactions.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-600">No transactions yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(transaction.created_at)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <span className={transaction.type === 'refund' ? 'text-red-600' : 'text-gray-900'}>
                                {transaction.type === 'refund' ? '-' : ''}${transaction.amount.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(transaction.status)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">🔒</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Secure Payment Processing</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Your payment information is encrypted and processed securely by Stripe. We never store your full
                  card details on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
