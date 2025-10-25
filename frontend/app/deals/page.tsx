'use client';

import { useState, useEffect } from 'react';
import { dealAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DealsPage() {
  const router = useRouter();
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    minRoi: '',
    maxRoi: '',
    search: '',
  });

  useEffect(() => {
    fetchDeals();
  }, [filters]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.minRoi) params.minRoi = filters.minRoi;
      if (filters.maxRoi) params.maxRoi = filters.maxRoi;
      if (filters.search) params.search = filters.search;

      const response = await dealAPI.list(params);
      setDeals(response.data.data || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (level: string) => {
    const colors: any = {
      'Low Risk': 'bg-green-100 text-green-800',
      'Medium Risk': 'bg-yellow-100 text-yellow-800',
      'High Risk': 'bg-orange-100 text-orange-800',
      'Very High Risk': 'bg-red-100 text-red-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: string) => {
    const labels: any = {
      real_estate: '🏠 Real Estate',
      franchise: '💼 Franchise',
      startup: '🚀 Startup',
      asset: '💎 Asset',
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      draft: 'bg-gray-100 text-gray-600',
      open: 'bg-green-100 text-green-600',
      funded: 'bg-blue-100 text-blue-600',
      failed: 'bg-red-100 text-red-600',
      closed: 'bg-gray-100 text-gray-600',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      minRoi: '',
      maxRoi: '',
      search: '',
    });
  };

  const toggleDealSelection = (dealId: string) => {
    setSelectedDeals(prev =>
      prev.includes(dealId)
        ? prev.filter(id => id !== dealId)
        : prev.length < 4
          ? [...prev, dealId]
          : prev
    );
  };

  const handleCompareDeals = () => {
    if (selectedDeals.length >= 2) {
      router.push(`/deals/compare?ids=${selectedDeals.join(',')}`);
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
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Investment Opportunities
              </h1>
              <p className="text-primary-100 text-lg">
                Discover fractional ownership opportunities across multiple asset classes
              </p>
            </div>
            <Link href="/deals/compare">
              <button className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all shadow-lg flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Compare Deals</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Asset Categories - Quick Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        <button
          onClick={() => setFilters({ ...filters, type: 'franchise' })}
          className={`bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 text-center hover:shadow-lg transition-all transform hover:-translate-y-1 ${
            filters.type === 'franchise' ? 'ring-2 ring-purple-500' : ''
          }`}
        >
          <div className="text-2xl mb-1">💎</div>
          <div className="text-xs font-semibold">Franchise</div>
        </button>
        <button
          onClick={() => setFilters({ ...filters, type: 'real_estate' })}
          className={`bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 text-center hover:shadow-lg transition-all transform hover:-translate-y-1 ${
            filters.type === 'real_estate' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="text-2xl mb-1">🏢</div>
          <div className="text-xs font-semibold">Real Estate</div>
        </button>
        <button
          onClick={() => setFilters({ ...filters, type: 'asset' })}
          className={`bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 text-center hover:shadow-lg transition-all transform hover:-translate-y-1 ${
            filters.type === 'asset' ? 'ring-2 ring-yellow-500' : ''
          }`}
        >
          <div className="text-2xl mb-1">🚗</div>
          <div className="text-xs font-semibold">Luxury Assets</div>
        </button>
        <button
          onClick={() => setFilters({ ...filters, type: 'startup' })}
          className={`bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 text-center hover:shadow-lg transition-all transform hover:-translate-y-1 ${
            filters.type === 'startup' ? 'ring-2 ring-green-500' : ''
          }`}
        >
          <div className="text-2xl mb-1">🧠</div>
          <div className="text-xs font-semibold">Tech Ventures</div>
        </button>
        <button
          onClick={() => setFilters({ ...filters, minRoi: '10' })}
          className={`bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg p-4 text-center hover:shadow-lg transition-all transform hover:-translate-y-1 ${
            filters.minRoi === '10' ? 'ring-2 ring-pink-500' : ''
          }`}
        >
          <div className="text-2xl mb-1">🏠</div>
          <div className="text-xs font-semibold">Rental Yield</div>
        </button>
        <button
          onClick={() => setFilters({ ...filters, status: 'open' })}
          className={`bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 text-center hover:shadow-lg transition-all transform hover:-translate-y-1 ${
            filters.status === 'open' ? 'ring-2 ring-orange-500' : ''
          }`}
        >
          <div className="text-2xl mb-1">🏗️</div>
          <div className="text-xs font-semibold">Open Now</div>
        </button>
        <button
          onClick={() => setFilters({ ...filters, minRoi: '15' })}
          className={`bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg p-4 text-center hover:shadow-lg transition-all transform hover:-translate-y-1 ${
            filters.minRoi === '15' ? 'ring-2 ring-indigo-500' : ''
          }`}
        >
          <div className="text-2xl mb-1">💸</div>
          <div className="text-xs font-semibold">High Yield</div>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search deals..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Asset Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="">All Types</option>
              <option value="real_estate">Real Estate</option>
              <option value="franchise">Franchise</option>
              <option value="startup">Startup</option>
              <option value="asset">Asset</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="funded">Funded</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Min ROI %</label>
            <input
              type="number"
              value={filters.minRoi}
              onChange={(e) => setFilters({ ...filters, minRoi: e.target.value })}
              placeholder="0"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max ROI %</label>
            <input
              type="number"
              value={filters.maxRoi}
              onChange={(e) => setFilters({ ...filters, maxRoi: e.target.value })}
              placeholder="100"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold">{deals.length}</span> investment opportunities
        </p>
      </div>

      {/* Deals Grid */}
      {deals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No deals found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => {
            const minInvestment = parseFloat(deal.min_ticket?.toString() || '0');
            const targetAmount = parseFloat(deal.target_amount?.toString() || '0');
            const expectedROI = parseFloat(deal.expected_roi?.toString() || '0');
            const monthlyIncome = (minInvestment * (expectedROI / 100)) / 12;
            const dealTotalMonthlyEarning = (targetAmount * (expectedROI / 100)) / 12;
            const isSelected = selectedDeals.includes(deal.id);

            return (
              <div key={deal.id} className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-800 transform hover:-translate-y-1">
                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3 z-20">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleDealSelection(deal.id);
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-white/90 backdrop-blur-sm hover:bg-primary-100 text-gray-600'
                    }`}
                  >
                    {isSelected ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </button>
                </div>

                <Link href={`/deals/${deal.id}`}>
                  {/* Deal Image */}
                  <div className="relative h-56 bg-gradient-to-br from-primary-400 to-primary-600">
                    {deal.images && deal.images[0] && (
                      <img
                        src={deal.images[0]}
                        alt={deal.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusColor(deal.status)}`}>
                        {deal.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Monthly Income Banner */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-white/50 shadow-lg">
                        {/* Deal Total Monthly Earning */}
                        <div className="mb-2 pb-2 border-b border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">📊 Deal Generates Monthly</div>
                          <div className="text-sm font-bold text-indigo-600">
                            {formatCurrency(dealTotalMonthlyEarning)}/mo
                          </div>
                        </div>
                        {/* Investor Potential Monthly Income */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">💰 Your Potential (min)</div>
                            <div className="text-lg font-bold text-green-600">
                              {formatCurrency(monthlyIncome)}/mo
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-600 mb-1">Expected ROI</div>
                            <div className="text-xl font-bold text-primary-600">
                              {expectedROI}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Type Badge */}
                    <div className="mb-3">
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {getTypeLabel(deal.type)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 text-gray-900 dark:text-white">{deal.title}</h3>

                    {/* Location & Jurisdiction */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      📍 {deal.location} • {deal.jurisdiction}
                    </p>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <div className="text-xs text-gray-600 dark:text-gray-400">Holding Period</div>
                        <div className="text-lg font-bold text-blue-600">{deal.holding_period_months}mo</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                        <div className="text-xs text-gray-600 dark:text-gray-400">Min. Investment</div>
                        <div className="text-sm font-bold text-purple-600">{formatCurrency(deal.min_ticket)}</div>
                      </div>
                    </div>

                    {/* Funding Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Funding Progress</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {Math.round((parseFloat(deal.raised_amount || '0') / parseFloat(deal.target_amount || '1')) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-primary-600 to-primary-500 h-2.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (parseFloat(deal.raised_amount || '0') / parseFloat(deal.target_amount || '1')) * 100)}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1 text-gray-500">
                        <span>{formatCurrency(deal.raised_amount || 0)}</span>
                        <span>{formatCurrency(deal.target_amount)}</span>
                      </div>
                    </div>

                    {/* Risk Badge */}
                    {deal.risk_badge && (
                      <div className="mb-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getRiskBadgeColor(deal.risk_badge.level)}`}>
                          {deal.risk_badge.icon} {deal.risk_badge.level}
                        </span>
                      </div>
                    )}

                    {/* CTA Button */}
                    <button className="w-full btn-primary">
                      View Details →
                    </button>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Compare Button */}
      {selectedDeals.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-primary-500 p-4 min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedDeals.length} deal{selectedDeals.length > 1 ? 's' : ''} selected
                </div>
                <div className="text-xs text-gray-500">
                  {selectedDeals.length < 2 ? 'Select at least 2 to compare' : 'Ready to compare!'}
                </div>
              </div>
              <button
                onClick={() => setSelectedDeals([])}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button
              onClick={handleCompareDeals}
              disabled={selectedDeals.length < 2}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                selectedDeals.length >= 2
                  ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-700 hover:to-purple-700 shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Compare Deals →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
