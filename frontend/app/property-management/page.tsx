'use client';

import { useState, useEffect } from 'react';
import { propertyManagementAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function PropertyManagementPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'rent' | 'expense' | null>(null);

  // Form states
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('maintenance');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertyManagementAPI.getProperties();
      setProperties(response.data.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordRent = async () => {
    if (!selectedProperty || !amount) return;

    try {
      setSubmitting(true);
      await propertyManagementAPI.recordRent(selectedProperty.id, {
        amount: parseFloat(amount),
        date,
        description,
      });
      alert(' Rent recorded successfully');
      resetForm();
      fetchProperties();
    } catch (error: any) {
      alert(`L ${error.response?.data?.message || 'Failed to record rent'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecordExpense = async () => {
    if (!selectedProperty || !amount) return;

    try {
      setSubmitting(true);
      await propertyManagementAPI.recordExpense(selectedProperty.id, {
        amount: parseFloat(amount),
        date,
        category,
        description,
      });
      alert(' Expense recorded successfully');
      resetForm();
      fetchProperties();
    } catch (error: any) {
      alert(`L ${error.response?.data?.message || 'Failed to record expense'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setCategory('maintenance');
    setShowModal(false);
    setSelectedProperty(null);
    setModalType(null);
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Property Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track rent, expenses, and financial performance
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">No properties found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-1">{property.name}</h3>
                <p className="text-sm text-gray-600">{property.address}</p>
                <span className="badge badge-blue capitalize mt-2">
                  {property.asset_type?.replace('_', ' ')}
                </span>
              </div>

              {property.summary && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Total Rent</div>
                    <div className="font-bold text-green-600">
                      {formatCurrency(property.summary.totalRentCollected)}
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Expenses</div>
                    <div className="font-bold text-red-600">
                      {formatCurrency(property.summary.totalExpenses)}
                    </div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Net Income</div>
                    <div className="font-bold text-blue-600">
                      {formatCurrency(property.summary.netIncome)}
                    </div>
                  </div>
                </div>
              )}

              {property.occupancy_rate && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Occupancy Rate</span>
                    <span className="font-semibold">{property.occupancy_rate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${property.occupancy_rate}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedProperty(property);
                    setModalType('rent');
                    setShowModal(true);
                  }}
                  className="btn-primary flex-1 text-sm"
                >
                  Record Rent
                </button>
                <button
                  onClick={() => {
                    setSelectedProperty(property);
                    setModalType('expense');
                    setShowModal(true);
                  }}
                  className="btn-secondary flex-1 text-sm"
                >
                  Record Expense
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">
              Record {modalType === 'rent' ? 'Rent Payment' : 'Expense'}
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Property</p>
              <p className="font-semibold">{selectedProperty.name}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (USD) *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {modalType === 'expense' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="repairs">Repairs</option>
                    <option value="utilities">Utilities</option>
                    <option value="insurance">Insurance</option>
                    <option value="taxes">Taxes</option>
                    <option value="management_fees">Management Fees</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={resetForm}
                className="btn-secondary flex-1"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={modalType === 'rent' ? handleRecordRent : handleRecordExpense}
                className="btn-primary flex-1"
                disabled={submitting || !amount}
              >
                {submitting ? 'Recording...' : 'Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
