'use client';

import { useState, useEffect } from 'react';
import { payoutScheduleAPI, dealAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { usePreferences } from '@/context/PreferencesContext';

export default function PayoutSchedulesPage() {
  const { formatCurrency } = usePreferences();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [upcomingPayouts, setUpcomingPayouts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'schedules' | 'upcoming'>('schedules');

  useEffect(() => {
    fetchSchedules();
    fetchUpcomingPayouts();
    fetchDeals();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await payoutScheduleAPI.getSchedules();
      setSchedules(response.data.data.schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingPayouts = async () => {
    try {
      const response = await payoutScheduleAPI.getUpcomingPayouts({ days: 30 });
      setUpcomingPayouts(response.data.data.upcoming);
    } catch (error) {
      console.error('Error fetching upcoming payouts:', error);
    }
  };

  const fetchDeals = async () => {
    try {
      const response = await dealAPI.list({ status: 'funded' });
      const fundedDeals = response.data.data.filter((d: any) => d.spv);
      setDeals(fundedDeals);
    } catch (error) {
      console.error('Error fetching deals:', error);
    }
  };

  const handleToggleStatus = async (scheduleId: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'pause' : 'resume';
    try {
      await payoutScheduleAPI.toggleStatus(scheduleId, { action });
      fetchSchedules();
      alert(`Schedule ${action}d successfully!`);
    } catch (error: any) {
      console.error('Error toggling schedule:', error);
      alert(error.response?.data?.message || 'Failed to update schedule');
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to cancel this schedule?')) return;

    try {
      await payoutScheduleAPI.deleteSchedule(scheduleId);
      fetchSchedules();
      alert('Schedule cancelled successfully!');
    } catch (error: any) {
      console.error('Error deleting schedule:', error);
      alert(error.response?.data?.message || 'Failed to cancel schedule');
    }
  };

  const handleProcessDuePayouts = async () => {
    if (!confirm('Process all due payout schedules now?')) return;

    try {
      const response = await payoutScheduleAPI.processDuePayouts();
      alert(response.data.message || 'Payouts processed successfully!');
      fetchSchedules();
      fetchUpcomingPayouts();
    } catch (error: any) {
      console.error('Error processing payouts:', error);
      alert(error.response?.data?.message || 'Failed to process payouts');
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
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Payout Schedules
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage automated payout schedules
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleProcessDuePayouts}
            className="btn-secondary text-sm"
          >
            Process Due Payouts
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            + Create Schedule
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('schedules')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'schedules'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Schedules
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upcoming (30 Days)
          </button>
        </nav>
      </div>

      {/* All Schedules Tab */}
      {activeTab === 'schedules' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Schedule Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    SPV
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Next Payout
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                      No payout schedules created yet
                    </td>
                  </tr>
                ) : (
                  schedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {schedule.schedule_name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {schedule.spv?.name}
                      </td>
                      <td className="px-6 py-4 capitalize text-gray-600">
                        {schedule.frequency.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {formatCurrency(schedule.amount_per_period)}
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(schedule.next_payout_date)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge badge-${schedule.status === 'active' ? 'green' : 'gray'} capitalize`}>
                          {schedule.status}
                        </span>
                        {schedule.auto_distribute && (
                          <span className="badge badge-blue ml-2">Auto</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleStatus(schedule.id, schedule.status)}
                            className="text-sm text-primary-600 hover:text-primary-900 font-medium"
                          >
                            {schedule.status === 'active' ? 'Pause' : 'Resume'}
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="text-sm text-red-600 hover:text-red-900 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upcoming Payouts Tab */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingPayouts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No upcoming payouts in the next 30 days</p>
            </div>
          ) : (
            upcomingPayouts.map((item) => (
              <div
                key={item.schedule_id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {item.schedule_name}
                    </h3>
                    <p className="text-gray-600 mb-4">SPV: {item.spv?.name}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-semibold text-lg">{formatCurrency(item.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Frequency</p>
                        <p className="font-semibold capitalize">
                          {item.frequency.replace('_', ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Next Payout</p>
                        <p className="font-semibold">{formatDate(item.next_payout_date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Days Until</p>
                        <p className="font-semibold text-primary-600">{item.days_until_payout}</p>
                      </div>
                    </div>
                  </div>
                  {item.auto_distribute && (
                    <span className="badge badge-green">Auto-Distribute</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Schedule Modal */}
      {showCreateModal && (
        <CreateScheduleModal
          deals={deals}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchSchedules();
            fetchUpcomingPayouts();
          }}
        />
      )}
    </div>
  );
}

function CreateScheduleModal({
  deals,
  onClose,
  onSuccess,
}: {
  deals: any[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    spvId: '',
    scheduleName: '',
    frequency: 'quarterly',
    amountPerPeriod: '',
    startDate: new Date().toISOString().split('T')[0],
    autoDistribute: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await payoutScheduleAPI.createSchedule(form);
      alert('Schedule created successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Error creating schedule:', error);
      alert(error.response?.data?.message || 'Failed to create schedule');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Create Payout Schedule</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">SPV</label>
            <select
              value={form.spvId}
              onChange={(e) => setForm({ ...form, spvId: e.target.value })}
              className="input w-full"
              required
            >
              <option value="">Select SPV</option>
              {deals.map((deal) => (
                <option key={deal.id} value={deal.spv.id}>
                  {deal.title} - {deal.spv.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Schedule Name</label>
            <input
              type="text"
              value={form.scheduleName}
              onChange={(e) => setForm({ ...form, scheduleName: e.target.value })}
              className="input w-full"
              placeholder="e.g., Monthly Dividend"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Frequency</label>
            <select
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value })}
              className="input w-full"
              required
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="semi_annual">Semi-Annual</option>
              <option value="annual">Annual</option>
              <option value="one_time">One-Time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount Per Period</label>
            <input
              type="number"
              value={form.amountPerPeriod}
              onChange={(e) => setForm({ ...form, amountPerPeriod: e.target.value })}
              className="input w-full"
              step="0.01"
              min="0"
              placeholder="5000.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="input w-full"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoDistribute"
              checked={form.autoDistribute}
              onChange={(e) => setForm({ ...form, autoDistribute: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="autoDistribute" className="text-sm">
              Auto-distribute when generated
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Create Schedule
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
