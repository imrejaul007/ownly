'use client';

import { useState, useEffect } from 'react';
import { dealAPI, payoutAPI, operationsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { usePreferences } from '@/context/PreferencesContext';

export default function OperationsPage() {
  const { formatCurrency } = usePreferences();
  const [deals, setDeals] = useState<any[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [financials, setFinancials] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'payouts' | 'revenue' | 'expenses'>('payouts');

  // Payout form state
  const [payoutForm, setPayoutForm] = useState({
    amount: '',
    payoutType: 'dividend',
    notes: '',
  });

  // Revenue form state
  const [revenueForm, setRevenueForm] = useState({
    amount: '',
    description: '',
    category: 'rental',
  });

  // Expense form state
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    description: '',
    category: 'maintenance',
  });

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    if (selectedDeal?.spv?.id) {
      fetchPayouts();
      fetchFinancials();
    }
  }, [selectedDeal]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await dealAPI.list({ status: 'funded' });
      const fundedDeals = response.data.data.filter((d: any) => d.spv);
      setDeals(fundedDeals);
      if (fundedDeals.length > 0) {
        setSelectedDeal(fundedDeals[0]);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayouts = async () => {
    try {
      const response = await payoutAPI.list({ spvId: selectedDeal.spv.id });
      setPayouts(response.data.data.payouts);
    } catch (error) {
      console.error('Error fetching payouts:', error);
    }
  };

  const fetchFinancials = async () => {
    try {
      const response = await operationsAPI.getFinancials(selectedDeal.spv.id);
      setFinancials(response.data.data.financials);
    } catch (error) {
      console.error('Error fetching financials:', error);
    }
  };

  const handleGeneratePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeal?.spv?.id) return;

    try {
      await payoutAPI.generate({
        spvId: selectedDeal.spv.id,
        amount: parseFloat(payoutForm.amount),
        payoutType: payoutForm.payoutType,
        notes: payoutForm.notes,
      });
      alert('Payout generated successfully!');
      setPayoutForm({ amount: '', payoutType: 'dividend', notes: '' });
      fetchPayouts();
      fetchFinancials();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate payout');
    }
  };

  const handleDistributePayout = async (payoutId: string) => {
    if (!confirm('Distribute this payout to all investors?')) return;

    try {
      await payoutAPI.distribute(payoutId);
      alert('Payout distributed successfully!');
      fetchPayouts();
      fetchFinancials();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to distribute payout');
    }
  };

  const handleRecordRevenue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeal?.spv?.id) return;

    try {
      await operationsAPI.recordRevenue(selectedDeal.spv.id, {
        amount: parseFloat(revenueForm.amount),
        description: revenueForm.description,
        category: revenueForm.category,
        date: new Date(),
      });
      alert('Revenue recorded successfully!');
      setRevenueForm({ amount: '', description: '', category: 'rental' });
      fetchFinancials();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to record revenue');
    }
  };

  const handleRecordExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeal?.spv?.id) return;

    try {
      await operationsAPI.recordExpense(selectedDeal.spv.id, {
        amount: parseFloat(expenseForm.amount),
        description: expenseForm.description,
        category: expenseForm.category,
        date: new Date(),
      });
      alert('Expense recorded successfully!');
      setExpenseForm({ amount: '', description: '', category: 'maintenance' });
      fetchFinancials();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to record expense');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Operations & Payouts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage SPV operations, record financials, and distribute payouts
        </p>
      </div>

      {/* Deal Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select SPV
        </label>
        <select
          value={selectedDeal?.id || ''}
          onChange={(e) => {
            const deal = deals.find((d) => d.id === e.target.value);
            setSelectedDeal(deal);
          }}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg"
        >
          {deals.map((deal) => (
            <option key={deal.id} value={deal.id}>
              {deal.title} ({deal.spv?.spv_name})
            </option>
          ))}
        </select>
      </div>

      {/* Financial Summary */}
      {financials && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-xs text-gray-600 mb-1">Operating Balance</div>
            <div className="text-2xl font-bold">
              {formatCurrency(financials.balances.operatingBalance)}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-xs text-gray-600 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold">
              {formatCurrency(financials.performance.totalRevenue)}
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="text-xs text-gray-600 mb-1">Total Expenses</div>
            <div className="text-2xl font-bold">
              {formatCurrency(financials.performance.totalExpenses)}
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="text-xs text-gray-600 mb-1">Net Income</div>
            <div className="text-2xl font-bold">
              {formatCurrency(financials.performance.netIncome)}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {['payouts', 'revenue', 'expenses'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generate Payout Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Generate Payout</h3>
              <form onSubmit={handleGeneratePayout} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <input
                    type="number"
                    value={payoutForm.amount}
                    onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={payoutForm.payoutType}
                    onChange={(e) => setPayoutForm({ ...payoutForm, payoutType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="dividend">Dividend</option>
                    <option value="rental">Rental</option>
                    <option value="profit_share">Profit Share</option>
                    <option value="interest">Interest</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    value={payoutForm.notes}
                    onChange={(e) => setPayoutForm({ ...payoutForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Monthly rental income"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Generate Payout
                </button>
              </form>
            </div>
          </div>

          {/* Payouts List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Payout History</h3>
              {payouts.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No payouts yet</p>
              ) : (
                <div className="space-y-4">
                  {payouts.map((payout) => (
                    <div
                      key={payout.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold">
                            {formatCurrency(payout.total_amount)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDate(payout.payout_date)} • {payout.payout_type}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`badge ${
                            payout.distributed ? 'badge-green' : 'badge-yellow'
                          }`}>
                            {payout.distributed ? 'Distributed' : 'Pending'}
                          </span>
                          {!payout.distributed && (
                            <button
                              onClick={() => handleDistributePayout(payout.id)}
                              className="btn-primary text-sm"
                            >
                              Distribute
                            </button>
                          )}
                        </div>
                      </div>
                      {payout.notes && (
                        <p className="text-sm text-gray-600 mt-2">{payout.notes}</p>
                      )}
                      <div className="text-sm text-gray-600 mt-2">
                        {payout.payout_items.length} investors
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Record Revenue</h3>
              <form onSubmit={handleRecordRevenue} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <input
                    type="number"
                    value={revenueForm.amount}
                    onChange={(e) => setRevenueForm({ ...revenueForm, amount: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={revenueForm.category}
                    onChange={(e) => setRevenueForm({ ...revenueForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="rental">Rental</option>
                    <option value="sales">Sales</option>
                    <option value="services">Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={revenueForm.description}
                    onChange={(e) => setRevenueForm({ ...revenueForm, description: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Record Revenue
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Recent Revenue</h3>
              {financials?.recentRevenue.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No revenue recorded</p>
              ) : (
                <div className="space-y-3">
                  {financials?.recentRevenue.map((entry: any, index: number) => (
                    <div key={index} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <div className="font-medium">{entry.description}</div>
                        <div className="text-sm text-gray-600">
                          {entry.category} • {formatDate(entry.date)}
                        </div>
                      </div>
                      <div className="font-semibold text-green-600">
                        +{formatCurrency(entry.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Record Expense</h3>
              <form onSubmit={handleRecordExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <input
                    type="number"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="utilities">Utilities</option>
                    <option value="management">Management</option>
                    <option value="repairs">Repairs</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <button type="submit" className="btn-primary w-full">
                  Record Expense
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Recent Expenses</h3>
              {financials?.recentExpenses.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No expenses recorded</p>
              ) : (
                <div className="space-y-3">
                  {financials?.recentExpenses.map((entry: any, index: number) => (
                    <div key={index} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <div className="font-medium">{entry.description}</div>
                        <div className="text-sm text-gray-600">
                          {entry.category} • {formatDate(entry.date)}
                        </div>
                      </div>
                      <div className="font-semibold text-red-600">
                        -{formatCurrency(entry.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
